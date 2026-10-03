import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  CircleAlert,
  Key,
  Shield,
} from 'lucide-react';

export const StaffLoginPage: React.FC = () => {
  const { adminLogin, navigate } = usePharmacy();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (password !== expectedPassword) {
      setError('Invalid credentials.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const role = email.includes('pharmacist') ? 'pharmacist' : 'admin';
      if (adminLogin(email, role)) {
        navigate('/admin');
      }
    }, 800);
  };
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Shield className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">Staff Portal</h2>
        <p className="text-center text-slate-400 text-sm mb-8">
          Authorized access only. Please sign in with your staff credentials.
        </p>
        {error && (
          <div className="bg-rose-950/50 border border-rose-900/50 text-rose-400 p-4 rounded-xl flex items-start gap-3 mb-6 text-sm">
            <CircleAlert className="w-5 h-5 shrink-0" />
            <p role="alert">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="staff-email" className="block text-slate-300 text-sm font-semibold mb-2">
              Staff Email
            </label>
            <input
              id="staff-email"
              type="email"
              autoComplete="username"
              placeholder="admin@dawastore.pk or pharmacist@dawastore.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600"
            />
          </div>
          <div>
            <label htmlFor="staff-password" className="block text-slate-300 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              id="staff-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Key className="w-5 h-5" />
                <span>Secure Sign In</span>
              </>
            )}
          </button>
        </form>
        <div className="mt-8 text-center">
          <a href="#/" className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">
            ← Back to Storefront
          </a>
        </div>
      </div>
    </div>
  );
};
