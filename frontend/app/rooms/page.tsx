"use client";

import { useEffect, useState } from "react";
import { getAllRooms, patchRoom, getAllTenants } from "@/lib/api";

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
  occupied: boolean;
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
  const [filter, setFilter] = useState<"All" | "Available" | "Occupied">("All");
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
    if (filter === "Available" && room.occupied) return false;
    if (filter === "Occupied" && !room.occupied) return false;
    if (search && !room.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const total = rooms.length;
  const available = rooms.filter((r) => !r.occupied).length;
  const occupied = rooms.filter((r) => r.occupied).length;

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

    // Auto-set occupied value
    const patchedRoom = {
      ...updatedRoom,
      occupied: updatedRoom.tenantNames.length > 0,
    };

    try {
      await patchRoom(roomId, patchedRoom);

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
  const getAvailableTenants = (room: Room) => {
    return tenants.filter(
      (t) => !t.roomId || room.tenantNames.includes(t.name)
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="Room Management" subtitle={`${total} total rooms`} />
      <div className="flex flex-col flex-1 p-8 overflow-hidden">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                {["All", "Available", "Occupied"].map((f) => (
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
        <div className="flex-1 overflow-y-auto pr-2">
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
                        <p>Rent: ₱{room.rent.toFixed(2)}</p>
                        <p>
                          Status:{" "}
                          {room.occupied ? (
                            <span className="text-red-600 font-medium">
                              Occupied
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">
                              Available
                            </span>
                          )}
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
