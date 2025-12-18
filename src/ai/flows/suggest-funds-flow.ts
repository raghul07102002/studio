'use server';
/**
 * @fileOverview Suggests top-performing funds based on a given category (Debt, Gold, Equity).
 *
 * - suggestFunds - A function that returns a list of fund suggestions.
 * - SuggestFundsInput - The input type for the suggestFunds function.
 * - SuggestFundsOutput - The return type for the suggestFunds function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFundSuggestions } from '@/ai/tools/get-fund-data';

const SuggestFundsInputSchema = z.object({
  category: z.enum(['debt', 'gold', 'equity']),
});
export type SuggestFundsInput = z.infer<typeof SuggestFundsInputSchema>;

const FundSuggestionSchema = z.object({
    name: z.string().describe('The name of the mutual fund.'),
    cagr: z.number().describe('The 5-year Compound Annual Growth Rate (CAGR) of the fund.'),
});

const SuggestFundsOutputSchema = z.object({
  funds: z.array(FundSuggestionSchema),
});
export type SuggestFundsOutput = z.infer<typeof SuggestFundsOutputSchema>;


export async function suggestFunds(input: SuggestFundsInput): Promise<SuggestFundsOutput> {
  return suggestFundsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFundsPrompt',
  input: { schema: SuggestFundsInputSchema },
  output: { schema: SuggestFundsOutputSchema },
  tools: [getFundSuggestions],
  prompt: `You are a financial assistant. Based on the user's selected category ({{{category}}}), suggest the top 3 performing funds. Use the getFundSuggestions tool to fetch the fund data.`,
});

const suggestFundsFlow = ai.defineFlow(
  {
    name: 'suggestFundsFlow',
    inputSchema: SuggestFundsInputSchema,
    outputSchema: SuggestFundsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
