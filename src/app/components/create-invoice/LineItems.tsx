import { GlassCard } from "../GlassCard";
import { Plus, Trash2 } from "lucide-react";
import { NumberStepper } from "./NumberStepper";
import type { InvoiceItem } from "../../lib/store";

type Props = {
  items: InvoiceItem[];
  setItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  updateItem: (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => void;
  defaultItem: () => InvoiceItem;
  sym: string;
};

export function LineItems({
  items,
  setItems,
  updateItem,
  defaultItem,
  sym,
}: Props) {
  return (
    <GlassCard className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4
          className="text-black"
          style={{ fontSize: "0.9rem", fontWeight: 600 }}
        >
          Line Items
        </h4>
        <button
          onClick={() => setItems([...items, defaultItem()])}
          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
          style={{ fontSize: "0.8rem", fontWeight: 500 }}
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="space-y-3">
        <div
          className="grid grid-cols-12 gap-2 text-gray-400"
          style={{ fontSize: "0.7rem", fontWeight: 500 }}
        >
          <div className="col-span-4">Description</div>
          <div className="col-span-3">Qty</div>
          <div className="col-span-2">Rate</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-1"></div>
        </div>

        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
            <input
              value={item.description}
              onChange={(e) =>
                updateItem(item.id, "description", e.target.value)
              }
              placeholder="Service description"
              className="col-span-4 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 transition-colors"
              style={{ fontSize: "0.85rem" }}
            />

            <div className="col-span-3">
              <NumberStepper
                value={item.quantity}
                onChange={(v) => updateItem(item.id, "quantity", v)}
                min={1}
                max={9999}
                step={1}
              />
            </div>

            <div className="col-span-2">
              <NumberStepper
                value={item.rate}
                onChange={(v) => updateItem(item.id, "rate", v)}
                min={0}
                step={5}
                prefix={sym}
              />
            </div>

            <div
              className="col-span-2 px-2 py-2 text-gray-700 flex items-center h-[42px]"
              style={{ fontSize: "0.85rem", fontWeight: 500 }}
            >
              {sym}
              {item.amount.toLocaleString()}
            </div>

            <button
              onClick={() => setItems(items.filter((i) => i.id !== item.id))}
              disabled={items.length === 1}
              className="col-span-1 flex items-center justify-center text-gray-300 hover:text-red-500 disabled:opacity-30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
