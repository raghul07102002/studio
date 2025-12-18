import { LayoutDashboard, CalendarDays, Settings, DollarSign, AreaChart } from "lucide-react";

export const navItems = [
    { href: "/wealth", icon: DollarSign, label: "Wealth Dashboard" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Habit Dashboard" },
];

export const habitNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/daily", icon: CalendarDays, label: "Track Today" },
    { href: "/reports", icon: AreaChart, label: "Reports" },
    { href: "/settings", icon: Settings, label: "Settings" },
];
