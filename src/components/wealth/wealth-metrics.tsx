
'use client';

import { useMemo } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, PiggyBank, Briefcase } from 'lucide-react';
import { isSameMonth } from 'date-fns';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface WealthMetricsProps {
    selectedMonth: string;
}

export function WealthMetrics({ selectedMonth }: WealthMetricsProps) {
  const { wealthData, updateWealthData } = useApp();
  const { monthlySalary, expenses } = wealthData;
  const monthlySavings = wealthData.monthlySavings?.[selectedMonth] || 0;

  const totalExpenses = useMemo(() => {
    if (!expenses) return 0;
    const currentMonthDate = new Date(selectedMonth);
    return Object.entries(expenses).reduce((total, [date, dailyExpenses]) => {
      if (isSameMonth(new Date(date), currentMonthDate)) {
        return total + dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      }
      return total;
    }, 0);
  }, [expenses, selectedMonth]);
  
  const savings = monthlySavings;
  const savingsRate = monthlySalary > 0 ? (savings / monthlySalary) * 100 : 0;
  
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateWealthData({ monthlySalary: parseFloat(value) || 0 });
  };

  const metricCardClasses = "transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <span className="p-2 text-muted-foreground">₹</span>
            <Input
              type="number"
              value={monthlySalary || ''}
              onChange={handleSalaryChange}
              placeholder="Enter amount"
              className="h-10 w-full rounded-md border-input bg-transparent px-1 py-2 text-lg font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <p className="text-xs text-muted-foreground">Your gross monthly income.</p>
        </CardContent>
      </Card>
      <Card className={metricCardClasses}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Target Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {savings.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0})}
          </div>
          <p className="text-xs text-muted-foreground">Your monthly savings goal.</p>
        </CardContent>
      </Card>
      <Card className={metricCardClasses}>
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
      <Card className={metricCardClasses}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalExpenses.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0})}
          </div>
          <p className="text-xs text-muted-foreground">
            Total for {new Date(selectedMonth).toLocaleString('default', { month: 'long' })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
