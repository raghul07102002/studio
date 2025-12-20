'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskItem } from './task-item';
import { useToast } from '@/hooks/use-toast';

export function TaskList() {
    const { dayPlannerData, addPlannerTask } = useApp();
    const { tasks = [] } = dayPlannerData;
    const { toast } = useToast();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskTime, setNewTaskTime] = useState('');
    const [newTaskAmount, setNewTaskAmount] = useState('');

    const handleAddTask = () => {
        if (!newTaskTitle || !newTaskTime) {
            toast({
                title: "Missing Information",
                description: "Please provide a title and a time for the task.",
                variant: 'destructive'
            });
            return;
        }
        addPlannerTask({
            title: newTaskTitle,
            time: newTaskTime,
            amount: parseFloat(newTaskAmount) || 0,
            completed: false,
        });
        setNewTaskTitle('');
        setNewTaskTime('');
        setNewTaskAmount('');
    };
    
    const totalAmount = tasks.reduce((sum, task) => sum + task.amount, 0);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Today's Plan</CardTitle>
                <CardDescription>
                    List and manage your tasks for the day. Click on a task to see details.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-2">
                        {tasks.map(task => (
                           <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4 border-t pt-6">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="New task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="h-10"
                    />
                    <Input
                        type="time"
                        value={newTaskTime}
                        onChange={(e) => setNewTaskTime(e.target.value)}
                        className="h-10 w-32"
                    />
                     <Input
                        type="number"
                        placeholder="Amount"
                        value={newTaskAmount}
                        onChange={(e) => setNewTaskAmount(e.target.value)}
                        className="h-10 w-32"
                    />
                    <Button onClick={handleAddTask} size="icon" className="h-10 w-10 shrink-0">
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
                 <div className="flex justify-end font-semibold text-lg pr-12">
                    <span>Total Spent: </span>
                    <span className="ml-2">
                        {totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}
