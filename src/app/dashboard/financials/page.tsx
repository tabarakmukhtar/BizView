
'use client';

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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const initialFinancialData: FinancialRecord[] = [
  { id: 'txn1', date: '2024-06-15', description: 'Website Redesign Project', amount: 7500, type: 'revenue', category: 'Web Development' },
  { id: 'txn2', date: '2024-06-14', description: 'Monthly Cloud Hosting', amount: 250, type: 'expense', category: 'Utilities' },
  { id: 'txn3', date: '2024-06-12', description: 'Client Retainer - Acme Corp', amount: 3000, type: 'revenue', category: 'Consulting' },
  { id: 'txn4', date: '2024-06-11', description: 'Marketing Campaign', amount: 1200, type: 'expense', category: 'Marketing' },
  { id: 'txn5', date: '2024-06-10', description: 'Office Supplies Purchase', amount: 175.50, type: 'expense', category: 'Office' },
  { id: 'txn6', date: '2024-06-08', description: 'Logo Design for Startup', amount: 1500, type: 'revenue', category: 'Design' },
  { id: 'txn7', date: '2024-06-05', description: 'Annual Software License', amount: 800, type: 'expense', category: 'Software' },
];

export default function FinancialsPage() {
  const [financialData, setFinancialData] = useState(initialFinancialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State for the new record form
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState<'revenue' | 'expense' | ''>('');
  const [newAmount, setNewAmount] = useState<number | string>('');

  const handleAddRecord = () => {
    if (!newDate || !newDescription || !newCategory || !newType || !newAmount) {
      // Basic validation
      alert('Please fill out all fields.');
      return;
    }

    const newRecord: FinancialRecord = {
      id: `txn${financialData.length + 1}`,
      date: newDate,
      description: newDescription,
      amount: Number(newAmount),
      type: newType as 'revenue' | 'expense',
      category: newCategory,
    };

    setFinancialData([newRecord, ...financialData]);
    
    // Reset form and close dialog
    setNewDate('');
    setNewDescription('');
    setNewCategory('');
    setNewType('');
    setNewAmount('');
    setIsDialogOpen(false);
  };
  
  const handleExportData = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvRows = [
      headers.join(','),
      ...financialData.map(row => 
        [row.date, `"${row.description}"`, row.category, row.type, row.amount].join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'financial_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Summaries</h1>
          <p className="text-muted-foreground">Review and manage all your financial records.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Financial Record</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new financial record.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Input id="date" type="date" className="col-span-3" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input id="description" placeholder="e.g. Office Supplies" className="col-span-3" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Input id="category" placeholder="e.g. Marketing" className="col-span-3" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Select onValueChange={(value) => setNewType(value as 'revenue' | 'expense')} value={newType}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">Amount</Label>
                  <Input id="amount" type="number" placeholder="e.g. 500.00" className="col-span-3" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddRecord}>Save Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
