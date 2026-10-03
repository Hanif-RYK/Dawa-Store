import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { X, Eye, EyeOff, Lock, Mail, User as UserIcon, Phone, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    addToast,
  } = usePharmacy();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+92 ');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, setIsAuthModalOpen]);

  // Reset errors on tab change
  useEffect(() => {
    setErrors({});
    setForgotSent(false);
  }, [authModalTab]);

  if (!isAuthModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (authModalTab !== 'forgot') {
      if (!password) {
        errs.password = 'Password is required';
      } else if (password.length < 6) {
        errs.password = 'Password must be at least 6 characters';
      }
    }

    if (authModalTab === 'register') {
      if (!name.trim()) {
        errs.name = 'Full name is required';
      }
      if (!phone.trim() || phone.length < 10) {
        errs.phone = 'Valid Pakistani mobile number required (e.g. +92 300 1234567)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (authModalTab === 'login') {
        login(email, password);
        setIsAuthModalOpen(false);
      } else if (authModalTab === 'register') {
        register(name, email, phone, password);
        setIsAuthModalOpen(false);
      } else if (authModalTab === 'forgot') {
        setForgotSent(true);
        addToast({
          type: 'success',
          title: 'Reset Link Sent',
          message: `Password reset instructions sent to ${email}`,
        });
      }
    }, 600);
  };

  return (
    <div
      id="auth-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAuthModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop-animate"
    >
      <div
        id="auth-modal-content"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden modal-content-animate"
      >
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 rounded-full transition-all z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="pt-6 px-6 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-base">
              +
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 tracking-tight">DawaStore</span>
              <span className="text-xs text-emerald-600 font-semibold ml-1.5 px-1.5 py-0.5 bg-emerald-50 rounded">Account</span>
            </div>
          </div>

          <div className="flex border-b border-slate-200">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => setAuthModalTab('login')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                authModalTab === 'login'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => setAuthModalTab('register')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                authModalTab === 'register'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {forgotSent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Check your inbox</h4>
              <p className="text-sm text-slate-600 mt-1 mb-5">
                We sent a password reset link to <strong className="text-slate-800">{email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForgotSent(false);
                  setAuthModalTab('login');
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {authModalTab === 'forgot' && (
                <div className="mb-2">
                  <h4 className="text-base font-bold text-slate-800">Reset Password</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter the email associated with your account to receive instructions.
                  </p>
                </div>
              )}

              {authModalTab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      id="auth-name-input"
                      type="text"
                      placeholder="e.g. Mohammad Hanif"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                        errors.name ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    id="auth-email-input"
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                      errors.email ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>

              {authModalTab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone (For Delivery SMS & Order Updates)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      id="auth-phone-input"
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                        errors.phone ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                </div>
              )}

              {authModalTab !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    {authModalTab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthModalTab('forgot')}
                        className="text-xs text-emerald-600 hover:text-emerald-800 font-medium cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                        errors.password ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-500 mt-1">{errors.password}</p>
                  )}
                </div>
              )}

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                <span>
                  {authModalTab === 'login'
                    ? 'Sign In to My Account'
                    : authModalTab === 'register'
                    ? 'Complete Registration'
                    : 'Send Reset Link'}
                </span>
              </button>

              {authModalTab === 'forgot' && (
                <button
                  type="button"
                  onClick={() => setAuthModalTab('login')}
                  className="w-full text-center text-xs text-slate-600 hover:text-slate-900 font-medium py-1 cursor-pointer"
                >
                  Cancel and return to Sign In
                </button>
              )}

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>By continuing, you agree to DawaStore’s </span>
                <span className="text-emerald-600 underline">Terms of Service</span>
                <span> & </span>
                <span className="text-emerald-600 underline">Privacy Policy</span>.
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
