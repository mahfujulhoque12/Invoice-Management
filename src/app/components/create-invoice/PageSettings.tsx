import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "../GlassCard";
import { NumberStepper } from "./NumberStepper";

// adjust path if needed

type Props = {
  showSettings: boolean;
  pageWidth: number;
  pageHeight: number;
  pageUnit: "px" | "in";
  setPageWidth: (v: number) => void;
  setPageHeight: (v: number) => void;
  setPageUnit: (v: "px" | "in") => void;
};

export function PageSettings({
  showSettings,
  pageWidth,
  pageHeight,
  pageUnit,
  setPageWidth,
  setPageHeight,
  setPageUnit,
}: Props) {
  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <GlassCard className="p-5">
            <h4
              className="text-black mb-4"
              style={{ fontSize: "0.9rem", fontWeight: 600 }}
            >
              Page Dimensions & Layout
            </h4>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label
                  className="text-gray-500 block mb-1.5"
                  style={{ fontSize: "0.75rem" }}
                >
                  Page Layout
                </label>
                <NumberStepper
                  value={pageWidth}
                  onChange={setPageWidth}
                  min={200}
                  max={2000}
                  step={pageUnit === "in" ? 0.5 : 10}
                  suffix={pageUnit}
                />
              </div>

              <div>
                <label
                  className="text-gray-500 block mb-1.5"
                  style={{ fontSize: "0.75rem" }}
                >
                  Width
                </label>
                <NumberStepper
                  value={pageWidth}
                  onChange={setPageWidth}
                  min={200}
                  max={2000}
                  step={pageUnit === "in" ? 0.5 : 10}
                  suffix={pageUnit}
                />
              </div>

              <div>
                <label
                  className="text-gray-500 block mb-1.5"
                  style={{ fontSize: "0.75rem" }}
                >
                  Height
                </label>
                <NumberStepper
                  value={pageHeight}
                  onChange={setPageHeight}
                  min={200}
                  max={3000}
                  step={pageUnit === "in" ? 0.5 : 10}
                  suffix={pageUnit}
                />
              </div>

              <div>
                <label
                  className="text-gray-500 block mb-1.5"
                  style={{ fontSize: "0.75rem" }}
                >
                  Unit
                </label>

                <div className="flex gap-1 p-1 rounded-xl bg-gray-50 border border-gray-200 h-[42px]">
                  {(["px", "in"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setPageUnit(u)}
                      className={`flex-1 rounded-lg transition-all duration-300 ${
                        pageUnit === u
                          ? "bg-white shadow-sm text-emerald-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      style={{ fontSize: "0.8rem", fontWeight: 500 }}
                    >
                      {u === "px" ? "Pixels" : "Inches"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
