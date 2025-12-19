
'use client';

import { useApp } from '@/contexts/app-provider';
import {
  format,
  getYear,
  getMonth,
  getDaysInMonth,
  setDate,
  parseISO,
} from 'date-fns';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DayCard } from './day-card';
import { Skeleton } from '../ui/skeleton';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

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
  
  const handleMonthChange = (dateString: string) => {
    if (dateString) {
      const newDate = parseISO(dateString + '-01'); // Treat it as the first of the month
      setCurrentDate(newDate);
      setCurrentPage(0);
    }
  }

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
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="month-picker">Select Month</Label>
                <Input
                    id="month-picker"
                    type="month"
                    value={format(currentDate, 'yyyy-MM')}
                    onChange={(e) => handleMonthChange(e.target.value)}
                />
            </div>
        </div>
      </div>
      
       <div className="flex items-center justify-center gap-4">
        <Button onClick={goToPreviousPage} disabled={currentPage === 0} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
            Week {currentPage + 1} of {totalPages}
        </span>
        <Button onClick={goToNextPage} disabled={currentPage >= totalPages - 1} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {paginatedDays.map((day) => (
          <DayCard key={day.toISOString()} date={day} />
        ))}
      </div>
    </div>
  );
}
