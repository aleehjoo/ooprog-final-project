"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              MS
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
