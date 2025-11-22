"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllTenants, patchTenant, getAllRooms, patchRoom } from "@/lib/api";

export interface Tenant {
  id: string;
  name: string;
  rent: number;
  roomId?: string | null;
  roomName?: string;
}

export interface Room {
  id: string;
  name: string;
  rent: number;
  occupied?: boolean;
  tenantNames?: string[];
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [backupTenant, setBackupTenant] = useState<Tenant | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const tenantsData = await getAllTenants();
        const roomsData = await getAllRooms();

        const updatedRooms = roomsData.map((r: Room) => ({
          ...r,
          occupied: tenantsData.some((t: Tenant) => t.roomId === r.id),
          tenantNames: tenantsData
            .filter((t: Tenant) => t.roomId === r.id)
            .map((t: Tenant) => t.name),
        }));

        setTenants(tenantsData);
        setRooms(updatedRooms);
      } catch (err) {
        console.error("Failed to load tenants or rooms", err);
      }
    }
    loadData();
  }, []);

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (tenant: Tenant) => {
    setBackupTenant({ ...tenant });
    setEditingId(tenant.id);
  };

  const handleCancel = () => {
    if (backupTenant) {
      setTenants((prev) =>
        prev.map((t) => (t.id === backupTenant.id ? backupTenant : t))
      );
    }
    setEditingId(null);
    setBackupTenant(null);
  };

  const handleSave = async (tenant: Tenant) => {
    setSavingId(tenant.id);
    try {
      // Update tenant first
      await patchTenant(tenant.id, tenant);

      setTenants((prev) => prev.map((t) => (t.id === tenant.id ? tenant : t)));

      // Update all rooms affected
      for (const room of rooms) {
        const tenantsInRoom = tenants
          .map((t) => (t.id === tenant.id ? tenant : t))
          .filter((t) => t.roomId === room.id);

        const updatedRoom: Room = {
          ...room,
          occupied: tenantsInRoom.length > 0,
          tenantNames: tenantsInRoom.map((t) => t.name),
        };

        // Only patch if the room changed
        if (
          updatedRoom.occupied !== room.occupied ||
          JSON.stringify(updatedRoom.tenantNames) !==
            JSON.stringify(room.tenantNames)
        ) {
          await patchRoom(room.id, updatedRoom);
        }
      }

      // Update rooms state locally
      setRooms((prev) =>
        prev.map((r) => {
          const tenantsInRoom = tenants
            .map((t) => (t.id === tenant.id ? tenant : t))
            .filter((t) => t.roomId === r.id);

          return {
            ...r,
            occupied: tenantsInRoom.length > 0,
            tenantNames: tenantsInRoom.map((t) => t.name),
          };
        })
      );

      setEditingId(null);
      setBackupTenant(null);
    } catch (err) {
      console.error("Failed to save tenant or update room", err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Tenant Management"
        subtitle={`${tenants.length} total tenants`}
      />

      <div className="flex-1 overflow-auto p-8">
        <Card className="mb-8">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold flex gap-2 flex-wrap">
                Tenants
              </h2>

              <div className="flex gap-3 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search tenants..."
                  className="flex-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Link href="/tenants/add-tenant">
                  <Button size="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tenant
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredTenants.length === 0 ? (
          <p className="text-muted-foreground">No tenants found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenants.map((tenant) => {
              const isEditing = editingId === tenant.id;
              return (
                <Card key={tenant.id} className="shadow-sm">
                  <CardContent className="py-2">
                    <div className="flex flex-col gap-2">
                      {isEditing ? (
                        <>
                          <Input
                            value={tenant.name}
                            onChange={(e) =>
                              setTenants((prev) =>
                                prev.map((t) =>
                                  t.id === tenant.id
                                    ? { ...t, name: e.target.value }
                                    : t
                                )
                              )
                            }
                          />
                          <Input
                            type="number"
                            value={tenant.rent || 0}
                            onChange={(e) =>
                              setTenants((prev) =>
                                prev.map((t) =>
                                  t.id === tenant.id
                                    ? { ...t, rent: Number(e.target.value) }
                                    : t
                                )
                              )
                            }
                          />
                          <select
                            title="Room"
                            value={tenant.roomId || ""}
                            onChange={(e) =>
                              setTenants((prev) =>
                                prev.map((t) =>
                                  t.id === tenant.id
                                    ? {
                                        ...t,
                                        roomId: e.target.value || null,
                                        roomName:
                                          rooms.find(
                                            (r) => r.id === e.target.value
                                          )?.name || "",
                                      }
                                    : t
                                )
                              )
                            }
                            className="border rounded p-2"
                          >
                            <option value="">No Room</option>
                            {rooms.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>

                          <Button
                            className="w-full"
                            onClick={() => handleSave(tenant)}
                            disabled={savingId === tenant.id}
                          >
                            {savingId === tenant.id ? "Saving…" : "Save"}
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
                          <p className="text-xl font-semibold">{tenant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Room: {tenant.roomName || "None"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Rent: ₱{tenant.rent}
                          </p>
                          <Button
                            className="mt-4 w-full"
                            variant="outline"
                            onClick={() => handleEdit(tenant)}
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
