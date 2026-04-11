import { Bell, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "payment" | "reminder" | "info";
}

interface Props {
  showNotifications: boolean;
  setShowNotifications: (val: boolean) => void;
  setShowProfile: (val: boolean) => void;
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markAsRead: (id: string) => void;
}

const GLASS_DROPDOWN =
  "bg-white backdrop-blur-2xl border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]";

export function NotificationsDropdown({
  showNotifications,
  setShowNotifications,
  setShowProfile,
  notifications,
  unreadCount,
  markAllRead,
  markAsRead,
}: Props) {
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setShowNotifications]);

  const notifIcon = (type: string) => {
    if (type === "payment")
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (type === "reminder") return <Bell className="w-4 h-4 text-amber-500" />;
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div ref={notifRef} className="relative">
      <button
        onClick={() => {
          setShowNotifications(!showNotifications);
          setShowProfile(false);
        }}
        className="relative w-8 h-8 rounded-full bg-black/[0.03] flex items-center justify-center hover:bg-black/[0.06] transition-all duration-200"
      >
        <Bell className="w-3.5 h-3.5 text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-[1.5px] border-white flex items-center justify-center">
            <span
              className="text-white"
              style={{ fontSize: "0.55rem", fontWeight: 700 }}
            >
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute right-0 top-11 w-96  rounded-2xl z-[99999999999]! overflow-hidden ${GLASS_DROPDOWN}`}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200/40">
              <h4
                className="text-black"
                style={{ fontSize: "0.9rem", fontWeight: 600 }}
              >
                Notifications
              </h4>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  style={{ fontSize: "0.72rem", fontWeight: 500 }}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto trendy-scroll">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`w-full flex items-start gap-3 px-5 py-3 hover:bg-emerald-50/40 transition-all duration-200 text-left ${
                    !notif.read ? "bg-emerald-50/30" : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{notifIcon(notif.type)}</div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className="text-black truncate"
                        style={{ fontSize: "0.8rem", fontWeight: 500 }}
                      >
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>

                    <p
                      className="text-gray-500 truncate"
                      style={{ fontSize: "0.72rem" }}
                    >
                      {notif.message}
                    </p>

                    <p
                      className="text-gray-400 mt-0.5"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {notif.time}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200/40 px-5 py-2.5">
              <button
                onClick={() => {
                  navigate("/dashboard/settings");
                  setShowNotifications(false);
                }}
                className="w-full text-center text-emerald-600 hover:text-emerald-700 transition-colors"
                style={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                Notification Settings →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
