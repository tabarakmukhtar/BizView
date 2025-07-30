'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating financial forecasts.
 *
 * The flow takes existing financial data as input and uses it to project financials for the next year.
 * It exports:
 * - `generateFinancialForecast` - An async function that triggers the financial forecasting flow.
 * - `FinancialForecastInput` - The input type for the `generateFinancialForecast` function.
 * - `FinancialForecastOutput` - The output type for the `generateFinancialForecast` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialForecastInputSchema = z.object({
  financialData: z
    .string()
    .describe(
      'A string containing the existing financial data, including revenue, expenses, and profit, potentially in CSV format.'
    ),
});
export type FinancialForecastInput = z.infer<typeof FinancialForecastInputSchema>;

const FinancialForecastOutputSchema = z.object({
  forecast: z
    .string()
    .describe(
      'A string containing the financial forecast for the next year, including projected revenue, expenses, and profit.'
    ),
});
export type FinancialForecastOutput = z.infer<typeof FinancialForecastOutputSchema>;

export async function generateFinancialForecast(
  input: FinancialForecastInput
): Promise<FinancialForecastOutput> {
  return financialForecastingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialForecastingPrompt',
  input: {schema: FinancialForecastInputSchema},
  output: {schema: FinancialForecastOutputSchema},
  prompt: `You are an expert financial analyst. Based on the following financial data, generate a financial forecast for the next year. Identify key trends and project future performance.

Financial Data:
{{{financialData}}}

Forecast:`,
});

const financialForecastingFlow = ai.defineFlow(
  {
    name: 'financialForecastingFlow',
    inputSchema: FinancialForecastInputSchema,
    outputSchema: FinancialForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
