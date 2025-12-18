"use client";
import { useApp } from "@/contexts/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateOverallCompletion } from "@/lib/analysis";
import { CheckCircle, Target, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { format } from "date-fns";

export function OverviewCards() {
  const { habitData, habits, filteredDates } = useApp();

  const { overallCompletion, totalCompleted, daysTracked, potentialHabits } = useMemo(() => {
    const overall = calculateOverallCompletion(habitData, habits, filteredDates);
    
    let completed = 0;
    filteredDates.forEach(date => {
        const dateString = format(date, "yyyy-MM-dd");
        const dayData = habitData[dateString];
        if (dayData) {
            completed += Object.values(dayData).filter(h => h.completed).length;
        }
    });

    return {
        overallCompletion: overall,
        totalCompleted: completed,
        daysTracked: filteredDates.length,
        potentialHabits: filteredDates.length * habits.length
    }
  }, [habitData, habits, filteredDates]);


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Overall Completion
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallCompletion.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Across all habits for the selected period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Habits Done</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCompleted}</div>
          <p className="text-xs text-muted-foreground">
            Out of {potentialHabits} possible habit instances
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Days Tracked</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysTracked}</div>
          <p className="text-xs text-muted-foreground">
            in the current view
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
          <div className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{habits.length}</div>
          <p className="text-xs text-muted-foreground">
            being tracked
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
