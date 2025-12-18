'use client';

import { useMemo } from 'react';
import { useWealth } from '@/contexts/wealth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, PiggyBank, Briefcase } from 'lucide-react';

export function WealthMetrics() {
  const { wealthData } = useWealth();
  const { monthlySalary, expenses } = wealthData;

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );
  
  const savings = monthlySalary - totalExpenses;
  const savingsRate = monthlySalary > 0 ? (savings / monthlySalary) * 100 : 0;
  const expenseRate = monthlySalary > 0 ? (totalExpenses / monthlySalary) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthlySalary.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0})}
          </div>
          <p className="text-xs text-muted-foreground">Your gross monthly income.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {savings.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0})}
          </div>
          <p className="text-xs text-muted-foreground">Salary minus expenses.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Percentage of salary saved.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expense Rate</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expenseRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Percentage of salary spent.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
