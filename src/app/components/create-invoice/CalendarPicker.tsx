import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

export function CalendarPicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value + "T00:00:00") : null;
  const [viewDate, setViewDate] = useState(() => selected || new Date());

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDay = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1,
  ).getDay();
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const selectDay = (day: number) => {
    const m = String(viewDate.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewDate.getFullYear()}-${m}-${d}`);
    setOpen(false);
  };

  const prevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const formatDisplay = (v: string) => {
    if (!v) return "";
    const d = new Date(v + "T00:00:00");
    return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open && selected) setViewDate(new Date(selected));
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-colors text-left"
      >
        <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
        <span
          className={`flex-1 ${value ? "text-gray-800" : "text-gray-400"}`}
          style={{ fontSize: "0.85rem", fontWeight: value ? 500 : 400 }}
        >
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
              <button
                type="button"
                onClick={prevMonth}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <span
                className="text-gray-800"
                style={{ fontSize: "0.85rem", fontWeight: 600 }}
              >
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0 mb-1">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="h-8 flex items-center justify-center text-gray-400"
                  style={{ fontSize: "0.65rem", fontWeight: 600 }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} className="h-8" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const m = String(viewDate.getMonth() + 1).padStart(2, "0");
                const d = String(day).padStart(2, "0");
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
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                        : isToday
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: isSelected || isToday ? 600 : 400,
                    }}
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
                onClick={() => {
                  onChange(todayStr);
                  setOpen(false);
                }}
                className="flex-1 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                style={{ fontSize: "0.72rem", fontWeight: 500 }}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="flex-1 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all"
                style={{ fontSize: "0.72rem", fontWeight: 500 }}
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
