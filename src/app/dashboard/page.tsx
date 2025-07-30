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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
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

const recentTransactions = [
    { id: '1', description: 'Client Project Alpha', amount: 5000, type: 'revenue' },
    { id: '2', description: 'Software Subscription', amount: -150, type: 'expense' },
    { id: '3', description: 'Client Retainer Beta', amount: 2500, type: 'revenue' },
    { id: '4', description: 'Office Supplies', amount: -230.50, type: 'expense' },
    { id: '5', description: 'Consulting Services', amount: 1200, type: 'revenue' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Good Morning, Manager</h1>
        <p className="text-muted-foreground">Here is your business overview for today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,873.45</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">$32,358.44</div>
            <p className="text-xs text-muted-foreground">+25.0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+57</div>
            <p className="text-xs text-muted-foreground">+3 since last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
                     <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => `$${value/1000}k`} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>An overview of your latest financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableBody>
                    {recentTransactions.map(transaction => (
                        <TableRow key={transaction.id}>
                            <TableCell>
                                <div className="font-medium">{transaction.description}</div>
                            </TableCell>
                            <TableCell className="text-right">
                                <span className={transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'}>
                                    {transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge variant={transaction.type === 'revenue' ? 'default' : 'destructive'} className="bg-opacity-20 text-opacity-100">
                                    {transaction.type}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
