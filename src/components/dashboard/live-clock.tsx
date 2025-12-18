"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TimeBox = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center">
        <div className="bg-primary/10 text-primary font-mono text-4xl sm:text-5xl lg:text-6xl p-3 sm:p-4 rounded-lg w-[60px] sm:w-[80px] text-center">
            {value}
        </div>
        <span className="text-xs text-muted-foreground mt-2">{label}</span>
    </div>
)

export function LiveClock() {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
  const [ampm, setAmpm] = useState('AM');
  const [date, setDate] = useState('');


  useEffect(() => {
    const timer = setInterval(() => {
        const now = new Date();
        setTime({
            hours: format(now, 'hh'),
            minutes: format(now, 'mm'),
            seconds: format(now, 'ss'),
        });
        setAmpm(format(now, 'a'));
        setDate(format(now, 'eeee, MMMM d, yyyy'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-sm text-muted-foreground mb-2">
          {date}
        </div>
        <div className="flex items-start gap-2 sm:gap-3">
            <TimeBox value={time.hours} label="Hours" />
            <span className="text-4xl sm:text-5xl font-thin text-muted-foreground mx-1">:</span>
            <TimeBox value={time.minutes} label="Minutes" />
            <span className="text-4xl sm:text-5xl font-thin text-muted-foreground mx-1">:</span>
            <TimeBox value={time.seconds} label="Seconds" />
        </div>
        <div className="text-lg font-semibold text-primary bg-primary/10 px-3 py-1 rounded-md mt-2">{ampm}</div>
      </div>
  );
}
