
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RoadmapProgressChart } from './roadmap-progress-chart';

interface RoadmapViewProps {
    path: string;
    onBack: () => void;
}

export interface RoadmapItem {
    id: string;
    title: string;
    hoursSpent: number;
}

const MAX_HOURS_PER_DAY = 4;

const initialRoadmapItems: Record<string, Omit<RoadmapItem, 'id'>[]> = {
    'CyberArk': [
        { title: 'Introduction to PAM, IAM & Vault Basics', hoursSpent: 0 },
        { title: 'Core Components (PVWA, CPM, PSM, PSMP)', hoursSpent: 0 },
        { title: 'Safes, Platforms, and Account Management', hoursSpent: 0 },
        { title: 'Authentication & Session Monitoring', hoursSpent: 0 },
        { title: 'Advanced Topics: PTA, AAM, and Conjur', hoursSpent: 0 },
    ],
    'Sailpoint IDN': [
        { title: 'IdentityNow Basics & Terminology', hoursSpent: 0 },
        { title: 'Sources, Accounts, and Entitlements', hoursSpent: 0 },
        { title: 'Access Profiles and Roles', hoursSpent: 0 },
        { title: 'Certification Campaigns & Policies', hoursSpent: 0 },
        { title: 'Transforms and Provisioning Logic', hoursSpent: 0 },
    ],
    'Cloud computing': [
        { title: 'Core Concepts: IaaS, PaaS, SaaS', hoursSpent: 0 },
        { title: 'Networking & Security in the Cloud', hoursSpent: 0 },
        { title: 'Compute Services (VMs, Containers, Serverless)', hoursSpent: 0 },
        { title: 'Storage & Database Solutions', hoursSpent: 0 },
        { title: 'Identity and Access Management (IAM)', hoursSpent: 0 },
    ],
    'Devops': [
        { title: 'CI/CD Pipelines (e.g., Jenkins, GitLab CI)', hoursSpent: 0 },
        { title: 'Infrastructure as Code (Terraform, Ansible)', hoursSpent: 0 },
        { title: 'Containerization (Docker, Kubernetes)', hoursSpent: 0 },
        { title: 'Monitoring & Observability (Prometheus, Grafana)', hoursSpent: 0 },
        { title: 'Scripting & Automation (Bash, Python)', hoursSpent: 0 },
    ],
};


export function RoadmapView({ path, onBack }: RoadmapViewProps) {
    const [items, setItems] = useState<RoadmapItem[]>(() => {
        const initialItems = initialRoadmapItems[path] || [];
        return initialItems.map((item, index) => ({
            ...item,
            id: `item-${path}-${index}-${Date.now()}`
        }));
    });
    
    const [newItemTitle, setNewItemTitle] = useState('');

    const handleAddItem = () => {
        if (newItemTitle.trim() === '') return;
        const newItem: RoadmapItem = {
            id: `item-${Date.now()}`,
            title: newItemTitle,
            hoursSpent: 0,
        };
        setItems([...items, newItem]);
        setNewItemTitle('');
    };

    const handleHoursChange = (id: string, hours: number) => {
        const newHours = Math.max(0, hours); // Ensure hours are not negative
        setItems(items.map(item =>
            item.id === id ? { ...item, hoursSpent: newHours } : item
        ));
    };
    
    const handleDeleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
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
                
                <div className="flex justify-end pt-4">
                    <Button>Save Progress</Button>
                </div>
            </CardContent>
        </Card>
    );
}
