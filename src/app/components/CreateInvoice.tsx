import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore, CURRENCIES, generateId, type Invoice, type InvoiceItem } from '../lib/store';
import { useNavigate } from 'react-router';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';
import {
  Plus, Trash2, Upload, Eye, Save, Send, RotateCcw, Settings2,
  FileText, X, ChevronLeft, ChevronRight, Calendar, Minus,
  ChevronUp, ChevronDown, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const defaultItem = (): InvoiceItem => ({
  id: generateId(), description: '', quantity: 1, rate: 0, amount: 0,
});

/* ─── Modern Number Stepper ─── */
function NumberStepper({
  value, onChange, min = 0, max = 999999, step = 1, prefix = '', suffix = '', label
}: {
  value: number; onChange: (v: number) => void; min?: number; max?: number;
  step?: number; prefix?: string; suffix?: string; label?: string;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  return (
    <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 overflow-hidden h-[38px] group hover:border-emerald-300 focus-within:border-emerald-400 transition-colors">
      <div className="flex-1 flex items-center px-3 min-w-0">
        {prefix && <span className="text-gray-400 mr-0.5 shrink-0" style={{ fontSize: '0.8rem' }}>{prefix}</span>}
        <input
          type="text"
          value={value}
          onChange={e => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) onChange(clamp(num));
            else if (e.target.value === '') onChange(min);
          }}
          className="w-full bg-transparent outline-none text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ fontSize: '0.82rem', fontWeight: 500 }}
        />
        {suffix && <span className="text-gray-400 ml-0.5 shrink-0" style={{ fontSize: '0.7rem' }}>{suffix}</span>}
      </div>
      <div className="flex flex-col border-l border-gray-200 h-full shrink-0 w-6">
        <button
          type="button"
          onClick={() => onChange(clamp(value + step))}
          className="flex-1 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:bg-emerald-100"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
        <div className="h-px bg-gray-200" />
        <button
          type="button"
          onClick={() => onChange(clamp(value - step))}
          className="flex-1 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:bg-emerald-100"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

/* ─── Custom Calendar Picker ─── */
function CalendarPicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value + 'T00:00:00') : null;
  const [viewDate, setViewDate] = useState(() => selected || new Date());

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const selectDay = (day: number) => {
    const m = String(viewDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${viewDate.getFullYear()}-${m}-${d}`);
    setOpen(false);
  };

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const formatDisplay = (v: string) => {
    if (!v) return '';
    const d = new Date(v + 'T00:00:00');
    return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen(!open); if (!open && selected) setViewDate(new Date(selected)); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-colors text-left"
      >
        <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className={`flex-1 ${value ? 'text-gray-800' : 'text-gray-400'}`} style={{ fontSize: '0.85rem', fontWeight: value ? 500 : 400 }}>
          {value ? formatDisplay(value) : `Select ${label.toLowerCase()}`}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-0 top-[calc(100%+6px)] z-[60] w-[280px] bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] rounded-2xl p-4"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <span className="text-gray-800" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button type="button" onClick={nextMonth} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0 mb-1">
              {DAYS.map(d => (
                <div key={d} className="h-8 flex items-center justify-center text-gray-400" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="h-8" />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const m = String(viewDate.getMonth() + 1).padStart(2, '0');
                const d = String(day).padStart(2, '0');
                const dateStr = `${viewDate.getFullYear()}-${m}-${d}`;
                const isSelected = dateStr === value;
                const isToday = dateStr === todayStr;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={`h-8 w-8 mx-auto rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                        : isToday
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={{ fontSize: '0.78rem', fontWeight: isSelected || isToday ? 600 : 400 }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Quick actions */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { onChange(todayStr); setOpen(false); }}
                className="flex-1 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                style={{ fontSize: '0.72rem', fontWeight: 500 }}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); }}
                className="flex-1 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all"
                style={{ fontSize: '0.72rem', fontWeight: 500 }}
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Component ─── */
export function CreateInvoice() {
  const { addInvoice, invoices } = useStore();
  const navigate = useNavigate();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([defaultItem()]);
  const [notes, setNotes] = useState('Thank you for your business!');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(10);
  const [recurring, setRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [companyLogo, setCompanyLogo] = useState<string | undefined>();
  const [pageWidth, setPageWidth] = useState(816);
  const [pageHeight, setPageHeight] = useState(1056);
  const [pageUnit, setPageUnit] = useState<'px' | 'in'>('px');
  const [showSettings, setShowSettings] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const currencyRef = useRef<HTMLDivElement>(null);
  const currencyBtnRef = useRef<HTMLButtonElement>(null);
  const [currencyPos, setCurrencyPos] = useState({ top: 0, left: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const invoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  const sym = CURRENCIES[currency]?.symbol || '$';

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      updated.amount = updated.quantity * updated.rate;
      return updated;
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setCompanyLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (status: 'draft' | 'sent') => {
    if (!clientName) { toast.error('Please enter client name'); return; }
    const inv: Invoice = {
      id: generateId(), number: invoiceNumber, clientName, clientEmail, clientAddress,
      date, dueDate, items, notes, currency, status, total, subtotal, tax, taxRate,
      recurring, recurringInterval: recurring ? recurringInterval : undefined,
      companyLogo, pageWidth, pageHeight, pageUnit,
    };
    addInvoice(inv);
    toast.success(status === 'draft' ? 'Invoice saved as draft!' : 'Invoice created & sent!');
    navigate('/dashboard/invoices');
  };

  const handleSendEmail = () => {
    toast.success(`Invoice sent to ${sendEmail || clientEmail}!`);
    setShowSendModal(false);
    handleSave('sent');
  };

  const displayWidth = pageUnit === 'in' ? pageWidth * 96 : pageWidth;
  const displayHeight = pageUnit === 'in' ? pageHeight * 96 : pageHeight;
  const previewScale = Math.min(1, 500 / displayWidth);

  // Calculate currency dropdown position when opening
  const openCurrencyDropdown = () => {
    if (currencyBtnRef.current) {
      const rect = currencyBtnRef.current.getBoundingClientRect();
      setCurrencyPos({ top: rect.bottom + 6, left: rect.left });
    }
    setCurrencyOpen(prev => !prev);
  };

  // Close currency dropdown on outside click
  useEffect(() => {
    if (!currencyOpen) return;
    const handler = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        // Also check if click is inside the portal dropdown
        const portal = document.getElementById('currency-portal-dropdown');
        if (portal && portal.contains(e.target as Node)) return;
        setCurrencyOpen(false);
        setCurrencySearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [currencyOpen]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-black" style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Create Invoice</h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>Fill in the details with live preview on the right.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            style={{ fontSize: '0.8rem', fontWeight: 500 }}>
            <Settings2 className="w-4 h-4" /> Page Settings
          </button>
          <button onClick={() => handleSave('draft')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all"
            style={{ fontSize: '0.8rem', fontWeight: 500 }}>
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button onClick={() => setShowSendModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            style={{ fontSize: '0.8rem', fontWeight: 500 }}>
            <Send className="w-4 h-4" /> Send Invoice
          </button>
        </div>
      </div>

      {/* Page Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <GlassCard className="p-5">
              <h4 className="text-black mb-4" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Page Dimensions & Layout</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-gray-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>Width</label>
                  <NumberStepper value={pageWidth} onChange={setPageWidth} min={200} max={2000} step={pageUnit === 'in' ? 0.5 : 10} suffix={pageUnit} />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>Height</label>
                  <NumberStepper value={pageHeight} onChange={setPageHeight} min={200} max={3000} step={pageUnit === 'in' ? 0.5 : 10} suffix={pageUnit} />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>Unit</label>
                  <div className="flex gap-1 p-1 rounded-xl bg-gray-50 border border-gray-200 h-[42px]">
                    {(['px', 'in'] as const).map(u => (
                      <button key={u} onClick={() => setPageUnit(u)}
                        className={`flex-1 rounded-lg transition-all duration-300 ${pageUnit === u ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                        style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        {u === 'px' ? 'Pixels' : 'Inches'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>Company Logo</label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full h-[42px] rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-all flex items-center gap-2 justify-center"
                    style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                    <Upload className="w-3.5 h-3.5" /> {companyLogo ? 'Change Logo' : 'Upload Logo'}
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-5">
          <GlassCard className="p-5 space-y-4">
            <h4 className="text-black" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Client Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Client Name *</label>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Company or person"
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 transition-colors" style={{ fontSize: '0.85rem' }} />
              </div>
              <div>
                <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Email</label>
                <input value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@email.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 transition-colors" style={{ fontSize: '0.85rem' }} />
              </div>
            </div>
            <div>
              <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Address</label>
              <input value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="Full address"
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 transition-colors" style={{ fontSize: '0.85rem' }} />
            </div>
          </GlassCard>

          <GlassCard className="p-5 space-y-4">
            <h4 className="text-black" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Invoice Details</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Invoice Date</label>
                <CalendarPicker value={date} onChange={setDate} label="Invoice Date" />
              </div>
              <div>
                <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Due Date</label>
                <CalendarPicker value={dueDate} onChange={setDueDate} label="Due Date" />
              </div>
              <div ref={currencyRef} className="relative">
                <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Currency</label>
                <button
                  type="button"
                  ref={currencyBtnRef}
                  onClick={openCurrencyDropdown}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-colors text-left"
                >
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {CURRENCIES[currency]?.symbol || '$'}
                  </span>
                  <span className="flex-1 text-gray-800" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{currency}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${currencyOpen ? 'rotate-180' : ''}`} />
                </button>
                {currencyOpen && createPortal(
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                      className="fixed z-[9999] w-[260px] bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden"
                      style={{ top: currencyPos.top, left: currencyPos.left }}
                      id="currency-portal-dropdown"
                    >
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            autoFocus
                            value={currencySearch}
                            onChange={e => setCurrencySearch(e.target.value)}
                            placeholder="Search currency..."
                            className="w-full pl-8 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 outline-none focus:border-emerald-300 transition-colors"
                            style={{ fontSize: '0.78rem' }}
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto trendy-scroll p-1">
                        {Object.entries(CURRENCIES)
                          .filter(([code, { name }]) =>
                            code.toLowerCase().includes(currencySearch.toLowerCase()) ||
                            name.toLowerCase().includes(currencySearch.toLowerCase())
                          )
                          .map(([code, { name, symbol }]) => (
                            <button
                              key={code}
                              type="button"
                              onClick={() => {
                                setCurrency(code);
                                setCurrencyOpen(false);
                                setCurrencySearch('');
                              }}
                              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 ${
                                currency === code ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                                currency === code ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                              }`} style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                                {symbol}
                              </span>
                              <div className="min-w-0">
                                <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{code}</span>
                                <span className="text-gray-400 ml-1.5" style={{ fontSize: '0.7rem' }}>{name}</span>
                              </div>
                            </button>
                          ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>,
                  document.body
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>Tax Rate</label>
                <NumberStepper value={taxRate} onChange={setTaxRate} min={0} max={100} step={0.5} suffix="%" />
              </div>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 cursor-pointer py-2.5" onClick={() => setRecurring(!recurring)}>
                  <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${recurring ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${recurring ? 'translate-x-5' : ''}`} />
                  </div>
                  <span className="text-gray-600" style={{ fontSize: '0.85rem' }}>Recurring</span>
                </label>
                {recurring && (
                  <select value={recurringInterval} onChange={e => setRecurringInterval(e.target.value as any)}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 transition-colors" style={{ fontSize: '0.85rem' }}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-black" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Line Items</h4>
              <button onClick={() => setItems([...items, defaultItem()])}
                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-gray-400" style={{ fontSize: '0.7rem', fontWeight: 500 }}>
                <div className="col-span-4">Description</div>
                <div className="col-span-3">Qty</div>
                <div className="col-span-2">Rate</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-1"></div>
              </div>
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Service description" className="col-span-4 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 transition-colors" style={{ fontSize: '0.85rem' }} />
                  <div className="col-span-3">
                    <NumberStepper value={item.quantity} onChange={v => updateItem(item.id, 'quantity', v)} min={1} max={9999} step={1} />
                  </div>
                  <div className="col-span-2">
                    <NumberStepper value={item.rate} onChange={v => updateItem(item.id, 'rate', v)} min={0} step={5} prefix={sym} />
                  </div>
                  <div className="col-span-2 px-2 py-2 text-gray-700 flex items-center h-[42px]" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {sym}{item.amount.toLocaleString()}
                  </div>
                  <button onClick={() => setItems(items.filter(i => i.id !== item.id))} disabled={items.length === 1}
                    className="col-span-1 flex items-center justify-center text-gray-300 hover:text-red-500 disabled:opacity-30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 resize-none transition-colors" style={{ fontSize: '0.85rem' }} />
          </GlassCard>
        </div>

        {/* Live Preview */}
        <div className="sticky top-20">
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span className="text-black" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Live Preview</span>
              <span className="text-gray-400 ml-auto" style={{ fontSize: '0.7rem' }}>
                {pageWidth}{pageUnit} × {pageHeight}{pageUnit}
              </span>
            </div>
            <div className="flex justify-center overflow-auto rounded-xl bg-gray-100 p-4 trendy-scroll">
              <div
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                style={{ width: displayWidth * previewScale, minHeight: displayHeight * previewScale, transform: `scale(1)`, transformOrigin: 'top center' }}
              >
                <div className="p-8" style={{ fontSize: `${11 * previewScale}px` }}>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      {companyLogo ? (
                        <img src={companyLogo} alt="Logo" className="h-10 mb-2 object-contain" />
                      ) : (
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                            <FileText className="w-3 h-3 text-white" />
                          </div>
                          <span style={{ fontWeight: 600, fontSize: `${13 * previewScale}px` }}>Your Company</span>
                        </div>
                      )}
                      <div className="text-gray-400" style={{ fontSize: `${9 * previewScale}px` }}>
                        123 Business Street<br />City, State 12345
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-600" style={{ fontWeight: 700, fontSize: `${18 * previewScale}px` }}>INVOICE</span>
                      <div className="text-gray-500 mt-1" style={{ fontSize: `${9 * previewScale}px` }}>
                        <div>{invoiceNumber}</div>
                        <div>Date: {date || '—'}</div>
                        {dueDate && <div>Due: {dueDate}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Bill To */}
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-400 mb-1" style={{ fontSize: `${8 * previewScale}px`, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bill To</div>
                    <div style={{ fontWeight: 600 }}>{clientName || 'Client Name'}</div>
                    {clientEmail && <div className="text-gray-500">{clientEmail}</div>}
                    {clientAddress && <div className="text-gray-500">{clientAddress}</div>}
                  </div>

                  {/* Items Table */}
                  <table className="w-full mb-6" style={{ fontSize: `${10 * previewScale}px` }}>
                    <thead>
                      <tr className="border-b-2 border-emerald-100">
                        <th className="text-left py-2 text-gray-500" style={{ fontWeight: 500 }}>Description</th>
                        <th className="text-right py-2 text-gray-500" style={{ fontWeight: 500 }}>Qty</th>
                        <th className="text-right py-2 text-gray-500" style={{ fontWeight: 500 }}>Rate</th>
                        <th className="text-right py-2 text-gray-500" style={{ fontWeight: 500 }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-2">{item.description || '—'}</td>
                          <td className="text-right py-2">{item.quantity}</td>
                          <td className="text-right py-2">{sym}{item.rate}</td>
                          <td className="text-right py-2" style={{ fontWeight: 500 }}>{sym}{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-48 space-y-1" style={{ fontSize: `${10 * previewScale}px` }}>
                      <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{sym}{subtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-gray-500"><span>Tax ({taxRate}%)</span><span>{sym}{tax.toLocaleString()}</span></div>
                      <div className="flex justify-between border-t-2 border-emerald-200 pt-1 mt-1" style={{ fontWeight: 700 }}>
                        <span>Total ({currency})</span><span className="text-emerald-600">{sym}{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {notes && (
                    <div className="mt-8 pt-4 border-t border-gray-100">
                      <div className="text-gray-400 mb-1" style={{ fontSize: `${8 * previewScale}px`, fontWeight: 600 }}>NOTES</div>
                      <div className="text-gray-500">{notes}</div>
                    </div>
                  )}

                  {recurring && (
                    <div className="mt-3 flex items-center gap-1 text-emerald-600" style={{ fontSize: `${9 * previewScale}px` }}>
                      <RotateCcw className="w-3 h-3" />
                      <span>Recurring: {recurringInterval}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Send Modal */}
      <AnimatePresence>
        {showSendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowSendModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-black" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Send Invoice</h3>
                <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-black"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-gray-500 mb-4" style={{ fontSize: '0.85rem' }}>Send {invoiceNumber} directly to your client via email.</p>
              <div className="mb-4">
                <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Recipient Email</label>
                <input value={sendEmail || clientEmail} onChange={e => setSendEmail(e.target.value)} placeholder="client@email.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400" style={{ fontSize: '0.85rem' }} />
              </div>
              <button onClick={handleSendEmail}
                className="w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                style={{ fontWeight: 500 }}>
                <Send className="w-4 h-4" /> Send Now
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}