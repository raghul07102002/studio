"use client";

import { useApp } from "@/contexts/app-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icon, Icons, IconName } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

const habitSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Habit name is required."),
  type: z.enum(["checkbox", "numeric"]),
  icon: z.custom<IconName>((val) =>
    Object.keys(Icons).includes(val as string)
  ),
});

const settingsSchema = z.object({
  habits: z.array(habitSchema).length(15, "There must be exactly 15 habits."),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsView() {
  const { habits, updateHabits, isInitialized } = useApp();
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      habits: habits,
    },
    values: { habits } // Make form reactive to context changes
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "habits",
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateHabits(data.habits);
    toast({
      title: "Settings Saved",
      description: "Your habit configuration has been updated.",
    });
  };

  if (!isInitialized) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-96 w-full" />
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Habit Configuration</CardTitle>
            <CardDescription>
              Customize your 15 habits for 2025. Changes will be saved locally.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-22rem)] pr-6">
                <div className="space-y-6">
                {fields.map((field, index) => (
                    <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
                    >
                    <div className="md:col-span-1 text-lg font-semibold text-muted-foreground pt-2 text-center">
                        {index + 1}
                    </div>
                    <div className="md:col-span-5">
                        <FormField
                        control={form.control}
                        name={`habits.${index}.name`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Habit Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormField
                        control={form.control}
                        name={`habits.${index}.type`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="checkbox">Checkbox</SelectItem>
                                <SelectItem value="numeric">Numeric</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormField
                        control={form.control}
                        name={`habits.${index}.icon`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.keys(Icons).map((iconName) => (
                                    <SelectItem
                                        key={iconName}
                                        value={iconName}
                                    >
                                        <div className="flex items-center gap-2">
                                        <Icon name={iconName as IconName} className="h-4 w-4" />
                                        <span>{iconName}</span>
                                        </div>
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    </div>
                ))}
                </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
