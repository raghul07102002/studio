
'use client';

import { useApp } from '@/contexts/app-provider';
import {
  format,
  getYear,
  getMonth,
  getDaysInMonth,
  setDate,
} from 'date-fns';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { MONTHS, YEAR } from '@/lib/constants';
import { DayCard } from './day-card';
import { Skeleton } from '../ui/skeleton';

const DAYS_PER_PAGE = 7;

export function DailyView() {
  const { isInitialized } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);

  const currentYear = getYear(currentDate);
  const currentMonth = getMonth(currentDate);

  const daysInMonth = useMemo(() => {
    const days = getDaysInMonth(currentDate);
    return Array.from({ length: days }, (_, i) => setDate(currentDate, i + 1));
  }, [currentDate]);

  const totalPages = Math.ceil(daysInMonth.length / DAYS_PER_PAGE);

  const paginatedDays = useMemo(() => {
    const startIndex = currentPage * DAYS_PER_PAGE;
    const endIndex = startIndex + DAYS_PER_PAGE;
    return daysInMonth.slice(startIndex, endIndex);
  }, [daysInMonth, currentPage]);

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(year));
    setCurrentDate(newDate);
    setCurrentPage(0);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(MONTHS.indexOf(month));
    setCurrentDate(newDate);
    setCurrentPage(0);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className='self-start'>
            <h1 className="text-3xl font-bold">Daily Tracking</h1>
            <p className="text-muted-foreground">
                Track your habits day by day for {format(currentDate, 'MMMM yyyy')}
            </p>
        </div>
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {daysInMonth.map((day) => (
          <DayCard key={day.toISOString()} date={day} />
        ))}
      </div>
    </div>
  );
}
