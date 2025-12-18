"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Flame, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { habitNavItems } from "./navigation";
import { DashboardSelector } from "./dashboard-selector";
import { useApp } from "@/contexts/app-provider";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const pathname = usePathname();
  const { selectedDashboard } = useApp();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-6">
        <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-lg"
        >
            <Flame className="h-6 w-6 text-primary" />
            <span>Track2025</span>
        </Link>
        
      </div>

      <div className="flex items-center gap-4">
        {selectedDashboard === 'habits' && (
            <nav className="hidden md:flex items-center gap-1 rounded-lg bg-secondary/80 p-1">
                {habitNavItems.map((item) => (
                <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    asChild
                >
                    <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                    </Link>
                </Button>
                ))}
            </nav>
        )}
        <DashboardSelector />

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="h-16 flex items-center px-6 border-b">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 font-bold text-lg"
                >
                  <Flame className="h-6 w-6 text-primary" />
                  <span>Track2025</span>
                </Link>
              </div>
              {selectedDashboard === 'habits' && (
                <nav className="flex-1 px-4 py-6 space-y-2">
                  {habitNavItems.map((item) => (
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
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
