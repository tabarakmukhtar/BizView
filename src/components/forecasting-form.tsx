
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getFinancialForecast, FormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Forecast
        </>
      )}
    </Button>
  );
}

export function ForecastingForm() {
  const [state, formAction] = useActionState(getFinancialForecast, initialState);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Input Your Financial Data</CardTitle>
          <CardDescription>
            Provide your recent financial data (e.g., in CSV format or a descriptive text) including revenue, expenses, and profit over several periods. The more data you provide, the more accurate the forecast will be.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Textarea
              name="financialData"
              placeholder="Example: Month,Revenue,Expenses,Profit\nJan 2023,10000,6000,4000\nFeb 2023,12000,7000,5000..."
              className="min-h-[200px] font-mono"
              required
            />
            {state.errors?.financialData && (
              <p className="text-sm font-medium text-destructive">{state.errors.financialData.join(', ')}</p>
            )}
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      {state.message && !state.forecast && (
         <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.forecast && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles />
              Your Financial Forecast
            </CardTitle>
            <CardDescription>Here is the AI-generated financial projection for the upcoming year based on the data you provided.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-md bg-card p-4">
              {state.forecast.forecast}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
