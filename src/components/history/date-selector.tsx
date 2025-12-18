
'use client';

import { useApp } from '@/contexts/app-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { MONTHS, YEAR } from '@/lib/constants';
import { getYear, getMonth } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

export function DateSelector() {
  const { reportDate, setReportDate } = useApp();

  const currentYear = getYear(reportDate);
  const currentMonth = getMonth(reportDate);

  const handleYearChange = (year: string) => {
    const newDate = new Date(reportDate);
    newDate.setFullYear(parseInt(year));
    setReportDate(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(reportDate);
    newDate.setMonth(MONTHS.indexOf(month));
    setReportDate(newDate);
  };

  return (
    <div className="flex items-center gap-2 self-start md:self-center">
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        <span className='text-sm font-medium'>Period:</span>
        <Select
            value={String(currentYear)}
            onValueChange={handleYearChange}
        >
            <SelectTrigger className="w-28">
            <SelectValue />
            </SelectTrigger>
            <SelectContent>
            {[...Array(5)].map((_, i) => (
                <SelectItem
                key={YEAR - 2 + i}
                value={String(YEAR - 2 + i)}
                >
                {YEAR - 2 + i}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        <Select
            value={MONTHS[currentMonth]}
            onValueChange={handleMonthChange}
        >
            <SelectTrigger className="w-36">
            <SelectValue />
            </SelectTrigger>
            <SelectContent>
            {MONTHS.map((month) => (
                <SelectItem key={month} value={month}>
                {month}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
    </div>
  );
}
