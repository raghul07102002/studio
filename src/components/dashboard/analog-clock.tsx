"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-4">
      <div className="flex items-baseline justify-center gap-2 text-center font-mono text-primary">
        <div className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter">
          {format(time, 'hh')}
        </div>
        <div className='text-4xl sm:text-5xl md:text-6xl font-semibold animate-pulse'>:</div>
        <div className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter">
          {format(time, 'mm')}
        </div>
        <div className='text-4xl sm:text-5xl md:text-6xl font-semibold animate-pulse'>:</div>
        <div className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter">
          {format(time, 'ss')}
        </div>
        <div className='ml-3 text-xl sm:text-2xl font-semibold text-muted-foreground self-end'>{format(time, 'a')}</div>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-foreground">{format(time, 'EEEE, MMMM do, yyyy')}</p>
      </div>
    </div>
  );
}
