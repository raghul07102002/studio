"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

export function LiveClock() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Card className="h-full flex flex-col items-center justify-center bg-accent text-accent-foreground">
      <CardContent className="p-6 text-center">
        <div className="text-6xl font-bold tracking-tighter">
          {format(currentTime, 'HH:mm:ss')}
        </div>
        <div className="text-xl text-accent-foreground/80">
          {format(currentTime, 'eeee, MMMM d, yyyy')}
        </div>
      </CardContent>
    </Card>
  );
}
