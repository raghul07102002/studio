'use client';

import { AlarmClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function DayPlannerView() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardContent className="p-10 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <AlarmClock className="h-24 w-24 text-primary" />
            <div className="absolute inset-0 -z-10 bg-primary/10 rounded-full blur-2xl"></div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Day Planner</h1>
          <p className="text-muted-foreground mb-8">
            Start your day with a clear plan.
          </p>
          <Button size="lg" className="w-full text-lg h-12">
            START
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
