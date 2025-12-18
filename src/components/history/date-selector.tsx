
'use client';

import { useApp } from '@/contexts/app-provider';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';

export function DateSelector() {
  const { reportDateRange, setReportDateRange } = useApp();

  return (
    <div className="flex items-center gap-2 self-start md:self-center">
        <Popover>
            <PopoverTrigger asChild>
            <Button
                id="date"
                variant={"outline"}
                className={cn(
                "w-[300px] justify-start text-left font-normal",
                !reportDateRange && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {reportDateRange?.from ? (
                    reportDateRange.to ? (
                    <>
                        {format(reportDateRange.from, "LLL dd, y")} -{" "}
                        {format(reportDateRange.to, "LLL dd, y")}
                    </>
                    ) : (
                    format(reportDateRange.from, "LLL dd, y")
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
                defaultMonth={reportDateRange?.from}
                selected={reportDateRange}
                onSelect={setReportDateRange}
                numberOfMonths={2}
            />
            </PopoverContent>
      </Popover>
    </div>
  );
}
