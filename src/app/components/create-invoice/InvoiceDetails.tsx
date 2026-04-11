import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Search } from "lucide-react";
import { NumberStepper } from "./NumberStepper";
import { CalendarPicker } from "./CalendarPicker";
import { CURRENCIES } from "../../lib/store";

type Props = {
  date: string;
  setDate: (v: string) => void;

  dueDate: string;
  setDueDate: (v: string) => void;

  currency: string;
  setCurrency: (v: string) => void;

  currencyOpen: boolean;
  setCurrencyOpen: (v: boolean) => void;

  currencySearch: string;
  setCurrencySearch: (v: string) => void;

  currencyRef: React.RefObject<HTMLDivElement | null>;
  currencyBtnRef: React.RefObject<HTMLButtonElement | null>;
  currencyPos: { top: number; left: number };
  openCurrencyDropdown: () => void;

  taxRate: number;
  setTaxRate: (v: number) => void;

  recurring: boolean;
  setRecurring: (v: boolean) => void;

  recurringInterval: "weekly" | "monthly" | "quarterly" | "yearly";
  setRecurringInterval: (v: any) => void;
};

export function InvoiceDetails({
  date,
  setDate,
  dueDate,
  setDueDate,
  currency,
  setCurrency,
  currencyOpen,
  setCurrencyOpen,
  currencySearch,
  setCurrencySearch,
  currencyRef,
  currencyBtnRef,
  currencyPos,
  openCurrencyDropdown,
  taxRate,
  setTaxRate,
  recurring,
  setRecurring,
  recurringInterval,
  setRecurringInterval,
}: Props) {
  return (
    <>
      <h4
        className="text-black"
        style={{ fontSize: "0.9rem", fontWeight: 600 }}
      >
        Invoice Details
      </h4>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label
            className="text-gray-500 block mb-1"
            style={{ fontSize: "0.75rem" }}
          >
            Invoice Date
          </label>
          <CalendarPicker
            value={date}
            onChange={setDate}
            label="Invoice Date"
          />
        </div>

        <div>
          <label
            className="text-gray-500 block mb-1"
            style={{ fontSize: "0.75rem" }}
          >
            Due Date
          </label>
          <CalendarPicker
            value={dueDate}
            onChange={setDueDate}
            label="Due Date"
          />
        </div>

        {/* Currency */}
        <div ref={currencyRef} className="relative">
          <label
            className="text-gray-500 block mb-1"
            style={{ fontSize: "0.75rem" }}
          >
            Currency
          </label>

          <button
            type="button"
            ref={currencyBtnRef}
            onClick={openCurrencyDropdown}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-colors text-left"
          >
            <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
              {CURRENCIES[currency]?.symbol || "$"}
            </span>

            <span
              className="flex-1 text-gray-800"
              style={{ fontSize: "0.85rem", fontWeight: 500 }}
            >
              {currency}
            </span>

            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                currencyOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {currencyOpen &&
            createPortal(
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="fixed z-[9999] w-[260px] bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden"
                  style={{ top: currencyPos.top, left: currencyPos.left }}
                  id="currency-portal-dropdown"
                >
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        autoFocus
                        value={currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                        placeholder="Search currency..."
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto p-1">
                    {Object.entries(CURRENCIES)
                      .filter(
                        ([code, { name }]) =>
                          code
                            .toLowerCase()
                            .includes(currencySearch.toLowerCase()) ||
                          name
                            .toLowerCase()
                            .includes(currencySearch.toLowerCase()),
                      )
                      .map(([code, { name, symbol }]) => (
                        <button
                          key={code}
                          onClick={() => {
                            setCurrency(code);
                            setCurrencyOpen(false);
                            setCurrencySearch("");
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg ${
                            currency === code
                              ? "bg-emerald-50 text-emerald-700"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="w-7 h-7 rounded-md flex items-center justify-center bg-gray-100">
                            {symbol}
                          </span>
                          <div>
                            <span>{code}</span>
                            <span className="text-gray-400 ml-1.5">{name}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </motion.div>
              </AnimatePresence>,
              document.body,
            )}
        </div>
      </div>

      {/* Tax + Recurring */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className="text-gray-500 block mb-1.5"
            style={{ fontSize: "0.75rem" }}
          >
            Tax Rate
          </label>
          <NumberStepper
            value={taxRate}
            onChange={setTaxRate}
            min={0}
            max={100}
            step={0.5}
            suffix="%"
          />
        </div>

        <div className="flex items-end gap-3">
          <label
            className="flex items-center gap-2 cursor-pointer py-2.5"
            onClick={() => setRecurring(!recurring)}
          >
            <div
              className={`w-10 h-5 rounded-full p-0.5 ${
                recurring ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white ${
                  recurring ? "translate-x-5" : ""
                }`}
              />
            </div>

            <span className="text-gray-600">Recurring</span>
          </label>

          {recurring && (
            <select
              value={recurringInterval}
              onChange={(e) => setRecurringInterval(e.target.value as any)}
              className="flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          )}
        </div>
      </div>
    </>
  );
}
