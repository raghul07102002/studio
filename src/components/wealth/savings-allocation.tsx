'use client';

import { useMemo } from 'react';
import { useWealth } from '@/contexts/wealth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FundTable } from './fund-table';
import { Progress } from '../ui/progress';

export function SavingsAllocation() {
  const { wealthData, updateWealthData } = useWealth();
  const { monthlySalary, monthlySavings, savingsAllocation } = wealthData;
  
  const totalAllocated = useMemo(() => {
    const { mutualFunds, emergencyFunds, shortTermGoals } = savingsAllocation;
    const mfTotal = Object.values(mutualFunds).flat().reduce((sum, fund) => sum + fund.amount, 0);
    const efTotal = emergencyFunds.reduce((sum, fund) => sum + fund.amount, 0);
    const stgTotal = shortTermGoals.reduce((sum, fund) => sum + fund.amount, 0);
    return mfTotal + efTotal + stgTotal;
  }, [savingsAllocation]);

  const allocationProgress = monthlySavings > 0 ? (totalAllocated / monthlySavings) * 100 : 0;

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateWealthData({ monthlySalary: parseFloat(value) || 0 });
  };
  
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
            <label htmlFor="monthly-salary" className="text-sm font-medium">
              Monthly Salary
            </label>
            <div className="flex items-center">
                <span className="p-2 text-muted-foreground">₹</span>
                <input
                id="monthly-salary"
                type="number"
                value={monthlySalary || ''}
                onChange={handleSalaryChange}
                placeholder="e.g., 100000"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
            </div>
        </div>

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
                placeholder="e.g., 50000"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
            </div>
            <Progress value={allocationProgress} className="mt-2 h-2" />
        </div>
        
        <div className='space-y-4 rounded-lg border p-4'>
            <h3 className="text-lg font-semibold text-center">Mutual Funds</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FundTable category="debt" title="Debt" maxAllocation={monthlySavings * 0.4} />
            <FundTable category="gold" title="Gold" maxAllocation={monthlySavings * 0.2} />
            <FundTable category="equity" title="Equity" maxAllocation={monthlySavings * 0.4} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FundTable 
            category="emergencyFunds"
            title="Emergency Funds"
            maxAllocation={monthlySavings} // Or some other logic
          />
          <FundTable 
            category="shortTermGoals"
            title="Short Term Goals"
            maxAllocation={monthlySavings} // Or some other logic
          />
        </div>
      </CardContent>
    </Card>
  );
}
