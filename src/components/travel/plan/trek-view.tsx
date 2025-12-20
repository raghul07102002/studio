
'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { TrekPlanCard } from './trek-plan-card';

export function TrekView() {
  const { travelData, addTrekPlan } = useApp();
  const { treks = [] } = travelData;

  const [newTrekName, setNewTrekName] = useState('');

  const handleAddTrek = () => {
    if (newTrekName.trim() === '') return;
    addTrekPlan(newTrekName);
    setNewTrekName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter New Trek Name (e.g. Everest Base Camp)"
          value={newTrekName}
          onChange={(e) => setNewTrekName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTrek()}
        />
        <Button onClick={handleAddTrek}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Trek
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {treks.map((plan) => (
          <TrekPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
       {treks.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No trek plans yet.</p>
          <p className="text-sm">Add a trek to start planning your next adventure!</p>
        </div>
      )}
    </div>
  );
}
