
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface RoadmapViewProps {
    path: string;
    onBack: () => void;
}

interface RoadmapItem {
    id: string;
    text: string;
    completed: boolean;
}

export function RoadmapView({ path, onBack }: RoadmapViewProps) {
    const [items, setItems] = useState<RoadmapItem[]>([]);
    const [newItemText, setNewItemText] = useState('');

    const handleAddItem = () => {
        if (newItemText.trim() === '') return;
        const newItem: RoadmapItem = {
            id: `item-${Date.now()}`,
            text: newItemText,
            completed: false,
        };
        setItems([...items, newItem]);
        setNewItemText('');
    };

    const handleToggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const handleUpdateItemText = (id: string, text: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, text } : item
        ));
    };
    
    const handleDeleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };


    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <CardTitle>Roadmap: {path}</CardTitle>
                        <CardDescription>Define the steps, skills, and goals for your career path.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center gap-2 group">
                            <Checkbox
                                id={item.id}
                                checked={item.completed}
                                onCheckedChange={() => handleToggleItem(item.id)}
                            />
                            <Input
                                type="text"
                                value={item.text}
                                onChange={(e) => handleUpdateItemText(item.id, e.target.value)}
                                className="flex-1 border-none bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteItem(item.id)}
                                className="opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Add a new roadmap item..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                    />
                    <Button onClick={handleAddItem} size="icon">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                
                <div className="flex justify-end pt-4">
                    <Button>Save Roadmap</Button>
                </div>
            </CardContent>
        </Card>
    );
}
