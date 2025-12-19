
'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/app-provider';
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
    schemeCode: string;
    schemeName: string;
}

export function FundTable({
  category,
  title,
  maxAllocation,
}: FundTableProps) {
  const { wealthData, updateWealthData } = useApp();
  
  const funds: Fund[] = 
    wealthData.savingsAllocation && 'mutualFunds' in wealthData.savingsAllocation && wealthData.savingsAllocation.mutualFunds && (category in wealthData.savingsAllocation.mutualFunds)
      ? wealthData.savingsAllocation.mutualFunds[category as FundCategory]
      : (wealthData.savingsAllocation && (category in wealthData.savingsAllocation) ? wealthData.savingsAllocation[category as TopLevelFundCategory] : []);

  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemSchemeCode, setNewItemSchemeCode] = useState<string | undefined>(undefined);
  const [isAdding, setIsAdding] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newItemName.length < 3) {
      setSearchResults([]);
      setIsPopoverOpen(false);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`https://api.mfapi.in/mf/search?q=${newItemName}`);
        const data: SearchResult[] = await response.json();
        setSearchResults(data);
        setIsPopoverOpen(data.length > 0);
      } catch (error) {
        console.error("Error fetching funds:", error);
        setSearchResults([]);
        setIsPopoverOpen(false);
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
            const newFund: Fund = { name: newItemName, amount, id: `fund-${Date.now()}`, schemeCode: newItemSchemeCode };
            const newAllocation = { ...(wealthData.savingsAllocation) };
            if (!newAllocation.mutualFunds) newAllocation.mutualFunds = { debt: [], gold: [], equity: [] };

            if (['debt', 'gold', 'equity'].includes(category)) {
                newAllocation.mutualFunds[category as FundCategory].push(newFund);
            } else {
                newAllocation[category as TopLevelFundCategory] = [...(newAllocation[category as TopLevelFundCategory] || []), newFund];
            }
            updateWealthData({ savingsAllocation: newAllocation });

            setNewItemName('');
            setNewItemAmount('');
            setNewItemSchemeCode(undefined);
            setIsAdding(false);
            setIsPopoverOpen(false);
        }
    };
    
    const handleUpdate = (id: string, field: 'name' | 'amount', value: string) => {
        const newAllocation = { ...(wealthData.savingsAllocation) };
         if (['debt', 'gold', 'equity'].includes(category)) {
            const cat = category as FundCategory;
            newAllocation.mutualFunds[cat] = newAllocation.mutualFunds[cat].map(f => f.id === id ? { ...f, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : f);
        } else {
            const cat = category as TopLevelFundCategory;
            newAllocation[cat] = (newAllocation[cat] || []).map(f => f.id === id ? { ...f, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : f);
        }
        updateWealthData({ savingsAllocation: newAllocation });
    };

    const handleRemove = (id: string) => {
        const newAllocation = { ...(wealthData.savingsAllocation) };
        if (['debt', 'gold', 'equity'].includes(category)) {
            const cat = category as FundCategory;
            newAllocation.mutualFunds[cat] = newAllocation.mutualFunds[cat].filter(f => f.id !== id);
        } else {
            const cat = category as TopLevelFundCategory;
            newAllocation[cat] = (newAllocation[cat] || []).filter(f => f.id !== id);
        }
        updateWealthData({ savingsAllocation: newAllocation });
    }

  const handleSelectFund = (name: string, schemeCode: string) => {
    setNewItemName(name);
    setNewItemSchemeCode(schemeCode);
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
                <Button variant="ghost" size="icon" className='h-8 w-8' onClick={() => handleRemove(fund.id)}>
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
            ))}
        </div>
        </ScrollArea>
        
        {isAdding ? (
            <div className="mt-2" ref={anchorRef}>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div className="flex gap-1 items-center">
                      <Input
                        placeholder="Search Fund Name..."
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
                  </PopoverTrigger>
                  <PopoverContent 
                    className="p-0" 
                    style={{ width: anchorRef.current ? `${anchorRef.current.offsetWidth}px` : 'auto' }}
                    align='start'
                  >
                      <ScrollArea className="h-48">
                        <div className="p-2 space-y-1">
                          {isSearching ? <p className="p-2 text-xs text-muted-foreground">Searching...</p> : 
                            (searchResults.length > 0 ? searchResults.map((fund) => (
                              <Button
                                key={fund.schemeCode}
                                variant="ghost"
                                className="w-full justify-start h-auto text-left whitespace-normal text-xs"
                                onClick={() => handleSelectFund(fund.schemeName, fund.schemeCode)}
                              >
                                {fund.schemeName}
                              </Button>
                            )) : (newItemName.length >= 3 && <p className="p-2 text-xs text-muted-foreground">No results found.</p>))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                </Popover>
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
