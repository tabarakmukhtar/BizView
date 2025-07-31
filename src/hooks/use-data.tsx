
'use client';

import type { Client, FinancialRecord, Appointment, Notification } from "@/lib/definitions";
import { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from 'react';
import { useIsClient } from './use-is-client';

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
   // Previous month's data for comparison
  { id: 'txn8', date: '2024-05-20', description: 'Consulting Services', amount: 4000, type: 'revenue', category: 'Consulting' },
  { id: 'txn9', date: '2024-05-15', description: 'Cloud Services', amount: 250, type: 'expense', category: 'Utilities' },
  { id: 'txn10', date: '2024-05-10', description: 'Marketing Ad Spend', amount: 1000, type: 'expense', category: 'Marketing' },
  { id: 'txn11', date: '2024-05-05', description: 'E-commerce Site Build', amount: 12000, type: 'revenue', category: 'Web Development' },
];

const initialAppointments: Appointment[] = [
  { id: '1', time: '10:00', title: 'Project Kickoff with Acme Inc.', description: 'Discussing the new marketing campaign strategy.', clientId: '2', clientName: 'Bob Smith' },
  { id: '2', time: '13:00', title: 'Team Sync-up', description: 'Weekly check-in on project progress and blockers.' },
  { id: '3', time: '15:30', title: 'Interview with Candidate', description: 'Senior Frontend Developer position.' },
];

const initialNotifications: Notification[] = [
    {id: '1', title: 'Welcome to BizView!', description: 'Explore the dashboard to manage your business.', createdAt: new Date()},
]

type Currency = 'USD' | 'EUR' | 'INR';

const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93, // 1 USD = 0.93 EUR
  INR: 83.45, // 1 USD = 83.45 INR
};

interface Summary {
  revenue: number;
  expenses: number;
  profit: number;
  clients: number;
}

interface DataContextType {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  financialData: FinancialRecord[];
  setFinancialData: (data: FinancialRecord[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  loading: boolean;
  summary: Summary;
  previousSummary: Summary;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClientsState] = useState<Client[]>([]);
  const [financialData, setFinancialDataState] = useState<FinancialRecord[]>([]);
  const [appointments, setAppointmentsState] = useState<Appointment[]>([]);
  const [notifications, setNotificationsState] = useState<Notification[]>([]);
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [loading, setLoading] = useState(true);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      try {
        const storedClients = localStorage.getItem('bizview-clients');
        setClientsState(storedClients ? JSON.parse(storedClients) : initialClients);

        const storedFinancials = localStorage.getItem('bizview-financials');
        setFinancialDataState(storedFinancials ? JSON.parse(storedFinancials) : initialFinancialData);

        const storedAppointments = localStorage.getItem('bizview-appointments');
        setAppointmentsState(storedAppointments ? JSON.parse(storedAppointments) : initialAppointments);

        const storedNotifications = localStorage.getItem('bizview-notifications');
        const parsedNotifications = storedNotifications ? JSON.parse(storedNotifications, (key, value) => {
            if (key === 'createdAt') return new Date(value);
            return value;
        }) : initialNotifications;
        setNotificationsState(parsedNotifications);
        
        const storedCurrency = localStorage.getItem('bizview-currency');
        setCurrencyState((storedCurrency as Currency) || 'USD');

      } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        setClientsState(initialClients);
        setFinancialDataState(initialFinancialData);
        setAppointmentsState(initialAppointments);
        setNotificationsState(initialNotifications);
        setCurrencyState('USD');
      } finally {
        setLoading(false);
      }
    }
  }, [isClient]);

  const setClients = (newClients: Client[]) => {
    setClientsState(newClients);
    if(isClient) localStorage.setItem('bizview-clients', JSON.stringify(newClients));
  };

  const setFinancialData = (newFinancialData: FinancialRecord[]) => {
    setFinancialDataState(newFinancialData);
    if(isClient) localStorage.setItem('bizview-financials', JSON.stringify(newFinancialData));
  };

  const setAppointments = (newAppointments: Appointment[]) => {
    setAppointmentsState(newAppointments);
    if(isClient) localStorage.setItem('bizview-appointments', JSON.stringify(newAppointments));
  };

  const setNotifications = (newNotifications: Notification[]) => {
      setNotificationsState(newNotifications);
      if(isClient) localStorage.setItem('bizview-notifications', JSON.stringify(newNotifications));
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
      const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          createdAt: new Date(),
      };
      const updatedNotifications = [newNotification, ...notifications].slice(0, 10); // Keep last 10
      setNotifications(updatedNotifications);
  }
  
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    if(isClient) localStorage.setItem('bizview-currency', newCurrency);
  }

  const convertedFinancialData = useMemo(() => {
    if (!isClient) return [];
    const rate = exchangeRates[currency];
    return financialData.map(record => ({
      ...record,
      amount: record.amount * rate,
    }));
  }, [financialData, currency, isClient]);

  const getSummaryForPeriod = (data: FinancialRecord[], clientData: Client[], startDate: Date, endDate: Date): Summary => {
    const periodData = data.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate < endDate;
    });

    const revenue = periodData.filter(r => r.type === 'revenue').reduce((acc, r) => acc + r.amount, 0);
    const expenses = periodData.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
    const profit = revenue - expenses;
    const activeClients = clientData.filter(c => c.status === 'active').length; // This is a snapshot, not period-specific

    return { revenue, expenses, profit, clients: activeClients };
  }

  const { summary, previousSummary } = useMemo(() => {
    if (!isClient) {
      const emptySummary = { revenue: 0, expenses: 0, profit: 0, clients: 0 };
      return { summary: emptySummary, previousSummary: emptySummary };
    }

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const currentData = getSummaryForPeriod(financialData, clients, currentMonthStart, nextMonthStart);
    const previousData = getSummaryForPeriod(financialData, clients, previousMonthStart, currentMonthStart);
    
    return { summary: currentData, previousSummary: previousData };
  }, [financialData, clients, isClient]);


  return (
    <DataContext.Provider
      value={{
        clients,
        setClients,
        financialData: convertedFinancialData,
        setFinancialData,
        appointments,
        setAppointments,
        notifications,
        addNotification,
        currency,
        setCurrency,
        loading,
        summary,
        previousSummary
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
