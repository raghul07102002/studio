"use client";

import { useMemo } from "react";
import { useApp } from "@/contexts/app-provider";
import { calculateHabitCompletion } from "@/lib/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/icons";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HabitProgressList() {
  const { habits, habitData, filteredDates } = useApp();

  const habitProgress = useMemo(() => {
    return habits
      .map((habit) => ({
        ...habit,
        completion: calculateHabitCompletion(habitData, habit.id, filteredDates),
      }))
      .sort((a, b) => b.completion - a.completion);
  }, [habits, habitData, filteredDates]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Habit Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
            <div className="space-y-4 pr-4">
            {habitProgress.map((habit) => (
                <div key={habit.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 font-medium">
                        <Icon name={habit.icon} className="h-4 w-4 text-muted-foreground" />
                        <span>{habit.name}</span>
                    </div>
                    <span className="font-semibold">{habit.completion.toFixed(1)}%</span>
                </div>
                <Progress value={habit.completion} className="h-2" />
                </div>
            ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
