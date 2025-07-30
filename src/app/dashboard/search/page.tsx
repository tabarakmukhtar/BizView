
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import type { Client, FinancialRecord } from '@/lib/definitions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// In a real application, you would fetch this data based on the query.
// For this prototype, we'll use the same initial data and filter it.
const initialClients: Client[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', company: 'Innovate LLC', status: 'active', lastContact: '2024-06-20' },
  { id: '2', name: 'Bob Smith', email: 'bob.s@example.com', company: 'Solutions Inc.', status: 'active', lastContact: '2024-06-18' },
  { id: '3', name: 'Charlie Brown', email: 'charlie.b@example.com', company: 'Tech Forward', status: 'inactive', lastContact: '2024-03-10' },
  { id: '4', name: 'Diana Prince', email: 'diana.p@example.com', company: 'Global Synergy', status: 'active', lastContact: '2024-06-21' },
  { id: '5', name: 'Ethan Hunt', email: 'ethan.h@example.com', company: 'Mission Group', status: 'active', lastContact: '2024-05-30' },
];

const initialFinancialData: FinancialRecord[] = [
  { id: 'txn1', date: '2024-06-15', description: 'Website Redesign Project', amount: 7500, type: 'revenue', category: 'Web Development' },
  { id: 'txn2', date: '2024-06-14', description: 'Monthly Cloud Hosting', amount: 250, type: 'expense', category: 'Utilities' },
  { id: 'txn3', date: '2024-06-12', description: 'Client Retainer - Acme Corp', amount: 3000, type: 'revenue', category: 'Consulting' },
  { id: 'txn4', date: '2024-06-11', description: 'Marketing Campaign', amount: 1200, type: 'expense', category: 'Marketing' },
  { id: 'txn5', date: '2024-06-10', description: 'Office Supplies Purchase', amount: 175.50, type: 'expense', category: 'Office' },
  { id: 'txn6', date: '2024-06-08', description: 'Logo Design for Startup', amount: 1500, type: 'revenue', category: 'Design' },
  { id: 'txn7', date: '2024-06-05', description: 'Annual Software License', amount: 800, type: 'expense', category: 'Software' },
];


function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [filteredFinancials, setFilteredFinancials] = useState<FinancialRecord[]>([]);

  useEffect(() => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      
      const clients = initialClients.filter(c => 
        c.name.toLowerCase().includes(lowercasedQuery) ||
        c.email.toLowerCase().includes(lowercasedQuery) ||
        c.company.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredClients(clients);

      const financials = initialFinancialData.filter(f =>
        f.description.toLowerCase().includes(lowercasedQuery) ||
        f.category.toLowerCase().includes(lowercasedQuery) ||
        String(f.amount).includes(lowercasedQuery)
      );
      setFilteredFinancials(financials);

    } else {
      setFilteredClients([]);
      setFilteredFinancials([]);
    }
  }, [query]);

  if (!query) {
     return (
        <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg">
            <Search className="w-16 h-16 text-muted-foreground" />
            <p className="text-xl font-semibold mt-4">
                Search Your Dashboard
            </p>
            <p className="text-muted-foreground text-sm max-w-sm">
                Find clients, transactions, appointments, and more by typing in the search bar above.
            </p>
        </div>
     );
  }

  const hasResults = filteredClients.length > 0 || filteredFinancials.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">
          Showing results for: <span className="font-semibold text-foreground">"{query}"</span>
        </p>
      </div>

      {!hasResults ? (
        <Card>
           <CardContent className="pt-6">
             <div className="flex flex-col items-center justify-center text-center h-64">
                <Search className="w-12 h-12 text-muted-foreground" />
                <p className="text-lg font-semibold mt-4">
                  No results found for "{query}"
                </p>
                <p className="text-muted-foreground text-sm">
                  Try a different search term or use the main navigation.
                </p>
              </div>
           </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
          {filteredClients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Found Clients</CardTitle>
                <CardDescription>Clients matching your search query.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={`https://placehold.co/40x40.png?text=${client.name.charAt(0)}`} alt={client.name} data-ai-hint="person" />
                              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{client.company}</TableCell>
                        <TableCell>
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                            {client.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {filteredFinancials.length > 0 && (
             <Card>
              <CardHeader>
                <CardTitle>Found Financial Records</CardTitle>
                <CardDescription>Financial records matching your search query.</CardDescription>
              </CardHeader>
              <CardContent>
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
                        {filteredFinancials.map((record) => (
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
                                currency: 'USD',
                            })}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading search results...</div>}>
            <SearchResults />
        </Suspense>
    )
}
