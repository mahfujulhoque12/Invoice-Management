import { createBrowserRouter, Navigate } from 'react-router';
import { Landing } from './components/Landing';
import { DashboardLayout } from './components/DashboardLayout';
import { Overview } from './components/Overview';
import { CreateInvoice } from './components/CreateInvoice';
import { InvoiceList } from './components/InvoiceList';
import { Customers } from './components/Customers';
import { SettingsPage } from './components/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      { index: true, Component: Overview },
      { path: 'create', Component: CreateInvoice },
      { path: 'invoices', Component: InvoiceList },
      { path: 'clients', Component: Customers },
      { path: 'settings', Component: SettingsPage },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
