'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RoadmapProgressChart } from './roadmap-progress-chart';
import { useCareer, type RoadmapItem, type CareerPath } from '@/contexts/career-provider';

interface RoadmapViewProps {
    path: CareerPath;
    onBack: () => void;
}

const MAX_HOURS_PER_DAY = 4;

export function RoadmapView({ path, onBack }: RoadmapViewProps) {
    const { roadmaps, setRoadmap, addRoadmapItem, updateRoadmapItem, removeRoadmapItem } = useCareer();
    const items = roadmaps[path] || [];
    
    const [newItemTitle, setNewItemTitle] = useState('');

    const handleAddItem = () => {
        if (newItemTitle.trim() === '') return;
        addRoadmapItem(path, newItemTitle);
        setNewItemTitle('');
    };

    const handleHoursChange = (id: string, hours: number) => {
        const newHours = Math.max(0, hours); // Ensure hours are not negative
        const item = items.find(i => i.id === id);
        if (item) {
            updateRoadmapItem(path, { ...item, hoursSpent: newHours });
        }
    };
    
    const handleDeleteItem = (id: string) => {
        removeRoadmapItem(path, id);
    };

    const calculateProgress = (hours: number) => {
        return Math.min((hours / MAX_HOURS_PER_DAY) * 100, 100);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                        <Button variant="outline" size="icon" onClick={onBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <CardTitle className="text-2xl font-bold">Roadmap: {path}</CardTitle>
                            <CardDescription>Track your daily effort. Your goal is 4 hours of focused study per day.</CardDescription>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <RoadmapProgressChart items={items} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {items.map(item => {
                        const progress = calculateProgress(item.hoursSpent);
                        const isCompleted = progress >= 100;
                        return (
                            <div key={item.id} className="group rounded-lg border bg-card p-4 transition-all hover:bg-secondary/50">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex-1 space-y-1">
                                        <p className="font-semibold text-foreground">{item.title}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {isCompleted ? (
                                                <Badge variant="default" className="bg-green-600">Completed</Badge>
                                            ) : (
                                                <Badge variant="secondary">In Progress</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <Input
                                            type="number"
                                            value={item.hoursSpent}
                                            onChange={(e) => handleHoursChange(item.id, parseFloat(e.target.value) || 0)}
                                            className="h-9 w-20 text-center font-medium"
                                            min="0"
                                        />
                                        <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Hours Today</label>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                                        >
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-medium text-muted-foreground">Daily Progress</span>
                                        <span className="text-xs font-bold text-primary">{progress.toFixed(0)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                    <Input
                        type="text"
                        placeholder="Add a new learning block..."
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                        className="h-10"
                    />
                    <Button onClick={handleAddItem} size="icon" className="h-10 w-10">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
