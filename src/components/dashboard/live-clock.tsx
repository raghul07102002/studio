"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TimeBox = ({ value }: { value: string }) => (
    <div className="bg-primary/10 text-primary font-mono text-4xl sm:text-5xl lg:text-6xl p-2 sm:p-4 rounded-lg w-[50px] sm:w-[70px] text-center">
        {value}
    </div>
)

export function LiveClock() {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    ampm: 'AM'
  });
  const [date, setDate] = useState('');


  useEffect(() => {
    const timer = setInterval(() => {
        const now = new Date();
        setTime({
            hours: format(now, 'hh'),
            minutes: format(now, 'mm'),
            seconds: format(now, 'ss'),
            ampm: format(now, 'a')
        });
        setDate(format(now, 'eeee, MMMM d, yyyy'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2 sm:gap-3">
            <TimeBox value={time.hours} />
            <span className="text-4xl sm:text-5xl font-thin text-muted-foreground">:</span>
            <TimeBox value={time.minutes} />
            <span className="text-4xl sm:text-5xl font-thin text-muted-foreground">:</span>
            <TimeBox value={time.seconds} />
        </div>
        <div className="text-xl sm:text-2xl font-semibold text-primary">{time.ampm}</div>
        <div className="text-sm sm:text-base text-muted-foreground mt-2">
          {date}
        </div>
      </div>
  );
}
