
'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MonthlyBudgetInputProps {
  type: 'expenses' | 'trips';
  selectedMonth: string; // "yyyy-MM"
}

export function MonthlyBudgetInput({ type, selectedMonth }: MonthlyBudgetInputProps) {
  const { wealthData, updateWealthData } = useApp();
  // We will now only use expenseBudgets as the source of truth
  const budgets = wealthData.expenseBudgets;
  
  const [amount, setAmount] = useState((budgets && budgets[selectedMonth]) || '');

  useEffect(() => {
    setAmount((budgets && budgets[selectedMonth]) || '');
  }, [selectedMonth, budgets]);

  const handleSetBudget = () => {
    const numericAmount = parseFloat(String(amount));
    if (!isNaN(numericAmount)) {
      // Update both expense and trip budgets simultaneously
      const newExpenseBudgets = { ...(wealthData.expenseBudgets || {}), [selectedMonth]: numericAmount };
      const newTripBudgets = { ...(wealthData.tripBudgets || {}), [selectedMonth]: numericAmount };
      updateWealthData({ 
        expenseBudgets: newExpenseBudgets,
        tripBudgets: newTripBudgets 
      });
    }
  };
  
  const budgetLabel = 'Monthly Budget';

  return (
    <div className="flex w-full items-center gap-2">
      <Label htmlFor={`${type}-budget`} className="text-sm font-medium whitespace-nowrap">
        {budgetLabel}:
      </Label>
      <div className="flex w-full items-center">
        <span className="p-2 text-muted-foreground text-sm">₹</span>
        <Input
          id={`${type}-budget`}
          type="number"
          placeholder="Set budget for the month"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1"
        />
      </div>
      <Button onClick={handleSetBudget}>Set</Button>
    </div>
  );
}
