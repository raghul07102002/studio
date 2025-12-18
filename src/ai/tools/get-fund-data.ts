'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const fundData = {
  debt: [
    { name: 'ICICI Prudential Gilt Fund', cagr: 7.8 },
    { name: 'SBI Magnum Gilt Fund', cagr: 7.5 },
    { name: 'HDFC Gilt Fund', cagr: 7.2 },
  ],
  gold: [
    { name: 'SBI Gold Fund', cagr: 15.2 },
    { name: 'Nippon India Gold Savings Fund', cagr: 14.8 },
    { name: 'HDFC Gold Fund', cagr: 14.5 },
  ],
  equity: [
    { name: 'Parag Parikh Flexi Cap Fund', cagr: 22.5 },
    { name: 'Quant Small Cap Fund', cagr: 35.1 },
    { name: 'Axis Small Cap Fund', cagr: 28.9 },
  ],
};

export const getFundSuggestions = ai.defineTool(
  {
    name: 'getFundSuggestions',
    description: 'Get a list of top-performing mutual funds for a given category.',
    inputSchema: z.object({
      category: z.enum(['debt', 'gold', 'equity']),
    }),
    outputSchema: z.object({
      funds: z.array(
        z.object({
          name: z.string(),
          cagr: z.number(),
        })
      ),
    }),
  },
  async ({ category }) => {
    return {
      funds: fundData[category] || [],
    };
  }
);
