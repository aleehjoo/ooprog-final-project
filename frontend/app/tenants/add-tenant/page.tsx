import { TenantForm } from "@/components/forms/tenants-form";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

function page() {
  return (
    <main className="flex flex-col h-full">
      <Header title="Add Tenant" />
      <div className="p-10 flex gap-6">
        <Link href={"/tenants"} className="mb-8">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <TenantForm />
      </div>
    </main>
  );
}

export default page;
