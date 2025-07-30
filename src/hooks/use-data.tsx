
'use client';

import type { Client, FinancialRecord, Appointment } from '@/lib/definitions';
import { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from 'react';

// Initial data (can be replaced with API calls) - ALL AMOUNTS ARE IN USD (BASE CURRENCY)
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

const initialAppointments: Appointment[] = [
  { id: '1', time: '10:00 AM', title: 'Project Kickoff with Acme Inc.', description: 'Discussing the new marketing campaign strategy.' },
  { id: '2', time: '01:00 PM', title: 'Team Sync-up', description: 'Weekly check-in on project progress and blockers.' },
  { id: '3', time: '03:30 PM', title: 'Interview with Candidate', description: 'Senior Frontend Developer position.' },
];

type Currency = 'USD' | 'EUR' | 'INR';

const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93, // 1 USD = 0.93 EUR
  INR: 83.45, // 1 USD = 83.45 INR
};

interface DataContextType {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  financialData: FinancialRecord[];
  setFinancialData: (data: FinancialRecord[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClientsState] = useState<Client[]>([]);
  const [financialData, setFinancialDataState] = useState<FinancialRecord[]>([]);
  const [appointments, setAppointmentsState] = useState<Appointment[]>([]);
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API and localStorage
    try {
      const storedClients = localStorage.getItem('bizview-clients');
      setClientsState(storedClients ? JSON.parse(storedClients) : initialClients);

      const storedFinancials = localStorage.getItem('bizview-financials');
      // All data in localStorage is stored in the base currency (USD)
      setFinancialDataState(storedFinancials ? JSON.parse(storedFinancials) : initialFinancialData);

      const storedAppointments = localStorage.getItem('bizview-appointments');
      setAppointmentsState(storedAppointments ? JSON.parse(storedAppointments) : initialAppointments);
      
      const storedCurrency = localStorage.getItem('bizview-currency');
      setCurrencyState((storedCurrency as Currency) || 'USD');

    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      // Fallback to initial data if localStorage is corrupt
      setClientsState(initialClients);
      setFinancialDataState(initialFinancialData);
      setAppointmentsState(initialAppointments);
      setCurrencyState('USD');
    } finally {
      setLoading(false);
    }
  }, []);

  const setClients = (newClients: Client[]) => {
    setClientsState(newClients);
    localStorage.setItem('bizview-clients', JSON.stringify(newClients));
  };

  const setFinancialData = (newFinancialData: FinancialRecord[]) => {
    setFinancialDataState(newFinancialData);
    // Always store in USD
    localStorage.setItem('bizview-financials', JSON.stringify(newFinancialData));
  };

  const setAppointments = (newAppointments: Appointment[]) => {
    setAppointmentsState(newAppointments);
    localStorage.setItem('bizview-appointments', JSON.stringify(newAppointments));
  };
  
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('bizview-currency', newCurrency);
  }

  // Memoize the converted financial data to avoid recalculating on every render
  const convertedFinancialData = useMemo(() => {
    const rate = exchangeRates[currency];
    return financialData.map(record => ({
      ...record,
      amount: record.amount * rate,
    }));
  }, [financialData, currency]);

  return (
    <DataContext.Provider
      value={{
        clients,
        setClients,
        financialData: convertedFinancialData,
        setFinancialData,
        appointments,
        setAppointments,
        currency,
        setCurrency,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
