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

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secondHandRotation = seconds * 6;
  const minuteHandRotation = minutes * 6 + seconds * 0.1;
  const hourHandRotation = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6">
      <div className="relative w-56 h-56">
        <div className="absolute inset-0 rounded-full bg-background shadow-inner border-4 border-primary/20"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full z-10"></div>

        {/* Hour Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-1 h-[28%] bg-foreground rounded-full origin-bottom"
          style={{ transform: `translate(-50%, -100%) rotate(${hourHandRotation}deg)` }}
        ></div>

        {/* Minute Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-0.5 h-[38%] bg-foreground rounded-full origin-bottom"
          style={{ transform: `translate(-50%, -100%) rotate(${minuteHandRotation}deg)` }}
        ></div>

        {/* Second Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-0.5 h-[42%] bg-primary rounded-full origin-bottom"
          style={{ transform: `translate(-50%, -100%) rotate(${secondHandRotation}deg)` }}
        ></div>

        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
            <div key={i} className='absolute w-full h-full' style={{transform: `rotate(${i * 30}deg)`}}>
                <div className={cn(
                    'absolute top-[5px] left-1/2 -translate-x-1/2 w-0.5 h-3 rounded-full',
                    i % 3 === 0 ? 'bg-foreground' : 'bg-muted-foreground'
                )}></div>
            </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xl font-semibold text-foreground tracking-wider">{format(time, 'hh:mm:ss a')}</p>
        <p className="text-sm font-medium text-muted-foreground">{format(time, 'EEEE, MMMM do, yyyy')}</p>
      </div>
    </div>
  );
}
