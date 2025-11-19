"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Home,
  Users,
  DollarSign,
  Wrench,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Rooms",
    href: "/dashboard/rooms",
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: "Tenants",
    href: "/dashboard/tenants",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: <DollarSign className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`bg-card border-r border-border transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-xl font-bold text-primary">RoomEase</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {item.icon}
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${
            collapsed ? "px-0 justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
