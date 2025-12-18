
import { Habit, HabitData, ViewOption } from "./types";
import { getDaysInYear } from "./utils";
import { YEAR } from "./constants";
import { format, isSameMonth, parse, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval } from "date-fns";

export const calculateDailyCompletion = (
  dailyLogs: Record<string, { completed: boolean }>,
  habits: Habit[]
) => {
  if (!dailyLogs || habits.length === 0) return 0;
  const completedCount = Object.values(dailyLogs).filter(
    (log) => log.completed
  ).length;
  return (completedCount / habits.length) * 100;
};

export const calculateOverallCompletion = (
  habitData: HabitData,
  habits: Habit[],
  filteredDates: Date[]
) => {
  if (habits.length === 0 || filteredDates.length === 0) return 0;

  const totalPossible = filteredDates.length * habits.length;
  if (totalPossible === 0) return 0;

  let totalCompleted = 0;
  for (const date of filteredDates) {
    const dateString = format(date, "yyyy-MM-dd");
    const dayData = habitData[dateString];
    if (dayData) {
      totalCompleted += Object.values(dayData).filter((h) => h.completed).length;
    }
  }

  return (totalCompleted / totalPossible) * 100;
};

export const calculateHabitCompletion = (
  habitData: HabitData,
  habitId: string,
  filteredDates: Date[]
) => {
  if (filteredDates.length === 0) return 0;

  let completedCount = 0;
  for (const date of filteredDates) {
    const dateString = format(date, "yyyy-MM-dd");
    const habitLog = habitData[dateString]?.[habitId];
    if (habitLog?.completed) {
      completedCount++;
    }
  }

  return (completedCount / filteredDates.length) * 100;
};

export const getFilteredDates = (view: ViewOption, referenceDate: Date) => {
    const now = referenceDate;
    let start, end;
    
    switch (view) {
      case 'Day':
        start = now;
        end = now;
        return eachDayOfInterval({ start, end });
      case 'Week':
        start = startOfWeek(now);
        end = endOfWeek(now);
        return eachDayOfInterval({ start, end });
      case 'Month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        return eachDayOfInterval({ start, end });
      case 'Year':
        start = startOfYear(now);
        end = endOfYear(now);
        return eachDayOfInterval({ start, end });
      default:
        return getDaysInYear(now.getFullYear());
    }
};

export const getDailyProgression = (habitData: HabitData, habits: Habit[], filteredDates: Date[]) => {
  if (habits.length === 0 || filteredDates.length === 0) return [];
  
  return filteredDates.map(date => {
    const dateString = format(date, "yyyy-MM-dd");
    const dayData = habitData[dateString] || {};
    const completion = calculateDailyCompletion(dayData, habits);
    return {
      date: format(date, "MMM d"),
      completion: completion
    };
  });
};
