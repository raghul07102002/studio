'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import type { PlannerTask } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

interface TaskItemProps {
    task: PlannerTask;
}

export function TaskItem({ task }: TaskItemProps) {
    const { updatePlannerTask, removePlannerTask } = useApp();

    const handleFieldChange = (field: 'title' | 'time' | 'hours', value: string | number) => {
        updatePlannerTask(task.id, { [field]: value });
    };

    return (
        <Accordion type="single" collapsible className="w-full bg-secondary/30 rounded-lg">
            <AccordionItem value={task.id} className="border-b-0">
                <div className="flex items-center gap-4 px-4 py-2">
                    <Checkbox 
                        id={`task-check-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={(checked) => updatePlannerTask(task.id, { completed: !!checked })}
                        className="h-5 w-5"
                    />
                    <AccordionTrigger className={cn("flex-1 p-0 hover:no-underline", task.completed && 'line-through text-muted-foreground')}>
                        <span className="font-medium">{task.title}</span>
                    </AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded-md">{task.time}</span>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => removePlannerTask(task.id)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                </div>
                <AccordionContent>
                    <div className="px-4 pb-4 pt-2 space-y-4 border-t mx-4 mt-2">
                         <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1">
                                <Label htmlFor={`task-time-${task.id}`}>Time</Label>
                                <Input
                                    id={`task-time-${task.id}`}
                                    type="time"
                                    value={task.time}
                                    onChange={(e) => handleFieldChange('time', e.target.value)}
                                    className="h-9"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`task-hours-${task.id}`}>Hours</Label>
                                <Input
                                    id={`task-hours-${task.id}`}
                                    type="number"
                                    value={task.hours}
                                    onChange={(e) => handleFieldChange('hours', parseFloat(e.target.value) || 0)}
                                    className="h-9"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
