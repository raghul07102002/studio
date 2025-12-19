
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ShieldCheck, UserCheck, Cloud, GitMerge } from 'lucide-react';
import { RoadmapView } from './roadmap-view';
import { CareerPieChart } from './career-pie-chart';
import { CareerPath } from '@/lib/types';
import { useApp } from '@/contexts/app-provider';

const careerPaths: { name: CareerPath, description: string, icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { name: 'CyberArk', description: 'Master the leading solution for Privileged Access Management.', icon: ShieldCheck },
    { name: 'Sailpoint IDN', description: 'Become an expert in Identity Governance and Administration.', icon: UserCheck },
    { name: 'Cloud computing', description: 'Specialize in cloud infrastructure and services.', icon: Cloud },
    { name: 'Devops', description: 'Bridge the gap between development and operations.', icon: GitMerge },
];

export function CareerDashboardView() {
    const { isInitialized } = useApp();
    const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);

    if (!isInitialized) {
        return <div>Loading...</div>
    }

    if (selectedPath) {
        return (
            <div className="flex justify-center w-full">
                <div className="w-full max-w-4xl">
                    <RoadmapView path={selectedPath} onBack={() => setSelectedPath(null)} />
                </div>
            </div>
        );
    }

  return (
    <div className="flex justify-center w-full">
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Career Progression</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Choose your path and define your future.</p>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {careerPaths.map((path) => {
                    const Icon = path.icon;
                    return (
                      <div 
                          key={path.name}
                          className="group relative cursor-pointer"
                          onClick={() => setSelectedPath(path.name)}
                      >
                          <Card className="h-full transition-all duration-200 ease-in-out group-hover:shadow-lg group-hover:border-primary group-hover:-translate-y-1">
                              <CardHeader>
                                  <div className="flex items-start justify-between">
                                      <CardTitle className="text-xl font-semibold">{path.name}</CardTitle>
                                      <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                                  </div>
                                  <CardDescription className="pt-2">{path.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="flex justify-end items-center pt-4">
                                  <div className='flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity'>
                                      Define Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                                  </div>
                              </CardContent>
                          </Card>
                      </div>
                    );
                })}
            </div>
        </div>
        <div className="lg:col-span-1">
            <CareerPieChart />
        </div>
    </div>
    </div>
  );
}
