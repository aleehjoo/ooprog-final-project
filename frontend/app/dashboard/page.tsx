"use client";

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, DollarSign, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Properties",
      value: "24",
      icon: Home,
      color: "text-blue-500",
    },
    {
      label: "Total Tenants",
      value: "78",
      icon: Users,
      color: "text-green-500",
    },
    {
      label: "Monthly Revenue",
      value: "$18,500",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      label: "Pending Issues",
      value: "6",
      icon: AlertCircle,
      color: "text-orange-500",
    },
  ];

  const recentActivity = [
    {
      title: "Payment received from Apartment 3B",
      time: "2 hours ago",
      amount: "+$1,200",
    },
    {
      title: "Payment received from Apartment 3B",
      time: "2 hours ago",
      amount: "+$1,200",
    },
    {
      title: "Payment received from Apartment 3B",
      time: "2 hours ago",
      amount: "+$1,200",
    },
    {
      title: "Payment received from Apartment 3B",
      time: "2 hours ago",
      amount: "+$1,200",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle="Welcome back to your property management system"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="grid grid-cols-1  gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    {activity.amount && (
                      <span className="text-sm font-semibold text-success">
                        {activity.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
