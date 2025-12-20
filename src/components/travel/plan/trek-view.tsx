
'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Mountain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrekListItem } from './trek-list-item';
import { useToast } from '@/hooks/use-toast';
import type { TrekEntry } from '@/lib/types';

export function TrekView() {
  const { travelData, addTrekEntry } = useApp();
  const { treks = [] } = travelData;
  const { toast } = useToast();

  const [newTrekName, setNewTrekName] = useState('');
  const [newTrekPlace, setNewTrekPlace] = useState('');
  const [newTrekDate, setNewTrekDate] = useState('');
  const [newTrekKm, setNewTrekKm] = useState('');

  const handleAddTrek = () => {
    if (!newTrekName || !newTrekPlace || !newTrekDate || !newTrekKm) {
        toast({
            title: "Missing Information",
            description: "Please fill out all fields to add a trek.",
            variant: "destructive"
        });
        return;
    }
    const newTrek: Omit<TrekEntry, 'id'> = {
      name: newTrekName,
      place: newTrekPlace,
      date: newTrekDate,
      kilometers: parseFloat(newTrekKm),
    };
    addTrekEntry(newTrek);
    setNewTrekName('');
    setNewTrekPlace('');
    setNewTrekDate('');
    setNewTrekKm('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-primary" />
            <span>My Treks Log</span>
        </CardTitle>
        <CardDescription>Log your completed treks to keep a record of your adventures.</CardDescription>
        <div className="flex flex-col md:flex-row items-end gap-2 pt-4 border-t">
          <div className='flex-1 w-full'>
            <label className='text-xs font-medium text-muted-foreground'>Trek Name</label>
            <Input
              placeholder="e.g. Everest Base Camp"
              value={newTrekName}
              onChange={(e) => setNewTrekName(e.target.value)}
            />
          </div>
          <div className='flex-1 w-full'>
            <label className='text-xs font-medium text-muted-foreground'>Place</label>
            <Input
              placeholder="e.g. Nepal"
              value={newTrekPlace}
              onChange={(e) => setNewTrekPlace(e.target.value)}
            />
          </div>
          <div className='w-full md:w-auto'>
            <label className='text-xs font-medium text-muted-foreground'>Date</label>
            <Input
              type="date"
              value={newTrekDate}
              onChange={(e) => setNewTrekDate(e.target.value)}
            />
          </div>
          <div className='w-full md:w-auto'>
            <label className='text-xs font-medium text-muted-foreground'>Kilometers</label>
            <Input
              type="number"
              placeholder="km"
              value={newTrekKm}
              onChange={(e) => setNewTrekKm(e.target.value)}
              className="w-full md:w-24"
            />
          </div>
          <Button onClick={handleAddTrek} className="w-full md:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Trek
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-3">
            {treks.length > 0 ? (
              treks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((trek) => (
                <TrekListItem key={trek.id} trek={trek} />
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>No treks logged yet.</p>
                <p className="text-sm">Add your first trek using the form above!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
