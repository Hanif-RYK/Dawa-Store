import React, { useState, useMemo } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { StoreSettings, DEFAULT_STORE_SETTINGS } from '../../types';
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Share2,
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  Plus,
  X,
  Building2,
  Globe,
  ExternalLink,
  Clock,
  HelpCircle,
  Loader2,
  Sparkles,
  Upload,
  Eye,
  Image as ImageIcon,
  FileCheck,
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { AutoExpandingTextarea } from '../common/AutoExpandingTextarea';
import { PAKISTANI_CITIES } from '../../data/mockData';

// Deduplication helper to ensure no policy text is repeated or has redundant embedded titles/labels
const sanitizePolicyText = (text: string | undefined, fallbackKey?: keyof typeof DEFAULT_STORE_SETTINGS.policies): string => {
  if (!text || typeof text !== 'string') {
    return fallbackKey ? DEFAULT_STORE_SETTINGS.policies[fallbackKey] || '' : '';
  }
  let cleaned = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // 1. Remove duplicate identical halves if string was accidentally doubled
  const half = Math.floor(cleaned.length / 2);
  const part1 = cleaned.slice(0, half).trim();
  const part2 = cleaned.slice(half).trim();
  if (part1 && part2 && part1 === part2) {
    cleaned = part1;
  }

  // 2. Remove any embedded UI headers or labels that might have leaked into saved policy text
  const displayedAtLineRegex = /(?:^|\n)[^\n]*(?:Displayed\s+at\s*\/|\/(?:returns|privacy|terms|about|shipping))[^\n]*(?:\n|$)/gi;
  cleaned = cleaned.replace(displayedAtLineRegex, '\n\n');

  const headerLineRegex = /(?:^|\n)[^\n]*(?:Return,?\s*Exchange\s*&\s*Refund|Privacy(?:\s*&\s*Patient\s*Health\s*Data\s*Security)?\s*Policy|Terms\s*&\s*Conditions|About\s*Us(?:\s*&\s*Company\s*Vision)?|Express\s*Delivery(?:\s*&\s*Cold-Chain)?\s*Policy)[^\n]*(?:\n|$)/gi;
  cleaned = cleaned.replace(headerLineRegex, '\n\n');

  // 3. Clean up excessive newlines left behind
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  // 4. Fallback if content was corrupted or too short
  if (cleaned.length < 35 && fallbackKey && DEFAULT_STORE_SETTINGS.policies[fallbackKey]) {
    return DEFAULT_STORE_SETTINGS.policies[fallbackKey];
  }

  return cleaned;
};

