
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { useData } from '@/hooks/use-data';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

const chartData = [
  { month: 'Jan', revenue: 1860, expenses: 800 },
  { month: 'Feb', revenue: 3050, expenses: 1200 },
  { month: 'Mar', revenue: 2370, expenses: 980 },
  { month: 'Apr', revenue: 730, expenses: 600 },
  { month: 'May', revenue: 2090, expenses: 1100 },
  { month: 'Jun', revenue: 2140, expenses: 1300 },
];

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--primary))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;


export function FinancialChart() {
    const { currency } = useData();

    const currencySymbols = {
        USD: '$',
        EUR: '€',
        INR: '₹',
    }

    return (
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Monthly revenue vs. expenses.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                     <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => `${currencySymbols[currency]}${value/1000}k`} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value, name, props) => (
                        <div className="flex flex-col">
                            <span>{props.payload.month}</span>
                            <span style={{ color: props.color }}>
                                {name}: {value.toLocaleString('en-US', { style: 'currency', currency: currency })}
                            </span>
                        </div>
                    )} />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
    );
}
