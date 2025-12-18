import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { startOfWeek, getDay, addDays, format, getDaysInMonth as getDaysInMonthFns, getISOWeek, getYear } from 'date-fns';
import { YEAR } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDaysInYear(year: number) {
  const days = [];
  for (let month = 0; month < 12; month++) {
    const daysInMonth = getDaysInMonthFns(new Date(year, month, 1));
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
  }
  return days;
}


export function getWeeksInYear(year: number) {
  const weeks: { weekNumber: number; days: Date[] }[] = [];
  const daysInYear = getDaysInYear(year);

  let currentWeek: Date[] = [];
  let currentWeekNumber = -1;

  daysInYear.forEach(date => {
    const weekNumber = getISOWeek(date);

    if (weekNumber !== currentWeekNumber) {
      if (currentWeek.length > 0) {
        weeks.push({ weekNumber: currentWeekNumber, days: currentWeek });
      }
      currentWeek = [];
      currentWeekNumber = weekNumber;
    }
    currentWeek.push(date);
  });
  
  if (currentWeek.length > 0) {
      // Handle the case where Jan 1st is in a week that belongs to the previous year
      if (weeks.length === 0 && currentWeekNumber > 50) {
        weeks.push({ weekNumber: currentWeekNumber, days: currentWeek });
      } else if (weeks.length > 0) {
        weeks.push({ weekNumber: currentWeekNumber, days: currentWeek });
      }
  }

  // Special case for years starting mid-week from previous year's week
  const firstDay = new Date(year, 0, 1);
  if(getISOWeek(firstDay) > 50) {
    const weekStart = startOfWeek(firstDay, { weekStartsOn: 1 });
    const week = Array.from({length: 7}, (_, i) => addDays(weekStart, i));
    const daysFromPrevYear = week.filter(d => getYear(d) < year);
    if(daysFromPrevYear.length > 0) {
        const firstWeekData = weeks.find(w => w.weekNumber === getISOWeek(firstDay));
        if (firstWeekData) {
            firstWeekData.days = [...daysFromPrevYear, ...firstWeekData.days];
        }
    }
  }

  return weeks;
}

export function getWeekDays(date: Date, weekStartsOn: 0 | 1 = 0) {
    const start = startOfWeek(date, { weekStartsOn });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
