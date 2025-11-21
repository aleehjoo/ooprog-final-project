"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const formSchema = z.object({
  roomName: z.string().min(3, "Room Name must be at least 3 characters"),
  rent: z
    .number()
    .int()
    .nonnegative("Rent must be a positive number"),
  isOccupied: z.boolean(),
  tenantName: z.array(z.string()).optional(),
});

export function RoomForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: "",
      rent: 0,
      isOccupied: false,
      tenantName: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const rentInPesos = values.rent / 100;

    console.log("Form submitted:", {
      ...values,
      rentInPesos, 
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="roomName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Room Name</FormLabel>
              <FormControl>
                <Input placeholder="Room 101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rent"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">
                Rent <span className="font-normal text-base">(In cents)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 12300"
                  value={field.value}
                  onChange={(e) => {
                    const v = e.target.value;

                    // Allow numbers only
                    if (/^\d*$/.test(v)) {
                      field.onChange(Number(v));
                    }
                  }}
                />
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
