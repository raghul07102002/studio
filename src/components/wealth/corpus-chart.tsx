
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
const YEARS = 20;
const RATE = 0.12; // 12%

// This function calculates the future value of a series of monthly investments
const calculateFutureValue = (monthlyInvestment: number) => {
  const months = YEARS * 12;
  const monthlyRate = RATE / 12;
  // FV = P * [({(1+r)^n - 1} / r) * (1+r)]  (formula for SIP)
  let futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  return futureValue;
};


export function CorpusChart() {
  const { wealthData } = useWealth();

  const investmentData = useMemo(() => {
    const { savingsAllocation } = wealthData;
    if (!savingsAllocation) {
        return { totalPrincipal: 0, totalInterest: 0, remainingPrincipal: TARGET_CORPUS };
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
    const totalPrincipalInvested = totalMonthlyInvestment * 12 * YEARS;
    const totalInterest = fv - totalPrincipalInvested > 0 ? fv - totalPrincipalInvested : 0;
    
    // This represents the total amount of money you'd put in over 20 years at the current monthly rate.
    // The "remaining" is how much more principal would be needed to hit the target.
    const remainingNeeded = TARGET_CORPUS > fv ? TARGET_CORPUS - fv : 0;

    return {
        amountInvested: totalPrincipalInvested,
        interestAmount: totalInterest,
        amountToInvest: remainingNeeded,
    }

  }, [wealthData.savingsAllocation]);


  const chartData = useMemo(() => {
    return [
      { name: 'Amount Invested', value: investmentData.amountInvested, fill: 'hsl(var(--chart-1))' },
      { name: 'Interest Amount', value: investmentData.interestAmount, fill: 'hsl(var(--chart-3))' },
      { name: 'Amount to Invest', value: investmentData.amountToInvest, fill: 'hsl(var(--muted))' },
    ].filter(d => d.value > 0);
  }, [investmentData]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className='space-y-1'>
            <CardTitle>Investment</CardTitle>
          </div>
          <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Remaining to Invest</p>
              <p className="text-lg font-bold">
                {investmentData.amountToInvest.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
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
                {(investmentData.amountInvested + investmentData.interestAmount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
