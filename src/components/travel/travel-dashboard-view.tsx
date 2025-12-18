'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TravelDashboardView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Travel Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your new travel dashboard!</p>
        </CardContent>
      </Card>
    </div>
  );
}
