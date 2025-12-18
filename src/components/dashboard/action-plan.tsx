"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/contexts/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateHabitActionPlan } from "@/ai/flows/generate-habit-action-plan";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { calculateHabitCompletion } from "@/lib/analysis";

export function ActionPlan() {
  const { habits, habitData, filteredDates, selectedView } = useApp();
  const [loading, setLoading] = useState(false);
  const [actionPlan, setActionPlan] = useState("");
  const { toast } = useToast();

  const habitCompletionData = useMemo(() => {
    const data: Record<string, number> = {};
    habits.forEach((habit) => {
      data[habit.name] = calculateHabitCompletion(habitData, habit.id, filteredDates);
    });
    return data;
  }, [habits, habitData, filteredDates]);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setActionPlan("");
    try {
      const result = await generateHabitActionPlan({ habitCompletionData });
      if (result.actionPlan) {
        setActionPlan(result.actionPlan);
      } else {
        throw new Error("Failed to generate a plan.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate an action plan. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Action Plan</CardTitle>
        <CardDescription>
          Get a personalized action plan based on your performance for the selected period ({selectedView}).
        </CardDescription>
      </CardHeader>
      {actionPlan && (
        <CardContent>
          <div className="prose prose-sm dark:prose-invert bg-secondary p-4 rounded-md">
            <h4 className="font-semibold">Your Personal Plan</h4>
            <p>{actionPlan}</p>
          </div>
        </CardContent>
      )}
      <CardFooter>
        <Button onClick={handleGeneratePlan} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {actionPlan ? "Regenerate Plan" : "Generate Action Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
