import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function RoomsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Tenant Management" subtitle={`--- total tenants`} />

      <div className="flex-1 overflow-auto p-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold flex gap-2 flex-wrap">
                Tenants
              </h2>

              <div className="flex gap-3 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search tenants..."
                  className="flex-1"
                />
                <Link href="/tenants/add-tenant">
                  <Button size="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tenants
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
