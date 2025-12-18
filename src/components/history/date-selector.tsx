
'use client';

import { useApp } from '@/contexts/app-provider';
import { MONTHS, YEAR } from '@/lib/constants';
import { getYear, getMonth, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ViewSelector } from '../layout/view-selector';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';

export function DateSelector() {
  const { reportDate, setReportDate } = useApp();

  return (
    <div className="flex items-center gap-2 self-start md:self-center">
        <div className='w-40'>
            <ViewSelector />
        </div>
        <Popover>
            <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                "w-[240px] justify-start text-left font-normal",
                !reportDate && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {reportDate ? format(reportDate, "PPP") : <span>Pick a date</span>}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                mode="single"
                selected={reportDate}
                onSelect={(date) => setReportDate(date || new Date())}
                initialFocus
            />
            </PopoverContent>
        </Popover>
    </div>
  );
}
