import { ForecastingForm } from '@/components/forecasting-form';

export default function ForecastingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">AI-Driven Financial Forecasting</h1>
        <p className="text-muted-foreground">
          Use the power of AI to project your financials for the next year based on historical data.
        </p>
      </div>
      <ForecastingForm />
    </div>
  );
}
