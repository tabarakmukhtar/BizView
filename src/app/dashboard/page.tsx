
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
import { DollarSign, Users, TrendingUp, TrendingDown, PackageOpen, ArrowUp, ArrowDown } from 'lucide-react';
import { FinancialChart } from '@/components/financial-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { useUser } from '@/hooks/use-user';
import { useData } from '@/hooks/use-data';
import { useIsClient } from '@/hooks/use-is-client';

function MetricCard({ title, value, percentageChange, previousValue, icon, formatAsCurrency, currency }) {
  const isPositive = percentageChange >= 0;
  const isZero = percentageChange === 0 || isNaN(percentageChange) || !isFinite(percentageChange);

  const formatValue = (val) => {
    if (formatAsCurrency) {
      return val.toLocaleString('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return `+${val}`;
  }
  
  const getChangeText = () => {
    if (isZero) return "No change from last month";
    const change = Math.abs(percentageChange).toFixed(1);
    return `${change}% ${isPositive ? 'more' : 'less'} than last month`;
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        <p className="text-xs text-muted-foreground">
          {getChangeText()}
        </p>
      </CardContent>
    </Card>
  )
}


export default function DashboardPage() {
    const { name } = useUser();
    const { financialData, clients, loading, currency, summary, previousSummary } = useData();
    const isClient = useIsClient();

    const greeting = useMemo(() => {
      if (!isClient) return 'Welcome';
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return 'Good Morning';
      } else if (currentHour < 18) {
        return 'Good Afternoon';
      } else {
        return 'Good Evening';
      }
    }, [isClient]);
    
    const recentTransactions = useMemo(() => {
        return [...financialData]
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [financialData]);
    
     const calculatePercentageChange = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return ((current - previous) / previous) * 100;
    };


    if (loading || !isClient) {
      return (
        <div className="flex flex-col gap-8">
            <div>
              <Skeleton className="h-9 w-1/2 mb-2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
               {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                       <Skeleton className="h-4 w-1/3" />
                       <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                       <Skeleton className="h-8 w-3/4 mb-1" />
                       <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
               ))}
            </div>
             <div className="grid gap-4 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <Skeleton className="h-7 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pl-2">
                     <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
                 <Card className="lg:col-span-3">
                  <CardHeader>
                    <Skeleton className="h-7 w-1/2" />
                     <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <Skeleton className="h-5 w-3/5" />
                            <Skeleton className="h-5 w-1/5" />
                          </div>
                        ))}
                      </div>
                  </CardContent>
                </Card>
            </div>
        </div>
      );
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">{greeting}, {name}</h1>
        <p className="text-muted-foreground">Here is your business overview for today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Revenue"
          value={summary.revenue}
          percentageChange={calculatePercentageChange(summary.revenue, previousSummary.revenue)}
          previousValue={previousSummary.revenue}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          formatAsCurrency={true}
          currency={currency}
        />
         <MetricCard 
          title="Total Expenses"
          value={summary.expenses}
          percentageChange={calculatePercentageChange(summary.expenses, previousSummary.expenses)}
          previousValue={previousSummary.expenses}
          icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
          formatAsCurrency={true}
          currency={currency}
        />
        <MetricCard 
          title="Net Profit"
          value={summary.profit}
          percentageChange={calculatePercentageChange(summary.profit, previousSummary.profit)}
          previousValue={previousSummary.profit}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          formatAsCurrency={true}
          currency={currency}
        />
        <MetricCard 
          title="Active Clients"
          value={summary.clients}
          percentageChange={calculatePercentageChange(summary.clients, previousSummary.clients)}
          previousValue={previousSummary.clients}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          formatAsCurrency={false}
          currency={currency}
        />
      </div>
      
      <div className="grid gap-4 lg:grid-cols-7">
        <FinancialChart />
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>An overview of your latest financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
                 <Table>
                    <TableBody>
                        {recentTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <div className="font-medium">{transaction.description}</div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={`font-mono ${transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                                        {transaction.type === 'expense' && '-'}{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: currency })}
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
