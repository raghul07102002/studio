"use client";

import { useApp } from "@/contexts/app-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardOption } from "@/lib/types";

export function DashboardSelector() {
  const { selectedDashboard, setSelectedDashboard } = useApp();

  return (
    <Select
      value={selectedDashboard}
      onValueChange={(value) => setSelectedDashboard(value as DashboardOption)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Dashboard" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="habits">Habit Dashboard</SelectItem>
        <SelectItem value="wealth">Wealth Dashboard</SelectItem>
      </SelectContent>
    </Select>
  );
}
