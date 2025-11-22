const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
const BASE_URL_ROOMS = `${BASE_URL}/api/rooms`;
const BASE_URL_TENANTS = `${BASE_URL}/api/tenants`;

export async function addRoom(roomData: any) {
  const res = await fetch(BASE_URL_ROOMS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  });

  if (!res.ok) throw new Error("Failed to create room");
  return res.json();
}

export async function updateRoom(id: string, roomData: any) {
  const res = await fetch(`${BASE_URL_ROOMS}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  });

  if (!res.ok) throw new Error("Failed to update room");
  return res.json();
}

export async function patchRoom(id: string, partialData: any) {
  const res = await fetch(`${BASE_URL_ROOMS}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(partialData),
  });

  if (!res.ok) throw new Error("Failed to patch room");
  return res.json();
}

export async function deleteRoom(id: string) {
  const res = await fetch(`${BASE_URL_ROOMS}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete room");
  return true;
}

export async function getRoomById(id: string) {
  const res = await fetch(`${BASE_URL_ROOMS}/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Room not found");
  return res.json();
}

export async function getAllRooms() {
  const res = await fetch(BASE_URL_ROOMS);
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json();
}
export async function getAllTenants() {
  const res = await fetch(BASE_URL_TENANTS, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch tenants");
  return res.json();
}

export async function getTenantById(id: string) {
  const res = await fetch(`${BASE_URL_TENANTS}/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Tenant not found");
  return res.json();
}

export async function addTenant(tenantData: any) {
  const res = await fetch(BASE_URL_TENANTS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tenantData),
  });

  if (!res.ok) throw new Error("Failed to create tenant");
  return res.json();
}

export async function updateTenant(id: string, tenantData: any) {
  const res = await fetch(`${BASE_URL_TENANTS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tenantData),
  });

  if (!res.ok) throw new Error("Failed to update tenant");
  return res.json();
}

export async function patchTenant(id: string, partialData: any) {
  const res = await fetch(`${BASE_URL_TENANTS}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partialData),
  });

  if (!res.ok) throw new Error("Failed to patch tenant");
  return res.json();
}

export async function deleteTenant(id: string) {
  const res = await fetch(`${BASE_URL_TENANTS}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete tenant");
  return true;
}