export const AdminStoreSettings: React.FC = () => {
  const { storeSettings, updateStoreSettings, addToast, navigate, setIsLicenseModalOpen } = usePharmacy();

  const [formData, setFormData] = useState<StoreSettings>(() => {
    return {
      ...storeSettings,
      policies: {
        aboutUs: sanitizePolicyText(storeSettings.policies?.aboutUs, 'aboutUs'),
        returnPolicy: sanitizePolicyText(storeSettings.policies?.returnPolicy, 'returnPolicy'),
        privacyPolicy: sanitizePolicyText(storeSettings.policies?.privacyPolicy, 'privacyPolicy'),
        termsConditions: sanitizePolicyText(storeSettings.policies?.termsConditions, 'termsConditions'),
        shippingPolicy: sanitizePolicyText(storeSettings.policies?.shippingPolicy, 'shippingPolicy'),
      },
    };
  });

  // Sync formData if storeSettings updates from context
  React.useEffect(() => {
    setFormData((prev) => ({
      ...storeSettings,
      policies: {
        aboutUs: sanitizePolicyText(storeSettings.policies?.aboutUs, 'aboutUs'),
        returnPolicy: sanitizePolicyText(storeSettings.policies?.returnPolicy, 'returnPolicy'),
        privacyPolicy: sanitizePolicyText(storeSettings.policies?.privacyPolicy, 'privacyPolicy'),
        termsConditions: sanitizePolicyText(storeSettings.policies?.termsConditions, 'termsConditions'),
        shippingPolicy: sanitizePolicyText(storeSettings.policies?.shippingPolicy, 'shippingPolicy'),
      },
    }));
  }, [storeSettings]);
  const [activeSubTab, setActiveSubTab] = useState<
    'contact' | 'licensing' | 'delivery' | 'social' | 'policies'
  >('contact');
  const [newCityInput, setNewCityInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);

  // Compute unsaved changes live
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(storeSettings);
  }, [formData, storeSettings]);

  // Handle simple field changes
  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Certificate image size must be under 5MB.',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleChange('licenseCertificateImage', reader.result);
        addToast({
          type: 'success',
          title: 'Certificate Uploaded',
          message: 'License certificate file loaded successfully. Click Save Changes to apply.',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle nested social links
  const handleSocialChange = (field: keyof StoreSettings['socialLinks'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value,
      },
    }));
  };

  // Handle nested policies
  const handlePolicyChange = (field: keyof StoreSettings['policies'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      policies: {
        ...prev.policies,
        [field]: value,
      },
    }));
  };

  // City Tag Management
  const handleAddCity = (cityToAdd?: string) => {
    const city = (cityToAdd || newCityInput).trim();
    if (!city) return;
    if (formData.expressDeliveryCities.some((c) => c.toLowerCase() === city.toLowerCase())) {
      addToast({
        type: 'warning',
        title: 'City Already Added',
        message: `${city} is already in the Express Delivery list.`,
      });
      setNewCityInput('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      expressDeliveryCities: [...prev.expressDeliveryCities, city],
    }));
    setNewCityInput('');
    addToast({
      type: 'success',
      title: 'City Added',
      message: `${city} added to 2-4 Hours Express Delivery coverage.`,
    });
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      expressDeliveryCities: prev.expressDeliveryCities.filter((c) => c !== cityToRemove),
    }));
  };

  // Save Settings
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const sanitizedData: StoreSettings = {
        ...formData,
        policies: {
          aboutUs: sanitizePolicyText(formData.policies.aboutUs, 'aboutUs'),
          returnPolicy: sanitizePolicyText(formData.policies.returnPolicy, 'returnPolicy'),
          privacyPolicy: sanitizePolicyText(formData.policies.privacyPolicy, 'privacyPolicy'),
          termsConditions: sanitizePolicyText(formData.policies.termsConditions, 'termsConditions'),
          shippingPolicy: sanitizePolicyText(formData.policies.shippingPolicy, 'shippingPolicy'),
        },
      };
      setFormData(sanitizedData);
      updateStoreSettings(sanitizedData);
      setIsSaving(false);
      setShowSaveSuccessModal(true);
      addToast({
        type: 'success',
        title: 'Settings Saved Successfully',
        message: 'Store contact details, licensing, delivery cities, and policies have been updated live across the app.',
      });
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation (Responsive wrapping, zero cut-off) */}
      <div className="p-1.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex flex-wrap items-center gap-2 shadow-inner mb-6">
        {[
          { id: 'contact', label: 'Contact & Helpline', icon: PhoneCall },
          { id: 'licensing', label: 'Pharmacy Reg & License', icon: ShieldCheck },
          { id: 'delivery', label: '2-4 Hr Express Cities', icon: Truck, count: formData.expressDeliveryCities.length },
          { id: 'social', label: 'Social Media & WhatsApp', icon: Share2 },
          { id: 'policies', label: 'Policies & Help Content', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                  : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs font-black ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: CONTACT & HELPLINE */}
      {activeSubTab === 'contact' && (
        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-5 max-w-4xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            Customer Helpline & Communication Numbers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Toll-Free Helpline (24/7) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.helpline}
                  onChange={(e) => handleChange('helpline', e.target.value)}
                  placeholder="e.g. 0800-74276"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Displayed in the header, footer guarantees, and public contact card.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Universal Access Number (UAN)
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.uan}
                  onChange={(e) => handleChange('uan', e.target.value)}
                  placeholder="e.g. +92 21 111-329-278"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Official landline or UAN for customer service calls.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Support Mobile / Phone
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                WhatsApp Support Phone
              </label>
              <div className="relative">
                <WhatsAppIcon className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                General Support Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  placeholder="e.g. support@dawastore.pk"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pharmacist Prescription Desk Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={formData.pharmacistEmail}
                  onChange={(e) => handleChange('pharmacistEmail', e.target.value)}
                  placeholder="e.g. pharmacist@dawastore.pk"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Physical Pharmacy / Warehouse Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. Plot 42-C, Medical District, Shahrah-e-Faisal, Karachi, Pakistan"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Operating Hours & Customer Care Schedule
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => handleChange('operatingHours', e.target.value)}
                placeholder="e.g. 24/7 Digital Pharmacy & Customer Care Desk"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PHARMACY REGISTRATION & LICENSING */}
      {activeSubTab === 'licensing' && (
        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-6 max-w-3xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-700/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">DRAP & Health Department Pharmacy Licensing</h3>
              <p className="text-xs text-slate-400">
                Ensure regulatory compliance by displaying official licensing certificates and registered pharmacist details.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pharmacy / Business Trade Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={formData.pharmacyName}
                onChange={(e) => handleChange('pharmacyName', e.target.value)}
                placeholder="e.g. DawaStore Online Pharmacy"
                className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. 100% Genuine Pakistani Pharmacy & Health Delivery"
                className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pharmacy Registration / License Number <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.pharmacyRegNumber}
                    onChange={(e) => handleChange('pharmacyRegNumber', e.target.value)}
                    placeholder="e.g. 09412 or Form-9/2026-DRAP"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Displayed in the header and footer: &ldquo;Pharmacy Reg # {formData.pharmacyRegNumber}&rdquo;</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  License Classification / Form Type
                </label>
                <input
                  type="text"
                  value={formData.licenseType || ''}
                  onChange={(e) => handleChange('licenseType', e.target.value)}
                  placeholder="e.g. Form-9 (Retail Pharmacy & Digital Dispensary Drug Sale License)"
                  className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Chief In-Charge Pharmacist (Pharm-D)
                </label>
                <input
                  type="text"
                  value={formData.chiefPharmacist}
                  onChange={(e) => handleChange('chiefPharmacist', e.target.value)}
                  placeholder="e.g. Dr. Sarah Khan, Pharm-D"
                  className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pharmacist Registration Number (PCP / Council)
                </label>
                <input
                  type="text"
                  value={formData.rPhNumber || ''}
                  onChange={(e) => handleChange('rPhNumber', e.target.value)}
                  placeholder="e.g. R.Ph # 4182 (Pharmacy Council of Pakistan)"
                  className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  License Issue Date
                </label>
                <input
                  type="text"
                  value={formData.licenseIssueDate || ''}
                  onChange={(e) => handleChange('licenseIssueDate', e.target.value)}
                  placeholder="e.g. 15 Jan 2022"
                  className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  License Expiry / Renewal Date
                </label>
                <input
                  type="text"
                  value={formData.licenseExpiryDate || ''}
                  onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
                  placeholder="e.g. 31 Dec 2027"
                  className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Regulatory & Licensing Authority
              </label>
              <AutoExpandingTextarea
                rows={2}
                minRows={2}
                value={formData.licensingAuthority}
                onChange={(e) => handleChange('licensingAuthority', e.target.value)}
                placeholder="e.g. Drug Regulatory Authority of Pakistan (DRAP) & Provincial Health Dept"
                className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* Official Drug Sale License Certificate Upload & Image */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Official Drug Sale License Certificate Scan</span>
                </div>
                <span className="text-xs text-slate-400">JPEG, PNG, WebP (Max 5MB)</span>
              </div>

              {/* Upload Input & URL input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Upload Scan from Device
                  </label>
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-emerald-400 hover:text-emerald-300 text-xs font-bold rounded-xl border border-dashed border-emerald-500/40 transition-all cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Choose Certificate File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCertificateUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Or Paste Certificate Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.licenseCertificateImage || ''}
                    onChange={(e) => handleChange('licenseCertificateImage', e.target.value)}
                    placeholder="https://example.com/license-scan.jpg"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Current Certificate Preview Thumbnail */}
              {formData.licenseCertificateImage && (
                <div className="relative p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={formData.licenseCertificateImage}
                      alt="Certificate Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-slate-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-200 block truncate">
                        Drug Sale License Scan Attached
                      </span>
                      <span className="text-xs text-slate-400 block truncate">
                        Form-9 #{formData.pharmacyRegNumber} • Active
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsLicenseModalOpen(true)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Live Modal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('licenseCertificateImage', '')}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Remove Certificate"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Badge Preview */}
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300">
                      Public Verification Badge
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono font-bold border border-emerald-700">
                      Reg #{formData.pharmacyRegNumber || '09412'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Licensed & Inspected by {formData.licensingAuthority}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLicenseModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Test Verification Dialog</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 2-4 HOURS EXPRESS DELIVERY CITIES */}
      {activeSubTab === 'delivery' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">2 to 4 Hours Express Delivery Cities Configuration</h3>
                  <p className="text-xs text-slate-400">
                    Specify which cities have active motorcycle delivery hubs for urgent prescription fulfillment.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Total Active Cities:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white text-xs font-black">
                  {formData.expressDeliveryCities.length} Cities
                </span>
              </div>
            </div>

            {/* Delivery Times & Thresholds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Express Delivery Time
                </label>
                <input
                  type="text"
                  value={formData.expressDeliveryTime}
                  onChange={(e) => handleChange('expressDeliveryTime', e.target.value)}
                  placeholder="e.g. 2 to 4 Hours"
                  className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nationwide Delivery Time
                </label>
                <input
                  type="text"
                  value={formData.standardDeliveryTime}
                  onChange={(e) => handleChange('standardDeliveryTime', e.target.value)}
                  placeholder="e.g. 24 to 48 Hours"
                  className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Free Shipping Threshold (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.freeDeliveryThreshold}
                  onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                  placeholder="2000"
                  className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 font-bold"
                />
                <p className="text-xs text-emerald-400 mt-1">
                  Controls the "You unlocked FREE express delivery" bar in Cart & Checkout. Orders above this get Rs. 0 shipping.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Standard Delivery Fee (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.deliveryFee}
                  onChange={(e) => handleChange('deliveryFee', Number(e.target.value))}
                  placeholder="150"
                  className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 font-bold"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Charged on orders below the free shipping threshold.
                </p>
              </div>
            </div>

            {/* Active Express Cities Tags */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-200">
                Active Express Delivery Cities ({formData.expressDeliveryCities.length})
              </label>

              <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                {formData.expressDeliveryCities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold shadow-xs"
                  >
                    <span>{city}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(city)}
                      className="text-emerald-400 hover:text-rose-400 cursor-pointer p-0.5 transition-colors"
                      title={`Remove ${city}`}
                      aria-label={`Remove ${city}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {formData.expressDeliveryCities.length === 0 && (
                  <span className="text-xs text-slate-500 italic flex items-center">
                    No express cities configured yet. Add cities below.
                  </span>
                )}
              </div>
            </div>

            {/* Add Custom City Form */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-300">
                Add New City to Express Delivery Coverage
              </label>
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="text"
                  value={newCityInput}
                  onChange={(e) => setNewCityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCity();
                    }
                  }}
                  placeholder="Type city name (e.g. Rahim Yar Khan, Hyderabad, Gujranwala)"
                  className="flex-1 px-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddCity()}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add City</span>
                </button>
              </div>

              {/* Quick Add Suggestions from major Pakistani Cities */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-1.5">
                  Quick Add Pakistani Cities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PAKISTANI_CITIES.filter(
                    (c) => !formData.expressDeliveryCities.includes(c)
                  ).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleAddCity(city)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-emerald-800/60 hover:text-emerald-300 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      + {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SOCIAL MEDIA & WHATSAPP */}
      {activeSubTab === 'social' && (
        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-5 max-w-3xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-700/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Social Media Profiles & Instant WhatsApp Desk</h3>
              <p className="text-xs text-slate-400">
                Configure your official social handles and direct WhatsApp medicine ordering link.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                WhatsApp Order & Support Link <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <WhatsAppIcon className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.socialLinks.whatsapp}
                  onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                  placeholder="https://wa.me/923001234567?text=Hello,%20I%20need%20medicines%20delivered"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Used in the floating WhatsApp badge, footer, and direct prescription consultation buttons.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Facebook Page URL
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpharmacypage"
                  className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourpharmacypage"
                  className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  LinkedIn Company Profile URL
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/yourpharmacy"
                  className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  YouTube Channel (Optional)
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.youtube || ''}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/@yourpharmacy"
                  className="w-full px-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: POLICIES & HELP CONTENT */}
      {activeSubTab === 'policies' && (
        <div className="space-y-6">
          {/* Header Overview Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Policies, Legal Terms & Help Content</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Manage official customer-facing policies. Each section renders independently across your storefront pages.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-emerald-400">
              <button
                type="button"
                onClick={() => navigate('/returns')}
                className="hover:underline flex items-center gap-1 cursor-pointer bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                <span>/returns</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/privacy')}
                className="hover:underline flex items-center gap-1 cursor-pointer bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                <span>/privacy</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/terms')}
                className="hover:underline flex items-center gap-1 cursor-pointer bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                <span>/terms</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="hover:underline flex items-center gap-1 cursor-pointer bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                <span>/about</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/shipping')}
                className="hover:underline flex items-center gap-1 cursor-pointer bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                <span>/shipping</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* POLICY CARD 1: Return, Exchange & Refund Policy */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">Return, Exchange & Refund Policy</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  Displayed at /returns
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/returns')}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                  title="View live page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Defines regulatory rules regarding sealed medicines, cold-chain exclusions, reporting windows, and refund processing terms.
            </p>
            <div className="space-y-1.5">
              <textarea
                rows={6}
                value={formData.policies.returnPolicy}
                onChange={(e) => handlePolicyChange('returnPolicy', e.target.value)}
                placeholder="Enter return, exchange, and refund policy terms..."
                className="w-full min-h-[170px] p-4 text-xs sm:text-sm bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 leading-relaxed font-sans overflow-y-auto thin-scrollbar resize-y"
              />
              <div className="flex items-center justify-end text-xs text-slate-500 font-mono">
                {formData.policies.returnPolicy?.length || 0} characters
              </div>
            </div>
          </div>

          {/* POLICY CARD 2: Privacy & Patient Health Data Security Policy */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">Privacy & Patient Health Data Security Policy</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  Displayed at /privacy
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/privacy')}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                  title="View live page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explains how patient prescription images, medical consult logs, contact details, and encrypted transactions are protected.
            </p>
            <div className="space-y-1.5">
              <textarea
                rows={6}
                value={formData.policies.privacyPolicy}
                onChange={(e) => handlePolicyChange('privacyPolicy', e.target.value)}
                placeholder="Enter privacy and health data security policy..."
                className="w-full min-h-[170px] p-4 text-xs sm:text-sm bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 leading-relaxed font-sans overflow-y-auto thin-scrollbar resize-y"
              />
              <div className="flex items-center justify-end text-xs text-slate-500 font-mono">
                {formData.policies.privacyPolicy?.length || 0} characters
              </div>
            </div>
          </div>

          {/* POLICY CARD 3: Terms & Conditions (Schedule G & Prescription Dispensing) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">Terms & Conditions (Schedule G & Prescription Dispensing)</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  Displayed at /terms
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/terms')}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                  title="View live page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Outlines clinical governance, mandatory PMDC registered doctor prescription requirements, DRAP statutory MRP compliance, and customer age limits.
            </p>
            <div className="space-y-1.5">
              <textarea
                rows={6}
                value={formData.policies.termsConditions}
                onChange={(e) => handlePolicyChange('termsConditions', e.target.value)}
                placeholder="Enter terms of service and prescription dispensing terms..."
                className="w-full min-h-[170px] p-4 text-xs sm:text-sm bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 leading-relaxed font-sans overflow-y-auto thin-scrollbar resize-y"
              />
              <div className="flex items-center justify-end text-xs text-slate-500 font-mono">
                {formData.policies.termsConditions?.length || 0} characters
              </div>
            </div>
          </div>

          {/* POLICY CARD 4: About Us & Company Vision */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">About Us & Company Vision</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  Displayed at /about
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                  title="View live page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describes the licensed pharmacy history, direct pharmaceutical sourcing from DRAP-registered companies, cold chain storage, and patient care mission.
            </p>
            <div className="space-y-1.5">
              <textarea
                rows={6}
                value={formData.policies.aboutUs}
                onChange={(e) => handlePolicyChange('aboutUs', e.target.value)}
                placeholder="Enter about company story, mission, and registered pharmacist team..."
                className="w-full min-h-[170px] p-4 text-xs sm:text-sm bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 leading-relaxed font-sans overflow-y-auto thin-scrollbar resize-y"
              />
              <div className="flex items-center justify-end text-xs text-slate-500 font-mono">
                {formData.policies.aboutUs?.length || 0} characters
              </div>
            </div>
          </div>

          {/* POLICY CARD 5: Express Delivery & Cold-Chain Shipping Policy */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">Express Delivery & Cold-Chain Shipping Policy</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  Displayed at /shipping
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/shipping')}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                  title="View live page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explains rider dispatch hours, 2 to 4 hour delivery radius in partner cities, nationwide transit times, and free shipping qualifications.
            </p>
            <div className="space-y-1.5">
              <textarea
                rows={6}
                value={formData.policies.shippingPolicy || ''}
                onChange={(e) => handlePolicyChange('shippingPolicy', e.target.value)}
                placeholder="Enter shipping and delivery policy terms..."
                className="w-full min-h-[170px] p-4 text-xs sm:text-sm bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 leading-relaxed font-sans overflow-y-auto thin-scrollbar resize-y"
              />
              <div className="flex items-center justify-end text-xs text-slate-500 font-mono">
                {formData.policies.shippingPolicy?.length || 0} characters
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save / Discard Bar (Standardized across all settings tabs) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl mt-8 relative z-0">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className={`w-2.5 h-2.5 rounded-full ${hasUnsavedChanges ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
          <span className="text-xs text-slate-300 font-medium">
            {hasUnsavedChanges
              ? 'Unsaved store settings modifications.'
              : 'All store contact details, licensing, and policies are synchronized live with storefront.'}
          </span>
        </div>
        <div className="flex items-center gap-2.5 justify-end flex-wrap">
          <button
            type="button"
            disabled={!hasUnsavedChanges || isSaving}
            onClick={() => {
              setFormData(storeSettings);
              addToast({
                type: 'info',
                title: 'Changes Discarded',
                message: 'Form inputs reverted back to current published store settings.',
              });
            }}
            className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-700/80 hover:bg-slate-700 active:bg-slate-600 rounded-xl transition-colors cursor-pointer border border-slate-600 disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-black rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-75 ${
              hasUnsavedChanges
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-400/40 shadow-emerald-500/20'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-900/30'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{hasUnsavedChanges ? 'Save Settings *' : 'Save Settings'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Centered Save Settings Confirmation Modal Screen */}
      {showSaveSuccessModal && (
        <div
          id="save-settings-success-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowSaveSuccessModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 text-center shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top ambient glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowSaveSuccessModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Animated Radiant Success Icon */}
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 animate-in zoom-in-75">
              <CheckCircle2 className="w-9 h-9 text-white stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">
              Settings Saved & Published!
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              All store contact details, official helpline, licensing, and policies have been successfully updated live across your storefront.
            </p>

            {/* Live Update Summary Cards */}
            <div className="my-5 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Helpline
                </span>
                <span className="font-bold text-white font-mono">{formData.helpline || 'Updated'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Pharmacy Reg #
                </span>
                <span className="font-bold text-emerald-400 font-mono">#{formData.pharmacyRegNumber || '09412'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" /> Express Delivery
                </span>
                <span className="font-bold text-white">{formData.expressDeliveryCities.length} Cities Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Sync Status
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live in Real-Time
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-400/90 mb-5 bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 rounded-xl">
              ✓ Header, Footer, Mobile Drawer, and Contact pages have been updated.
            </p>

            <button
              type="button"
              onClick={() => setShowSaveSuccessModal(false)}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
