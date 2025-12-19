

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
  | "Day"
  | "Week"
  | "Month"
  | "Year";

export type DashboardOption = "habits" | "wealth" | "career" | "travel";

// Career Dashboard Types
export type CareerPath = 'CyberArk' | 'Sailpoint IDN' | 'Cloud computing' | 'Devops';

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface RoadmapItem {
    id: string;
    title: string;
    hoursSpent: number;
    displayHours?: string;
    subtasks?: Subtask[];
}

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
  schemeCode?: string;
}

export interface MutualFunds {
  debt: Fund[];
  gold: Fund[];
  equity: Fund[];
}

export interface SavingsAllocation {
  mutualFunds: MutualFunds;
  emergencyFunds: Fund[];
  shortTermGoals: Fund[];
}


export interface MonthlyBudget {
  [month: string]: number; // e.g., { "2025-01": 50000 }
}

export interface WealthData {
  monthlySalary: number;
  monthlySavings: number;
  expenses: Record<string, Expense[]>;
  trips: Trip[];
  savingsAllocation: SavingsAllocation;
  expenseBudgets: MonthlyBudget;
  tripBudgets: MonthlyBudget;
}

// Travel Dashboard Types
export interface TravelPlace {
  id: string;
  name: string;
  district: string;
  state: string;
  date: string; // YYYY-MM-DD
  coords: { lat: number; lng: number };
}

export interface TravelData {
  places: TravelPlace[];
  selectedStates: string[];
}
