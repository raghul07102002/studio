
'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TravelForm from '@/components/travel/TravelForm';
import TravelList from '@/components/travel/TravelList';
import TravelStats from '@/components/travel/TravelStats';
import { useApp } from '@/contexts/app-provider';
import type { TravelEntry } from '@/lib/types';
import 'leaflet/dist/leaflet.css';
import { DateRange } from 'react-day-picker';

const TravelPage = () => {
  const { travelData, updateTravelData } = useApp();
  const entries = useMemo(() => (travelData.places || []).map((p: any) => ({...p, from: p.from || {name: 'Unknown'}, to: p.to || {name: 'Unknown'}})), [travelData.places]);


  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);


  const handleAdd = (entry: Omit<TravelEntry, "id">) => {
    const newPlaces = [...(travelData.places || []), { ...entry, id: crypto.randomUUID() }];
    updateTravelData({ places: newPlaces });
  };

  const handleDelete = (id: string) => {
    const newPlaces = (travelData.places || []).filter((e) => e.id !== id);
    updateTravelData({ places: newPlaces });
  };

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    return entries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        if (dateRange?.from && entryDate < dateRange.from) return false;
        // Add a day to the end date to make it inclusive
        if (dateRange?.to) {
            const toDate = new Date(dateRange.to);
            toDate.setDate(toDate.getDate() + 1);
            if (entryDate >= toDate) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries, dateRange]);
  

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4">
        <div className="space-y-4">
            {/* Add Journey Card */}
            <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Add Journey
                </CardTitle>
            </CardHeader>
            <CardContent>
                <TravelForm onAdd={handleAdd} />
            </CardContent>
            </Card>

            {/* Stats */}
            <Card>
                <CardContent className="pt-4">
                    <TravelStats entries={filteredEntries} />
                </CardContent>
            </Card>

            {/* Journey List Card */}
            <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                Your Journeys
                {filteredEntries.length > 0 && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({filteredEntries.length})
                    </span>
                )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <TravelList entries={filteredEntries} onDelete={handleDelete} />
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default TravelPage;
