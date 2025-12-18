"use client";

import { useApp } from "@/contexts/app-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewOption } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const viewOptions: { value: ViewOption; label: string }[] = [
    { value: "Day", label: "Day" },
    { value: "Week", label: "Week" },
    { value: "Month", label: "Month" },
];

export function ViewSelector() {
  const { selectedView, setSelectedView } = useApp();

  return (
    <Tabs defaultValue={selectedView} onValueChange={(value) => setSelectedView(value as ViewOption)}>
      <TabsList className="grid w-full grid-cols-3 h-9">
        {viewOptions.map((option) => (
          <TabsTrigger key={option.value} value={option.value} className="text-xs h-7">
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
