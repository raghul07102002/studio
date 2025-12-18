import type { IconName } from "@/components/icons";

export interface Habit {
  id: string;
  name: string;
  type: "checkbox" | "numeric";
  icon: IconName;
}

export interface HabitLog {
  completed: boolean;
  value?: number;
}

export type DailyHabitLogs = Record<string, HabitLog>;

export type HabitData = Record<string, DailyHabitLogs>;

export type ViewOption =
  | "Year"
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";
