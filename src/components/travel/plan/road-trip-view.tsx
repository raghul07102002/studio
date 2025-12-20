
'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { INDIA_STATES } from '@/data/india-states';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import { StatePlanCard } from './state-plan-card';

export function RoadTripView() {
  const { travelData, addRoadTripPlan } = useApp();
  const { roadTrips = [] } = travelData;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleAddState = (stateCode: string) => {
    addRoadTripPlan(stateCode);
    setOpen(false);
    setValue('');
  };

  const availableStates = INDIA_STATES.filter(
    (state) => !roadTrips.some((plan) => plan.stateCode === state.code)
  );

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add a State to Your Plan
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search state..." />
            <CommandList>
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandGroup>
                {availableStates.map((state) => (
                    <CommandItem
                    key={state.code}
                    value={state.name}
                    onSelect={() => handleAddState(state.code)}
                    >
                    {state.name}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {roadTrips.map((plan) => (
          <StatePlanCard key={plan.stateCode} plan={plan} />
        ))}
      </div>
       {roadTrips.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No road trip plans yet.</p>
          <p className="text-sm">Add a state to start planning your next adventure!</p>
        </div>
      )}
    </div>
  );
}
