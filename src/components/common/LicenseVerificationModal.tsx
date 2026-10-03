import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  ShieldCheck,
  X,
  FileCheck,
  Building2,
  UserCheck,
  Calendar,
  MapPin,
  ExternalLink,
  ZoomIn,
  PhoneCall,
  CheckCircle2,
  Award,
  Thermometer,
  FileText,
} from 'lucide-react';

export const LicenseVerificationModal: React.FC = () => {
  const { isLicenseModalOpen, setIsLicenseModalOpen, storeSettings } = usePharmacy();
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else if (isLicenseModalOpen) {
          setIsLicenseModalOpen(false);
        }
      }
    };
    if (isLicenseModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLicenseModalOpen, isZoomed, setIsLicenseModalOpen]);

  if (!isLicenseModalOpen) return null;

  const certificateImg =
    storeSettings.licenseCertificateImage ||
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80';

  return (
    <div
      id="license-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsLicenseModalOpen(false)}
    >
      <div
        id="license-verification-dialog"
        className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-inner shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  DRAP Pharmacy License & Verification
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Government Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Regulated under Drug Regulatory Authority of Pakistan Act & Pharmacy Council
              </p>
            </div>
          </div>
          <button
            id="close-license-modal-btn"
            type="button"
            onClick={() => setIsLicenseModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close license verification window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Official Verification Status Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    Active Drug Sale License
                  </h4>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Certified
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong className="text-slate-800">{storeSettings.pharmacyName}</strong> is legally authorized by the provincial health authorities and DRAP to stock, dispense, and deliver authentic prescription drugs and cold-chain healthcare supplies.
                </p>
              </div>
            </div>

            <div className="px-4 py-2 bg-white rounded-xl border border-emerald-200 shadow-2xs text-left sm:text-right shrink-0">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">License Number</span>
              <span className="text-sm sm:text-base font-black font-mono text-emerald-700">
                #{storeSettings.pharmacyRegNumber}
              </span>
            </div>
          </div>

          {/* Legal Credentials Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Box 1: Facility & License Type */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dispensary & License Classification</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Business / Trade Name:</span>
                  <span className="font-bold text-slate-900 text-right">{storeSettings.pharmacyName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">License Category:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {storeSettings.licenseType || 'Form-9 (Retail & Digital Dispensary)'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Regulatory Body:</span>
                  <span className="font-semibold text-emerald-700 text-right max-w-[200px]">
                    {storeSettings.licensingAuthority}
                  </span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-500">Physical Dispensary:</span>
                  <span className="text-slate-700 font-medium text-right max-w-[200px] truncate" title={storeSettings.address}>
                    {storeSettings.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Registered Pharmacist & Validity */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Superintendent Pharmacist & Validity</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Chief In-Charge Pharmacist:</span>
                  <span className="font-bold text-slate-900 text-right">{storeSettings.chiefPharmacist}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Pharmacy Council Reg:</span>
                  <span className="font-mono font-bold text-emerald-700 text-right">
                    {storeSettings.rPhNumber || 'R.Ph # 4182 (PCP)'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">License Issue Date:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {storeSettings.licenseIssueDate || '15 Jan 2022'}
                  </span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-500">Current Validity / Renewal:</span>
                  <span className="font-bold text-emerald-700 text-right">
                    Valid till {storeSettings.licenseExpiryDate || '31 Dec 2027'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Certificate Scan / Photo Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Official Drug Sale License Certificate Document
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Zoom Certificate</span>
              </button>
            </div>

            {/* Certificate Preview Card */}
            <div
              className="group relative rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 hover:border-emerald-500 transition-colors overflow-hidden cursor-pointer flex flex-col items-center justify-center p-3 max-h-72"
              onClick={() => setIsZoomed(true)}
            >
              <img
                src={certificateImg}
                alt={`Official Drug Sale License Certificate #${storeSettings.pharmacyRegNumber}`}
                className="w-full max-h-64 object-contain rounded-xl shadow-xs group-hover:scale-[1.01] transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2">
                <span className="px-4 py-2 bg-emerald-700 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4" /> View Full Resolution Certificate
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 italic text-center">
              Official stamp of the Drug Inspector & Health Licensing Department. Tap above to inspect high-resolution copy.
            </p>
          </div>

          {/* Compliance Triple Guarantee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
              <h5 className="text-xs font-bold text-slate-900">100% Genuine Sourcing</h5>
              <p className="text-xs text-slate-500">
                Direct procurement from GSK, Abbott, Getz, Searle, & Hilton.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center space-y-1">
              <Thermometer className="w-5 h-5 text-teal-600 mx-auto" />
              <h5 className="text-xs font-bold text-slate-900">Cold Chain (2°C–8°C)</h5>
              <p className="text-xs text-slate-500">
                Temperature monitored delivery for insulins & biologics.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center space-y-1">
              <FileText className="w-5 h-5 text-sky-600 mx-auto" />
              <h5 className="text-xs font-bold text-slate-900">Prescription Auditing</h5>
              <p className="text-xs text-slate-500">
                Licensed Pharm-D pharmacist review on every controlled medicine order.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>
              Pharmacist Desk: <strong className="text-slate-800">{storeSettings.phone}</strong> (UAN: {storeSettings.uan})
            </span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${storeSettings.helpline.replace(/-/g, '')}`}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors text-center"
            >
              Call Helpline
            </a>
            <button
              type="button"
              onClick={() => setIsLicenseModalOpen(false)}
              className="flex-1 sm:flex-none px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-center"
            >
              Understood & Close
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Lightbox Zoom for License Certificate */}
      {isZoomed && (
        <div
          id="certificate-zoom-lightbox"
          className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <span className="text-xs text-slate-300 font-medium bg-black/50 px-3 py-1.5 rounded-xl border border-white/20">
              License Reg #{storeSettings.pharmacyRegNumber}
            </span>
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              aria-label="Close certificate preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="max-w-4xl max-h-[85vh] overflow-auto p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={certificateImg}
              alt="High resolution license certificate"
              className="max-h-[80vh] w-auto mx-auto rounded-2xl shadow-2xl border border-slate-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
