"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useApp } from "@/contexts/app-provider";
import { calculateHabitCompletion } from "@/lib/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/icons";

export function CompletionChart() {
  const { habits, habitData, filteredDates } = useApp();

  const chartData = useMemo(() => {
    return habits.map((habit) => ({
      name: habit.name,
      icon: habit.icon,
      completion: parseFloat(
        calculateHabitCompletion(habitData, habit.id, filteredDates).toFixed(1)
      ),
    })).sort((a,b) => a.completion - b.completion);
  }, [habits, habitData, filteredDates]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Completion Rate by Habit</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={80} 
                tickLine={false} 
                axisLine={false}
                tick={{fontSize: 12}}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value) => [`${value}%`, "Completion"]}
            />
            <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
