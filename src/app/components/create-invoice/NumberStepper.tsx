import { ChevronDown, ChevronUp } from "lucide-react";

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999999,
  step = 1,
  prefix = "",
  suffix = "",
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  return (
    <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 overflow-hidden h-[38px] group hover:border-emerald-300 focus-within:border-emerald-400 transition-colors">
      <div className="flex-1 flex items-center px-3 min-w-0">
        {prefix && (
          <span
            className="text-gray-400 mr-0.5 shrink-0"
            style={{ fontSize: "0.8rem" }}
          >
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) onChange(clamp(num));
            else if (e.target.value === "") onChange(min);
          }}
          className="w-full bg-transparent outline-none text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ fontSize: "0.82rem", fontWeight: 500 }}
        />
        {suffix && (
          <span
            className="text-gray-400 ml-0.5 shrink-0"
            style={{ fontSize: "0.7rem" }}
          >
            {suffix}
          </span>
        )}
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
