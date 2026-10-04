import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePharmacy();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="print:hidden fixed bottom-5 left-4 right-4 sm:left-auto sm:right-5 sm:w-auto sm:max-w-sm z-50 flex flex-col gap-2.5 pointer-events-none items-center sm:items-end"
    >
      {toasts.map((toast) => {
        let bgColor = 'bg-slate-900 text-white';
        let Icon = Info;
        let iconColor = 'text-sky-400';

        if (toast.type === 'success') {
          bgColor = 'bg-emerald-900/95 text-emerald-50 border-emerald-700/60';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error') {
          bgColor = 'bg-rose-900/95 text-rose-50 border-rose-700/60';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          bgColor = 'bg-amber-950/95 text-amber-50 border-amber-700/60';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        } else {
          bgColor = 'bg-slate-900/95 text-slate-50 border-slate-700/60';
          Icon = Info;
          iconColor = 'text-sky-400';
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${bgColor}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm">
              <p className="font-semibold">{toast.title}</p>
              {toast.message && (
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              id={`toast-close-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
