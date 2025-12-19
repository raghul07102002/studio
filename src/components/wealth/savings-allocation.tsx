
'use client';

import { useMemo } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FundTable } from './fund-table';
import { Progress } from '../ui/progress';

export function SavingsAllocation() {
  const { wealthData, updateWealthData } = useApp();
  const { monthlySavings, savingsAllocation } = wealthData;
  
  const totalAllocated = useMemo(() => {
    if (!savingsAllocation) return 0;
    const { mutualFunds, emergencyFunds, shortTermGoals } = savingsAllocation;
    const mfTotal = mutualFunds ? Object.values(mutualFunds).flat().reduce((sum, fund) => sum + fund.amount, 0) : 0;
    const efTotal = emergencyFunds ? emergencyFunds.reduce((sum, fund) => sum + fund.amount, 0) : 0;
    const stgTotal = shortTermGoals ? shortTermGoals.reduce((sum, fund) => sum + fund.amount, 0) : 0;
    return mfTotal + efTotal + stgTotal;
  }, [savingsAllocation]);

  const allocationProgress = monthlySavings > 0 ? (totalAllocated / monthlySavings) * 100 : 0;
  const unallocatedAmount = monthlySavings - totalAllocated;
  
  const handleSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateWealthData({ monthlySavings: parseFloat(value) || 0 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Allocation</CardTitle>
        <CardDescription>
            Allocate your monthly savings into different funds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <div className='flex justify-between items-center'>
                <label htmlFor="monthly-savings" className="text-sm font-medium">
                Monthly Savings Target
                </label>
                <span className='text-sm font-medium'>
                {totalAllocated.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}
                / 
                {monthlySavings.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}
                </span>
            </div>
            <div className="flex items-center">
                <span className="p-2 text-muted-foreground">₹</span>
                <input
                id="monthly-savings"
                type="number"
                value={monthlySavings || ''}
                onChange={handleSavingsChange}
                placeholder="e.g., 80000"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
            </div>
            <Progress value={allocationProgress} className="mt-2 h-2" />
            {unallocatedAmount > 0 && (
                <p className='text-xs text-center text-amber-600 font-medium pt-1'>
                    {unallocatedAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })} more needs to be invested.
                </p>
            )}
             {unallocatedAmount < 0 && (
                <p className='text-xs text-center text-destructive font-medium pt-1'>
                    You have overallocated by {Math.abs(unallocatedAmount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}.
                </p>
            )}
        </div>
        
        <div className='space-y-4 rounded-lg border p-4'>
            <h3 className="text-lg font-semibold text-center">Mutual Funds</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FundTable category="debt" title="Debt" maxAllocation={Infinity} />
            <FundTable category="gold" title="Gold" maxAllocation={Infinity} />
            <FundTable category="equity" title="Equity" maxAllocation={Infinity} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FundTable 
            category="emergencyFunds"
            title="Emergency Funds"
            maxAllocation={Infinity}
          />
          <FundTable 
            category="shortTermGoals"
            title="Short Term Goals"
            maxAllocation={Infinity}
          />
        </div>
      </CardContent>
    </Card>
  );
}
