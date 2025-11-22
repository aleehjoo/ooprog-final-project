"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { addRoom, getAllTenants, patchTenant } from "@/lib/api";
import { useToast } from "../ToastProvider";

const formSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
  rent: z.number().int().nonnegative(),
  tenantIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Tenant {
  id: string;
  name: string;
  roomName?: string | null;
}

export function RoomForm() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { addToast } = useToast(); // <<-- Initialize toast

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rent: 0,
      tenantIds: [],
    },
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllTenants();
        setTenants(data.filter((t: Tenant) => !t.roomName));
      } catch (err) {
        console.error("Failed to fetch tenants", err);
        addToast({
          title: "Failed to fetch tenants",
          type: "error",
        });
      }
    }
    load();
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      const assignedTenants = tenants.filter((t) =>
        values.tenantIds?.includes(t.id)
      );

      const occupied = assignedTenants.length > 0;

      const roomPayload = {
        name: values.name,
        rent: values.rent,
        occupied,
        tenantNames: assignedTenants.map((t) => t.name),
      };

      const createdRoom = await addRoom(roomPayload);

      await Promise.all(
        assignedTenants.map((tenant) =>
          patchTenant(tenant.id, {
            roomName: createdRoom.name,
          })
        )
      );

      addToast({
        title: "Room created successfully",
        description: `Room "${roomPayload.name}" was added`,
        type: "success",
      });

      form.reset({ name: "", rent: 0, tenantIds: [] });

      const refreshed = await getAllTenants();
      setTenants(refreshed.filter((t: Tenant) => !t.roomName));
    } catch (err) {
      console.error(err);
      addToast({
        title: "Failed to create room",
        type: "error",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Room Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Room 101"
                  {...field}
                />
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
              <FormLabel>Rent (₱ in Cents)</FormLabel>
              <FormControl>
                <input
                  className="border p-2 rounded w-full"
                  type="text"
                  inputMode="numeric"
                  value={field.value?.toString() ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^\d*$/.test(v)) field.onChange(Number(v));
                  }}
                  placeholder="12000"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tenants */}
        <FormItem>
          <FormLabel>Assign Tenants</FormLabel>

          <Button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {dropdownOpen ? "Hide Tenants" : "Select Tenants"}
          </Button>

          {dropdownOpen && (
            <FormControl className="border rounded p-2 mt-2 max-h-40 overflow-y-auto">
              <Controller
                control={form.control}
                name="tenantIds"
                render={({ field }) => (
                  <>
                    {tenants.length === 0 && (
                      <div className="text-gray-500">No available tenants</div>
                    )}

                    {tenants.map((tenant) => (
                      <label
                        key={tenant.id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          value={tenant.id}
                          checked={field.value?.includes(tenant.id) ?? false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([
                                ...(field.value ?? []),
                                tenant.id,
                              ]);
                            } else {
                              field.onChange(
                                (field.value ?? []).filter(
                                  (id) => id !== tenant.id
                                )
                              );
                            }
                          }}
                        />
                        {tenant.name}
                      </label>
                    ))}
                  </>
                )}
              />
            </FormControl>
          )}
        </FormItem>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
