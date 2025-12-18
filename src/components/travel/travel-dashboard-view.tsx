'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndiaMap } from './india-map';

export function TravelDashboardView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Travel Dashboard</CardTitle>
          <CardDescription>Visualize your travels across India.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='w-full h-[600px] flex items-center justify-center'>
            <IndiaMap />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
