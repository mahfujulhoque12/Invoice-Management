// Global state management using a simple pub/sub pattern
import { useState, useEffect, useCallback } from 'react';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  total: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  recurring: boolean;
  recurringInterval?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  companyLogo?: string;
  pageWidth: number;
  pageHeight: number;
  pageUnit: 'px' | 'in';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  totalInvoices: number;
  totalPaid: number;
  totalOutstanding: number;
}

export const CURRENCIES: Record<string, { symbol: string; name: string }> = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  BDT: { symbol: '৳', name: 'Bangladeshi Taka' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
  KRW: { symbol: '₩', name: 'South Korean Won' },
  MXN: { symbol: 'Mex$', name: 'Mexican Peso' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar' },
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
  SEK: { symbol: 'kr', name: 'Swedish Krona' },
  TRY: { symbol: '₺', name: 'Turkish Lira' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham' },
  SAR: { symbol: '﷼', name: 'Saudi Riyal' },
};

const MOCK_INVOICES: Invoice[] = [
  {
    id: '1', number: 'INV-001', clientName: 'Acme Corp', clientEmail: 'billing@acme.com',
    clientAddress: '123 Business Ave, New York, NY', date: '2026-03-15', dueDate: '2026-04-15',
    items: [
      { id: '1', description: 'Web Development', quantity: 40, rate: 150, amount: 6000 },
      { id: '2', description: 'UI/UX Design', quantity: 20, rate: 120, amount: 2400 },
    ],
    notes: 'Thank you for your business!', currency: 'USD', status: 'paid',
    total: 9240, subtotal: 8400, tax: 840, taxRate: 10, recurring: false,
    pageWidth: 816, pageHeight: 1056, pageUnit: 'px',
  },
  {
    id: '2', number: 'INV-002', clientName: 'TechStart Inc', clientEmail: 'finance@techstart.io',
    clientAddress: '456 Innovation Blvd, San Francisco, CA', date: '2026-03-20', dueDate: '2026-04-20',
    items: [
      { id: '1', description: 'Mobile App Development', quantity: 60, rate: 175, amount: 10500 },
      { id: '2', description: 'QA Testing', quantity: 15, rate: 100, amount: 1500 },
    ],
    notes: 'Net 30 payment terms.', currency: 'USD', status: 'sent',
    total: 13200, subtotal: 12000, tax: 1200, taxRate: 10, recurring: true, recurringInterval: 'monthly',
    pageWidth: 816, pageHeight: 1056, pageUnit: 'px',
  },
  {
    id: '3', number: 'INV-003', clientName: 'Global Logistics', clientEmail: 'ap@globallog.com',
    clientAddress: '789 Harbor Dr, London, UK', date: '2026-02-28', dueDate: '2026-03-28',
    items: [
      { id: '1', description: 'Consulting Services', quantity: 10, rate: 250, amount: 2500 },
    ],
    notes: '', currency: 'GBP', status: 'overdue',
    total: 2750, subtotal: 2500, tax: 250, taxRate: 10, recurring: false,
    pageWidth: 816, pageHeight: 1056, pageUnit: 'px',
  },
  {
    id: '4', number: 'INV-004', clientName: 'DesignHub Co', clientEmail: 'pay@designhub.co',
    clientAddress: '321 Creative Way, Berlin, DE', date: '2026-03-25', dueDate: '2026-04-25',
    items: [
      { id: '1', description: 'Brand Identity Package', quantity: 1, rate: 5000, amount: 5000 },
      { id: '2', description: 'Marketing Collateral', quantity: 1, rate: 2000, amount: 2000 },
    ],
    notes: 'Includes 2 revision rounds.', currency: 'EUR', status: 'draft',
    total: 7700, subtotal: 7000, tax: 700, taxRate: 10, recurring: false,
    pageWidth: 816, pageHeight: 1056, pageUnit: 'px',
  },
  {
    id: '5', number: 'INV-005', clientName: 'Zenith Solutions', clientEmail: 'accounts@zenith.bd',
    clientAddress: '10 Gulshan Ave, Dhaka, BD', date: '2026-03-01', dueDate: '2026-04-01',
    items: [
      { id: '1', description: 'ERP Integration', quantity: 80, rate: 100, amount: 8000 },
    ],
    notes: 'Phase 1 delivery.', currency: 'BDT', status: 'paid',
    total: 8800, subtotal: 8000, tax: 800, taxRate: 10, recurring: true, recurringInterval: 'quarterly',
    pageWidth: 816, pageHeight: 1056, pageUnit: 'px',
  },
];

const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Acme Corp', email: 'billing@acme.com', address: '123 Business Ave, NY', totalInvoices: 12, totalPaid: 45000, totalOutstanding: 0 },
  { id: '2', name: 'TechStart Inc', email: 'finance@techstart.io', address: '456 Innovation Blvd, SF', totalInvoices: 8, totalPaid: 28000, totalOutstanding: 13200 },
  { id: '3', name: 'Global Logistics', email: 'ap@globallog.com', address: '789 Harbor Dr, London', totalInvoices: 5, totalPaid: 12500, totalOutstanding: 2750 },
  { id: '4', name: 'DesignHub Co', email: 'pay@designhub.co', address: '321 Creative Way, Berlin', totalInvoices: 3, totalPaid: 9000, totalOutstanding: 7700 },
  { id: '5', name: 'Zenith Solutions', email: 'accounts@zenith.bd', address: '10 Gulshan Ave, Dhaka', totalInvoices: 6, totalPaid: 32000, totalOutstanding: 0 },
];

let invoices = [...MOCK_INVOICES];
let customers = [...MOCK_CUSTOMERS];
let isAuthenticated = false;
const listeners = new Set<() => void>();

function notify() { listeners.forEach(l => l()); }

export function useStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick(t => t + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const login = useCallback(() => { isAuthenticated = true; notify(); }, []);
  const logout = useCallback(() => { isAuthenticated = false; notify(); }, []);
  const addInvoice = useCallback((inv: Invoice) => { invoices = [inv, ...invoices]; notify(); }, []);
  const updateInvoice = useCallback((inv: Invoice) => {
    invoices = invoices.map(i => i.id === inv.id ? inv : i); notify();
  }, []);
  const deleteInvoice = useCallback((id: string) => { invoices = invoices.filter(i => i.id !== id); notify(); }, []);

  return {
    invoices,
    customers,
    isAuthenticated,
    login,
    logout,
    addInvoice,
    updateInvoice,
    deleteInvoice,
  };
}

export function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }
