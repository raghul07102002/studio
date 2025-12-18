
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndiaMap } from './india-map';

export function TravelDashboardView() {
  const [visitedStates, setVisitedStates] = useState<string[]>(['MH', 'GJ', 'RJ']);

  const handleStateClick = (stateId: string) => {
    setVisitedStates(prev => 
      prev.includes(stateId) 
        ? prev.filter(id => id !== stateId)
        : [...prev, stateId]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Travel Dashboard</CardTitle>
          <CardDescription>Click on a state to mark it as visited.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='w-full h-[600px] flex items-center justify-center'>
            <IndiaMap visitedStates={visitedStates} onStateClick={handleStateClick} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    