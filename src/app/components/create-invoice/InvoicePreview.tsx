import { GlassCard } from "../GlassCard";
import { Eye, FileText, RotateCcw } from "lucide-react";

type Props = {
  pageWidth: number;
  pageHeight: number;
  pageUnit: "px" | "in";
  displayWidth: number;
  displayHeight: number;
  previewScale: number;
  companyLogo?: string;

  invoiceNumber: string;
  date: string;
  dueDate: string;

  clientName: string;
  clientEmail: string;
  clientAddress: string;

  items: {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];

  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;

  currency: string;
  sym: string;

  notes: string;

  recurring: boolean;
  recurringInterval: string;
};

export function InvoicePreview({
  pageWidth,
  pageHeight,
  pageUnit,
  displayWidth,
  displayHeight,
  previewScale,
  companyLogo,
  invoiceNumber,
  date,
  dueDate,
  clientName,
  clientEmail,
  clientAddress,
  items,
  subtotal,
  tax,
  total,
  taxRate,
  currency,
  sym,
  notes,
  recurring,
  recurringInterval,
}: Props) {
  return (
    <div className="sticky top-20">
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-emerald-600" />
          <span
            className="text-black"
            style={{ fontSize: "0.9rem", fontWeight: 600 }}
          >
            Live Preview
          </span>
          <span
            className="text-gray-400 ml-auto"
            style={{ fontSize: "0.7rem" }}
          >
            {pageWidth}
            {pageUnit} × {pageHeight}
            {pageUnit}
          </span>
        </div>

        <div className="flex justify-center overflow-auto rounded-xl bg-gray-100 p-4 trendy-scroll">
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            style={{
              width: displayWidth * previewScale,
              minHeight: displayHeight * previewScale,
              transform: `scale(1)`,
              transformOrigin: "top center",
            }}
          >
            <div className="p-8" style={{ fontSize: `${11 * previewScale}px` }}>
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt="Logo"
                      className="h-10 mb-2 object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                        <FileText className="w-3 h-3 text-white" />
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: `${13 * previewScale}px`,
                        }}
                      >
                        Your Company
                      </span>
                    </div>
                  )}
                  <div
                    className="text-gray-400"
                    style={{ fontSize: `${9 * previewScale}px` }}
                  >
                    123 Business Street
                    <br />
                    City, State 12345
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className="text-emerald-600"
                    style={{
                      fontWeight: 700,
                      fontSize: `${18 * previewScale}px`,
                    }}
                  >
                    INVOICE
                  </span>
                  <div
                    className="text-gray-500 mt-1"
                    style={{ fontSize: `${9 * previewScale}px` }}
                  >
                    <div>{invoiceNumber}</div>
                    <div>Date: {date || "—"}</div>
                    {dueDate && <div>Due: {dueDate}</div>}
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <div
                  className="text-gray-400 mb-1"
                  style={{
                    fontSize: `${8 * previewScale}px`,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Bill To
                </div>
                <div style={{ fontWeight: 600 }}>
                  {clientName || "Client Name"}
                </div>
                {clientEmail && (
                  <div className="text-gray-500">{clientEmail}</div>
                )}
                {clientAddress && (
                  <div className="text-gray-500">{clientAddress}</div>
                )}
              </div>

              {/* Items */}
              <table
                className="w-full mb-6"
                style={{ fontSize: `${10 * previewScale}px` }}
              >
                <thead>
                  <tr className="border-b-2 border-emerald-100">
                    <th className="text-left py-2 text-gray-500">
                      Description
                    </th>
                    <th className="text-right py-2 text-gray-500">Qty</th>
                    <th className="text-right py-2 text-gray-500">Rate</th>
                    <th className="text-right py-2 text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-2">{item.description || "—"}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">
                        {sym}
                        {item.rate}
                      </td>
                      <td
                        className="text-right py-2"
                        style={{ fontWeight: 500 }}
                      >
                        {sym}
                        {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div
                  className="w-48 space-y-1"
                  style={{ fontSize: `${10 * previewScale}px` }}
                >
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>
                      {sym}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax ({taxRate}%)</span>
                    <span>
                      {sym}
                      {tax.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="flex justify-between border-t-2 border-emerald-200 pt-1 mt-1"
                    style={{ fontWeight: 700 }}
                  >
                    <span>Total ({currency})</span>
                    <span className="text-emerald-600">
                      {sym}
                      {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {notes && (
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <div
                    className="text-gray-400 mb-1"
                    style={{
                      fontSize: `${8 * previewScale}px`,
                      fontWeight: 600,
                    }}
                  >
                    NOTES
                  </div>
                  <div className="text-gray-500">{notes}</div>
                </div>
              )}

              {recurring && (
                <div
                  className="mt-3 flex items-center gap-1 text-emerald-600"
                  style={{ fontSize: `${9 * previewScale}px` }}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Recurring: {recurringInterval}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
