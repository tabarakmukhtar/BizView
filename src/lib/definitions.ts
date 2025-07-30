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
  amount: number;
  type: 'revenue' | 'expense';
  category: string;
};

export type Appointment = {
  id: string;
  time: string;
  title: string;
  description: string;
};
