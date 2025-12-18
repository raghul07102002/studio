"use client";

import { useApp } from "@/contexts/app-provider";
import { OverviewCards } from "./overview-cards";
import { HabitProgressList } from "./habit-progress-list";
import { CompletionChart } from "./completion-chart";
import { ActionPlan } from "./action-plan";
import { Skeleton } from "../ui/skeleton";

export function HabitDashboardView() {
  const { isInitialized } = useApp();

  if (!isInitialized) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4 space-y-4">
                    <Skeleton className="h-96" />
                </div>
                <div className="lg:col-span-3 space-y-4">
                    <Skeleton className="h-96" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <OverviewCards />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
            <HabitProgressList />
        </div>
        <div className="lg:col-span-3">
            <CompletionChart />
        </div>
      </div>
      <ActionPlan />
    </div>
  );
}
