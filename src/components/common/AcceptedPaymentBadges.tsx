import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { getActivePaymentMethods, ActivePaymentMethodInfo } from '../../types';
import { Banknote, CreditCard, Building2 } from 'lucide-react';

interface AcceptedPaymentBadgesProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md';
  showTitle?: boolean;
  titleText?: string;
}

export const AcceptedPaymentBadges: React.FC<AcceptedPaymentBadgesProps> = ({
  className = '',
  variant = 'dark',
  size = 'sm',
  showTitle = true,
  titleText = 'Accepted Payment Methods:',
}) => {
  const { paymentSettings } = usePharmacy();
  const activeMethods = getActivePaymentMethods(paymentSettings);

  if (activeMethods.length === 0) {
    return null;
  }

  const isDark = variant === 'dark';
  const badgeHeight = size === 'sm' ? 'h-7' : 'h-8';
  const textSize = size === 'sm' ? 'text-xs' : 'text-xs';

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {showTitle && (
        <span
          className={`text-xs font-semibold mr-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {titleText}
        </span>
      )}

      {activeMethods.map((method) => {
        switch (method.badgeType) {
          case 'cod':
            return (
              <div
                key={method.id}
                className={`${badgeHeight} px-2.5 rounded-md border flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
                title="Cash on Delivery (COD) - Pay when rider arrives"
              >
                <Banknote className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className={`${textSize} font-bold whitespace-nowrap`}>
                  Cash on Delivery
                </span>
              </div>
            );

          case 'jazzcash':
            return (
              <div
                key={method.id}
                className={`${badgeHeight} px-2.5 rounded-md border flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 ${
                  isDark
                    ? 'bg-[#171717] border-neutral-700'
                    : 'bg-neutral-900 border-neutral-800'
                }`}
                title="JazzCash Mobile Account & Instant Gateway"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#D81E27] flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFD200]"></div>
                </div>
                <div className={`flex items-center ${textSize} font-black tracking-tight leading-none`}>
                  <span className="text-white">Jazz</span>
                  <span className="text-[#D81E27]">Cash</span>
                </div>
              </div>
            );

          case 'easypaisa':
            return (
              <div
                key={method.id}
                className={`${badgeHeight} px-2.5 rounded-md border flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 ${
                  isDark
                    ? 'bg-white border-slate-200'
                    : 'bg-white border-slate-300'
                }`}
                title="Easypaisa Mobile Wallet & Merchant Gateway"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#00A859] flex items-center justify-center text-white font-black text-[9px] leading-none shrink-0">
                  e
                </div>
                <div className={`flex items-center ${textSize} font-black tracking-tight leading-none`}>
                  <span className="text-[#00A859]">easy</span>
                  <span className="text-slate-900">paisa</span>
                </div>
              </div>
            );

          case 'card':
            return (
              <React.Fragment key={method.id}>
                {/* Visa Badge */}
                <div
                  className={`${badgeHeight} px-2.5 bg-white rounded-md border border-slate-200 flex items-center justify-center shadow-xs transition-transform hover:scale-105`}
                  title="Visa Debit / Credit Card"
                >
                  <span className="font-black italic text-[#1A1F71] text-xs tracking-wider">
                    VISA
                  </span>
                </div>

                {/* MasterCard Badge */}
                <div
                  className={`${badgeHeight} px-2 bg-white rounded-md border border-slate-200 flex items-center gap-1 shadow-xs transition-transform hover:scale-105`}
                  title="MasterCard Debit / Credit Card"
                >
                  <div className="flex items-center -space-x-1 shrink-0">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90 mix-blend-multiply"></div>
                  </div>
                  <span className="font-bold text-slate-800 text-xs tracking-tight">
                    mastercard
                  </span>
                </div>
              </React.Fragment>
            );

          case 'bank':
            return (
              <div
                key={method.id}
                className={`${badgeHeight} px-2 rounded-md border flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
                title="Bank Transfer (IBAN / Raast / 1Link)"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className={`${textSize} font-bold whitespace-nowrap`}>
                  Bank / Raast
                </span>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
