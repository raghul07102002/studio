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
      { name: 'Achieved', value: achieved, fill: 'hsl(var(--primary))' },
      { name: 'Remaining', value: remaining, fill: 'hsl(var(--secondary))' },
    ];
  }, [selectedYear]);

  const achievedCorpus = chartData[0].value;
  const achievedPercentage = (achievedCorpus / TARGET_CORPUS) * 100;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Target Corpus</CardTitle>
            <CardDescription>
              ₹{TARGET_CORPUS.toLocaleString('en-IN')} over 20 years
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
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                strokeWidth={5}
                paddingAngle={5}
                cornerRadius={8}
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <div className="p-6 pt-0 text-center">
        <p className="text-2xl font-bold">
          {achievedCorpus.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
          })}
        </p>
        <p className="text-muted-foreground">
          {achievedPercentage.toFixed(1)}% of your goal
        </p>
      </div>
    </Card>
  );
}
