import { GlassCard } from "../GlassCard";

type Props = {
  clientName: string;
  setClientName: (v: string) => void;

  clientEmail: string;
  setClientEmail: (v: string) => void;

  clientAddress: string;
  setClientAddress: (v: string) => void;
};

export function ClientDetails({
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientAddress,
  setClientAddress,
}: Props) {
  return (
    <GlassCard className="p-5 space-y-4">
      <h4
        className="text-black"
        style={{ fontSize: "0.9rem", fontWeight: 600 }}
      >
        Client Details
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className="text-gray-500 block mb-1"
            style={{ fontSize: "0.75rem" }}
          >
            Client Name *
          </label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Company or person"
            className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 transition-colors"
            style={{ fontSize: "0.85rem" }}
          />
        </div>

        <div>
          <label
            className="text-gray-500 block mb-1"
            style={{ fontSize: "0.75rem" }}
          >
            Email
          </label>
          <input
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="client@email.com"
            className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 transition-colors"
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>

      <div>
        <label
          className="text-gray-500 block mb-1"
          style={{ fontSize: "0.75rem" }}
        >
          Address
        </label>
        <input
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          placeholder="Full address"
          className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 hover:border-emerald-300 transition-colors"
          style={{ fontSize: "0.85rem" }}
        />
      </div>
    </GlassCard>
  );
}
