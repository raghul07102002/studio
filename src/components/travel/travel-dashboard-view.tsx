'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export function TravelDashboardView() {
  // State for visited states can be used later if the map becomes interactive again
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
          <CardDescription>Your map of India. You can replace the placeholder below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='w-full h-[600px] flex items-center justify-center relative bg-muted rounded-lg'>
            <Image 
              src="https://storage.googleapis.com/aiv-studio-public-images/india-map.png"
              alt="Map of India"
              fill
              style={{ objectFit: 'contain' }}
              data-ai-hint="India map"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
