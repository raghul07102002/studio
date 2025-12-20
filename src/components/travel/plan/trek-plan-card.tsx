
'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/app-provider';
import type { TrekPlan, TrekPlace } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, Calendar as CalendarIcon, Route } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';

interface TrekPlanCardProps {
  plan: TrekPlan;
}

export function TrekPlanCard({ plan }: TrekPlanCardProps) {
  const { updateTrekPlan } = useApp();
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceDistance, setNewPlaceDistance] = useState('');

  const handleAddPlace = () => {
    if (newPlaceName.trim() === '') return;
    const newPlace: TrekPlace = {
      id: `place-${Date.now()}`,
      name: newPlaceName,
      visited: false,
      distance: parseFloat(newPlaceDistance) || 0,
    };
    const updatedPlan = { ...plan, places: [...plan.places, newPlace] };
    updateTrekPlan(updatedPlan);
    setNewPlaceName('');
    setNewPlaceDistance('');
  };

  const handleUpdatePlace = (placeId: string, updates: Partial<TrekPlace>) => {
    const updatedPlaces = plan.places.map(p => 
      p.id === placeId ? { ...p, ...updates } : p
    );
    updateTrekPlan({ ...plan, places: updatedPlaces });
  };

  const handleRemovePlace = (placeId: string) => {
    const updatedPlaces = plan.places.filter(p => p.id !== placeId);
    updateTrekPlan({ ...plan, places: updatedPlaces });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    updateTrekPlan({ ...plan, [field]: date?.toISOString() });
  };
  
  const visitedCount = plan.places.filter(p => p.visited).length;
  const totalDistance = useMemo(() => {
    return plan.places.reduce((sum, p) => sum + (p.distance || 0), 0);
  }, [plan.places]);


  return (
    <Card>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1" className='border-b-0'>
          <CardHeader>
            <AccordionTrigger className='p-0 hover:no-underline'>
                <div className='flex-1 text-left'>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                        <span className="font-semibold">{visitedCount} / {plan.places.length}</span> places visited
                        <span className='mx-2'>•</span>
                        <span className="font-semibold">{totalDistance}</span> km total
                    </CardDescription>
                </div>
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal text-xs h-9">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {plan.startDate ? format(parseISO(plan.startDate), 'LLL dd, y') : <span>Start Date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={plan.startDate ? parseISO(plan.startDate) : undefined} onSelect={(d) => handleDateChange('startDate', d)} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal text-xs h-9">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {plan.endDate ? format(parseISO(plan.endDate), 'LLL dd, y') : <span>End Date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={plan.endDate ? parseISO(plan.endDate) : undefined} onSelect={(d) => handleDateChange('endDate', d)} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <ScrollArea className="h-40 pr-4">
                        <div className="space-y-2">
                            {plan.places.map((place) => (
                            <div key={place.id} className="flex items-center gap-2 group">
                                <Checkbox
                                id={`place-${place.id}`}
                                checked={place.visited}
                                onCheckedChange={(checked) => handleUpdatePlace(place.id, { visited: !!checked })}
                                />
                                <label htmlFor={`place-${place.id}`} className='flex-1 text-sm'>{place.name}</label>
                                {place.distance && <span className='text-xs text-muted-foreground'>{place.distance} km</span>}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                    onClick={() => handleRemovePlace(place.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                            ))}
                            {plan.places.length === 0 && <p className='text-sm text-muted-foreground text-center pt-8'>No places added yet.</p>}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
            <CardFooter>
                 <div className="w-full flex items-center gap-2">
                    <Input 
                        placeholder="Add a new place..." 
                        value={newPlaceName}
                        onChange={(e) => setNewPlaceName(e.target.value)}
                        className="h-9"
                    />
                     <Input 
                        type="number"
                        placeholder="km" 
                        value={newPlaceDistance}
                        onChange={(e) => setNewPlaceDistance(e.target.value)}
                        className="h-9 w-20"
                    />
                    <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleAddPlace}>
                        <Plus className="h-4 w-4" />
                    </Button>
                 </div>
            </CardFooter>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
