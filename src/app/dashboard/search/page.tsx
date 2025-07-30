
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">
          {query ? `Showing results for: "${query}"` : 'Please enter a search term.'}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            This is a placeholder for search results. In a real application, this page would display results from across your entire dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed rounded-lg">
            <Search className="w-12 h-12 text-muted-foreground" />
            <p className="text-lg font-semibold mt-4">
              {query ? `No results found for "${query}"` : 'Search for clients, transactions, and more'}
            </p>
            <p className="text-muted-foreground text-sm">
              Try a different search term or use the main navigation.
            </p>
          </div>
        </CardContent>
      </Card>
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
