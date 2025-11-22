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
  rent: z.number().positive({ message: "Rent must be positive" }),
  roomName: z.string(),
});

export function TenantForm() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { addToast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", rent: 0, roomName: "" },
  });

  // Fetch available rooms
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("http://localhost:8080/api/rooms");
        const data: Room[] = await res.json();
        setRooms(data.filter((r) => !r.occupied)); // only available rooms
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
      const res = await fetch("http://localhost:8080/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to create tenant");
      const tenant = await res.json();

      const room = rooms.find((r) => r.name === values.roomName);
      if (room) {
        const updatedTenantNames = [...(room.tenantNames || []), tenant.name];
        const patchRes = await fetch(
          `http://localhost:8080/api/rooms/${room.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tenantNames: updatedTenantNames }),
          }
        );
        if (!patchRes.ok) throw new Error("Failed to update room");
      }

      addToast({
        title: "Tenant Added",
        description: `${tenant.name} added successfully!`,
        type: "success",
      });

      form.reset();
      setRooms((prev) => prev.filter((r) => r.id !== room?.id));
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

        {/* Rent */}
        <FormField
          control={form.control}
          name="rent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rent</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="10000"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
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
