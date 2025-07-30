'use server';

import { generateFinancialForecast, FinancialForecastInput, FinancialForecastOutput } from '@/ai/flows/financial-forecasting';
import { z } from 'zod';

const FinancialDataSchema = z.object({
  financialData: z.string().min(50, { message: "Please provide more detailed financial data for an accurate forecast." }),
});

export type FormState = {
  message: string;
  forecast?: FinancialForecastOutput;
  errors?: {
    financialData?: string[];
  };
};

export async function getFinancialForecast(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FinancialDataSchema.safeParse({
    financialData: formData.get('financialData'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const input: FinancialForecastInput = {
      financialData: validatedFields.data.financialData,
    };
    const forecastResult = await generateFinancialForecast(input);
    return {
      message: 'Forecast generated successfully.',
      forecast: forecastResult,
    };
  } catch (error) {
    console.error('Error generating financial forecast:', error);
    return {
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}
