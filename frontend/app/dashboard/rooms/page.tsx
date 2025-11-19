import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function RoomsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Room Management" subtitle={`--- total rooms`} />

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Rooms",
              value: "---",
              className: "text-foreground",
            },
            {
              label: "Available Rooms",
              value: "---",
              className: "text-accent",
            },
            {
              label: "Occupied Rooms",
              value: "---",
              className: "text-destructive",
            },
            {
              label: "Reserved Rooms",
              value: "---",
              className: "text-warning",
            },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.className}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {["All", "Available", "Occupied", "Reserved"].map((filter) => (
                  <Button key={filter} size="sm" variant={"outline"}>
                    {filter}
                  </Button>
                ))}
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search rooms..."
                  className="flex-1"
                />
                <Button size="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
