'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TravelForm from '@/components/travel/TravelForm';
import TravelList from '@/components/travel/TravelList';
import DateRangeFilter from '@/components/travel/DateRangeFilter';
import TravelStats from '@/components/travel/TravelStats';
import { TravelEntry } from '@/lib/types';
import MapWrapper from '@/components/travel/MapWrapper';

const TravelPage = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem("travel-entries");
      if (saved) {
        setEntries(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load travel entries from localStorage", error);
    }
  }, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Save to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("travel-entries", JSON.stringify(entries));
    }
  }, [entries, isClient]);

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
        if (startDate && entry.date < startDate) return false;
        if (endDate && entry.date > endDate) return false;
        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries, startDate, endDate]);

  if (!isClient) {
    return null; // or a loading skeleton
  }
  
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-[380px_1fr] gap-4">
          {/* Sidebar */}
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

            {/* Filter & Stats Card */}
            <Card>
              <CardContent className="pt-4 space-y-4">
                <DateRangeFilter
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onClear={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                />
                <Separator />
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

          {/* Map */}
          <Card className="overflow-hidden">
            <div className="h-[calc(100vh-120px)] min-h-[500px]">
              <MapWrapper entries={filteredEntries} />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TravelPage;
