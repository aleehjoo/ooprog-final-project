"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ToastProvider";
import { getAllRooms, addTenant, patchRoom } from "@/lib/api";

interface Room {
  id: string;
  name: string;
  rent: number;
  occupied: boolean;
  tenantNames: string[];
}

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Tenant Name must be at least 3 characters." }),
  roomName: z.string(),
  paymentStatus: z.enum(["paid", "not_paid"]).optional(),
});

export function TenantForm() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { addToast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", roomName: "", paymentStatus: "not_paid" },
  });

  // Fetch available rooms
  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getAllRooms();
        setRooms(data);
      } catch (err) {
        console.error(err);
        addToast({
          title: "Failed to fetch rooms",
          description: "Please try again later.",
          type: "error",
        });
      }
    }
    fetchRooms();
  }, [addToast]);

  // Submit form
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Rent will be calculated automatically based on room assignment
      const tenantData = {
        name: values.name,
        roomName: values.roomName || "",
        rent: 0, // Will be calculated when room is assigned
        paymentStatus: values.paymentStatus || "not_paid",
      };
      
      const tenant = await addTenant(tenantData);

      // If tenant is assigned to a room, update the room's tenantNames
      if (values.roomName) {
        const room = rooms.find((r) => r.name === values.roomName);
        if (room) {
          const updatedTenantNames = [...(room.tenantNames || []), tenant.name];
          await patchRoom(room.id, {
            tenantNames: updatedTenantNames,
            occupied: true,
            status: "occupied",
          });
        }
      }

      addToast({
        title: "Tenant Added",
        description: `${tenant.name} added successfully!`,
        type: "success",
      });

      form.reset({ name: "", roomName: "", paymentStatus: "not_paid" });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: "Failed to add tenant.",
        type: "error",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Tenant Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Status */}
        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <FormControl>
                <select {...field} className="border rounded p-2 w-full">
                  <option value="not_paid">Not Paid</option>
                  <option value="paid">Paid</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Room Selection */}
        <FormField
          control={form.control}
          name="roomName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <FormControl>
                <select {...field} className="border rounded p-2 w-full">
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.name}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
