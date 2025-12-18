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
    <Card className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
      <CardContent className="p-6 text-center">
        <div className="text-5xl font-bold tracking-tighter">
          {format(currentTime, 'hh:mm:ss a')}
        </div>
        <div className="text-lg opacity-80 mt-2">
          {format(currentTime, 'eeee, MMMM d, yyyy')}
        </div>
      </CardContent>
    </Card>
  );
}
