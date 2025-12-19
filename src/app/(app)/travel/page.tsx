
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TravelForm from '@/components/travel/TravelForm';
import TravelList from '@/components/travel/TravelList';
import DateRangeFilter from '@/components/travel/DateRangeFilter';
import TravelStats from '@/components/travel/TravelStats';
import { TravelEntry } from '@/lib/types';
import 'leaflet/dist/leaflet.css';
import { DateRange } from 'react-day-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const TravelPage = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("travel-entries");
      if (saved) {
        setEntries(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load travel entries from localStorage", error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("travel-entries", JSON.stringify(entries));
  }, [entries]);

  const handleAdd = (entry: Omit<TravelEntry, "id">) => {
    setEntries((prev) => [
      ...prev,
      { ...entry, id: crypto.randomUUID() },
    ]);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const filteredEntries = useMemo(() => {
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
  
  const pathCoordinates = useMemo(() => {
    const coords: { lat: number; lng: number }[] = [];
    filteredEntries.forEach(entry => {
        if (entry.from.coords) {
            coords.push(entry.from.coords);
        }
        if (entry.to.coords) {
            coords.push(entry.to.coords);
        }
    });
    // Deduplicate coordinates to avoid extra markers and strange polyline behavior
    return coords.filter((c, index, self) => 
        c && c.lat && c.lng && index === self.findIndex((t) => (
            t.lat === c.lat && t.lng === c.lng
        ))
    );
  }, [filteredEntries]);


  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4">
        <Tabs defaultValue="journeys">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="journeys">Journeys</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
          <TabsContent value="journeys" className="mt-6">
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
          </TabsContent>
          <TabsContent value="map" className="mt-6">
            <div className="grid lg:grid-cols-[380px_1fr] gap-4">
                <div>
                     <Card>
                        <CardContent className="pt-4 space-y-4">
                            <DateRangeFilter
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                            onClear={() => setDateRange(undefined)}
                            />
                        </CardContent>
                    </Card>
                </div>
                 <Card className="relative z-0">
                    <div className="h-[calc(100vh-220px)] min-h-[500px]">
                        <Map entries={pathCoordinates} />
                    </div>
                </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TravelPage;
