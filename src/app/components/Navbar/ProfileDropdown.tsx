import { User, Settings, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router";

interface Props {
  showProfile: boolean;
  setShowProfile: (val: boolean) => void;
  setShowNotifications: (val: boolean) => void;

  handleLogout: () => void;
}

const GLASS_DROPDOWN =
  "bg-white backdrop-blur-2xl border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]";

export function ProfileDropdown({
  showProfile,
  setShowProfile,
  setShowNotifications,
  handleLogout,
}: Props) {
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setShowProfile]);

  return (
    <div ref={profileRef} className="relative">
      <button
        onClick={() => {
          setShowProfile(!showProfile);
          setShowNotifications(false);
        }}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ring-2 ring-white/80 shadow-sm hover:shadow-md hover:shadow-emerald-500/20 transition-all duration-200"
      >
        <span
          className="text-white"
          style={{ fontSize: "0.7rem", fontWeight: 700 }}
        >
          JD
        </span>
      </button>

      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute right-0 top-11 w-60 rounded-2xl z-[100] overflow-hidden ${GLASS_DROPDOWN}`}
          >
            <div className="px-4 py-3.5 border-b border-gray-200/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <span
                    className="text-white"
                    style={{ fontSize: "0.75rem", fontWeight: 700 }}
                  >
                    JD
                  </span>
                </div>
                <div>
                  <p
                    className="text-black"
                    style={{ fontSize: "0.82rem", fontWeight: 600 }}
                  >
                    John Doe
                  </p>
                  <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                    john@company.com
                  </p>
                </div>
              </div>
            </div>

            <div className="p-1.5">
              {[
                {
                  icon: User,
                  label: "My Profile",
                  action: () => {
                    navigate("/dashboard/settings");
                    setShowProfile(false);
                  },
                },
                {
                  icon: Settings,
                  label: "Settings",
                  action: () => {
                    navigate("/dashboard/settings");
                    setShowProfile(false);
                  },
                },
                {
                  icon: CreditCard,
                  label: "Billing",
                  action: () => {
                    navigate("/dashboard/settings");
                    setShowProfile(false);
                  },
                },
                {
                  icon: HelpCircle,
                  label: "Help & Support",
                  action: () => setShowProfile(false),
                },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-emerald-50/60 hover:text-emerald-700 transition-all duration-200 text-left group"
                  style={{ fontSize: "0.8rem", fontWeight: 500 }}
                >
                  <item.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="p-1.5 border-t border-gray-200/40">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50/60 transition-all duration-200 text-left"
                style={{ fontSize: "0.8rem", fontWeight: 500 }}
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
