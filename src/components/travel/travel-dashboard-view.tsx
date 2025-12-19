
'use client';

import { useApp } from '@/contexts/app-provider';
import { Skeleton } from '../ui/skeleton';
import { TravelControls } from './travel-controls';
import { IndiaMap } from './india-map';
import { Card } from '../ui/card';
import { INDIA_STATES_PATHS } from '@/data/india-states-paths';
import { cn } from '@/lib/utils';

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-background flex items-center justify-center p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 964.38 1033.42"
        aria-label="Loading map of India"
        className="w-full h-full max-w-full max-h-full animate-pulse"
      >
        <g>
          {INDIA_STATES_PATHS.map((state) => (
            <path
              key={state.id}
              d={state.d}
              className={cn('fill-muted stroke-background stroke-[2]')}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function TravelDashboardView() {
  const { isInitialized } = useApp();

  if (!isInitialized) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        <Skeleton className="lg:col-span-1 h-full" />
        <Card className="lg:col-span-2 h-full">
            <MapSkeleton />
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-1 h-full overflow-y-auto">
        <TravelControls />
      </div>
      <div className="lg:col-span-2 h-full rounded-lg overflow-hidden border">
        <IndiaMap />
      </div>
    </div>
  );
}
