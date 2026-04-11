import { useState, useRef, useEffect } from "react";
import {
  useStore,
  CURRENCIES,
  generateId,
  type Invoice,
  type InvoiceItem,
} from "../lib/store";
import { useNavigate } from "react-router";
import { GlassCard } from "./GlassCard";
import { toast } from "sonner";
import { Save, Send, Settings2 } from "lucide-react";

import { PageSettings } from "./create-invoice/PageSettings";
import { SendInvoiceModal } from "./create-invoice/SendInvoiceModal";
import { InvoicePreview } from "./create-invoice/InvoicePreview";
import { InvoiceDetails } from "./create-invoice/InvoiceDetails";
import { ClientDetails } from "./create-invoice/ClientDetails";
import { LineItems } from "./create-invoice/LineItems";

const defaultItem = (): InvoiceItem => ({
  id: generateId(),
  description: "",
  quantity: 1,
  rate: 0,
  amount: 0,
});

/* ─── Main Component ─── */
export function CreateInvoice() {
  const { addInvoice, invoices } = useStore();
  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([defaultItem()]);
  const [notes, setNotes] = useState("Thank you for your business!");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState(10);
  const [recurring, setRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<
    "weekly" | "monthly" | "quarterly" | "yearly"
  >("monthly");

  const [pageWidth, setPageWidth] = useState(816);
  const [pageHeight, setPageHeight] = useState(1056);
  const [pageUnit, setPageUnit] = useState<"px" | "in">("px");
  const [showSettings, setShowSettings] = useState(false);
  const [sendEmail, setSendEmail] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const currencyRef = useRef<HTMLDivElement>(null);
  const currencyBtnRef = useRef<HTMLButtonElement>(null);
  const [currencyPos, setCurrencyPos] = useState({ top: 0, left: 0 });

  const invoiceNumber = `INV-${String(invoices.length + 1).padStart(3, "0")}`;
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  const sym = CURRENCIES[currency]?.symbol || "$";

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.amount = updated.quantity * updated.rate;
        return updated;
      }),
    );
  };

  const handleSave = (status: "draft" | "sent") => {
    if (!clientName) {
      toast.error("Please enter client name");
      return;
    }
    const inv: Invoice = {
      id: generateId(),
      number: invoiceNumber,
      clientName,
      clientEmail,
      clientAddress,
      date,
      dueDate,
      items,
      notes,
      currency,
      status,
      total,
      subtotal,
      tax,
      taxRate,
      recurring,
      recurringInterval: recurring ? recurringInterval : undefined,
      pageWidth,
      pageHeight,
      pageUnit,
    };
    addInvoice(inv);
    toast.success(
      status === "draft"
        ? "Invoice saved as draft!"
        : "Invoice created & sent!",
    );
    navigate("/dashboard/invoices");
  };

  const handleSendEmail = () => {
    toast.success(`Invoice sent to ${sendEmail || clientEmail}!`);
    setShowSendModal(false);
    handleSave("sent");
  };

  const displayWidth = pageUnit === "in" ? pageWidth * 96 : pageWidth;
  const displayHeight = pageUnit === "in" ? pageHeight * 96 : pageHeight;
  const previewScale = Math.min(1, 500 / displayWidth);

  // Calculate currency dropdown position when opening
  const openCurrencyDropdown = () => {
    if (currencyBtnRef.current) {
      const rect = currencyBtnRef.current.getBoundingClientRect();
      setCurrencyPos({ top: rect.bottom + 6, left: rect.left });
    }
    setCurrencyOpen((prev) => !prev);
  };

  // Close currency dropdown on outside click
  useEffect(() => {
    if (!currencyOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        currencyRef.current &&
        !currencyRef.current.contains(e.target as Node)
      ) {
        // Also check if click is inside the portal dropdown
        const portal = document.getElementById("currency-portal-dropdown");
        if (portal && portal.contains(e.target as Node)) return;
        setCurrencyOpen(false);
        setCurrencySearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [currencyOpen]);

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
            Create Invoice
          </h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: "0.875rem" }}>
            Fill in the details with live preview on the right.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            <Settings2 className="w-4 h-4" /> Page Settings
          </button>
          <button
            onClick={() => handleSave("draft")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            <Send className="w-4 h-4" /> Send Invoice
          </button>
        </div>
      </div>

      {/* Page Settings Panel */}
      <PageSettings
        showSettings={showSettings}
        pageWidth={pageWidth}
        pageHeight={pageHeight}
        pageUnit={pageUnit}
        setPageWidth={setPageWidth}
        setPageHeight={setPageHeight}
        setPageUnit={setPageUnit}
      />

      <div className="grid grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-5">
          <ClientDetails
            clientName={clientName}
            setClientName={setClientName}
            clientEmail={clientEmail}
            setClientEmail={setClientEmail}
            clientAddress={clientAddress}
            setClientAddress={setClientAddress}
          />

          <GlassCard className="p-5 space-y-4">
            <InvoiceDetails
              date={date}
              setDate={setDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
              currency={currency}
              setCurrency={setCurrency}
              currencyOpen={currencyOpen}
              setCurrencyOpen={setCurrencyOpen}
              currencySearch={currencySearch}
              setCurrencySearch={setCurrencySearch}
              currencyRef={currencyRef}
              currencyBtnRef={currencyBtnRef}
              currencyPos={currencyPos}
              openCurrencyDropdown={openCurrencyDropdown}
              taxRate={taxRate}
              setTaxRate={setTaxRate}
              recurring={recurring}
              setRecurring={setRecurring}
              recurringInterval={recurringInterval}
              setRecurringInterval={setRecurringInterval}
            />
          </GlassCard>

          <LineItems
            items={items}
            setItems={setItems}
            updateItem={updateItem}
            defaultItem={defaultItem}
            sym={sym}
          />

          <GlassCard className="p-5">
            <label
              className="text-gray-500 block mb-1"
              style={{ fontSize: "0.75rem" }}
            >
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 resize-none transition-colors"
              style={{ fontSize: "0.85rem" }}
            />
          </GlassCard>
        </div>

        {/* Live Preview */}
        <InvoicePreview
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          pageUnit={pageUnit}
          displayWidth={displayWidth}
          displayHeight={displayHeight}
          previewScale={previewScale}
          invoiceNumber={invoiceNumber}
          date={date}
          dueDate={dueDate}
          clientName={clientName}
          clientEmail={clientEmail}
          clientAddress={clientAddress}
          items={items}
          subtotal={subtotal}
          tax={tax}
          total={total}
          taxRate={taxRate}
          currency={currency}
          sym={sym}
          notes={notes}
          recurring={recurring}
          recurringInterval={recurringInterval}
        />
      </div>

      {/* Send Modal */}
      <SendInvoiceModal
        show={showSendModal}
        onClose={() => setShowSendModal(false)}
        invoiceNumber={invoiceNumber}
        sendEmail={sendEmail}
        clientEmail={clientEmail}
        setSendEmail={setSendEmail}
        onSend={handleSendEmail}
      />
    </div>
  );
}
