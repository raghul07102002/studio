'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CareerPieChart } from './career-pie-chart';

export function CareerDashboardView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Career Progression</CardTitle>
          <CardDescription>Track and manage your career goals.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            <p>Main content area for career progression.</p>
          </div>
        </CardContent>
      </Card>
      <div className="lg:col-span-1">
        <CareerPieChart />
      </div>
    </div>
  );
}
