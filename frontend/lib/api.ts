const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export async function getRooms() {
  const res = await fetch(`${BASE}/api/rooms`);
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json();
}

export async function addRoom(room: { name: string; rate?: string }) {
  const res = await fetch(`${BASE}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room),
  });
  if (!res.ok) throw new Error("Failed to add room");
  return res.json();
}
