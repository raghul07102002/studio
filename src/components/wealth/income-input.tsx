'use client';

import { useWealth } from '@/contexts/wealth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function IncomeInput() {
  const { wealthData, updateWealthData } = useWealth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="monthly-salary">Monthly Salary</Label>
          <div className="flex items-center">
            <span className="p-2 text-muted-foreground">₹</span>
            <Input
              id="monthly-salary"
              type="number"
              value={wealthData.monthlySalary}
              onChange={(e) =>
                updateWealthData({
                  monthlySalary: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="e.g., 100000"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
