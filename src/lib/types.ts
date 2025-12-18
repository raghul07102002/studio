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

export type DashboardOption = "habits" | "wealth";

// Wealth Dashboard Types
export interface Expense {
  id: string;
  name: string;
  amount: number;
}

export interface Trip {
  id: string;
  name: string;
  amount: number;
}

export interface Fund {
  id: string;
  name: string;
  amount: number;
}

export interface SavingsAllocation {
  debt: Fund[];
  gold: Fund[];
  equity: Fund[];
}

export interface WealthData {
  monthlySalary: number;
  monthlySavings: number;
  expenses: Expense[];
  trips: Trip[];
  savingsAllocation: SavingsAllocation;
}
