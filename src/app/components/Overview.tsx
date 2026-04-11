import { useStore, CURRENCIES } from "../lib/store";
import { GlassCard } from "./GlassCard";
import { useNavigate } from "react-router";
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  RotateCcw,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "motion/react";

const MONTHS_DATA = [
  { month: "Oct", revenue: 18000 },
  { month: "Nov", revenue: 22000 },
  { month: "Dec", revenue: 19000 },
  { month: "Jan", revenue: 28000 },
  { month: "Feb", revenue: 24000 },
  { month: "Mar", revenue: 32000 },
];

export function Overview() {
  const { invoices } = useStore();
  const navigate = useNavigate();

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.total, 0);
  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + i.total, 0);
  const overdue = invoices
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + i.total, 0);
  const recurring = invoices.filter((i) => i.recurring).length;

  const statusData = [
    {
      name: "Paid",
      value: invoices.filter((i) => i.status === "paid").length,
      color: "#10b981",
    },
    {
      name: "Sent",
      value: invoices.filter((i) => i.status === "sent").length,
      color: "#3b82f6",
    },
    {
      name: "Overdue",
      value: invoices.filter((i) => i.status === "overdue").length,
      color: "#ef4444",
    },
    {
      name: "Draft",
      value: invoices.filter((i) => i.status === "draft").length,
      color: "#9ca3af",
    },
  ];

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+12.5%",
      up: true,
      color: "emerald",
      link: "/dashboard/invoices",
    },
    {
      label: "Outstanding",
      value: `$${outstanding.toLocaleString()}`,
      icon: TrendingUp,
      trend: "-4.2%",
      up: false,
      color: "blue",
      link: "/dashboard/invoices",
    },
    {
      label: "Overdue",
      value: `$${overdue.toLocaleString()}`,
      icon: AlertCircle,
      trend: "+2.1%",
      up: true,
      color: "red",
      link: "/dashboard/invoices",
    },
    {
      label: "Recurring",
      value: recurring.toString(),
      icon: RotateCcw,
      trend: "+1",
      up: true,
      color: "purple",
      link: "/dashboard/invoices",
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-black"
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: "0.875rem" }}>
            Welcome back, here's your business overview.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/create")}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          <PlusCircle className="w-4 h-4" /> New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard
              className="p-5 cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => navigate(s.link)}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[s.color]}`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <div
                  className={`flex items-center gap-0.5 ${s.up && s.color !== "red" ? "text-emerald-500" : "text-red-500"}`}
                  style={{ fontSize: "0.75rem", fontWeight: 500 }}
                >
                  {s.up ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {s.trend}
                </div>
              </div>
              <p
                className="text-black"
                style={{ fontSize: "1.5rem", fontWeight: 700 }}
              >
                {s.value}
              </p>
              <p
                className="text-gray-400 mt-0.5"
                style={{ fontSize: "0.8rem" }}
              >
                {s.label}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-5">
        <GlassCard className="col-span-2 p-6">
          <h3
            className="text-black mb-1"
            style={{ fontSize: "1rem", fontWeight: 600 }}
          >
            Revenue Trend
          </h3>
          <p className="text-gray-400 mb-4" style={{ fontSize: "0.8rem" }}>
            Last 6 months performance
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHS_DATA}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: 12,
                  fontSize: 13,
                }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#greenGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <h3
            className="text-black mb-1"
            style={{ fontSize: "1rem", fontWeight: 600 }}
          >
            Invoice Status
          </h3>
          <p className="text-gray-400 mb-2" style={{ fontSize: "0.8rem" }}>
            Distribution overview
          </p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {statusData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="text-gray-500" style={{ fontSize: "0.75rem" }}>
                  {d.name} ({d.value})
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Invoices */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-black"
            style={{ fontSize: "1rem", fontWeight: 600 }}
          >
            Recent Invoices
          </h3>
          <button
            onClick={() => navigate("/dashboard/invoices")}
            className="text-emerald-600 hover:text-emerald-700"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            View All →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Invoice", "Client", "Amount", "Status", "Date"].map((h) => (
                <th
                  key={h}
                  className="text-left text-gray-400 pb-3 px-1"
                  style={{ fontSize: "0.75rem", fontWeight: 500 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.slice(0, 5).map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => navigate("/dashboard/invoices")}
              >
                <td className="py-3 px-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-300" />
                    <span
                      className="text-black"
                      style={{ fontSize: "0.85rem", fontWeight: 500 }}
                    >
                      {inv.number}
                    </span>
                  </div>
                </td>
                <td
                  className="py-3 px-1 text-gray-600"
                  style={{ fontSize: "0.85rem" }}
                >
                  {inv.clientName}
                </td>
                <td
                  className="py-3 px-1 text-black"
                  style={{ fontSize: "0.85rem", fontWeight: 500 }}
                >
                  {CURRENCIES[inv.currency]?.symbol}
                  {inv.total.toLocaleString()}
                </td>
                <td className="py-3 px-1">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-lg ${
                      inv.status === "paid"
                        ? "bg-emerald-50 text-emerald-600"
                        : inv.status === "sent"
                          ? "bg-blue-50 text-blue-600"
                          : inv.status === "overdue"
                            ? "bg-red-50 text-red-600"
                            : "bg-gray-100 text-gray-500"
                    }`}
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {inv.status}
                  </span>
                </td>
                <td
                  className="py-3 px-1 text-gray-400"
                  style={{ fontSize: "0.8rem" }}
                >
                  {inv.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
