import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from './GlassCard';
import { CURRENCIES } from '../lib/store';
import { toast } from 'sonner';
import {
  Save, Bell, Mail, Globe, Palette, Upload, Trash2, User, Shield,
  FileText, Check, X, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SettingsPage() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('Your Company');
  const [companyEmail, setCompanyEmail] = useState('hello@yourcompany.com');
  const [companyAddress, setCompanyAddress] = useState('123 Business St, City, State 12345');
  const [companyPhone, setCompanyPhone] = useState('+1 (555) 000-0000');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [autoReminders, setAutoReminders] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);
  const [defaultTax, setDefaultTax] = useState(10);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('company');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState('30');
  const [defaultNotes, setDefaultNotes] = useState('Thank you for your business!');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setCompanyLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: Globe },
    { id: 'invoices', label: 'Invoice Defaults', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-black" style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Settings</h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>Manage your account and preferences.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-full bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300"
            style={{ fontSize: '0.82rem', fontWeight: 500 }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="settings-tab-pill"
                className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-200/60"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <tab.icon className={`relative z-10 w-3.5 h-3.5 transition-colors ${activeTab === tab.id ? 'text-emerald-500' : 'text-gray-400'}`} />
            <span className={`relative z-10 ${activeTab === tab.id ? 'text-emerald-700' : 'text-gray-500'}`}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {/* Company Tab */}
        {activeTab === 'company' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <GlassCard className="p-6 space-y-5">
              <h3 className="text-black" style={{ fontSize: '1rem', fontWeight: 600 }}>Company Information</h3>

              {/* Logo Upload */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                  {companyLogo ? (
                    <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div>
                  <p className="text-black mb-1" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Company Logo</p>
                  <p className="text-gray-400 mb-2" style={{ fontSize: '0.75rem' }}>Recommended: 200×200px, PNG or SVG</p>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      <Upload className="w-3.5 h-3.5" /> Upload
                    </button>
                    {companyLogo && (
                      <button onClick={() => setCompanyLogo(null)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                        style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Company Name</label>
                  <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" style={{ fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Email</label>
                  <input value={companyEmail} onChange={e => setCompanyEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" style={{ fontSize: '0.85rem' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Phone</label>
                  <input value={companyPhone} onChange={e => setCompanyPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" style={{ fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Address</label>
                  <input value={companyAddress} onChange={e => setCompanyAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" style={{ fontSize: '0.85rem' }} />
                </div>
              </div>
            </GlassCard>
            <button onClick={() => toast.success('Company information saved!')}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              style={{ fontWeight: 500 }}>
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </motion.div>
        )}

        {/* Invoice Defaults Tab */}
        {activeTab === 'invoices' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <GlassCard className="p-6 space-y-5">
              <h3 className="text-black" style={{ fontSize: '1rem', fontWeight: 600 }}>Invoice Defaults</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Default Currency</label>
                  <select value={defaultCurrency} onChange={e => setDefaultCurrency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" style={{ fontSize: '0.85rem' }}>
                    {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                      <option key={code} value={code}>{symbol} {code} — {name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Tax Rate (%)</label>
                  <input type="number" value={defaultTax} onChange={e => setDefaultTax(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" style={{ fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Invoice Prefix</label>
                  <input value={invoicePrefix} onChange={e => setInvoicePrefix(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" style={{ fontSize: '0.85rem' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Default Payment Terms (days)</label>
                  <select value={defaultPaymentTerms} onChange={e => setDefaultPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" style={{ fontSize: '0.85rem' }}>
                    <option value="7">Net 7</option>
                    <option value="15">Net 15</option>
                    <option value="30">Net 30</option>
                    <option value="45">Net 45</option>
                    <option value="60">Net 60</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Preview</label>
                  <div className="px-3 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-emerald-700" style={{ fontSize: '0.85rem' }}>
                    {invoicePrefix}-001 · {CURRENCIES[defaultCurrency]?.symbol} · {defaultTax}% tax · Net {defaultPaymentTerms}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Default Invoice Notes</label>
                <textarea value={defaultNotes} onChange={e => setDefaultNotes(e.target.value)} rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none transition-all" style={{ fontSize: '0.85rem' }} />
              </div>
            </GlassCard>
            <button onClick={() => toast.success('Invoice defaults saved!')}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              style={{ fontWeight: 500 }}>
              <Save className="w-4 h-4" /> Save Defaults
            </button>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <GlassCard className="p-6 space-y-5">
              <h3 className="text-black" style={{ fontSize: '1rem', fontWeight: 600 }}>Notification Preferences</h3>
              {[
                { label: 'Automated Payment Reminders', desc: 'Automatically remind clients before due date', value: autoReminders, setter: setAutoReminders },
                { label: 'Email Notifications', desc: 'Get notified when invoices are viewed or paid', value: emailNotifications, setter: setEmailNotifications },
                { label: 'Payment Confirmations', desc: 'Receive email when a payment is processed', value: paymentNotifications, setter: setPaymentNotifications },
                { label: 'Overdue Alerts', desc: 'Get alerted when invoices become overdue', value: overdueAlerts, setter: setOverdueAlerts },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-gray-700" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</p>
                    <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>{item.desc}</p>
                  </div>
                  <button
                    onClick={() => item.setter(!item.value)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${item.value ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${item.value ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              ))}
              {autoReminders && (
                <div className="pt-2 border-t border-gray-100">
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Reminder days before due date</label>
                  <div className="flex items-center gap-1 p-1 rounded-full bg-gray-100/60 border border-gray-200/50 w-fit">
                    {[1, 3, 5, 7, 14].map(d => (
                      <button key={d} onClick={() => setReminderDays(d)}
                        className="relative px-3 py-1.5 rounded-full transition-all duration-300"
                        style={{ fontSize: '0.78rem', fontWeight: 500 }}>
                        {reminderDays === d && (
                          <motion.div
                            layoutId="reminder-pill"
                            className="absolute inset-0 bg-emerald-500 rounded-full shadow-sm"
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          />
                        )}
                        <span className={`relative z-10 ${reminderDays === d ? 'text-white' : 'text-gray-600'}`}>
                          {d} day{d > 1 ? 's' : ''}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
            <button onClick={() => toast.success('Notification preferences saved!')}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              style={{ fontWeight: 500 }}>
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </motion.div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-black" style={{ fontSize: '1rem', fontWeight: 600 }}>Account Information</h3>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: '1rem', fontWeight: 700 }}>JD</span>
                </div>
                <div>
                  <p className="text-black" style={{ fontSize: '1rem', fontWeight: 600 }}>John Doe</p>
                  <p className="text-gray-500" style={{ fontSize: '0.8rem' }}>john@company.com · Pro Plan</p>
                </div>
                <button
                  onClick={() => toast.success('Profile updated!')}
                  className="ml-auto px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  style={{ fontSize: '0.8rem', fontWeight: 500 }}
                >
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>Current Password</label>
                  <input type="password" placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" style={{ fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1" style={{ fontSize: '0.75rem' }}>New Password</label>
                  <input type="password" placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" style={{ fontSize: '0.85rem' }} />
                </div>
              </div>
              <button onClick={() => toast.success('Password updated!')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                <Shield className="w-3.5 h-3.5" /> Update Password
              </button>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-red-600 mb-2" style={{ fontSize: '1rem', fontWeight: 600 }}>Danger Zone</h3>
              <p className="text-gray-500 mb-4" style={{ fontSize: '0.85rem' }}>Permanently delete your account and all associated data.</p>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                <Trash2 className="w-3.5 h-3.5" /> Delete Account
              </button>
            </GlassCard>
          </motion.div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm p-6 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-center text-black mb-2" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Delete Account?</h3>
              <p className="text-center text-gray-500 mb-6" style={{ fontSize: '0.85rem' }}>This action cannot be undone. All your data will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors" style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  Cancel
                </button>
                <button onClick={() => { setShowDeleteConfirm(false); toast.error('Account deletion is disabled in demo mode.'); }}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors" style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}