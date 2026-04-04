import { useStore } from '../lib/store';
import { GlassCard } from './GlassCard';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, Clock } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid,
} from 'recharts';

const monthlyRevenue = [
  { month: 'Aug', value: 12000 }, { month: 'Sep', value: 15000 }, { month: 'Oct', value: 18000 },
  { month: 'Nov', value: 22000 }, { month: 'Dec', value: 19000 }, { month: 'Jan', value: 28000 },
  { month: 'Feb', value: 24000 }, { month: 'Mar', value: 32000 },
];

const clientRevenue = [
  { name: 'Acme Corp', value: 45000 }, { name: 'TechStart', value: 28000 },
  { name: 'Zenith', value: 32000 }, { name: 'DesignHub', value: 9000 }, { name: 'Global Log', value: 12500 },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export function Analytics() {
  const { invoices, customers } = useStore();

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0);
  const avgInvoice = invoices.length ? Math.round(totalInvoiced / invoices.length) : 0;
  const collectionRate = totalInvoiced ? Math.round((totalRevenue / totalInvoiced) * 100) : 0;

  const statusData = [
    { name: 'Paid', value: invoices.filter(i => i.status === 'paid').length, color: '#10b981' },
    { name: 'Sent', value: invoices.filter(i => i.status === 'sent').length, color: '#3b82f6' },
    { name: 'Overdue', value: invoices.filter(i => i.status === 'overdue').length, color: '#ef4444' },
    { name: 'Draft', value: invoices.filter(i => i.status === 'draft').length, color: '#9ca3af' },
  ];

  const currencyData = Object.entries(
    invoices.reduce((acc, inv) => {
      acc[inv.currency] = (acc[inv.currency] || 0) + inv.total;
      return acc;
    }, {} as Record<string, number>)
  ).map(([currency, value], i) => ({ name: currency, value, color: COLORS[i % COLORS.length] }));

  const tooltipStyle = { background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 12, fontSize: 12 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-black" style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Analytics</h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>Track your business performance and insights.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+18.2%', up: true },
          { label: 'Avg Invoice', value: `$${avgInvoice.toLocaleString()}`, icon: FileText, trend: '+5.4%', up: true },
          { label: 'Collection Rate', value: `${collectionRate}%`, icon: TrendingUp, trend: '+3.1%', up: true },
          { label: 'Active Clients', value: customers.length.toString(), icon: Users, trend: '+2', up: true },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <kpi.icon className="w-5 h-5" />
                </div>
                <span className="text-emerald-500 flex items-center gap-0.5" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  <TrendingUp className="w-3 h-3" /> {kpi.trend}
                </span>
              </div>
              <p className="text-black" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kpi.value}</p>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.8rem' }}>{kpi.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-5">
        <GlassCard className="p-6">
          <h3 className="text-black mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Monthly Revenue</h3>
          <p className="text-gray-400 mb-4" style={{ fontSize: '0.8rem' }}>Last 8 months trend</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-black mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Revenue by Client</h3>
          <p className="text-gray-400 mb-4" style={{ fontSize: '0.8rem' }}>Top performing clients</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={clientRevenue}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {clientRevenue.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-3 gap-5">
        <GlassCard className="p-6">
          <h3 className="text-black mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Invoice Status</h3>
          <p className="text-gray-400 mb-2" style={{ fontSize: '0.8rem' }}>Current distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {statusData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-gray-500" style={{ fontSize: '0.75rem' }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-black mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Currency Split</h3>
          <p className="text-gray-400 mb-2" style={{ fontSize: '0.8rem' }}>By invoice currency</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={currencyData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {currencyData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {currencyData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-gray-500" style={{ fontSize: '0.75rem' }}>{d.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-black mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>Quick Stats</h3>
          <p className="text-gray-400 mb-4" style={{ fontSize: '0.8rem' }}>Key performance indicators</p>
          <div className="space-y-4">
            {[
              { label: 'Recurring Invoices', value: invoices.filter(i => i.recurring).length, total: invoices.length },
              { label: 'On-time Payments', value: invoices.filter(i => i.status === 'paid').length, total: invoices.length },
              { label: 'Client Retention', value: 4, total: 5 },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600" style={{ fontSize: '0.8rem' }}>{stat.label}</span>
                  <span className="text-black" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{stat.value}/{stat.total}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(stat.value / stat.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
