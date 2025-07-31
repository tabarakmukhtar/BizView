
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
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

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
    const { currency, financialData } = useData();

    const chartData = useMemo(() => {
        const monthlyData: { [key: string]: { month: string, revenue: number, expenses: number, date: Date }} = {};

        // Use a copy of financialData to avoid potential side effects from sorting
        [...financialData].forEach(record => {
            const recordDate = new Date(record.date);
            // Create a key like "2024-01" for sorting and grouping
            const monthKey = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { 
                  month: recordDate.toLocaleString('default', { month: 'short', year: '2-digit' }), 
                  revenue: 0, 
                  expenses: 0,
                  date: new Date(recordDate.getFullYear(), recordDate.getMonth(), 1)
                };
            }
            if (record.type === 'revenue') {
                monthlyData[monthKey].revenue += record.amount;
            } else {
                monthlyData[monthKey].expenses += record.amount;
            }
        });
        
        // Sort the aggregated data by date to ensure the chart is chronological
        return Object.values(monthlyData).sort((a, b) => a.date.getTime() - b.date.getTime());

    }, [financialData]);


    const currencySymbols = {
        USD: '$',
        EUR: '€',
        INR: '₹',
    }

    const formatYAxis = (value: number) => {
        if (value >= 1000) {
            return `${currencySymbols[currency] || '$'}${Math.round(value / 1000)}k`;
        }
        return `${currencySymbols[currency] || '$'}${value}`;
    }

    return (
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>A historical overview of monthly revenue vs. expenses.</CardDescription>
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
                     <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={formatYAxis} />
                    <ChartTooltip 
                        cursor={false} 
                        content={<ChartTooltipContent 
                                    formatter={(value, name) => (
                                        <div className='flex flex-col'>
                                            <span className="text-muted-foreground">{name}</span>
                                            <span className='font-bold' style={{ color: name === 'Revenue' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>
                                                {Number(value).toLocaleString('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                    )} 
                                    labelClassName="font-bold"
                                />} 
                    />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
    );
}
