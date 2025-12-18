"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const TimeCard = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-36 rounded-lg shadow-2xl flex items-center justify-center bg-primary/90 text-primary-foreground"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-10deg) rotateX(5deg)',
        }}
      >
        <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
        <span className="text-5xl sm:text-6xl md:text-7xl font-bold font-mono tracking-tighter" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
          {value}
        </span>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
};

export function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4" style={{ perspective: '1000px' }}>
      <div className="flex items-center justify-center gap-2 sm:gap-4 text-center">
        <TimeCard value={format(time, 'hh')} label="Hours" />
        <div className='text-5xl font-bold text-primary/50 self-center pb-8'>:</div>
        <TimeCard value={format(time, 'mm')} label="Minutes" />
        <div className='text-5xl font-bold text-primary/50 self-center pb-8'>:</div>
        <TimeCard value={format(time, 'ss')} label="Seconds" />
        <div className='text-xl self-end pb-8 pl-2 font-semibold text-muted-foreground'>{format(time, 'a')}</div>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-foreground">{format(time, 'EEEE, MMMM do, yyyy')}</p>
      </div>
    </div>
  );
}
