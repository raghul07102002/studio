
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const TARGET_CORPUS = 70000000;
const YEARS = Array.from({ length: 20 }, (_, i) => i + 1);

export function CorpusChart() {
  const [selectedYear, setSelectedYear] = useState(1);

  const chartData = useMemo(() => {
    const achieved = (selectedYear / 20) * TARGET_CORPUS;
    const remaining = TARGET_CORPUS - achieved;
    return [
      { name: 'Achieved', value: achieved, fill: 'hsl(var(--chart-3))' },
      { name: 'Remaining', value: remaining, fill: 'hsl(var(--muted))' },
    ];
  }, [selectedYear]);

  const achievedCorpus = chartData[0].value;
  const achievedPercentage = (achievedCorpus / TARGET_CORPUS) * 100;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle>Target Corpus</CardTitle>
            <CardDescription>
              ₹{TARGET_CORPUS.toLocaleString('en-IN')} in 20 years
            </CardDescription>
          </div>
          <Select
            value={String(selectedYear)}
            onValueChange={(val) => setSelectedYear(Number(val))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  Year {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                        formatter={(value) => `${(value as number).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}`}
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
                <p className="text-xs text-muted-foreground">Achieved</p>
                <p className="text-2xl font-bold tracking-tighter">
                {achievedPercentage.toFixed(0)}%
                </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
