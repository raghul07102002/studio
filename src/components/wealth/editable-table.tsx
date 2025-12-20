
'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/app-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import type { Expense, Trip } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { MonthlyBudgetInput } from './monthly-budget-input';
import { Label } from '../ui/label';

interface EditableTableProps {
  title: string;
  description: string;
  type: 'expenses' | 'trips';
  selectedDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
}

export function EditableTable({
  title,
  description,
  type,
  selectedDate,
  onDateChange
}: EditableTableProps) {
  const { wealthData, updateWealthData } = useApp();
  
  const dateForExpenses = type === 'expenses' ? selectedDate : new Date();
  const selectedDateString = dateForExpenses ? format(dateForExpenses, 'yyyy-MM-dd') : '';
  const selectedMonthString = dateForExpenses ? format(dateForExpenses, 'yyyy-MM') : format(new Date(), 'yyyy-MM');

  const items = type === 'expenses' 
    ? (wealthData?.expenses?.[selectedDateString] || [])
    : wealthData?.trips || [];
  
  // Both budgets are now the same, read from expenseBudgets
  const monthlyBudget = wealthData?.expenseBudgets?.[selectedMonthString] || 0;

  const monthlyTotalSpent = useMemo(() => {
    if (type === 'expenses') {
        if (!wealthData?.expenses) return 0;
        return Object.entries(wealthData.expenses).reduce((total, [date, dailyExpenses]) => {
            if (date.startsWith(selectedMonthString)) {
            return total + dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            }
            return total;
        }, 0);
    }
    // For trips, we sum up all trips regardless of month for the total
    return wealthData?.trips?.reduce((sum, item) => sum + item.amount, 0) || 0;
  }, [wealthData?.expenses, wealthData?.trips, selectedMonthString, type]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  
  const handleAddItem = () => {
    const amount = parseFloat(newItemAmount);
    if (newItemName && !isNaN(amount)) {
      if (type === 'expenses') {
        const newExpense = { name: newItemName, amount, id: `exp-${Date.now()}` };
        const newExpenses = { ...(wealthData.expenses || {}) };
        if (!newExpenses[selectedDateString]) newExpenses[selectedDateString] = [];
        newExpenses[selectedDateString].push(newExpense);
        updateWealthData({ expenses: newExpenses });
      } else {
        const newTrip = { name: newItemName, amount, id: `trip-${Date.now()}` };
        const newTrips = [...(wealthData.trips || []), newTrip];
        updateWealthData({ trips: newTrips });
      }
      setNewItemName('');
      setNewItemAmount('');
    }
  };
  
  const handleUpdate = (id: string, field: 'name' | 'amount', value: string) => {
    if (type === 'expenses') {
        const newExpenses = { ...(wealthData.expenses || {}) };
        if (newExpenses[selectedDateString]) {
            newExpenses[selectedDateString] = newExpenses[selectedDateString].map(item => 
                item.id === id ? { ...item, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : item
            );
            updateWealthData({ expenses: newExpenses });
        }
    } else {
        const newTrips = (wealthData.trips || []).map(item => 
            item.id === id ? { ...item, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : item
        );
        updateWealthData({ trips: newTrips });
    }
  };
  
  const handleRemoveItem = (id: string) => {
    if (type === 'expenses') {
        const newExpenses = { ...(wealthData.expenses || {}) };
        if (newExpenses[selectedDateString]) {
            newExpenses[selectedDateString] = newExpenses[selectedDateString].filter(item => item.id !== id);
            if (newExpenses[selectedDateString].length === 0) delete newExpenses[selectedDateString];
            updateWealthData({ expenses: newExpenses });
        }
    } else {
        const newTrips = (wealthData.trips || []).filter(item => item.id !== id);
        updateWealthData({ trips: newTrips });
    }
  };

  const dailyTotal = items.reduce((sum, item) => sum + item.amount, 0);
  
  const totalForFooter = type === 'expenses' ? monthlyTotalSpent : dailyTotal;
  const remainingBudget = monthlyBudget - totalForFooter;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
             {type === 'expenses' && onDateChange && (
              <div className="grid w-full max-w-xs items-center gap-1.5">
                  <Label htmlFor="expense-date">Select Date</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => onDateChange(e.target.value ? parseISO(e.target.value) : undefined)}
                    className="w-full"
                  />
              </div>
            )}
        </div>
        {type === 'expenses' && (
          <div className="pt-4">
              <MonthlyBudgetInput type={type} selectedMonth={selectedMonthString} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className='h-48 w-full pr-4'>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[120px] text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Textarea
                        value={item.name}
                        onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                        className="h-8 border-none resize-none overflow-hidden bg-transparent focus-visible:ring-0"
                        rows={1}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleUpdate(item.id, 'amount', e.target.value)}
                        className="h-8 border-none text-right bg-transparent focus-visible:ring-0"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
            </Table>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="New item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount"
              className="w-32"
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
            />
            <Button onClick={handleAddItem}>Add</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2'>
        <div className="w-full flex justify-between font-semibold">
          <span>Total for {type === 'expenses' ? (selectedDate ? format(selectedDate, 'MMM d') : 'day') : 'All Trips'}:</span>
          <span>{dailyTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</span>
        </div>
        <div className="w-full flex justify-between font-semibold text-muted-foreground text-sm">
          <span>Monthly Budget ({format(new Date(selectedMonthString), 'MMMM yyyy')}):</span>
          <span>{monthlyBudget.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</span>
        </div>
        <div className="w-full flex justify-between font-semibold text-muted-foreground text-sm">
          <span>Total Spent this Month:</span>
          <span>{totalForFooter.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</span>
        </div>
        <div className={cn("w-full flex justify-between font-bold text-lg", remainingBudget < 0 ? "text-destructive" : "text-primary")}>
          <span>Remaining Budget:</span>
          <span>{remainingBudget.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
