
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, TrendingUp, TrendingDown, PackageOpen } from 'lucide-react';
import { FinancialChart } from '@/components/financial-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import type { FinancialRecord } from '@/lib/definitions';
import { useUser } from '@/hooks/use-user';


export default function DashboardPage() {
    const { name } = useUser();
    const [summaryData, setSummaryData] = useState({
        revenue: 45231.89,
        expenses: 12873.45,
        profit: 32358.44,
        clients: 57,
    });
    const [recentTransactions, setRecentTransactions] = useState<Omit<FinancialRecord, 'date' | 'category' | 'id'>[]>([
        { description: 'Client Project Alpha', amount: 5000, type: 'revenue' },
        { description: 'Software Subscription', amount: 150, type: 'expense' },
        { description: 'Client Retainer Beta', amount: 2500, type: 'revenue' },
        { description: 'Office Supplies', amount: 230.50, type: 'expense' },
        { description: 'Consulting Services', amount: 1200, type: 'revenue' },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Good Morning, {name}</h1>
        <p className="text-muted-foreground">Here is your business overview for today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">${summaryData.revenue.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">${summaryData.expenses.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold text-green-600 dark:text-green-500">${summaryData.profit.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">+25.0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">+{summaryData.clients}</div>}
            <p className="text-xs text-muted-foreground">+3 since last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <FinancialChart />
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>An overview of your latest financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                 <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <Skeleton className="h-5 w-3/5" />
                        <Skeleton className="h-5 w-1/5" />
                      </div>
                    ))}
                 </div>
            ) : recentTransactions.length > 0 ? (
                 <Table>
                    <TableBody>
                        {recentTransactions.map((transaction, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="font-medium">{transaction.description}</div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'}>
                                        {transaction.type === 'expense' && '-'}${transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={transaction.type === 'revenue' ? 'default' : 'destructive'} className="capitalize">
                                        {transaction.type}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                 <div className="flex flex-col items-center justify-center text-center h-40 border-2 border-dashed rounded-lg">
                  <PackageOpen className="w-10 h-10 text-muted-foreground" />
                  <p className="text-lg font-semibold mt-2">No recent transactions</p>
                  <p className="text-muted-foreground text-sm">New transactions will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
