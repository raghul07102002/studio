import { LayoutDashboard, CalendarDays, Settings, DollarSign, History, Briefcase, Plane, Map, AlarmClock } from "lucide-react";

export const navItems = [
    { href: "/wealth", icon: DollarSign, label: "Wealth Dashboard" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Habit Dashboard" },
];

export const habitNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/daily", icon: CalendarDays, label: "Track Today" },
    { href: "/settings", icon: Settings, label: "Settings" },
];

export const wealthNavItems = [
    { href: "/wealth", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/history", icon: History, label: "History" },
];

export const careerNavItems = [
    { href: "/career", icon: LayoutDashboard, label: "Dashboard" },
];

export const travelNavItems = [
    { href: "/travel", icon: Plane, label: "Journeys" },
    { href: "/travel/map", icon: Map, label: "Map" },
];

export const dayPlannerNavItems = [
    { href: "/day-planner", icon: AlarmClock, label: "Day Planner" },
];
