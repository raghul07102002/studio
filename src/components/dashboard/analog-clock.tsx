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
    <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tighter text-primary">
            {format(time, 'hh:mm:ss')}
            <span className='text-2xl sm:text-3xl ml-2'>{format(time, 'a')}</span>
        </div>
        <div>
            <p className="text-lg font-semibold text-foreground">{format(time, 'EEEE')}</p>
            <p className="text-sm text-muted-foreground">{format(time, 'MMMM do, yyyy')}</p>
        </div>
    </div>
  );
}
