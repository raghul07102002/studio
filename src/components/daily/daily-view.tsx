"use client";

import { useApp } from "@/contexts/app-provider";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { calculateDailyCompletion } from "@/lib/analysis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

export function DailyView() {
  const { habits, habitData, updateHabitLog, filteredDates, isInitialized } = useApp();

  if (!isInitialized) {
    return (
        <div className="border rounded-lg">
            <div className="p-4">
                <Skeleton className="h-8 w-full" />
            </div>
            <div className="p-4">
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)] border rounded-lg">
      <Table>
        <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm">
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            {habits.map((habit) => (
              <TableHead key={habit.id} className="text-center w-[100px] whitespace-nowrap">{habit.name}</TableHead>
            ))}
            <TableHead className="text-right w-[150px]">Daily Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDates.map((date) => {
            const dateString = format(date, "yyyy-MM-dd");
            const dayLogs = habitData[dateString] || {};
            const dailyCompletion = calculateDailyCompletion(dayLogs, habits);

            return (
              <TableRow key={dateString}>
                <TableCell className="font-medium">{format(date, "MMM d")}</TableCell>
                {habits.map((habit) => {
                  const log = dayLogs[habit.id] || { completed: false };
                  return (
                    <TableCell key={habit.id} className="text-center">
                      {habit.type === "checkbox" ? (
                        <Checkbox
                          checked={log.completed}
                          onCheckedChange={(checked) =>
                            updateHabitLog(dateString, habit.id, {
                              completed: !!checked,
                            })
                          }
                          aria-label={`${habit.name} on ${dateString}`}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={log.completed}
                                onCheckedChange={(checked) =>
                                    updateHabitLog(dateString, habit.id, {
                                    completed: !!checked,
                                    })
                                }
                                aria-label={`${habit.name} on ${dateString} completed`}
                            />
                            <Input
                                type="number"
                                className="h-8 w-16"
                                value={log.value ?? ""}
                                onChange={(e) =>
                                    updateHabitLog(dateString, habit.id, {
                                        completed: log.completed,
                                        value: parseInt(e.target.value) || 0,
                                    })
                                }
                                aria-label={`${habit.name} value on ${dateString}`}
                            />
                        </div>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm font-medium w-12 text-right">{dailyCompletion.toFixed(0)}%</span>
                    <Progress value={dailyCompletion} className="w-24 h-2" />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
