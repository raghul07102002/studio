'use client';

import { useMemo, useState } from 'react';
import { useWealth } from '@/contexts/wealth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FundTable } from './fund-table';
import { Progress } from '../ui/progress';

const ALLOCATION_CONFIG = {
  debt: { name: 'Debt', percentage: 0.4 },
  gold: { name: 'Gold', percentage: 0.2 },
  equity: { name: 'Equity', percentage: 0.4 },
};

export function SavingsAllocation() {
  const { wealthData, updateWealthData } = useWealth();
  const { monthlySavings } = wealthData;

  const isSavingsLow = monthlySavings < 50000;

  const allocations = useMemo(() => {
    return {
        debt: monthlySavings * ALLOCATION_CONFIG.debt.percentage,
        gold: monthlySavings * ALLOCATION_CONFIG.gold.percentage,
        equity: monthlySavings * ALLOCATION_CONFIG.equity.percentage,
    }
  }, [monthlySavings]);

  const totalAllocated = Object.values(wealthData.savingsAllocation).flat().reduce((sum, fund) => sum + fund.amount, 0);
  const allocationProgress = monthlySavings > 0 ? (totalAllocated / monthlySavings) * 100 : 0;

  const handleSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      updateWealthData({ monthlySavings: 0 });
    } else {
      updateWealthData({ monthlySavings: parseFloat(value) || 0 });
    }
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
                Monthly Savings Amount
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
                placeholder="e.g., 50000"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
            </div>
            {isSavingsLow && monthlySavings > 0 && (
                <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                    Warning: Monthly savings is below the recommended minimum of ₹50,000.
                </AlertDescription>
                </Alert>
            )}
            <Progress value={allocationProgress} className="mt-2 h-2" />
        </div>

        <div className="space-y-6">
          <FundTable 
            category="debt"
            title="Debt (40%)"
            maxAllocation={allocations.debt}
          />
          <FundTable 
            category="gold"
            title="Gold (20%)"
            maxAllocation={allocations.gold}
          />
          <FundTable 
            category="equity"
            title="Equity (40%)"
            maxAllocation={allocations.equity}
          />
        </div>
      </CardContent>
    </Card>
  );
}
