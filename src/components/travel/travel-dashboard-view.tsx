'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export function TravelDashboardView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [destinations, setDestinations] = useState<string[]>(['Mumbai', 'Delhi', 'Bangalore']);
  const [newDestination, setNewDestination] = useState('');

  const handleAddDestination = () => {
    if (newDestination.trim()) {
      setDestinations(prev => [...prev, newDestination.trim()]);
      setNewDestination('');
    }
  };

  const handleRemoveDestination = (destinationToRemove: string) => {
    setDestinations(prev => prev.filter(dest => dest !== destinationToRemove));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Travel Dashboard</CardTitle>
              <CardDescription>Plan your next adventure.</CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[280px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className='w-full h-[400px] flex items-center justify-center relative bg-muted rounded-lg'>
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
      <Card>
        <CardHeader>
          <CardTitle>Plan Your Destinations</CardTitle>
          <CardDescription>Add or remove places for your travel itinerary.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="Enter a state, district, or city"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDestination()}
              />
              <Button onClick={handleAddDestination}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
            <ScrollArea className="h-48 w-full pr-4 border rounded-md">
                <div className='p-4 space-y-2'>
                {destinations.length > 0 ? (
                    destinations.map(dest => (
                    <div key={dest} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                        <span className="text-sm font-medium">{dest}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveDestination(dest)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        No destinations added yet.
                    </div>
                )}
                </div>
            </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
