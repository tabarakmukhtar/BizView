import type { FinancialRecord } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown, PlusCircle } from "lucide-react";

const financialData: FinancialRecord[] = [
  { id: 'txn1', date: '2024-06-15', description: 'Website Redesign Project', amount: 7500, type: 'revenue', category: 'Web Development' },
  { id: 'txn2', date: '2024-06-14', description: 'Monthly Cloud Hosting', amount: 250, type: 'expense', category: 'Utilities' },
  { id: 'txn3', date: '2024-06-12', description: 'Client Retainer - Acme Corp', amount: 3000, type: 'revenue', category: 'Consulting' },
  { id: 'txn4', date: '2024-06-11', description: 'Marketing Campaign', amount: 1200, type: 'expense', category: 'Marketing' },
  { id: 'txn5', date: '2024-06-10', description: 'Office Supplies Purchase', amount: 175.50, type: 'expense', category: 'Office' },
  { id: 'txn6', date: '2024-06-08', description: 'Logo Design for Startup', amount: 1500, type: 'revenue', category: 'Design' },
  { id: 'txn7', date: '2024-06-05', description: 'Annual Software License', amount: 800, type: 'expense', category: 'Software' },
];

export default function FinancialsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Summaries</h1>
          <p className="text-muted-foreground">Review and manage all your financial records.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell className="font-medium">{record.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{record.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.type === 'revenue' ? 'default' : 'destructive'} className="capitalize">
                      {record.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-mono ${record.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                    {record.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
