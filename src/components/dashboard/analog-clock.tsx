"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-primary/20 bg-background shadow-inner">
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>

      {/* Hour Hand */}
      <div
        className="absolute top-1/2 left-1/2 w-1 h-1/4 bg-primary origin-bottom transform -translate-x-1/2 rounded-t-full"
        style={{
          transform: `translateX(-50%) rotate(${hourDeg}deg)`,
          height: '22%',
          top: '28%',
        }}
      ></div>

      {/* Minute Hand */}
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-1/3 bg-foreground origin-bottom transform -translate-x-1/2 rounded-t-full"
        style={{
          transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
          height: '30%',
          top: '20%',
        }}
      ></div>

      {/* Second Hand */}
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-2/5 bg-destructive origin-bottom transform -translate-x-1/2"
        style={{
          transform: `translateX(-50%) rotate(${secondDeg}deg)`,
          height: '35%',
          top: '15%',
        }}
      ></div>
      
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = i * 30;
        const isMajor = i % 3 === 0;
        return (
            <div 
                key={i} 
                className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 origin-center', isMajor ? 'h-[90%] bg-foreground/50' : 'h-[90%] bg-muted')}
                style={{ transform: `translateX(-50%) translateY(-50%) rotate(${angle}deg)`}}
            >
                <div className={cn('absolute w-full', isMajor ? 'h-3' : 'h-2', 'bg-background')}></div>
                <div className={cn('absolute bottom-0 w-full', isMajor ? 'h-3' : 'h-2', 'bg-background')}></div>
            </div>
        )
      })}
    </div>
  );
}
