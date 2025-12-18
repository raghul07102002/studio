
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useWealth } from '@/contexts/wealth-provider';

const TARGET_CORPUS = 70000000; // 7 Crore

// This function now uses a ratio based on the user's reference point.
// Reference: 50k/month investment reaches 7 Cr in 20 years at 12% CAGR.
// This simplifies the projection to be directly proportional to the total monthly investment.
const calculateFutureValue = (totalMonthlyInvestment: number) => {
  const referenceInvestment = 50000;
  const referenceFutureValue = TARGET_CORPUS;
  
  if (referenceInvestment === 0) {
    return 0;
  }
  
  // Project the future value proportionally to the reference.
  const projectedValue = (totalMonthlyInvestment / referenceInvestment) * referenceFutureValue;
  return projectedValue;
};


export function CorpusChart() {
  const { wealthData } = useWealth();
  const [projectedValue, setProjectedValue] = useState(0);

  useEffect(() => {
    const { savingsAllocation } = wealthData;
    if (!savingsAllocation) {
        setProjectedValue(0);
        return;
    }

    const allFunds = [
        ...(savingsAllocation.mutualFunds?.debt || []),
        ...(savingsAllocation.mutualFunds?.gold || []),
        ...(savingsAllocation.mutualFunds?.equity || []),
        ...(savingsAllocation.emergencyFunds || []),
        ...(savingsAllocation.shortTermGoals || []),
    ];

    const totalMonthlyInvestment = allFunds.reduce((sum, fund) => sum + fund.amount, 0);

    const fv = calculateFutureValue(totalMonthlyInvestment);
    setProjectedValue(fv);

  }, [wealthData.savingsAllocation]);


  const chartData = useMemo(() => {
    const achieved = projectedValue;
    const remaining = Math.max(0, TARGET_CORPUS - achieved);
    return [
      { name: 'Projected', value: achieved, fill: 'hsl(var(--chart-3))' },
      { name: 'Remaining', value: remaining, fill: 'hsl(var(--muted))' },
    ];
  }, [projectedValue]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className='space-y-1'>
            <CardTitle>Investment</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[300px] aspect-square">
            <ChartContainer
                config={{}}
                className="mx-auto aspect-square w-full"
            >
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        hideLabel 
                        formatter={(value) => `₹${(value as number).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`}
                        />}
                    />
                    <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="70%"
                    outerRadius="100%"
                    strokeWidth={5}
                    stroke="hsl(var(--background))"
                    startAngle={90}
                    endAngle={450}
                    cornerRadius={8}
                    >
                    {chartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                    </Pie>
                </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <p className="text-xs text-muted-foreground mt-2">Projected Value</p>
                <p className="text-2xl font-bold tracking-tighter">
                {projectedValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
