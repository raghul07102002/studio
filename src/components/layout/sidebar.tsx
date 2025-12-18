
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Settings,
  Flame,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/daily", icon: CalendarDays, label: "Daily View" },
  { href: "/weekly", icon: CalendarRange, label: "Weekly View" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-card hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Flame className="h-6 w-6 text-primary" />
          <span>ChronoHabits</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="px-4 py-6 border-t">
        <p className="text-xs text-muted-foreground text-center">© 2025 ChronoHabits</p>
      </div>
    </aside>
  );
}
