"use client";

import { ViewSelector } from "./view-selector";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Flame, Menu, LayoutDashboard, CalendarDays, CalendarRange, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/daily", icon: CalendarDays, label: "Daily View" },
    { href: "/weekly", icon: CalendarRange, label: "Weekly View" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

export function AppHeader() {
    const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
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
                </SheetContent>
            </Sheet>
        </div>
        <h1 className="text-xl font-semibold hidden sm:block">
            {navItems.find(item => item.href === pathname)?.label || 'ChronoHabits'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <ViewSelector />
      </div>
    </header>
  );
}
