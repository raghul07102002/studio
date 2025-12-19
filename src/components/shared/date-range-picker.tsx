
'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
    dateRange: DateRange | undefined;
    onDateChange: (dateRange: DateRange | undefined) => void;
    className?: string;
}

export function DateRangePicker({ dateRange, onDateChange, className }: DateRangePickerProps) {
  return (
    <div className={cn("flex items-center gap-2 self-start md:self-center", className)}>
        <Popover>
            <PopoverTrigger asChild>
            <Button
                id="date"
                variant={"outline"}
                className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                    dateRange.to ? (
                    <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                    </>
                    ) : (
                    format(dateRange.from, "LLL dd, y")
                    )
                ) : (
                    <span>Pick a date range</span>
                )}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateChange}
                numberOfMonths={1}
            />
            </PopoverContent>
      </Popover>
    </div>
  );
}
