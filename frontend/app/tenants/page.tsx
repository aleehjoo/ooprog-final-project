"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllTenants, patchTenant, getAllRooms, patchRoom } from "@/lib/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface Tenant {
  id: string;
  name: string;
  rent: number;
  roomId?: string | null;
  roomName?: string;
  paymentStatus?: string;
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

  // Calculate rent for a tenant based on their room
  const calculateTenantRent = (tenant: Tenant): number => {
    if (!tenant.roomName) {
      return 0; // No room, no rent
    }

    // Find the room this tenant is in
    const tenantRoom = rooms.find((r) => r.name === tenant.roomName);
    if (!tenantRoom) {
      return 0;
    }

    // Count how many tenants are in this room
    const tenantsInRoom = tenants.filter((t) => t.roomName === tenantRoom.name);
    const tenantCount = tenantsInRoom.length;

    if (tenantCount === 0) {
      return 0;
    }

    // Rent is room rent (in cents) divided by number of tenants, then convert to pesos
    return tenantRoom.rent / tenantCount / 100;
  };

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
      // Get the original tenant to check for room changes
      const originalTenant = tenants.find((t) => t.id === tenant.id);
      if (!originalTenant) return;

      // Calculate rent before saving (rent is not editable, calculated from room)
      const calculatedRent = calculateTenantRent(tenant) * 100; // Convert to cents
      
      // Update tenant with calculated rent and payment status
      const tenantToSave = {
        ...tenant,
        rent: calculatedRent,
        paymentStatus: tenant.paymentStatus || "not_paid",
      };
      
      await patchTenant(tenant.id, tenantToSave);

      // Find the room the tenant is assigned to (by roomName)
      const assignedRoom = rooms.find((r) => r.name === tenant.roomName);
      const previousRoom = rooms.find((r) => r.name === originalTenant.roomName);

      // Remove tenant from previous room if room changed
      if (previousRoom && previousRoom.id !== assignedRoom?.id) {
        const updatedTenantNames = (previousRoom.tenantNames || []).filter(
          (name) => name !== tenant.name
        );
        await patchRoom(previousRoom.id, {
          tenantNames: updatedTenantNames,
          occupied: updatedTenantNames.length > 0,
          status: updatedTenantNames.length > 0 ? "occupied" : previousRoom.status || "available",
        });
      }

      // Add tenant to new room if assigned
      if (assignedRoom) {
        const currentTenantNames = assignedRoom.tenantNames || [];
        if (!currentTenantNames.includes(tenant.name)) {
          const updatedTenantNames = [...currentTenantNames, tenant.name];
          await patchRoom(assignedRoom.id, {
            tenantNames: updatedTenantNames,
            occupied: true,
            status: "occupied",
          });
        }
      }

      // Refresh data
      const [refreshedTenants, refreshedRooms] = await Promise.all([
        getAllTenants(),
        getAllRooms(),
      ]);

      setTenants(refreshedTenants);
      setRooms(refreshedRooms);

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
                          <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">
                              Rent (calculated automatically)
                            </label>
                            <Input
                              type="text"
                              value={
                                tenant.roomName
                                  ? `₱${calculateTenantRent(tenant).toFixed(2)}`
                                  : "No room assigned"
                              }
                              disabled
                              className="bg-muted cursor-not-allowed"
                            />
                            {tenant.roomName && (
                              <p className="text-xs text-muted-foreground">
                                Room rent divided by {tenants.filter((t) => t.roomName === tenant.roomName).length} tenant(s)
                              </p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">
                              Room
                            </label>
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
                              className="border rounded p-2 w-full"
                            >
                              <option value="">No Room</option>
                              {rooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">
                              Payment Status
                            </label>
                            <Select
                              value={tenant.paymentStatus || "not_paid"}
                              onValueChange={(value) =>
                                setTenants((prev) =>
                                  prev.map((t) =>
                                    t.id === tenant.id
                                      ? { ...t, paymentStatus: value }
                                      : t
                                  )
                                )
                              }
                            >
                              <SelectTrigger className="w-full bg-background border-2 hover:border-primary transition-colors">
                                <SelectValue>
                                  {tenant.paymentStatus === "paid" ? (
                                    <span className="flex items-center gap-2">
                                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                      Paid
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-2">
                                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                      Not Paid
                                    </span>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-2 border-border shadow-xl z-50 min-w-[200px]">
                                <SelectItem 
                                  value="paid"
                                  className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-950"
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    Paid
                                  </span>
                                </SelectItem>
                                <SelectItem 
                                  value="not_paid"
                                  className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    Not Paid
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

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
                            Rent: {tenant.roomName ? `₱${calculateTenantRent(tenant).toFixed(2)}` : "No rent"}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-muted-foreground">Payment:</span>
                            <span
                              className={`text-sm font-medium ${
                                tenant.paymentStatus === "paid"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {tenant.paymentStatus === "paid" ? "Paid" : "Not Paid"}
                            </span>
                          </div>
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
