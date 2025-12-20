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
    const [newTaskHours, setNewTaskHours] = useState('');

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
            hours: parseFloat(newTaskHours) || 0,
            completed: false,
        });
        setNewTaskTitle('');
        setNewTaskTime('');
        setNewTaskHours('');
    };
    
    const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Today's Plan</CardTitle>
                <CardDescription>
                    List and manage your tasks for the day. Click on a task to see details.
                </CardDescription>
                <div className="flex items-center gap-2 pt-4 border-t">
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
                        placeholder="Hours"
                        value={newTaskHours}
                        onChange={(e) => setNewTaskHours(e.target.value)}
                        className="h-10 w-32"
                    />
                    <Button onClick={handleAddTask} size="icon" className="h-10 w-10 shrink-0">
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-2">
                        {tasks.map(task => (
                           <TaskItem key={task.id} task={task} />
                        ))}
                         {tasks.length === 0 && (
                            <div className="text-center text-muted-foreground pt-10">
                                <p>No tasks planned yet.</p>
                                <p className="text-sm">Add your first task for the day above.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                 <div className="w-full flex justify-end font-semibold text-lg pr-4">
                    <span>Total Hours: </span>
                    <span className="ml-2">
                        {totalHours}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}
