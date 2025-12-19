'use client';

import { useApp } from '@/contexts/app-provider';
import { Skeleton } from '../ui/skeleton';
import { TravelControls } from './travel-controls';
import { IndiaMap } from './india-map';
import { Card } from '../ui/card';

export function TravelDashboardView() {
  const { isInitialized } = useApp();

  if (!isInitialized) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        <Skeleton className="lg:col-span-1 h-full" />
        <Skeleton className="lg:col-span-2 h-full" />
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
