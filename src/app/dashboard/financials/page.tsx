
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
import { FileDown, PlusCircle, PackageOpen } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useData } from "@/hooks/use-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinancialsPage() {
  const { financialData, setFinancialData, loading, currency, setCurrency } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { role } = useUser();
  
  // State for the new record form
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState<'revenue' | 'expense' | ''>('');
  const [newAmount, setNewAmount] = useState<number | string>('');

  const canAddRecord = role === 'Admin';

  const handleAddRecord = () => {
    if (!newDate || !newDescription || !newCategory || !newType || !newAmount) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }

    const newRecord: FinancialRecord = {
      id: `txn${Date.now()}`,
      date: newDate,
      description: newDescription,
      amount: Number(newAmount),
      type: newType as 'revenue' | 'expense',
      category: newCategory,
    };

    setFinancialData([newRecord, ...financialData].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    // Reset form and close dialog
    setNewDate('');
    setNewDescription('');
    setNewCategory('');
    setNewType('');
    setNewAmount('');
    setIsDialogOpen(false);
     toast({
        title: "Record Added",
        description: "The new financial record has been saved.",
    });
  };
  
  const handleExportData = () => {
    const headers = ['ID', 'Date', 'Description', 'Amount', 'Type', 'Category'];
    const csvRows = [
      headers.join(','),
      ...financialData.map(row => 
        [row.id, row.date, `"${row.description}"`, row.amount, row.type, row.category].join(',')
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
    toast({
        title: "Export Successful",
        description: "Your financial data has been exported as a CSV file.",
    });
  };

  if (loading) {
     return (
       <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-72 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
             <div className="space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b">
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-4 w-48" />
                   <Skeleton className="h-6 w-28" />
                   <Skeleton className="h-6 w-20" />
                   <Skeleton className="h-4 w-24 text-right" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Summaries</h1>
          <p className="text-muted-foreground">
            {role === 'Admin' ? 'Review and manage all your financial records.' : 'Review all financial records.'}
          </p>
        </div>
        <div className="flex gap-2 items-center">
           <div className="w-32">
            <Select value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'EUR' | 'INR')}>
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleExportData} disabled={financialData.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                   <DialogTrigger asChild>
                      <Button disabled={!canAddRecord}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Record
                      </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                {!canAddRecord && (
                    <TooltipContent>
                      <p>Only Admins can add new records. Please contact an Admin for assistance.</p>
                    </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
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
          {financialData.length > 0 ? (
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
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
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
                        currency: currency,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed rounded-lg">
                <PackageOpen className="w-12 h-12 text-muted-foreground" />
                <p className="text-lg font-semibold mt-4">No financial records found</p>
                <p className="text-muted-foreground text-sm">Add a new record to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
