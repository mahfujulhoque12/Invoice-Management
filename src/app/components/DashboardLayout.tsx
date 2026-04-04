import { NavLink, Outlet, useNavigate } from 'react-router';
import { useStore } from '../lib/store';
import {
  FileText, LayoutDashboard, PlusCircle, Users, Settings,
  LogOut, Bell, Search, X, User, CreditCard, HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/create', icon: PlusCircle, label: 'Create Invoice' },
  { to: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
  { to: '/dashboard/clients', icon: Users, label: 'Clients' },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'payment' | 'reminder' | 'info';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Payment Received', message: 'Acme Corp paid INV-001 ($9,240)', time: '2 hours ago', read: false, type: 'payment' },
  { id: '2', title: 'Invoice Overdue', message: 'INV-003 for Global Logistics is overdue', time: '5 hours ago', read: false, type: 'reminder' },
  { id: '3', title: 'New Client Added', message: 'DesignHub Co was added to your clients', time: '1 day ago', read: true, type: 'info' },
  { id: '4', title: 'Recurring Invoice Sent', message: 'INV-002 auto-sent to TechStart Inc', time: '2 days ago', read: true, type: 'reminder' },
];

const GLASS_DROPDOWN = 'bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]';

export function DashboardLayout() {
  const { logout, invoices } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [scrolled, setScrolled] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const searchResults = searchQuery.trim()
    ? invoices.filter(i =>
        i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.number.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const notifIcon = (type: string) => {
    if (type === 'payment') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (type === 'reminder') return <Bell className="w-4 h-4 text-amber-500" />;
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #f8faf9 0%, #ffffff 30%, #ecfdf5 55%, #ffffff 75%, #f0fdf4 100%)' }}>
      {/* Decorative gradient orbs */}
      <div className="fixed top-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-emerald-200/25 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] left-[-100px] w-[400px] h-[400px] rounded-full bg-emerald-100/30 blur-[100px] pointer-events-none" />
      <div className="fixed top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-emerald-50/40 blur-[80px] pointer-events-none" />

      {/* Floating Top Navigation Bar */}
      <div className="sticky top-0 z-40 w-full" style={{ padding: '12px 40px 0' }}>
        <header
          className={`relative flex items-center justify-between h-[56px] rounded-2xl transition-all duration-500 ${
            scrolled
              ? 'bg-white/65 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-white/70'
              : 'bg-white/45 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50'
          }`}
          style={{ padding: '0 20px' }}
        >
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <NavLink to="/dashboard" className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/25">
                <FileText className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-black tracking-tight" style={{ fontSize: '1rem', fontWeight: 700 }}>InvoiceFlow</span>
            </NavLink>
          </div>

          {/* Center: Nav Pills */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 shrink-0 ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'text-gray-500 hover:text-black hover:bg-black/[0.04]'
                  }`
                }
                style={{ fontSize: '0.78rem', fontWeight: 500 }}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right: Search, Notifications, Profile */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onFocus={() => setShowSearch(true)}
                  onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
                  className="w-48 pl-9 pr-3 py-1.5 rounded-full bg-black/[0.03] border border-transparent text-gray-700 placeholder-gray-400 focus:border-emerald-300 focus:bg-white/80 focus:w-64 focus:shadow-lg focus:shadow-emerald-500/5 outline-none transition-all duration-300"
                  style={{ fontSize: '0.78rem' }}
                />
              </div>
              <AnimatePresence>
                {showSearch && searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                    className={`absolute right-0 top-11 w-80 rounded-2xl p-1.5 z-[100] ${GLASS_DROPDOWN}`}
                  >
                    {searchResults.length > 0 ? (
                      <>
                        <p className="px-3 py-1.5 text-gray-400" style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Results</p>
                        {searchResults.map(inv => (
                          <button
                            key={inv.id}
                            onClick={() => { navigate('/dashboard/invoices'); setShowSearch(false); setSearchQuery(''); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50/60 transition-all duration-200 text-left group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/80 group-hover:bg-emerald-50 flex items-center justify-center shrink-0 transition-colors">
                              <FileText className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-black truncate" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{inv.number} — {inv.clientName}</p>
                              <p className="text-gray-400 truncate" style={{ fontSize: '0.68rem' }}>${inv.total.toLocaleString()} · {inv.status}</p>
                            </div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="px-3 py-6 text-center text-gray-400" style={{ fontSize: '0.78rem' }}>
                        No results for "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="relative w-8 h-8 rounded-full bg-black/[0.03] flex items-center justify-center hover:bg-black/[0.06] transition-all duration-200"
              >
                <Bell className="w-3.5 h-3.5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-[1.5px] border-white flex items-center justify-center">
                    <span className="text-white" style={{ fontSize: '0.55rem', fontWeight: 700 }}>{unreadCount}</span>
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
                    className={`absolute right-0 top-11 w-96 rounded-2xl z-[100] overflow-hidden ${GLASS_DROPDOWN}`}
                  >
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200/40">
                      <h4 className="text-black" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Notifications</h4>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-emerald-600 hover:text-emerald-700 transition-colors" style={{ fontSize: '0.72rem', fontWeight: 500 }}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto trendy-scroll">
                      {notifications.map(notif => (
                        <button
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`w-full flex items-start gap-3 px-5 py-3 hover:bg-emerald-50/40 transition-all duration-200 text-left ${!notif.read ? 'bg-emerald-50/30' : ''}`}
                        >
                          <div className="mt-0.5 shrink-0">{notifIcon(notif.type)}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-black truncate" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{notif.title}</p>
                              {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                            </div>
                            <p className="text-gray-500 truncate" style={{ fontSize: '0.72rem' }}>{notif.message}</p>
                            <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.65rem' }}>{notif.time}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-200/40 px-5 py-2.5">
                      <button
                        onClick={() => { navigate('/dashboard/settings'); setShowNotifications(false); }}
                        className="w-full text-center text-emerald-600 hover:text-emerald-700 transition-colors"
                        style={{ fontSize: '0.75rem', fontWeight: 500 }}
                      >
                        Notification Settings →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-gray-200/60" />

            {/* Profile — icon only, no chevron */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ring-2 ring-white/80 shadow-sm hover:shadow-md hover:shadow-emerald-500/20 transition-all duration-200"
              >
                <span className="text-white" style={{ fontSize: '0.7rem', fontWeight: 700 }}>JD</span>
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
                          <span className="text-white" style={{ fontSize: '0.75rem', fontWeight: 700 }}>JD</span>
                        </div>
                        <div>
                          <p className="text-black" style={{ fontSize: '0.82rem', fontWeight: 600 }}>John Doe</p>
                          <p className="text-gray-400" style={{ fontSize: '0.68rem' }}>john@company.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      {[
                        { icon: User, label: 'My Profile', action: () => { navigate('/dashboard/settings'); setShowProfile(false); } },
                        { icon: Settings, label: 'Settings', action: () => { navigate('/dashboard/settings'); setShowProfile(false); } },
                        { icon: CreditCard, label: 'Billing', action: () => { navigate('/dashboard/settings'); setShowProfile(false); } },
                        { icon: HelpCircle, label: 'Help & Support', action: () => setShowProfile(false) },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={item.action}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-emerald-50/60 hover:text-emerald-700 transition-all duration-200 text-left group"
                          style={{ fontSize: '0.8rem', fontWeight: 500 }}
                        >
                          <item.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 transition-colors" /> {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="p-1.5 border-t border-gray-200/40">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50/60 transition-all duration-200 text-left"
                        style={{ fontSize: '0.8rem', fontWeight: 500 }}
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
      </div>

      {/* Page content — 40px gap on both sides */}
      <main className="flex-1 overflow-auto trendy-scroll relative z-0" style={{ padding: '28px 40px 40px' }}>
        <Outlet />
      </main>
    </div>
  );
}
