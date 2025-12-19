'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { TravelEntry } from '@/lib/types';

// Dynamically import TravelMap with SSR turned off
const TravelMap = dynamic(() => import('@/components/travel/TravelMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted/30">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  entries: TravelEntry[];
}

// Memoized wrapper to prevent re-renders unless entries change
const MapWrapper = ({ entries }: MapWrapperProps) => {
  return <TravelMap entries={entries} />;
};

export default memo(MapWrapper);
