
'use client';
import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { format, startOfMonth } from 'date-fns';
import { CalendarIcon, Trash2, MapPin, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { INDIA_STATES } from '@/data/india-states';
import { TravelData } from '@/lib/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';

export function TravelControls() {
  const { travelData, updateTravelData } = useApp();
  const { selectedStates = [] } = travelData;

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [open, setOpen] = useState(false);

  const handleStateToggle = (stateName: string) => {
    const newSelectedStates = selectedStates.includes(stateName)
      ? selectedStates.filter(s => s !== stateName)
      : [...selectedStates, stateName];
    
    const newTravelData: Partial<TravelData> = { ...travelData, selectedStates: newSelectedStates };
    updateTravelData(newTravelData);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>India Travel Planner</CardTitle>
        <CardDescription>Select the states you plan to visit.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                    dateRange.to ? (
                        <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(dateRange.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pick a date</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                />
                </PopoverContent>
            </Popover>
        </div>

        <div className="space-y-2 flex-1 flex flex-col overflow-hidden">
            <label className="text-sm font-medium">Select States to Visit</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  <span className="truncate">
                    {selectedStates.length > 0 ? `${selectedStates.length} state(s) selected` : "Select states..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search state..." />
                  <CommandList>
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandGroup>
                        <ScrollArea className="h-64">
                            {INDIA_STATES.map((state) => (
                                <CommandItem
                                key={state.name}
                                value={state.name}
                                onSelect={() => handleStateToggle(state.name)}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedStates.includes(state.name) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {state.name}
                                </CommandItem>
                            ))}
                        </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex-1 pt-2 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                    {selectedStates.map(stateName => (
                        <Badge key={stateName} variant="secondary" className="text-sm">
                            {stateName}
                            <button onClick={() => handleStateToggle(stateName)} className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-foreground"/>
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
