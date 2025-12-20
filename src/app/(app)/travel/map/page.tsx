
'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import DateRangeFilter from '@/components/travel/DateRangeFilter';
import 'leaflet/dist/leaflet.css';
import { DateRange } from 'react-day-picker';
import { useApp } from '@/contexts/app-provider';
import type { TravelEntry } from '@/lib/types';
import { calculateDistance } from '@/lib/travelUtils';
import { Route } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Map = dynamic(() => import('@/components/travel/TravelMap'), {
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

const TravelMapPage = () => {
  const { travelData } = useApp();
  const entries: TravelEntry[] = useMemo(() => (travelData.places || []), [travelData.places]);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    return entries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        if (dateRange?.from && entryDate < dateRange.from) return false;
        if (dateRange?.to) {
            const toDate = new Date(dateRange.to);
            toDate.setDate(toDate.getDate() + 1);
            if (entryDate >= toDate) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries, dateRange]);
  
  const totalDistance = useMemo(() => {
    return filteredEntries.reduce((sum, entry) => {
        return sum + calculateDistance(entry.from.coords, entry.to.coords);
      }, 0);
  }, [filteredEntries]);


  return (
     <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-[380px_1fr] gap-4">
            <div>
                 <Card>
                    <CardContent className="pt-4 space-y-4">
                        <DateRangeFilter
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        onClear={() => setDateRange(undefined)}
                        />
                        <Separator />
                        <div className="rounded-lg bg-primary/10 p-4 text-center">
                            <Route className="h-6 w-6 mx-auto mb-2 text-primary" />
                            <p className="text-2xl font-bold text-primary">{totalDistance.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total KM Traveled</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <Card className="relative z-0">
                <div className="h-[calc(100vh-220px)] min-h-[500px]">
                    <Map entries={filteredEntries} />
                </div>
            </Card>
        </div>
        </main>
    </div>
  );
};

export default TravelMapPage;
