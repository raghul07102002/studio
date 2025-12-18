'use client';

import { useState } from 'react';
import { useWealth } from '@/contexts/wealth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import type { Fund, MutualFunds } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

type FundCategory = keyof MutualFunds;
type TopLevelFundCategory = 'emergencyFunds' | 'shortTermGoals';

interface FundTableProps {
  category: FundCategory | TopLevelFundCategory;
  title: string;
  maxAllocation: number;
}

export function FundTable({
  category,
  title,
  maxAllocation,
}: FundTableProps) {
  const { wealthData, addFund, updateFund, removeFund } = useWealth();
  
  const funds = (category in wealthData.savingsAllocation.mutualFunds)
    ? wealthData.savingsAllocation.mutualFunds[category as FundCategory]
    : wealthData.savingsAllocation[category as TopLevelFundCategory];

  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = () => {
    const amount = parseFloat(newItemAmount);
    if (newItemName && !isNaN(amount)) {
      addFund(category, { name: newItemName, amount });
      setNewItemName('');
      setNewItemAmount('');
      setIsAdding(false);
    }
  };

  const handleUpdate = (id: string, field: 'name' | 'amount', value: string) => {
    const item = funds.find(i => i.id === id);
    if (!item) return;

    if (field === 'name') {
      updateFund(category, { ...item, name: value });
    } else {
      updateFund(category, { ...item, amount: parseFloat(value) || 0 });
    }
  }

  const currentTotal = funds.reduce((sum, fund) => sum + fund.amount, 0);
  const remaining = maxAllocation - currentTotal;
  const isOverAllocated = remaining < 0;

  return (
    <div className="space-y-2 rounded-lg border p-4">
        <h4 className="font-semibold text-center">{title}</h4>
        <div className={cn("text-center text-xs font-medium", isOverAllocated ? 'text-destructive' : 'text-muted-foreground')}>
            {currentTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            { maxAllocation !== Infinity && <span> / {maxAllocation.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>}
        </div>
        
        <ScrollArea className='h-32'>
        <div className="space-y-2">
            {funds.map((fund) => (
            <div key={fund.id} className="flex gap-1 items-center">
                <Input
                    value={fund.name}
                    onChange={(e) => handleUpdate(fund.id, 'name', e.target.value)}
                    className="h-8 text-xs flex-1"
                    placeholder='Fund Name'
                />
                <Input
                    type="number"
                    value={fund.amount}
                    onChange={(e) => handleUpdate(fund.id, 'amount', e.target.value)}
                    className="h-8 w-24 text-xs"
                    placeholder='Amount'
                />
                <Button variant="ghost" size="icon" className='h-8 w-8' onClick={() => removeFund(category, fund.id)}>
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
            ))}
        </div>
        </ScrollArea>
        
        {isAdding ? (
            <div className="flex gap-1 items-center mt-2">
                <Input
                placeholder="Fund Name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="h-8 text-xs flex-1"
                />
                <Input
                type="number"
                placeholder="Amount"
                className="h-8 w-24 text-xs"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                />
                <Button size="icon" className='h-8 w-8' onClick={handleAddItem}><Plus className='h-4 w-4' /></Button>
            </div>
        ) : (
            <Button variant="outline" size='sm' className='w-full mt-2' onClick={() => setIsAdding(true)}>Add Fund</Button>
        )}
        
        {maxAllocation !== Infinity && (
            <div className={cn("text-center text-xs font-medium pt-1", isOverAllocated ? 'text-destructive' : 'text-muted-foreground')}>
                Remaining: {remaining.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
        )}
    </div>
  );
}
