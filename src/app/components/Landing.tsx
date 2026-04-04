import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '../lib/store';
import {
  FileText, ArrowRight, BarChart3, Send, Zap, Shield, Globe, ChevronRight,
  X, Play, Check, Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Landing() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    login();
    navigate('/dashboard');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/dashboard');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
    setShowForgotPassword(false);
    setForgotSent(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
    setShowForgotPassword(false);
  };

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setShowLogin(false);
    setForgotSent(false);
  };

  const closeAllModals = () => {
    setShowLogin(false);
    setShowDemo(false);
    setShowForgotPassword(false);
    setShowSignup(false);
    setForgotSent(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8faf9 25%, #ecfdf5 50%, #ffffff 70%, #f0fdf4 100%)' }}>
      {/* Background decorations */}
      <div className="absolute top-[-200px] right-[-150px] w-[600px] h-[600px] rounded-full bg-emerald-200/30 blur-[120px]" />
      <div className="absolute bottom-[-300px] left-[-200px] w-[500px] h-[500px] rounded-full bg-emerald-100/40 blur-[100px]" />
      <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-emerald-50/50 blur-[80px]" />

      {/* Nav */}
      <div className="sticky top-0 z-20 w-full" style={{ padding: '14px 40px 0' }}>
        <nav className="flex items-center justify-between h-[56px] rounded-2xl bg-white/60 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/50" style={{ padding: '0 24px' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/25">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-black tracking-tight" style={{ fontSize: '1.1rem', fontWeight: 700 }}>InvoiceFlow</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={openLogin}
              className="px-4 py-1.5 rounded-full text-gray-700 hover:text-black hover:bg-black/[0.04] transition-all duration-200"
              style={{ fontSize: '0.82rem', fontWeight: 500 }}
            >
              Sign In
            </button>
            <button
              onClick={openSignup}
              className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 shadow-md shadow-black/10"
              style={{ fontSize: '0.82rem', fontWeight: 500 }}
            >
              Sign Up
            </button>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center text-center pt-20 pb-20" style={{ padding: '80px 40px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-8">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Next-gen invoicing platform</span>
          </div>
          <h1 className="max-w-3xl mx-auto text-black" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Invoicing made
            <span className="text-emerald-500"> effortless</span>,
            <br />beautifully simple.
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-gray-500" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            Create, customize, and send professional invoices in seconds. Track payments, manage clients, and grow your business with powerful analytics.
          </p>
          <div className="flex items-center gap-4 mt-10 justify-center">
            <button
              onClick={openSignup}
              className="group flex items-center gap-2 px-7 py-3.5 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              style={{ fontSize: '0.95rem', fontWeight: 500 }}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="group flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              style={{ fontSize: '0.95rem', fontWeight: 500 }}
            >
              <Play className="w-4 h-4 text-emerald-500" />
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full"
          id="features"
        >
          {[
            { icon: FileText, title: 'Smart Invoicing', desc: 'Create customizable invoices with live preview, any currency, and professional templates.' },
            { icon: BarChart3, title: 'Analytics & Insights', desc: 'Track revenue, overdue payments, and client metrics with beautiful visual dashboards.' },
            { icon: Send, title: 'Instant Delivery', desc: 'Send invoices directly via email with automated reminders and recurring billing.' },
          ].map((f, i) => (
            <button
              key={i}
              onClick={openSignup}
              className="group p-8 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                <f.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-black mb-2" style={{ fontSize: '1.15rem', fontWeight: 600 }}>{f.title}</h3>
              <p className="text-gray-500" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-emerald-600 group-hover:gap-2 transition-all" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          ))}
        </motion.div>

        {/* Trust bar */}
        <div className="mt-20 flex items-center gap-8 opacity-40">
          {[Shield, Globe, Zap].map((Icon, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-400">
              <Icon className="w-4 h-4" />
              <span style={{ fontSize: '0.8rem' }}>{['Bank-grade Security', 'Global Currencies', 'Lightning Fast'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========== MODALS ========== */}
      <AnimatePresence>
        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeAllModals}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl relative"
            >
              <button onClick={closeAllModals} className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="text-black" style={{ fontSize: '1.1rem', fontWeight: 600 }}>InvoiceFlow</span>
              </div>
              <h2 className="text-black mb-1" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Welcome back</h2>
              <p className="text-gray-500 mb-6" style={{ fontSize: '0.85rem' }}>Sign in to your account to continue</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-gray-700 mb-1.5 block" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      style={{ fontSize: '0.875rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-700 mb-1.5 block" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      style={{ fontSize: '0.875rem' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                      {rememberMe && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-gray-500" style={{ fontSize: '0.8rem' }}>Remember me</span>
                  </label>
                  <button type="button" onClick={openForgotPassword} className="text-emerald-600 hover:text-emerald-700" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Forgot password?</button>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  style={{ fontWeight: 500 }}
                >
                  Sign In <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-center text-gray-400" style={{ fontSize: '0.8rem' }}>
                  Don't have an account?{' '}
                  <button type="button" onClick={openSignup} className="text-emerald-600 hover:text-emerald-700" style={{ fontWeight: 500 }}>Start free trial</button>
                </p>
              </form>
            </motion.div>
          </div>
        )}

        {/* Signup Modal */}
        {showSignup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeAllModals}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl relative"
            >
              <button onClick={closeAllModals} className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="text-black" style={{ fontSize: '1.1rem', fontWeight: 600 }}>InvoiceFlow</span>
              </div>
              <h2 className="text-black mb-1" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Create your account</h2>
              <p className="text-gray-500 mb-6" style={{ fontSize: '0.85rem' }}>It's completely free — no credit card needed</p>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-gray-700 mb-1.5 block" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Full Name</label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label className="text-gray-700 mb-1.5 block" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Email</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label className="text-gray-700 mb-1.5 block" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Password</label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  style={{ fontWeight: 500 }}
                >
                  Create Account <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-gray-400" style={{ fontSize: '0.8rem' }}>
                  Already have an account?{' '}
                  <button type="button" onClick={openLogin} className="text-emerald-600 hover:text-emerald-700" style={{ fontWeight: 500 }}>Sign in</button>
                </p>
              </form>
            </motion.div>
          </div>
        )}

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeAllModals}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl relative"
            >
              <button onClick={closeAllModals} className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <span className="text-black" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Reset Password</span>
              </div>
              {!forgotSent ? (
                <>
                  <h2 className="text-black mb-1" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Forgot your password?</h2>
                  <p className="text-gray-500 mb-6" style={{ fontSize: '0.85rem' }}>Enter your email and we'll send you a reset link</p>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="text-gray-700 mb-1.5 block" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Email Address</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                        style={{ fontSize: '0.875rem' }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                      style={{ fontWeight: 500 }}
                    >
                      Send Reset Link
                    </button>
                    <p className="text-center">
                      <button type="button" onClick={openLogin} className="text-emerald-600 hover:text-emerald-700" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        ← Back to Sign In
                      </button>
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                    <Mail className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h2 className="text-black mb-2" style={{ fontSize: '1.3rem', fontWeight: 600 }}>Check your email</h2>
                  <p className="text-gray-500 mb-6 max-w-xs mx-auto" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                    We've sent a password reset link to <strong className="text-black">{forgotEmail || 'your email'}</strong>
                  </p>
                  <button
                    onClick={openLogin}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    style={{ fontSize: '0.85rem', fontWeight: 500 }}
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Demo Modal */}
        {showDemo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={closeAllModals}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-3xl rounded-3xl bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden relative"
            >
              <button onClick={closeAllModals} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors text-gray-500 hover:text-black shadow">
                <X className="w-4 h-4" />
              </button>
              {/* Demo Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
                <button
                  onClick={() => { closeAllModals(); login(); navigate('/dashboard'); }}
                  className="relative w-20 h-20 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-white/25 transition-all group shadow-2xl"
                >
                  <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                </button>
                <p className="text-white/70 mt-5" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Click to explore the live dashboard</p>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-black" style={{ fontSize: '1.05rem', fontWeight: 600 }}>See InvoiceFlow in action</h3>
                  <p className="text-gray-500" style={{ fontSize: '0.8rem' }}>Experience the full dashboard with sample data</p>
                </div>
                <button
                  onClick={() => { closeAllModals(); login(); navigate('/dashboard'); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                  style={{ fontSize: '0.85rem', fontWeight: 500 }}
                >
                  Try Live Demo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}