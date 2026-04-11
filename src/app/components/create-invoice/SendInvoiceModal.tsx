import { motion, AnimatePresence } from "motion/react";
import { X, Send } from "lucide-react";

type Props = {
  show: boolean;
  onClose: () => void;
  invoiceNumber: string;
  sendEmail: string;
  clientEmail: string;
  setSendEmail: (v: string) => void;
  onSend: () => void;
};

export function SendInvoiceModal({
  show,
  onClose,
  invoiceNumber,
  sendEmail,
  clientEmail,
  setSendEmail,
  onSend,
}: Props) {
  return (
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-black"
                style={{ fontSize: "1.1rem", fontWeight: 600 }}
              >
                Send Invoice
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-500 mb-4" style={{ fontSize: "0.85rem" }}>
              Send {invoiceNumber} directly to your client via email
            </p>

            <div className="mb-4">
              <label
                className="text-gray-500 block mb-1"
                style={{ fontSize: "0.75rem" }}
              >
                Recipient Email
              </label>
              <input
                value={sendEmail || clientEmail}
                onChange={(e) => setSendEmail(e.target.value)}
                placeholder="client@email.com"
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400"
                style={{ fontSize: "0.85rem" }}
              />
            </div>

            <button
              onClick={onSend}
              className="w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              style={{ fontWeight: 500 }}
            >
              <Send className="w-4 h-4" /> Send Now
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
