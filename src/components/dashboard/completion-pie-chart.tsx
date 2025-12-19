
"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useApp } from "@/contexts/app-provider";
import { calculateDailyCompletion } from "@/lib/analysis";
import { Heart } from "lucide-react";
import { format } from "date-fns";

export function CompletionPieChart() {
  const { habits, habitData } = useApp();

  const dailyCompletion = useMemo(() => {
    const todayString = format(new Date(), "yyyy-MM-dd");
    const todayLogs = habitData[todayString] || {};
    return calculateDailyCompletion(todayLogs, habits);
  }, [habitData, habits]);


  const chartData = useMemo(() => {
    const completed = dailyCompletion;
    const remaining = 100 - completed;
    return [
      { name: "Completed", value: completed, fill: "hsl(var(--primary))" },
      { name: "Remaining", value: remaining, fill: "hsl(var(--muted))" },
    ];
  }, [dailyCompletion]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Today's Completion</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[300px] aspect-square">
          <ChartContainer
            config={{}}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${(value as number).toFixed(1)}%`}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="70%"
                  outerRadius="100%"
                  strokeWidth={5}
                  stroke="hsl(var(--background))"
                  startAngle={90}
                  endAngle={450}
                  cornerRadius={8}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <p className="text-5xl font-bold tracking-tighter">{dailyCompletion.toFixed(0)}%</p>
          </div>
        </div>
      </CardContent>
      <div className="p-6 pt-0 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3">
          <Heart className="h-5 w-5 text-primary/50" />
          <p>Be kind to yourself. Small steps lead to big changes.</p>
        </div>
      </div>
    </Card>
  );
}
