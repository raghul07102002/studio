'use client';

import { useMemo, useState } from 'react';
import { useWealth } from '@/contexts/wealth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FundTable } from './fund-table';
import { Progress } from '../ui/progress';
import { isSameMonth } from 'date-fns';

const ALLOCATION_CONFIG = {
  debt: { name: 'Debt', percentage: 0.4 },
  gold: { name: 'Gold', percentage: 0.2 },
  equity: { name: 'Equity', percentage: 0.4 },
};

export function SavingsAllocation() {
  const { wealthData, updateWealthData } = useWealth();
  const { monthlySalary, expenses } = wealthData;

  const totalExpenses = useMemo(() => {
    const now = new Date();
    return Object.entries(expenses).reduce((total, [date, dailyExpenses]) => {
      if (isSameMonth(new Date(date), now)) {
        return total + dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      }
      return total;
    }, 0);
  }, [expenses]);
  
  const monthlySavings = monthlySalary - totalExpenses > 0 ? monthlySalary - totalExpenses : 0;

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

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateWealthData({ monthlySalary: parseFloat(value) || 0 });
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
            <label htmlFor="monthly-salary" className="text-sm font-medium">
              Monthly Salary
            </label>
            <div className="flex items-center">
                <span className="p-2 text-muted-foreground">₹</span>
                <input
                id="monthly-salary"
                type="number"
                value={wealthData.monthlySalary || ''}
                onChange={handleSalaryChange}
                placeholder="e.g., 100000"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
            </div>
        </div>

        <div className="space-y-2">
            <div className='flex justify-between items-center'>
                <label htmlFor="monthly-savings" className="text-sm font-medium">
                Monthly Savings (Auto-calculated)
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
                readOnly
                placeholder="e.g., 50000"
                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
