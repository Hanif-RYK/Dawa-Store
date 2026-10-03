import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { PaymentSettings, DEFAULT_PAYMENT_SETTINGS } from '../../types';
import { AutoExpandingTextarea } from '../common/AutoExpandingTextarea';
import {
  CreditCard,
  Banknote,
  Building2,
  ShieldCheck,
  Save,
  RotateCcw,
  Info,
  Trash2,
  Smartphone,
  KeyRound,
} from 'lucide-react';

type SettingsTab = 'wallets' | 'bank' | 'gateway';

export const AdminPaymentSettings: React.FC = () => {
  const { paymentSettings, updatePaymentSettings, addToast } = usePharmacy();
  const [formData, setFormData] = useState<PaymentSettings>(paymentSettings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('wallets');

  const handleSave = () => {
    updatePaymentSettings(formData);
    setHasUnsavedChanges(false);
    addToast({
      type: 'success',
      title: 'Payment Settings Saved!',
      message: 'Active payment accounts updated across Home Page, Footer, and Checkout.',
    });
  };

  const handleReset = () => {
    setFormData(DEFAULT_PAYMENT_SETTINGS);
    updatePaymentSettings(DEFAULT_PAYMENT_SETTINGS);
    setHasUnsavedChanges(false);
    addToast({
      type: 'info',
      title: 'Settings Reset',
      message: 'Restored default payment accounts setup.',
    });
  };

  const handleClearAll = () => {
    const emptySettings: PaymentSettings = {
      ...formData,
      jazzcash: {
        ...formData.jazzcash,
        accountTitle: '',
        accountNumber: '',
        tillNumber: '',
        gatewayMerchantId: '',
        gatewayPassword: '',
        gatewayHashKey: '',
      },
      easypaisa: {
        ...formData.easypaisa,
        accountTitle: '',
        accountNumber: '',
        tillNumber: '',
        gatewayStoreId: '',
        gatewayHashKey: '',
      },
      bankTransfer: {
        ...formData.bankTransfer,
        bankName: '',
        accountTitle: '',
        accountNumber: '',
        iban: '',
        raastId: '',
      },
      card: {
        ...formData.card,
        apiKey: '',
        secretKey: '',
      },
    };
    setFormData(emptySettings);
    updatePaymentSettings(emptySettings);
    setHasUnsavedChanges(false);
    addToast({
      type: 'info',
      title: 'Fields Cleared',
      message: 'All account fields have been cleared so you can enter your own details.',
    });
  };

  const updateField = <K extends keyof PaymentSettings>(key: K, value: PaymentSettings[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasUnsavedChanges(true);
  };

  // Count active per category
  const activeWalletsCount =
    (formData.cod.enabled ? 1 : 0) +
    (formData.jazzcash.enabled ? 1 : 0) +
    (formData.easypaisa.enabled ? 1 : 0);
  const activeBankCount = formData.bankTransfer.enabled ? 1 : 0;
  const activeGatewayCount = formData.card.enabled ? 1 : 0;

  return (
    <div className="space-y-5" id="admin-payment-settings">
      {/* CATEGORY TABS (Organized by function, zero mixing, responsive wrapping) */}
      <div className="p-1.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex flex-wrap items-center gap-2 shadow-inner mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('wallets')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'wallets'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
              : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Mobile Wallets & COD</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-xs font-black ${
              activeTab === 'wallets'
                ? 'bg-emerald-800 text-white'
                : activeWalletsCount > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {activeWalletsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'bank'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
              : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Bank Transfer & Raast</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-xs font-black ${
              activeTab === 'bank'
                ? 'bg-emerald-800 text-white'
                : activeBankCount > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {activeBankCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gateway')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'gateway'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
              : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Automated Gateways & Cards</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-xs font-black ${
              activeTab === 'gateway'
                ? 'bg-emerald-800 text-white'
                : activeGatewayCount > 0 ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {activeGatewayCount > 0 ? 'Active' : 'Off'}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MOBILE WALLETS & COD                                               */}
      {/* ========================================================================= */}
      {activeTab === 'wallets' && (
        <div className="space-y-5">
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 flex items-start gap-3">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              These are the direct mobile receiving accounts. When a customer selects JazzCash or EasyPaisa at checkout, your account number and title will be displayed so they can transfer funds and submit their Transaction ID (TID).
            </p>
          </div>

          {/* 1. Cash on Delivery (COD) */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              formData.cod.enabled
                ? 'bg-slate-800/90 border-emerald-500/60 shadow-sm'
                : 'bg-slate-900/50 border-slate-800 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">Cash on Delivery (COD)</h4>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        formData.cod.enabled
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {formData.cod.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customer pays the delivery rider in cash upon receiving their order.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cod.enabled}
                  onChange={(e) =>
                    updateField('cod', {
                      ...formData.cod,
                      enabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Sub-fields: visually disabled / greyed out when toggle is off */}
            <div
              className={`mt-4 pt-4 border-t border-slate-700/70 transition-opacity duration-200 ${
                formData.cod.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Customer Instructions at Checkout
              </label>
              <AutoExpandingTextarea
                rows={2}
                minRows={2}
                disabled={!formData.cod.enabled}
                value={formData.cod.instructions}
                onChange={(e) =>
                  updateField('cod', { ...formData.cod, instructions: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-hidden focus:border-emerald-500 leading-relaxed ${
                  !formData.cod.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                }`}
              />
            </div>
          </div>

          {/* 2. JazzCash Account */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              formData.jazzcash.enabled
                ? 'bg-slate-800/90 border-[#D81E27]/60 shadow-sm'
                : 'bg-slate-900/50 border-slate-800 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 rounded-full bg-[#D81E27] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFD200]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">JazzCash Direct Account</h4>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        formData.jazzcash.enabled
                          ? 'bg-[#D81E27]/20 text-rose-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {formData.jazzcash.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Receive payments to your JazzCash mobile account or Till number.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.jazzcash.enabled}
                  onChange={(e) =>
                    updateField('jazzcash', {
                      ...formData.jazzcash,
                      enabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>

            {/* Sub-fields: visually disabled / greyed out when toggle is off */}
            <div
              className={`mt-4 pt-4 border-t border-slate-700/70 space-y-4 transition-opacity duration-200 ${
                formData.jazzcash.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Account Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!formData.jazzcash.enabled}
                    value={formData.jazzcash.accountTitle}
                    onChange={(e) =>
                      updateField('jazzcash', {
                        ...formData.jazzcash,
                        accountTitle: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-rose-500 ${
                      !formData.jazzcash.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Name registered on JazzCash account
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    JazzCash Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!formData.jazzcash.enabled}
                    value={formData.jazzcash.accountNumber}
                    onChange={(e) =>
                      updateField('jazzcash', {
                        ...formData.jazzcash,
                        accountNumber: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-rose-500 font-mono ${
                      !formData.jazzcash.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Example: 0300-1234567
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Merchant Till Number (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={!formData.jazzcash.enabled}
                    value={formData.jazzcash.tillNumber || ''}
                    onChange={(e) =>
                      updateField('jazzcash', {
                        ...formData.jazzcash,
                        tillNumber: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-rose-500 font-mono ${
                      !formData.jazzcash.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Leave empty if using regular mobile account
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Checkout Instructions for Customer
                </label>
                <AutoExpandingTextarea
                  rows={2}
                  minRows={2}
                  disabled={!formData.jazzcash.enabled}
                  value={formData.jazzcash.instructions}
                  onChange={(e) =>
                    updateField('jazzcash', {
                      ...formData.jazzcash,
                      instructions: e.target.value,
                    })
                  }
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-hidden focus:border-rose-500 leading-relaxed ${
                    !formData.jazzcash.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 3. EasyPaisa Account */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              formData.easypaisa.enabled
                ? 'bg-slate-800/90 border-[#00A859]/60 shadow-sm'
                : 'bg-slate-900/50 border-slate-800 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center shrink-0">
                  <span className="text-[#00A859] font-black text-sm">easy</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">EasyPaisa Direct Account</h4>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        formData.easypaisa.enabled
                          ? 'bg-[#00A859]/20 text-emerald-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {formData.easypaisa.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Receive payments to your EasyPaisa mobile account or merchant Till.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.easypaisa.enabled}
                  onChange={(e) =>
                    updateField('easypaisa', {
                      ...formData.easypaisa,
                      enabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A859]"></div>
              </label>
            </div>

            {/* Sub-fields: visually disabled / greyed out when toggle is off */}
            <div
              className={`mt-4 pt-4 border-t border-slate-700/70 space-y-4 transition-opacity duration-200 ${
                formData.easypaisa.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Account Title <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!formData.easypaisa.enabled}
                    value={formData.easypaisa.accountTitle}
                    onChange={(e) =>
                      updateField('easypaisa', {
                        ...formData.easypaisa,
                        accountTitle: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 ${
                      !formData.easypaisa.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Name registered on EasyPaisa
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    EasyPaisa Mobile Number <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!formData.easypaisa.enabled}
                    value={formData.easypaisa.accountNumber}
                    onChange={(e) =>
                      updateField('easypaisa', {
                        ...formData.easypaisa,
                        accountNumber: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-mono ${
                      !formData.easypaisa.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Example: 0345-1234567
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Merchant Till Number (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={!formData.easypaisa.enabled}
                    value={formData.easypaisa.tillNumber || ''}
                    onChange={(e) =>
                      updateField('easypaisa', {
                        ...formData.easypaisa,
                        tillNumber: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-mono ${
                      !formData.easypaisa.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Leave empty if using regular mobile account
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Checkout Instructions for Customer
                </label>
                <AutoExpandingTextarea
                  rows={2}
                  minRows={2}
                  disabled={!formData.easypaisa.enabled}
                  value={formData.easypaisa.instructions}
                  onChange={(e) =>
                    updateField('easypaisa', {
                      ...formData.easypaisa,
                      instructions: e.target.value,
                    })
                  }
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-hidden focus:border-emerald-500 leading-relaxed ${
                    !formData.easypaisa.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BANK TRANSFER & RAAST                                              */}
      {/* ========================================================================= */}
      {activeTab === 'bank' && (
        <div className="space-y-5">
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 flex items-start gap-3">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Accept direct bank transfers from any Pakistani bank account or 1Link Raast ID (e.g. Meezan Bank, HBL, Bank Alfalah, MCB, etc.). Customers can copy your IBAN or Raast ID directly on the checkout screen.
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              formData.bankTransfer.enabled
                ? 'bg-slate-800/90 border-indigo-500/60 shadow-sm'
                : 'bg-slate-900/50 border-slate-800 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">Direct Bank Transfer / Raast (1Link)</h4>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        formData.bankTransfer.enabled
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {formData.bankTransfer.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Online bank transfer, Raast instant ID, or ATM fund transfer.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.bankTransfer.enabled}
                  onChange={(e) =>
                    updateField('bankTransfer', {
                      ...formData.bankTransfer,
                      enabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>

            {/* Sub-fields: visually disabled / greyed out when toggle is off */}
            <div
              className={`mt-4 pt-4 border-t border-slate-700/70 space-y-4 transition-opacity duration-200 ${
                formData.bankTransfer.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bank Name <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!formData.bankTransfer.enabled}
                    value={formData.bankTransfer.bankName}
                    onChange={(e) =>
                      updateField('bankTransfer', {
                        ...formData.bankTransfer,
                        bankName: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-indigo-500 ${
                      !formData.bankTransfer.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    e.g. Meezan Bank, HBL, Bank Alfalah
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Account Title <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!formData.bankTransfer.enabled}
                    value={formData.bankTransfer.accountTitle}
                    onChange={(e) =>
                      updateField('bankTransfer', {
                        ...formData.bankTransfer,
                        accountTitle: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-indigo-500 ${
                      !formData.bankTransfer.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Full business or personal account title
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Account Number (Branch / Local)
                  </label>
                  <input
                    type="text"
                    disabled={!formData.bankTransfer.enabled}
                    placeholder="e.g. 0102345678 or 10-16 digit account number"
                    value={formData.bankTransfer.accountNumber}
                    onChange={(e) =>
                      updateField('bankTransfer', {
                        ...formData.bankTransfer,
                        accountNumber: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-indigo-500 font-mono placeholder:text-slate-600 ${
                      !formData.bankTransfer.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block leading-relaxed">
                    Short local branch account number (usually 10–16 digits), used for same-bank branch transfers. Auto-populates from the trailing digits when a 24-character IBAN is entered.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      IBAN Number (24 Digits) <span className="text-indigo-400">*</span>
                    </label>
                    {formData.bankTransfer.enabled && formData.bankTransfer.iban && formData.bankTransfer.iban.length >= 16 && (
                      <button
                        type="button"
                        onClick={() => {
                          const rawIban = formData.bankTransfer.iban.trim().replace(/\s+/g, '');
                          // Standard Pakistani IBAN format: PK + 2 check digits + 4 bank code + 16 account digits
                          // Extract the core account number (last 14-16 digits) without leading zeros
                          let extracted = rawIban.slice(8);
                          if (!extracted && rawIban.length > 4) {
                            extracted = rawIban.slice(4);
                          }
                          // Strip redundant leading zeros for clean display if desired, or keep core branch digits
                          const cleanAcc = extracted.replace(/^0+/, '') || extracted;
                          updateField('bankTransfer', {
                            ...formData.bankTransfer,
                            accountNumber: cleanAcc,
                          });
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 cursor-pointer transition-colors"
                      >
                        Auto-extract account # from IBAN
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    disabled={!formData.bankTransfer.enabled}
                    placeholder="PK00BANK0000000000000000"
                    value={formData.bankTransfer.iban}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      const nextBank = {
                        ...formData.bankTransfer,
                        iban: val,
                      };
                      // If accountNumber is empty or was identical to the full IBAN, auto-populate the shorter distinct account number
                      const raw = val.trim().replace(/\s+/g, '');
                      if (raw.length === 24 && raw.startsWith('PK')) {
                        const coreAcc = raw.slice(8).replace(/^0+/, '') || raw.slice(8);
                        // Only auto-fill if account number is empty or currently matches the IBAN
                        if (
                          !formData.bankTransfer.accountNumber ||
                          formData.bankTransfer.accountNumber === formData.bankTransfer.iban
                        ) {
                          nextBank.accountNumber = coreAcc;
                        }
                      }
                      updateField('bankTransfer', nextBank);
                    }}
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-indigo-500 font-mono placeholder:text-slate-600 ${
                      !formData.bankTransfer.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block leading-relaxed">
                    International Bank Account Number (24 characters starting with PK). Required for inter-bank 1Link/1IBFT transfers across all Pakistani banks.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Raast ID (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={!formData.bankTransfer.enabled}
                    value={formData.bankTransfer.raastId || ''}
                    onChange={(e) =>
                      updateField('bankTransfer', {
                        ...formData.bankTransfer,
                        raastId: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-indigo-500 font-mono ${
                      !formData.bankTransfer.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Registered mobile number or Raast alias
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Checkout Instructions for Customer
                </label>
                <AutoExpandingTextarea
                  rows={2}
                  minRows={2}
                  disabled={!formData.bankTransfer.enabled}
                  value={formData.bankTransfer.instructions}
                  onChange={(e) =>
                    updateField('bankTransfer', {
                      ...formData.bankTransfer,
                      instructions: e.target.value,
                    })
                  }
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-hidden focus:border-indigo-500 leading-relaxed ${
                    !formData.bankTransfer.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AUTOMATED GATEWAYS & CARDS (API)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'gateway' && (
        <div className="space-y-5">
          <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-800/50 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-200 block">
                Automated Gateway Integrations (Advanced)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                This section is strictly for official merchant gateway credentials (Safepay, PayMob, JazzCash Merchant API, or EasyPaisa Store API). If you only accept direct mobile/bank transfers, you do not need to fill this out.
              </p>
            </div>
          </div>

          {/* Card Gateway */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              formData.card.enabled
                ? 'bg-slate-800/90 border-blue-500/60 shadow-sm'
                : 'bg-slate-900/50 border-slate-800 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">Credit & Debit Cards (Visa / Mastercard)</h4>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        formData.card.enabled
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {formData.card.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automated online debit/credit card processing via Pakistani payment gateway.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.card.enabled}
                  onChange={(e) =>
                    updateField('card', {
                      ...formData.card,
                      enabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {/* Sub-fields: visually disabled / greyed out when toggle is off */}
            <div
              className={`mt-4 pt-4 border-t border-slate-700/70 space-y-4 transition-opacity duration-200 ${
                formData.card.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gateway Provider
                  </label>
                  <select
                    disabled={!formData.card.enabled}
                    value={formData.card.provider}
                    onChange={(e) =>
                      updateField('card', {
                        ...formData.card,
                        provider: e.target.value as any,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-blue-500 cursor-pointer ${
                      !formData.card.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  >
                    <option value="safepay">Safepay Pakistan (Recommended)</option>
                    <option value="paymob">PayMob Pakistan</option>
                    <option value="stripe">Stripe International</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Environment Mode
                  </label>
                  <select
                    disabled={!formData.card.enabled}
                    value={formData.card.isSandbox ? 'sandbox' : 'live'}
                    onChange={(e) =>
                      updateField('card', {
                        ...formData.card,
                        isSandbox: e.target.value === 'sandbox',
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-blue-500 cursor-pointer ${
                      !formData.card.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  >
                    <option value="sandbox">Sandbox (Testing / Demo)</option>
                    <option value="live">Live Production (Real Transactions)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    API / Public Key
                  </label>
                  <input
                    type="text"
                    disabled={!formData.card.enabled}
                    value={formData.card.apiKey || ''}
                    onChange={(e) =>
                      updateField('card', {
                        ...formData.card,
                        apiKey: e.target.value,
                      })
                    }
                    className={`w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-blue-500 font-mono ${
                      !formData.card.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* JazzCash & EasyPaisa Merchant API Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* JazzCash API */}
            <div
              className={`p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 transition-opacity duration-200 ${
                formData.jazzcash.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  JazzCash Merchant API (Optional)
                </h5>
              </div>
              <p className="text-xs text-slate-400">
                Only for JazzCash corporate merchant portal accounts.
              </p>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Merchant ID</label>
                  <input
                    type="text"
                    disabled={!formData.jazzcash.enabled}
                    value={formData.jazzcash.gatewayMerchantId || ''}
                    onChange={(e) =>
                      updateField('jazzcash', {
                        ...formData.jazzcash,
                        gatewayMerchantId: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono ${
                      !formData.jazzcash.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Merchant Password</label>
                  <input
                    type="password"
                    disabled={!formData.jazzcash.enabled}
                    value={formData.jazzcash.gatewayPassword || ''}
                    onChange={(e) =>
                      updateField('jazzcash', {
                        ...formData.jazzcash,
                        gatewayPassword: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono ${
                      !formData.jazzcash.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Hash / Salt Key</label>
                  <input
                    type="password"
                    disabled={!formData.jazzcash.enabled}
                    value={formData.jazzcash.gatewayHashKey || ''}
                    onChange={(e) =>
                      updateField('jazzcash', {
                        ...formData.jazzcash,
                        gatewayHashKey: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono ${
                      !formData.jazzcash.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* EasyPaisa API */}
            <div
              className={`p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 transition-opacity duration-200 ${
                formData.easypaisa.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  EasyPaisa Store Gateway API (Optional)
                </h5>
              </div>
              <p className="text-xs text-slate-400">
                Only for EasyPaisa online corporate payment portal accounts.
              </p>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Store ID</label>
                  <input
                    type="text"
                    disabled={!formData.easypaisa.enabled}
                    value={formData.easypaisa.gatewayStoreId || ''}
                    onChange={(e) =>
                      updateField('easypaisa', {
                        ...formData.easypaisa,
                        gatewayStoreId: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono ${
                      !formData.easypaisa.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Hash / Secret Key</label>
                  <input
                    type="password"
                    disabled={!formData.easypaisa.enabled}
                    value={formData.easypaisa.gatewayHashKey || ''}
                    onChange={(e) =>
                      updateField('easypaisa', {
                        ...formData.easypaisa,
                        gatewayHashKey: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono ${
                      !formData.easypaisa.enabled ? 'cursor-not-allowed bg-slate-900/60 text-slate-500' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save / Discard Bar (Consistent rhythm & styling with Store Settings) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/95 border border-slate-700 shadow-xl mt-8">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className={`w-2.5 h-2.5 rounded-full ${hasUnsavedChanges ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
          <span className="text-xs text-slate-300 font-medium">
            {hasUnsavedChanges
              ? 'Unsaved payment account modifications.'
              : 'All payment accounts synchronized live with checkout and storefront.'}
          </span>
        </div>
        <div className="flex items-center gap-2.5 justify-end flex-wrap">
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-rose-300 bg-slate-700/40 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer border border-slate-600/60 flex items-center gap-1.5"
            title="Clear all fields to enter your own accounts"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear Fields</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-700/40 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-600/60 flex items-center gap-1.5"
            title="Reset to default payment configurations"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            disabled={!hasUnsavedChanges}
            onClick={() => {
              setFormData(paymentSettings);
              setHasUnsavedChanges(false);
            }}
            className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-700/80 hover:bg-slate-700 active:bg-slate-600 rounded-xl transition-colors cursor-pointer border border-slate-600 disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-black rounded-xl shadow-md transition-all cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-400/40 shadow-emerald-500/20'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-900/30'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{hasUnsavedChanges ? 'Save Settings *' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
