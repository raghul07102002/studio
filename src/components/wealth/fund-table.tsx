'use client';

import { useState, useEffect } from 'react';
import { useWealth } from '@/contexts/wealth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import type { Fund, MutualFunds } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type FundCategory = keyof MutualFunds;
type TopLevelFundCategory = 'emergencyFunds' | 'shortTermGoals';

interface FundTableProps {
  category: FundCategory | TopLevelFundCategory;
  title: string;
  maxAllocation: number;
}

interface SearchResult {
    schemeCode: number;
    schemeName: string;
}

export function FundTable({
  category,
  title,
  maxAllocation,
}: FundTableProps) {
  const { wealthData, addFund, updateFund, removeFund } = useWealth();
  
  const funds: Fund[] = 
    wealthData.savingsAllocation && 'mutualFunds' in wealthData.savingsAllocation && wealthData.savingsAllocation.mutualFunds && (category in wealthData.savingsAllocation.mutualFunds)
      ? wealthData.savingsAllocation.mutualFunds[category as FundCategory]
      : (wealthData.savingsAllocation && (category in wealthData.savingsAllocation) ? wealthData.savingsAllocation[category as TopLevelFundCategory] : []);

  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (newItemName.length < 3) {
      setSearchResults([]);
      if (newItemName.length === 0) setIsPopoverOpen(false);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`https://api.mfapi.in/mf/search?q=${newItemName}`);
        const data: SearchResult[] = await response.json();
        setSearchResults(data);
        setIsPopoverOpen(true);
      } catch (error) {
        console.error("Error fetching funds:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [newItemName]);

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

  const handleSelectFund = (name: string) => {
    setNewItemName(name);
    setSearchResults([]);
    setIsPopoverOpen(false);
  }

  const currentTotal = funds.reduce((sum, fund) => sum + fund.amount, 0);
  const remaining = maxAllocation - currentTotal;
  const isOverAllocated = remaining < 0;

  return (
    <div className="space-y-2 rounded-lg border p-4">
        <div className='flex justify-center items-center gap-2'>
            <h4 className="font-semibold text-center">{title}</h4>
        </div>
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
            <div className="flex gap-1 items-center mt-2 relative">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Input
                      placeholder="Search Fund Name..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="h-8 text-xs flex-1"
                    />
                  </PopoverTrigger>
                  {searchResults.length > 0 && (
                    <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align='start'>
                      <ScrollArea className="h-48">
                        <div className="p-2 space-y-1">
                          {isSearching ? <p className="p-2 text-xs text-muted-foreground">Searching...</p> : 
                            searchResults.map((fund) => (
                              <Button
                                key={fund.schemeCode}
                                variant="ghost"
                                className="w-full justify-start h-auto text-left whitespace-normal text-xs"
                                onClick={() => handleSelectFund(fund.schemeName)}
                              >
                                {fund.schemeName}
                              </Button>
                            ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  )}
                </Popover>

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
