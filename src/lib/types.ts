
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
  | "Week"
  | "Month"
  | "Year";

export type DashboardOption = "habits" | "wealth" | "career" | "travel" | "day-planner";

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
  monthlySavings: Record<string, number>; // Now a record
  expenses: Record<string, Expense[]>;
  trips: Trip[];
  savingsAllocation: Record<string, SavingsAllocation>; // Now a record
  expenseBudgets: MonthlyBudget;
  tripBudgets: MonthlyBudget;
}

// Travel Dashboard Types
export interface RoadTripPlace {
    id: string;
    name: string;
    visited: boolean;
}

export interface RoadTripPlan {
    stateCode: string; // e.g. "MH" for Maharashtra
    country: string;
    places: RoadTripPlace[];
    startDate?: string;
    endDate?: string;
}

export interface TrekEntry {
    id: string;
    name: string;
    place: string;
    date: string;
    kilometers: number;
}

export interface TravelData {
  places: TravelEntry[];
  roadTrips: RoadTripPlan[];
  treks: TrekEntry[];
}


export interface TravelLocation {
  name: string;
  coords: { lat: number; lng: number; };
}

export type TravelMode = 'bike' | 'train' | 'car' | 'walk' | 'flight' | 'bus';

export interface TravelEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  from: TravelLocation;
  to: TravelLocation;
  mode: TravelMode;
}

// Day Planner Types
export interface PlannerTask {
    id: string;
    title: string;
    completed: boolean;
    time: string; // e.g. "09:00"
    hours: number;
}

export interface DayPlannerData {
    tasks: PlannerTask[];
}
