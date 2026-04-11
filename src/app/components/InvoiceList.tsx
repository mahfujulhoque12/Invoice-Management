import { useState } from "react";
import { useStore, CURRENCIES } from "../lib/store";
import { GlassCard } from "./GlassCard";
import { toast } from "sonner";
import {
  FileText,
  Search,
  MoreHorizontal,
  Send,
  Trash2,
  Eye,
  Download,
  RotateCcw,
  Bell,
  Mail,
  X,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { ViewInvoiceModal } from "./invoice/ViewInvoiceModal";

export function InvoiceList() {
  const { invoices, updateInvoice, deleteInvoice } = useStore();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [viewInvoice, setViewInvoice] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = invoices
    .filter((i) => filter === "all" || i.status === filter)
    .filter(
      (i) =>
        i.clientName.toLowerCase().includes(search.toLowerCase()) ||
        i.number.toLowerCase().includes(search.toLowerCase()),
    );

  const statusColors: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-600",
    sent: "bg-blue-50 text-blue-600",
    overdue: "bg-red-50 text-red-600",
    draft: "bg-gray-100 text-gray-500",
  };

  const selectedInvoice = invoices.find((i) => i.id === viewInvoice);

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
            Invoices
          </h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: "0.875rem" }}>
            {invoices.length} total invoices
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-gray-200/80 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all duration-300"
            style={{ fontSize: "0.82rem" }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-full bg-gray-100/80 backdrop-blur-sm border border-gray-200/50">
          {["all", "draft", "sent", "paid", "overdue"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="relative px-4 py-1.5 rounded-full transition-all duration-300"
              style={{
                fontSize: "0.78rem",
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            >
              {filter === s && (
                <motion.div
                  layoutId="invoice-filter-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-200/60"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span
                className={`relative z-10 ${filter === s ? "text-emerald-600" : "text-gray-500"}`}
              >
                {s}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((inv) => {
          const sym = CURRENCIES[inv.currency]?.symbol || "$";
          return (
            <GlassCard
              key={inv.id}
              className="p-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-black"
                        style={{ fontSize: "0.95rem", fontWeight: 600 }}
                      >
                        {inv.number}
                      </span>
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-lg ${statusColors[inv.status]}`}
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {inv.status}
                      </span>
                      {inv.recurring && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-600"
                          style={{ fontSize: "0.7rem", fontWeight: 500 }}
                        >
                          <RotateCcw className="w-3 h-3" />{" "}
                          {inv.recurringInterval}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-gray-500 mt-0.5"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {inv.clientName} · {inv.clientEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p
                      className="text-black"
                      style={{ fontSize: "1.1rem", fontWeight: 700 }}
                    >
                      {sym}
                      {inv.total.toLocaleString()}
                    </p>
                    <p
                      className="text-gray-400"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Due: {inv.dueDate || "N/A"}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuOpen(menuOpen === inv.id ? null : inv.id)
                      }
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                    {menuOpen === inv.id && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-white backdrop-blur-2xl border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] rounded-xl z-[60] p-1.5">
                        <button
                          onClick={() => {
                            setViewInvoice(inv.id);
                            setMenuOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50/60 transition-colors text-left"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <Eye className="w-4 h-4" /> View Invoice
                        </button>
                        <button
                          onClick={() => {
                            toast.success(`Invoice ${inv.number} sent!`);
                            setMenuOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50/60 transition-colors text-left"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <Send className="w-3.5 h-3.5" /> Send via Email
                        </button>
                        <button
                          onClick={() => {
                            toast.success("Reminder sent!");
                            setMenuOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50/60 transition-colors text-left"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <Bell className="w-3.5 h-3.5" /> Send Reminder
                        </button>
                        {inv.status !== "paid" && (
                          <button
                            onClick={() => {
                              updateInvoice({ ...inv, status: "paid" });
                              toast.success("Marked as paid!");
                              setMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-emerald-600 hover:bg-emerald-50/60 transition-colors text-left"
                            style={{ fontSize: "0.8rem" }}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => {
                            toast("Invoice downloaded!");
                            setMenuOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50/60 transition-colors text-left"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <Download className="w-3.5 h-3.5" /> Download PDF
                        </button>
                        <button
                          onClick={() => {
                            deleteInvoice(inv.id);
                            toast.success("Invoice deleted!");
                            setMenuOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50/60 transition-colors text-left"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p style={{ fontSize: "0.9rem" }}>No invoices found</p>
          </div>
        )}
      </div>

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <ViewInvoiceModal
          selectedInvoice={selectedInvoice}
          statusColors={statusColors}
          onClose={() => setViewInvoice(null)}
        />
      )}
    </div>
  );
}
