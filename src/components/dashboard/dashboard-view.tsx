"use client";

import { useApp } from "@/contexts/app-provider";
import { Skeleton } from "../ui/skeleton";
import { CompletionPieChart } from "./completion-pie-chart";
import { DailyProgressChart } from "./daily-progress-chart";
import { Card, CardContent } from "../ui/card";
import { AnalogClock } from "./analog-clock";

export function HabitDashboardView() {
  const { isInitialized } = useApp();

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="lg:col-span-1 h-96" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompletionPieChart />
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <Card className="flex-1">
            <CardContent className="h-full flex flex-col items-center justify-center p-6">
              <AnalogClock />
            </CardContent>
          </Card>
        </div>
      </div>
      <DailyProgressChart />
    </div>
  );
}
