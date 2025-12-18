"use client";

import { useMemo } from "react";
import { useApp } from "@/contexts/app-provider";
import { getWeeksInYear } from "@/lib/utils";
import { format, isSameMonth } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { calculateOverallCompletion } from "@/lib/analysis";
import { MONTHS, YEAR } from "@/lib/constants";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function WeeklyView() {
  const { habitData, habits, selectedView, filteredDates, isInitialized } = useApp();

  const weeks = useMemo(() => {
    if (selectedView === "Year") {
      return getWeeksInYear(YEAR);
    }
    const monthIndex = MONTHS.indexOf(selectedView);
    return getWeeksInYear(YEAR).filter(week => 
      week.days.some(day => isSameMonth(day, new Date(YEAR, monthIndex)))
    );
  }, [selectedView]);

  if (!isInitialized) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
            {weeks.map(({ weekNumber, days }) => {
                const weekCompletion = calculateOverallCompletion(habitData, habits, days);
                const firstDay = days[0];
                const lastDay = days[days.length - 1];

                return (
                <AccordionItem value={`week-${weekNumber}`} key={weekNumber}>
                    <AccordionTrigger>
                    <div className="flex justify-between items-center w-full pr-4">
                        <div className="text-left">
                        <p className="font-semibold">Week {weekNumber}</p>
                        <p className="text-sm text-muted-foreground">
                            {format(firstDay, "MMM d")} - {format(lastDay, "MMM d, yyyy")}
                        </p>
                        </div>
                        <div className="flex items-center gap-4 w-1/3">
                        <Progress value={weekCompletion} className="h-2" />
                        <span className="font-semibold w-16 text-right">
                            {weekCompletion.toFixed(1)}%
                        </span>
                        </div>
                    </div>
                    </AccordionTrigger>
                    <AccordionContent>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs px-4">
                        {days.map(day => {
                           const dayCompletion = calculateOverallCompletion(habitData, habits, [day]);
                           const isFiltered = filteredDates.some(filteredDate => filteredDate.getTime() === day.getTime());

                           return (
                            <div key={day.toString()} className={`p-2 rounded-md ${isFiltered ? 'bg-secondary' : 'bg-muted/50'}`}>
                                <p className="font-bold">{format(day, "eee")}</p>
                                <p>{format(day, "d")}</p>
                                <p className={`font-semibold mt-1 ${isFiltered ? '' : 'text-muted-foreground'}`}>{dayCompletion.toFixed(0)}%</p>
                            </div>
                           )
                        })}
                    </div>
                    </AccordionContent>
                </AccordionItem>
                );
            })}
            </Accordion>
        </CardContent>
    </Card>
  );
}
