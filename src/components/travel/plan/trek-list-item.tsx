
'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Label } from '@/components/ui/label';
import type { TrekEntry } from '@/lib/types';

interface TrekListItemProps {
  trek: TrekEntry;
}

export function TrekListItem({ trek }: TrekListItemProps) {
  const { updateTrekEntry } = useApp();

  const handleUpdate = (field: keyof TrekEntry, value: string | number) => {
    updateTrekEntry(trek.id, { [field]: value });
  };

  return (
    <Card className="bg-muted/30">
        <Accordion type="single" collapsible>
            <AccordionItem value={trek.id} className="border-none">
                 <CardHeader className="py-3 px-4">
                    <AccordionTrigger className="p-0 hover:no-underline flex justify-between w-full">
                        <div className='text-left'>
                            <CardTitle className="text-base font-semibold">{trek.name}</CardTitle>
                            <CardDescription className="text-xs">{trek.place}</CardDescription>
                        </div>
                        <div className="text-right">
                             <p className="text-base font-semibold">{trek.kilometers} <span className="text-xs text-muted-foreground">km</span></p>
                             <p className="text-xs text-muted-foreground">{format(parseISO(trek.date), 'MMM d, yyyy')}</p>
                        </div>
                    </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                    <CardContent className="px-4 pb-4">
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <Label htmlFor={`trek-name-${trek.id}`} className="text-xs">Name</Label>
                                <Input
                                    id={`trek-name-${trek.id}`}
                                    value={trek.name}
                                    onChange={(e) => handleUpdate('name', e.target.value)}
                                />
                            </div>
                             <div>
                                <Label htmlFor={`trek-place-${trek.id}`} className="text-xs">Place</Label>
                                <Input
                                    id={`trek-place-${trek.id}`}
                                    value={trek.place}
                                    onChange={(e) => handleUpdate('place', e.target.value)}
                                />
                            </div>
                             <div>
                                <Label htmlFor={`trek-date-${trek.id}`} className="text-xs">Date</Label>
                                <Input
                                    id={`trek-date-${trek.id}`}
                                    type="date"
                                    value={trek.date}
                                    onChange={(e) => handleUpdate('date', e.target.value)}
                                />
                            </div>
                             <div>
                                <Label htmlFor={`trek-km-${trek.id}`} className="text-xs">Kilometers</Label>
                                <Input
                                    id={`trek-km-${trek.id}`}
                                    type="number"
                                    value={trek.kilometers}
                                    onChange={(e) => handleUpdate('kilometers', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
  );
}
