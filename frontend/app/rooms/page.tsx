"use client";

import { useEffect, useState } from "react";
import { getAllRooms, patchRoom, getAllTenants, patchTenant } from "@/lib/api";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

export interface Room {
  id: string;
  name: string;
  rent: number;
  occupied?: boolean;
  status?: string;
  tenantNames: string[];
}

export interface Tenant {
  id: string;
  name: string;
  roomId?: string | null;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filter, setFilter] = useState<"All" | "Available" | "Occupied" | "Reserved">("All");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [backupRoom, setBackupRoom] = useState<Room | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const roomsData = await getAllRooms();
        const tenantsData = await getAllTenants();
        setRooms(roomsData);
        setTenants(tenantsData); // keep all tenants
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    }
    loadData();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const status = (room as any).status || (room.occupied ? "occupied" : "available");
    if (filter === "Available" && status !== "available") return false;
    if (filter === "Occupied" && status !== "occupied") return false;
    if (filter === "Reserved" && status !== "reserved") return false;
    if (search && !room.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const total = rooms.length;
  const available = rooms.filter((r) => {
    const status = (r as any).status || (r.occupied ? "occupied" : "available");
    return status === "available";
  }).length;
  const occupied = rooms.filter((r) => {
    const status = (r as any).status || (r.occupied ? "occupied" : "available");
    return status === "occupied";
  }).length;
  const reserved = rooms.filter((r) => {
    const status = (r as any).status || (r.occupied ? "occupied" : "available");
    return status === "reserved";
  }).length;

  const handleEdit = (room: Room) => {
    setBackupRoom({ ...room }); // backup original room
    setEditingId(room.id);
  };

  const handleCancel = () => {
    if (backupRoom) {
      setRooms((prev) =>
        prev.map((r) => (r.id === backupRoom.id ? backupRoom : r))
      );
    }
    setEditingId(null);
    setBackupRoom(null);
  };

  const handleSave = async (roomId: string, updatedRoom: Room) => {
    setSavingId(roomId);

    // Get the original room to compare tenant changes
    const originalRoom = rooms.find((r) => r.id === roomId);
    if (!originalRoom) return;

    // Auto-set status based on tenantNames
    let status = "available";
    if (updatedRoom.tenantNames.length > 0) {
      status = "occupied";
    }
    const patchedRoom = {
      ...updatedRoom,
      occupied: updatedRoom.tenantNames.length > 0,
      status: status,
    };

    try {
      await patchRoom(roomId, patchedRoom);

      // Update tenants: assign roomName to newly added tenants, remove from unassigned
      const originalTenantNames = originalRoom.tenantNames || [];
      const newTenantNames = updatedRoom.tenantNames || [];
      
      // Find tenants that were added
      const addedTenants = newTenantNames.filter(
        (name) => !originalTenantNames.includes(name)
      );
      // Find tenants that were removed
      const removedTenants = originalTenantNames.filter(
        (name) => !newTenantNames.includes(name)
      );

      // Update added tenants with room name
      for (const tenantName of addedTenants) {
        const tenant = tenants.find((t) => t.name === tenantName);
        if (tenant) {
          await patchTenant(tenant.id, { roomName: updatedRoom.name });
        }
      }

      // Update removed tenants to clear room name
      for (const tenantName of removedTenants) {
        const tenant = tenants.find((t) => t.name === tenantName);
        if (tenant) {
          await patchTenant(tenant.id, { roomName: "" });
        }
      }

      // Refresh tenants data to reflect changes
      const refreshedTenants = await getAllTenants();
      setTenants(refreshedTenants);

      setRooms((prev) => prev.map((r) => (r.id === roomId ? patchedRoom : r)));

      setEditingId(null);
      setBackupRoom(null);
    } catch (err) {
      console.error("Failed to update room", err);
    } finally {
      setSavingId(null);
    }
  };

  // Get available tenants for multi-select
  // A tenant is available if:
  // 1. They are not assigned to any room (no roomId/roomName), OR
  // 2. They are already in this room's tenantNames list
  const getAvailableTenants = (room: Room) => {
    // Get all tenant names that are assigned to other rooms
    const assignedTenantNames = new Set<string>();
    rooms.forEach((r) => {
      if (r.id !== room.id && r.tenantNames && r.tenantNames.length > 0) {
        r.tenantNames.forEach((name) => assignedTenantNames.add(name));
      }
    });

    return tenants.filter((t) => {
      // Include if tenant is already in this room
      if (room.tenantNames.includes(t.name)) {
        return true;
      }
      // Include if tenant is not assigned to any other room
      return !assignedTenantNames.has(t.name);
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="Room Management" subtitle={`${total} total rooms`} />
      <div className="flex flex-col flex-1 p-8 overflow-hidden">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Rooms",
              value: total,
              className: "text-foreground",
            },
            {
              label: "Available Rooms",
              value: available,
              className: "text-accent",
            },
            {
              label: "Occupied Rooms",
              value: occupied,
              className: "text-destructive",
            },
            {
              label: "Reserved Rooms",
              value: reserved,
              className: "text-yellow-600",
            },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent>
                <p className="text-base text-muted-foreground mb-2">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.className}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters & Search */}
        <Card className="mb-4">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {["All", "Available", "Occupied", "Reserved"].map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={filter === f ? "default" : "outline"}
                    onClick={() => setFilter(f as any)}
                  >
                    {f}
                  </Button>
                ))}
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search rooms..."
                  className="flex-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Link href="/rooms/add-room">
                  <Button size="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto pr-2 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredRooms.map((room) => {
              const isEditing = editingId === room.id;
              return (
                <Card key={room.id}>
                  <CardContent className="space-y-2">
                    {isEditing ? (
                      <>
                        <Input
                          value={room.name}
                          onChange={(e) =>
                            setRooms((prev) =>
                              prev.map((r) =>
                                r.id === room.id
                                  ? { ...r, name: e.target.value }
                                  : r
                              )
                            )
                          }
                        />
                        <Input
                          type="number"
                          value={room.rent}
                          placeholder="Rent in cents (e.g., 12000 for ₱120.00)"
                          onChange={(e) =>
                            setRooms((prev) =>
                              prev.map((r) =>
                                r.id === room.id
                                  ? { ...r, rent: Number(e.target.value) || 0 }
                                  : r
                              )
                            )
                          }
                        />

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">
                            Status
                          </p>
                          {room.tenantNames.length > 0 ? (
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-md border-2 border-red-200 dark:border-red-900">
                              <p className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                                Occupied
                              </p>
                              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Status is automatically set to "Occupied" when tenants are assigned
                              </p>
                            </div>
                          ) : (
                            <Select
                              value={
                                (() => {
                                  const currentStatus = (room as any).status || "available";
                                  return currentStatus === "reserved" ? "reserved" : "available";
                                })()
                              }
                              onValueChange={(value) => {
                                setRooms((prev) =>
                                  prev.map((r) =>
                                    r.id === room.id
                                      ? { ...r, status: value, occupied: false }
                                      : r
                                  )
                                );
                              }}
                            >
                              <SelectTrigger className="w-full bg-background border-2 hover:border-primary transition-colors">
                                <SelectValue>
                                  {(() => {
                                    const currentStatus = (room as any).status || "available";
                                    if (currentStatus === "reserved") {
                                      return (
                                        <span className="flex items-center gap-2">
                                          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                          Reserved
                                        </span>
                                      );
                                    }
                                    return (
                                      <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Available
                                      </span>
                                    );
                                  })()}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-2 border-border shadow-xl z-50 min-w-[200px]">
                                <SelectItem 
                                  value="available"
                                  className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-950"
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    Available
                                  </span>
                                </SelectItem>
                                <SelectItem 
                                  value="reserved"
                                  className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-950"
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                    Reserved
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Tenants
                          </p>
                          <div className="max-h-40 overflow-y-auto border rounded p-2">
                            {getAvailableTenants(room).map((t) => (
                              <label
                                key={t.id}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={room.tenantNames.includes(t.name)}
                                  onChange={(e) =>
                                    setRooms((prev) =>
                                      prev.map((r) =>
                                        r.id === room.id
                                          ? {
                                              ...r,
                                              tenantNames: e.target.checked
                                                ? [...r.tenantNames, t.name]
                                                : r.tenantNames.filter(
                                                    (n) => n !== t.name
                                                  ),
                                            }
                                          : r
                                      )
                                    )
                                  }
                                />
                                <span>{t.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => handleSave(room.id, room)}
                          disabled={savingId === room.id}
                        >
                          {savingId === room.id ? "Saving…" : "Save"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold">{room.name}</p>
                        <p>Rent: ₱{(room.rent / 100).toFixed(2)}</p>
                        <p>
                          Status:{" "}
                          {(() => {
                            const status = (room as any).status || (room.occupied ? "occupied" : "available");
                            if (status === "occupied") {
                              return <span className="text-red-600 font-medium">Occupied</span>;
                            } else if (status === "reserved") {
                              return <span className="text-yellow-600 font-medium">Reserved</span>;
                            } else {
                              return <span className="text-green-600 font-medium">Available</span>;
                            }
                          })()}
                        </p>
                        <p>
                          Tenants:{" "}
                          {room.tenantNames.length > 0
                            ? room.tenantNames.join(", ")
                            : "None"}
                        </p>
                        <Button
                          className="mt-2 w-full"
                          variant="outline"
                          onClick={() => handleEdit(room)}
                        >
                          Edit Room
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
