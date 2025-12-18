"use client";

import { useApp } from "@/contexts/app-provider";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, getYear, getMonth } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { calculateDailyCompletion } from "@/lib/analysis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { eachDayOfInterval } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MONTHS, YEAR } from "@/lib/constants";

export function DailyView() {
  const { habits, habitData, updateHabitLog, isInitialized } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = getYear(currentDate);
  const currentMonth = getMonth(currentDate);

  const week = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(year));
    setCurrentDate(newDate);
  }

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(MONTHS.indexOf(month));
    setCurrentDate(newDate);
  }


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
    <div className="border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <Select value={String(currentYear)} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-28">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[...Array(5)].map((_, i) => (
                            <SelectItem key={YEAR - 2 + i} value={String(YEAR - 2 + i)}>{YEAR - 2 + i}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select value={MONTHS[currentMonth]} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {MONTHS.map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                 <div className="text-sm font-medium text-center w-48">
                    {format(week[0], "MMM d")} - {format(week[6], "MMM d, yyyy")}
                 </div>
                <Button variant="outline" size="icon" onClick={goToNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    <ScrollArea className="h-[calc(100vh-14rem)]">
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
          {week.map((date) => {
            const dateString = format(date, "yyyy-MM-dd");
            const dayLogs = habitData[dateString] || {};
            const dailyCompletion = calculateDailyCompletion(dayLogs, habits);

            return (
              <TableRow key={dateString}>
                <TableCell className="font-medium">{format(date, "MMM d, eee")}</TableCell>
                {habits.map((habit) => {
                  const log = dayLogs[habit.id] || { completed: false };
                  return (
                    <TableCell key={habit.id} className="text-center">
                      <Checkbox
                          checked={log.completed}
                          onCheckedChange={(checked) =>
                            updateHabitLog(dateString, habit.id, {
                              completed: !!checked,
                            })
                          }
                          aria-label={`${habit.name} on ${dateString}`}
                        />
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
    </div>
  );
}
