import { X, Mail, Download } from "lucide-react";
import { toast } from "sonner";
import { CURRENCIES } from "../../lib/store";

type Props = {
  selectedInvoice: any;
  statusColors: Record<string, string>;
  onClose: () => void;
};

export function ViewInvoiceModal({
  selectedInvoice,
  statusColors,
  onClose,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] overflow-auto p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-black"
            style={{ fontSize: "1.25rem", fontWeight: 600 }}
          >
            {selectedInvoice.number}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-between mb-6">
          <div>
            <p
              className="text-gray-400"
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Bill To
            </p>
            <p className="text-black" style={{ fontWeight: 600 }}>
              {selectedInvoice.clientName}
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>
              {selectedInvoice.clientEmail}
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>
              {selectedInvoice.clientAddress}
            </p>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex px-3 py-1 rounded-lg ${statusColors[selectedInvoice.status]}`}
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {selectedInvoice.status}
            </span>
            <p className="text-gray-500 mt-2" style={{ fontSize: "0.85rem" }}>
              Date: {selectedInvoice.date}
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>
              Due: {selectedInvoice.dueDate || "N/A"}
            </p>
          </div>
        </div>

        <table className="w-full mb-6" style={{ fontSize: "0.85rem" }}>
          <thead>
            <tr className="border-b-2 border-emerald-100">
              <th
                className="text-left py-2 text-gray-500"
                style={{ fontWeight: 500 }}
              >
                Item
              </th>
              <th
                className="text-right py-2 text-gray-500"
                style={{ fontWeight: 500 }}
              >
                Qty
              </th>
              <th
                className="text-right py-2 text-gray-500"
                style={{ fontWeight: 500 }}
              >
                Rate
              </th>
              <th
                className="text-right py-2 text-gray-500"
                style={{ fontWeight: 500 }}
              >
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {selectedInvoice.items.map((item: any) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2">{item.description}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  {CURRENCIES[selectedInvoice.currency]?.symbol}
                  {item.rate}
                </td>
                <td className="text-right py-2" style={{ fontWeight: 500 }}>
                  {CURRENCIES[selectedInvoice.currency]?.symbol}
                  {item.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-56 space-y-1" style={{ fontSize: "0.85rem" }}>
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>
                {CURRENCIES[selectedInvoice.currency]?.symbol}
                {selectedInvoice.subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Tax ({selectedInvoice.taxRate}%)</span>
              <span>
                {CURRENCIES[selectedInvoice.currency]?.symbol}
                {selectedInvoice.tax.toLocaleString()}
              </span>
            </div>

            <div
              className="flex justify-between border-t-2 border-emerald-200 pt-2 mt-2 text-black"
              style={{ fontWeight: 700, fontSize: "1rem" }}
            >
              <span>Total</span>
              <span className="text-emerald-600">
                {CURRENCIES[selectedInvoice.currency]?.symbol}
                {selectedInvoice.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              toast.success("Invoice sent!");
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
            style={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            <Mail className="w-4 h-4" /> Send via Email
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            style={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
