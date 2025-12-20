
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
import { useApp } from '@/contexts/app-provider';

const TARGET_CORPUS = 70000000; // 7 Crore
const YEARS = 20;
const RATE = 0.12; // 12%

const calculateFutureValue = (monthlyInvestment: number, months: number) => {
  const monthlyRate = RATE / 12;
  let futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  return futureValue;
};


export function CorpusChart() {
  const { wealthData } = useApp();

  const investmentData = useMemo(() => {
    const { savingsAllocation } = wealthData;
    if (!savingsAllocation) {
        return { totalPrincipal: 0, totalInterest: 0, fv: 0 };
    }

    let fv = 0;
    let totalPrincipalInvested = 0;

    const today = new Date();
    const totalMonths = YEARS * 12;

    Object.entries(savingsAllocation).forEach(([monthStr, allocation]) => {
      const allFunds = [
          ...(allocation.mutualFunds?.debt || []),
          ...(allocation.mutualFunds?.gold || []),
          ...(allocation.mutualFunds?.equity || []),
          ...(allocation.emergencyFunds || []),
          ...(allocation.shortTermGoals || []),
      ];
      const monthlyInvestment = allFunds.reduce((sum, fund) => sum + fund.amount, 0);

      const investmentDate = new Date(monthStr + '-01');
      const monthsRemaining = (today.getFullYear() - investmentDate.getFullYear()) * 12 + (today.getMonth() - investmentDate.getMonth());
      const monthsToProject = totalMonths - monthsRemaining;

      if (monthsToProject > 0) {
        fv += calculateFutureValue(monthlyInvestment, monthsToProject);
        totalPrincipalInvested += monthlyInvestment * monthsToProject;
      }
    });

    const totalInterest = fv - totalPrincipalInvested > 0 ? fv - totalPrincipalInvested : 0;
    
    return {
        amountInvested: totalPrincipalInvested,
        interestAmount: totalInterest,
        fv: fv,
    }

  }, [wealthData.savingsAllocation]);

  const remainingNeeded = TARGET_CORPUS > investmentData.fv ? TARGET_CORPUS - investmentData.fv : 0;

  const chartData = useMemo(() => {
    return [
      { name: 'Principal', value: investmentData.amountInvested, fill: 'hsl(var(--chart-1))' },
      { name: 'Interest', value: investmentData.interestAmount, fill: 'hsl(var(--chart-3))' },
      { name: 'Remaining', value: remainingNeeded, fill: 'hsl(var(--muted))' },
    ].filter(d => d.value > 0);
  }, [investmentData, remainingNeeded]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className='space-y-1'>
            <CardTitle>Investment Corpus</CardTitle>
          </div>
          <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Target Corpus</p>
              <p className="text-lg font-bold">
                {TARGET_CORPUS.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
                {investmentData.fv.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
