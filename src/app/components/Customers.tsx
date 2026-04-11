import { useState } from "react";
import { useStore } from "../lib/store";
import { useNavigate } from "react-router";
import { GlassCard } from "./GlassCard";
import { toast } from "sonner";
import {
  Users,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  AlertCircle,
  Send,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  X,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Customers() {
  const { customers } = useStore();
  const navigate = useNavigate();
  const totalPaid = customers.reduce((s, c) => s + c.totalPaid, 0);
  const totalOutstanding = customers.reduce(
    (s, c) => s + c.totalOutstanding,
    0,
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${newName} added as a new client!`);
    setShowAddCustomer(false);
    setNewName("");
    setNewEmail("");
    setNewAddress("");
    setNewPhone("");
  };

  return (
    <div className="space-y-6">
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
            Clients
          </h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: "0.875rem" }}>
            Manage your client relationships and track payments.
          </p>
        </div>
        <button
          onClick={() => setShowAddCustomer(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          <PlusCircle className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {[
          {
            label: "Total Clients",
            value: customers.length,
            icon: Users,
            color: "emerald",
            link: "",
          },
          {
            label: "Total Collected",
            value: `$${totalPaid.toLocaleString()}`,
            icon: DollarSign,
            color: "blue",
            link: "",
          },
          {
            label: "Total Outstanding",
            value: `$${totalOutstanding.toLocaleString()}`,
            icon: AlertCircle,
            color: "amber",
            link: "/dashboard/invoices",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard
              className={`p-5 ${s.link ? "cursor-pointer hover:shadow-lg" : ""} transition-all duration-300`}
              onClick={s.link ? () => navigate(s.link) : undefined}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color === "emerald" ? "bg-emerald-50 text-emerald-600" : s.color === "blue" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <p
                className="text-black"
                style={{ fontSize: "1.5rem", fontWeight: 700 }}
              >
                {s.value}
              </p>
              <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>
                {s.label}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {customers.map((customer) => {
          const isExpanded = expandedId === customer.id;
          return (
            <GlassCard key={customer.id} className="overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                className="w-full p-5 text-left hover:bg-white/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <span
                        className="text-white"
                        style={{ fontSize: "0.9rem", fontWeight: 600 }}
                      >
                        {customer.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p
                        className="text-black"
                        style={{ fontSize: "0.95rem", fontWeight: 600 }}
                      >
                        {customer.name}
                      </p>
                      <div
                        className="flex items-center gap-3 mt-1 text-gray-400"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {customer.address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p
                        className="text-black"
                        style={{ fontSize: "1rem", fontWeight: 600 }}
                      >
                        {customer.totalInvoices}
                      </p>
                      <p
                        className="text-gray-400"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Invoices
                      </p>
                    </div>
                    <div className="text-center">
                      <p
                        className="text-emerald-600"
                        style={{ fontSize: "1rem", fontWeight: 600 }}
                      >
                        ${customer.totalPaid.toLocaleString()}
                      </p>
                      <p
                        className="text-gray-400"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Paid
                      </p>
                    </div>
                    <div className="text-center">
                      <p
                        className={`${customer.totalOutstanding > 0 ? "text-amber-600" : "text-gray-400"}`}
                        style={{ fontSize: "1rem", fontWeight: 600 }}
                      >
                        ${customer.totalOutstanding.toLocaleString()}
                      </p>
                      <p
                        className="text-gray-400"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Outstanding
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => navigate("/dashboard/create")}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                          style={{ fontSize: "0.8rem", fontWeight: 500 }}
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Create Invoice
                        </button>
                        <button
                          onClick={() => {
                            toast.success(`Email sent to ${customer.email}`);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                          style={{ fontSize: "0.8rem", fontWeight: 500 }}
                        >
                          <Send className="w-3.5 h-3.5" /> Send Email
                        </button>
                        <button
                          onClick={() => navigate("/dashboard/invoices")}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                          style={{ fontSize: "0.8rem", fontWeight: 500 }}
                        >
                          <FileText className="w-3.5 h-3.5" /> View Invoices
                        </button>
                        {customer.totalOutstanding > 0 && (
                          <button
                            onClick={() =>
                              toast.success(
                                `Payment reminder sent to ${customer.email}`,
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
                            style={{ fontSize: "0.8rem", fontWeight: 500 }}
                          >
                            <AlertCircle className="w-3.5 h-3.5" /> Send
                            Reminder
                          </button>
                        )}
                      </div>
                      {/* Mini payment progress */}
                      <div className="mt-4">
                        <div className="flex justify-between mb-1.5">
                          <span
                            className="text-gray-500"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Payment Progress
                          </span>
                          <span
                            className="text-gray-700"
                            style={{ fontSize: "0.75rem", fontWeight: 600 }}
                          >
                            {customer.totalPaid + customer.totalOutstanding > 0
                              ? Math.round(
                                  (customer.totalPaid /
                                    (customer.totalPaid +
                                      customer.totalOutstanding)) *
                                    100,
                                )
                              : 100}
                            %
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                customer.totalPaid + customer.totalOutstanding >
                                0
                                  ? (customer.totalPaid /
                                      (customer.totalPaid +
                                        customer.totalOutstanding)) *
                                    100
                                  : 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          );
        })}
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddCustomer && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setShowAddCustomer(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-7 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddCustomer(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
              <h3
                className="text-black mb-1"
                style={{ fontSize: "1.2rem", fontWeight: 600 }}
              >
                Add New Client
              </h3>
              <p className="text-gray-500 mb-5" style={{ fontSize: "0.85rem" }}>
                Enter client details to create a new client profile.
              </p>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label
                    className="text-gray-500 block mb-1"
                    style={{ fontSize: "0.75rem", fontWeight: 500 }}
                  >
                    Full Name *
                  </label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Company or person name"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label
                    className="text-gray-500 block mb-1"
                    style={{ fontSize: "0.75rem", fontWeight: 500 }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="client@company.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label
                    className="text-gray-500 block mb-1"
                    style={{ fontSize: "0.75rem", fontWeight: 500 }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label
                    className="text-gray-500 block mb-1"
                    style={{ fontSize: "0.75rem", fontWeight: 500 }}
                  >
                    Address
                  </label>
                  <input
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Full address"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    style={{ fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                    style={{ fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Add Client
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
