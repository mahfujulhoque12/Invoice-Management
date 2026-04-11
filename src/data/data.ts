export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "payment" | "reminder" | "info";
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Payment Received",
    message: "Acme Corp paid INV-001 ($9,240)",
    time: "2 hours ago",
    read: false,
    type: "payment",
  },
  {
    id: "2",
    title: "Invoice Overdue",
    message: "INV-003 for Global Logistics is overdue",
    time: "5 hours ago",
    read: false,
    type: "reminder",
  },
  {
    id: "3",
    title: "New Client Added",
    message: "DesignHub Co was added to your clients",
    time: "1 day ago",
    read: true,
    type: "info",
  },
  {
    id: "4",
    title: "Recurring Invoice Sent",
    message: "INV-002 auto-sent to TechStart Inc",
    time: "2 days ago",
    read: true,
    type: "reminder",
  },
];
