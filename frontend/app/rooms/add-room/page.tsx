import { RoomForm } from "@/components/forms/rooms-form";
import { Header } from "@/components/header";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

function page() {
  return (
    <main className="flex flex-col h-full">
      <Header title="Add Room" />
      <div className="p-10 flex gap-6">
        <Link href={"/rooms"} className="mb-8">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <RoomForm />
      </div>
    </main>
  );
}

export default page;
