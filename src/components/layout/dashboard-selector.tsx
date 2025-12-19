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
import { Briefcase, Plane, Wallet, Flame } from "lucide-react";

export function DashboardSelector() {
  const { selectedDashboard, setSelectedDashboard } = useApp();

  return (
    <Select
      value={selectedDashboard}
      onValueChange={(value) => setSelectedDashboard(value as DashboardOption)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Dashboard" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="habits">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span>Habit Dashboard</span>
          </div>
        </SelectItem>
        <SelectItem value="wealth">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>Wealth Dashboard</span>
          </div>
        </SelectItem>
        <SelectItem value="career">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Career Progression</span>
          </div>
        </SelectItem>
        <SelectItem value="travel">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            <span>Travel Dashboard</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
