'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface RoadmapViewProps {
    path: string;
    onBack: () => void;
}

export function RoadmapView({ path, onBack }: RoadmapViewProps) {
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
                <Textarea
                    placeholder={`- Obtain [Certification Name] by [Date]
- Complete [Course Name] on [Platform]
- Lead a project related to ${path}
...`}
                    className="min-h-[400px] text-base"
                />
                <div className="flex justify-end">
                    <Button>Save Roadmap</Button>
                </div>
            </CardContent>
        </Card>
    );
}
