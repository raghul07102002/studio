
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useWealth } from '@/contexts/wealth-provider';
import { Fund } from '@/lib/types';

const TARGET_CORPUS = 70000000; // 7 Crore

// Function to calculate future value of a series of payments (investments)
const calculateFutureValue = (monthlyInvestment: number, annualRate: number, years: number) => {
  const monthlyRate = annualRate / 12;
  const totalMonths = years * 12;
  if (monthlyRate === 0) {
    return monthlyInvestment * totalMonths;
  }
  return monthlyInvestment * ( (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate );
};

async function getCAGR(schemeCode: string): Promise<number | null> {
    try {
        const today = new Date();
        const fiveYearsAgo = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
        
        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const [latestRes, pastRes] = await Promise.all([
            fetch(`https://api.mfapi.in/mf/${schemeCode}/latest`),
            fetch(`https://api.mfapi.in/mf/${schemeCode}?startDate=${formatDate(fiveYearsAgo)}`)
        ]);

        if (!latestRes.ok || !pastRes.ok) return null;

        const latestData = await latestRes.json();
        const pastDataArr = await pastRes.json();
        
        if (!latestData.data || pastDataArr.length === 0) return null;

        const latestNav = parseFloat(latestData.data[0].nav);
        const pastNavData = pastDataArr.data.find((d: any) => new Date(d.date) >= fiveYearsAgo);

        if (!pastNavData) return null;

        const pastNav = parseFloat(pastNavData.nav);

        if (isNaN(latestNav) || isNaN(pastNav) || pastNav === 0) return null;

        const cagr = (Math.pow(latestNav / pastNav, 1 / 5) - 1);
        return cagr;

    } catch (error) {
        console.error(`Failed to fetch CAGR for ${schemeCode}:`, error);
        return null;
    }
}


export function CorpusChart() {
  const { wealthData } = useWealth();
  const [projectedValue, setProjectedValue] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const calculateProjections = async () => {
        setIsCalculating(true);
        const { savingsAllocation } = wealthData;
        if (!savingsAllocation) {
            setProjectedValue(0);
            setIsCalculating(false);
            return;
        }

        const allFunds: Fund[] = [
            ...(savingsAllocation.mutualFunds?.debt || []),
            ...(savingsAllocation.mutualFunds?.gold || []),
            ...(savingsAllocation.mutualFunds?.equity || []),
            ...(savingsAllocation.emergencyFunds || []),
            ...(savingsAllocation.shortTermGoals || []),
        ];

        let totalFutureValue = 0;

        for (const fund of allFunds) {
            if (fund.schemeCode) {
                const cagr = await getCAGR(fund.schemeCode);
                if (cagr !== null) {
                    totalFutureValue += calculateFutureValue(fund.amount, cagr, 20);
                } else {
                    // If CAGR fails, project with 0% growth (i.e., just the principal)
                    totalFutureValue += fund.amount * 12 * 20;
                }
            } else {
                 // For funds without a scheme code, assume 0% growth
                 totalFutureValue += fund.amount * 12 * 20;
            }
        }
        setProjectedValue(totalFutureValue);
        setIsCalculating(false);
    };

    calculateProjections();
  }, [wealthData.savingsAllocation]);


  const chartData = useMemo(() => {
    const achieved = projectedValue;
    const remaining = Math.max(0, TARGET_CORPUS - achieved);
    return [
      { name: 'Projected', value: achieved, fill: 'hsl(var(--chart-3))' },
      { name: 'Remaining', value: remaining, fill: 'hsl(var(--muted))' },
    ];
  }, [projectedValue]);

  const achievedPercentage = (projectedValue / TARGET_CORPUS) * 100;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className='space-y-1'>
            <CardTitle>20-Year Corpus Projection</CardTitle>
            <CardDescription>
              Target: ₹{TARGET_CORPUS.toLocaleString('en-IN')}
            </CardDescription>
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
                {isCalculating ? (
                    <div className="text-sm text-muted-foreground">Calculating...</div>
                ) : (
                    <>
                        <p className="text-xs text-muted-foreground mt-2">Projected Value</p>
                        <p className="text-2xl font-bold tracking-tighter">
                        {projectedValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-sm font-medium text-primary">({achievedPercentage.toFixed(1)}% of Target)</p>
                    </>
                )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
