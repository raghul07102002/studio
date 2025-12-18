'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-habit-action-plan.ts';
import '@/ai/flows/suggest-funds-flow.ts';
