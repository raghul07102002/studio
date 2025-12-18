"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./header";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <AppHeader />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
