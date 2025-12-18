'use server';

/**
 * @fileOverview Generates a personalized action plan to improve habit adherence based on yearly completion rates.
 *
 * - generateHabitActionPlan - A function that generates an action plan based on habit completion data.
 * - GenerateHabitActionPlanInput - The input type for the generateHabitActionPlan function.
 * - GenerateHabitActionPlanOutput - The return type for the generateHabitActionPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHabitActionPlanInputSchema = z.object({
  habitCompletionData: z.record(z.string(), z.number()).describe('A record of habit completion rates for the year, with habit names as keys and completion percentages (0-100) as values.'),
});
export type GenerateHabitActionPlanInput = z.infer<typeof GenerateHabitActionPlanInputSchema>;

const GenerateHabitActionPlanOutputSchema = z.object({
  actionPlan: z.string().describe('A personalized action plan to improve habit adherence.'),
});
export type GenerateHabitActionPlanOutput = z.infer<typeof GenerateHabitActionPlanOutputSchema>;

export async function generateHabitActionPlan(input: GenerateHabitActionPlanInput): Promise<GenerateHabitActionPlanOutput> {
  return generateHabitActionPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHabitActionPlanPrompt',
  input: {schema: GenerateHabitActionPlanInputSchema},
  output: {schema: GenerateHabitActionPlanOutputSchema},
  prompt: `You are a personal habit coach. Analyze the following habit completion data for the year and generate a personalized action plan to improve habit adherence. The action plan should be specific, actionable, and tailored to the user's completion rates.

Habit Completion Data:
{{#each habitCompletionData}}
- {{key}}: {{value}}%
{{/each}}

Action Plan:`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateHabitActionPlanFlow = ai.defineFlow(
  {
    name: 'generateHabitActionPlanFlow',
    inputSchema: GenerateHabitActionPlanInputSchema,
    outputSchema: GenerateHabitActionPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
