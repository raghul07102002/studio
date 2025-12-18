"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center w-full">
      <div className="w-full text-primary font-mono tracking-tighter">
        <span className="text-6xl sm:text-7xl font-bold">{format(time, 'hh:mm')}</span>
        <span className="text-3xl sm:text-4xl font-semibold ml-2">{format(time, 'ss')}</span>
        <span className="text-xl sm:text-2xl font-light ml-2">{format(time, 'a')}</span>
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">{format(time, 'EEEE')}</p>
        <p className="text-sm text-muted-foreground">{format(time, 'MMMM do, yyyy')}</p>
      </div>
    </div>
  );
}
