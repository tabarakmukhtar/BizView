export type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive';
  lastContact: string;
};

export type FinancialRecord = {
  id: string;
  date: string;
  description: string;
  amount: number; // This will always be in the base currency (e.g., USD) in the raw data
  type: 'revenue' | 'expense';
  category: string;
};

export type Appointment = {
  id: string;
  time: string;
  title: string;
  description: string;
  clientId?: string; // Optional: Link appointment to a client
  clientName?: string; // Optional: For easy display
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}
