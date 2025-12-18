
'use client';

import { useApp } from '@/contexts/app-provider';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { calculateDailyCompletion } from '@/lib/analysis';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

interface DayCardProps {
  date: Date;
}

export function DayCard({ date }: DayCardProps) {
  const { habits, habitData, updateHabitLog } = useApp();
  const dateString = format(date, 'yyyy-MM-dd');
  const dayLogs = habitData[dateString] || {};
  const dailyCompletion = calculateDailyCompletion(dayLogs, habits);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold uppercase text-muted-foreground">{format(date, 'EEE')}</span>
            <span className="text-2xl font-bold">{format(date, 'd')}</span>
            <span className="text-sm font-semibold text-muted-foreground">{format(date, 'MMM')}</span>
        </div>
        <Badge variant={dailyCompletion > 80 ? "default" : "secondary"}>{dailyCompletion.toFixed(0)}%</Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 p-4 pt-0">
        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-3">
            {habits.map((habit) => {
              const log = dayLogs[habit.id] || { completed: false, value: 0 };
              return (
                <div key={habit.id} className="flex items-center justify-between rounded-md border p-3 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={log.completed}
                      onCheckedChange={(checked) =>
                        updateHabitLog(dateString, habit.id, {
                          completed: !!checked,
                        })
                      }
                      id={`${habit.id}-${dateString}`}
                      className="rounded-full h-5 w-5"
                    />
                    <label htmlFor={`${habit.id}-${dateString}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {habit.name}
                    </label>
                  </div>
                  {habit.type === 'numeric' && (
                    <Input
                        type="number"
                        value={log.value}
                        onChange={(e) => updateHabitLog(dateString, habit.id, { completed: log.completed, value: Number(e.target.value)})}
                        className="h-8 w-16 text-center border-none bg-background"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

