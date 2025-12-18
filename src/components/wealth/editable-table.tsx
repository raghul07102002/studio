'use client';

import { useState } from 'react';
import { useWealth } from '@/contexts/wealth-provider';
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
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditableTableProps {
  title: string;
  description: string;
  type: 'expenses' | 'trips';
}

export function EditableTable({
  title,
  description,
  type,
}: EditableTableProps) {
  const { wealthData, addExpense, updateExpense, removeExpense, addTrip, updateTrip, removeTrip } = useWealth();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const selectedDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  const items = type === 'expenses' 
    ? (wealthData.expenses[selectedDateString] || [])
    : wealthData.trips;

  const addItem = (item: Omit<Expense, 'id'> | Omit<Trip, 'id'>) => {
    if (type === 'expenses') {
      addExpense(selectedDateString, item as Omit<Expense, 'id'>);
    } else {
      addTrip(item as Omit<Trip, 'id'>);
    }
  };

  const updateItem = (item: Expense | Trip) => {
    if (type === 'expenses') {
      updateExpense(selectedDateString, item as Expense);
    } else {
      updateTrip(item as Trip);
    }
  }

  const removeItem = (id: string) => {
    if (type === 'expenses') {
      removeExpense(selectedDateString, id);
    } else {
      removeTrip(id);
    }
  }

  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const handleAddItem = () => {
    const amount = parseFloat(newItemAmount);
    if (newItemName && !isNaN(amount)) {
      addItem({ name: newItemName, amount });
      setNewItemName('');
      setNewItemAmount('');
    }
  };

  const handleUpdate = (id: string, field: 'name' | 'amount', value: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    if (field === 'name') {
      updateItem({ ...item, name: value });
    } else {
      updateItem({ ...item, amount: parseFloat(value) || 0 });
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
            {type === 'expenses' && (
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className='h-48 w-full'>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[100px] text-right">Amount</TableHead>
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
                        className="h-8 border-none resize-none overflow-hidden"
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
                        className="h-8 border-none text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
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
      <CardFooter className='justify-end'>
        <div className="text-right font-semibold">
          Total: {totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}
        </div>
      </CardFooter>
    </Card>
  );
}
