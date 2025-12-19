'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { RoadmapView } from './roadmap-view';

type CareerPath = 'CyberArk' | 'Sailpoint IDN' | 'Cloud computing' | 'Devops';

const careerPaths: { name: CareerPath, description: string }[] = [
    { name: 'CyberArk', description: 'Master the leading solution for Privileged Access Management.' },
    { name: 'Sailpoint IDN', description: 'Become an expert in Identity Governance and Administration.' },
    { name: 'Cloud computing', description: 'Specialize in cloud infrastructure and services.' },
    { name: 'Devops', description: 'Bridge the gap between development and operations.' },
];

export function CareerDashboardView() {
    const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);

    if (selectedPath) {
        return <RoadmapView path={selectedPath} onBack={() => setSelectedPath(null)} />;
    }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Career Progression</CardTitle>
                <CardDescription>Select a path to define and track your career roadmap.</CardDescription>
            </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerPaths.map((path) => (
                <Card 
                    key={path.name} 
                    className="hover:shadow-lg hover:border-primary transition-all cursor-pointer"
                    onClick={() => setSelectedPath(path.name)}
                >
                    <CardHeader>
                        <CardTitle>{path.name}</CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end items-center">
                        <div className='flex items-center text-sm font-medium text-primary'>
                            Define Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
