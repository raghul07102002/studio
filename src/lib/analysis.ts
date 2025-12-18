import { Habit, HabitData } from "./types";
import { getDaysInYear } from "./utils";
import { YEAR } from "./constants";
import { format, isSameMonth, parse } from "date-fns";

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

export const getFilteredDates = (view: string, year: number) => {
  const allDates = getDaysInYear(year);
  if (view === "Year") {
    return allDates;
  }
  const monthIndex = new Date(Date.parse(view +" 1, 2012")).getMonth();
  return allDates.filter(date => isSameMonth(date, new Date(year, monthIndex)));
};
