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

  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const hourRotation = (hour % 12) * 30 + minute * 0.5;
  const minuteRotation = minute * 6 + second * 0.1;
  const secondRotation = second * 6;

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-primary/20 bg-background shadow-inner">
        <div 
          className="absolute top-1/2 left-1/2 w-1 h-14 origin-top bg-primary rounded-full"
          style={{ transform: `rotate(${hourRotation}deg) translateY(-50%)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-0.5 h-20 origin-top bg-foreground rounded-full"
          style={{ transform: `rotate(${minuteRotation}deg) translateY(-50%)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-0.5 h-24 origin-top bg-destructive rounded-full"
          style={{ transform: `rotate(${secondRotation}deg) translateY(-50%)` }}
        />
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute w-full h-full text-center"
            style={{ transform: `rotate(${i * 30}deg)`}}
          >
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-semibold text-muted-foreground" style={{transform: `translateX(-50%) rotate(${-i * 30}deg)`}}>{i === 0 ? 12 : i}</span>
          </div>
        ))}
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">{format(time, 'EEEE')}</p>
        <p className="text-sm text-muted-foreground">{format(time, 'MMMM do, yyyy')}</p>
      </div>
    </div>
  );
}
