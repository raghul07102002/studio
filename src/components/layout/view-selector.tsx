"use client";

import { useApp } from "@/contexts/app-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS } from "@/lib/constants";
import { ViewOption } from "@/lib/types";

const viewOptions: ViewOption[] = ["Year", ...MONTHS as ViewOption[]];

export function ViewSelector() {
  const { selectedView, setSelectedView } = useApp();

  return (
    <Select
      value={selectedView}
      onValueChange={(value) => setSelectedView(value as ViewOption)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a view" />
      </SelectTrigger>
      <SelectContent>
        {viewOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
