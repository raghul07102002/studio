import { YEAR } from "@/lib/constants";
import { getDaysInYear } from "@/lib/utils";
import { format } from "date-fns";
import type { Habit, HabitData } from "@/lib/types";
import { DEFAULT_HABITS } from "./habits";

export function generateInitialHabitData(habits: Habit[] = DEFAULT_HABITS): HabitData {
  const daysIn2025 = getDaysInYear(YEAR);
  const initialData: HabitData = {};

  for (const day of daysIn2025) {
    const dateString = format(day, "yyyy-MM-dd");
    initialData[dateString] = {};
    for (const habit of habits) {
      initialData[dateString][habit.id] = {
        completed: false,
        value: habit.type === "numeric" ? 0 : undefined,
      };
    }
  }

  return initialData;
}
