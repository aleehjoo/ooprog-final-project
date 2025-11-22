"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, DollarSign } from "lucide-react";
import { getAllRooms, getAllTenants } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalTenants, setTotalTenants] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [roomsData, tenantsData] = await Promise.all([
          getAllRooms(),
          getAllTenants(),
        ]);

        setTotalRooms(roomsData.length);
        setTotalTenants(tenantsData.length);

        const revenue = tenantsData
          .filter((tenant: any) => tenant.paymentStatus === "paid")
          .reduce((sum: number, tenant: any) => sum + (tenant.rent || 0), 0) / 100;

        setTotalRevenue(revenue);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const stats = [
    {
      label: "Total Rooms",
      value: loading ? "..." : totalRooms.toString(),
      icon: Home,
      color: "text-blue-500",
    },
    {
      label: "Total Tenants",
      value: loading ? "..." : totalTenants.toString(),
      icon: Users,
      color: "text-green-500",
    },
    {
      label: "Total Revenue",
      value: loading
        ? "..."
        : `₱${totalRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      icon: DollarSign,
      color: "text-emerald-500",
    },
  ];

  const navigationButtons = [
    {
      label: "Rooms",
      href: "/rooms",
      icon: Home,
      description: "Manage your rooms",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "Tenants",
      href: "/tenants",
      icon: Users,
      description: "Manage your tenants",
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle="Welcome back to your property management system"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navigationButtons.map((button) => {
            const Icon = button.icon;
            return (
              <Link key={button.href} href={button.href}>
                <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                  <CardContent className="p-8 flex flex-col items-center justify-center min-h-[200px]">
                    <div
                      className={`${button.color} rounded-full p-6 mb-4 transition-transform duration-300 hover:scale-110`}
                    >
                      <Icon className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {button.label}
                    </h3>
                    <p className="text-muted-foreground text-center">
                      {button.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
