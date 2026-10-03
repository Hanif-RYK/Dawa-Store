import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import {
  Upload,
  MapPin,
  HelpCircle,
  ArrowRight,
  X,
  Phone,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const QuickActionCards: React.FC = () => {
  const { navigate, addToast } = usePharmacy();
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Medicine request modal state
  const [medName, setMedName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [userPhone, setUserPhone] = useState('+92 ');
  const [medQty, setMedQty] = useState('1');
  const [isRequested, setIsRequested] = useState(false);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !userPhone.trim()) {
      addToast({
        type: 'error',
        title: 'Missing information',
        message: 'Please provide medicine name and your contact number.',
      });
      return;
    }
    setIsRequested(true);
    addToast({
      type: 'success',
      title: 'Medicine Request Logged',
      message: `Our procurement team will locate ${medName} and contact you within 2 hours.`,
    });
    setTimeout(() => {
      setIsRequested(false);
      setShowRequestModal(false);
      setMedName('');
      setGenericName('');
    }, 1500);
  };

  const pharmacyBranches = [
    {
      city: 'Karachi (Central Hub)',
      address: 'Plot 42-C, Shahrah-e-Faisal, Block 6, PECHS',
      timing: 'Open 24/7 (365 Days)',
      phone: '+92 21 3456-7890',
    },
    {
      city: 'Karachi (South Branch)',
      address: 'Shop 4, Khayaban-e-Shahbaz, Phase 6, DHA',
      timing: '8:00 AM - 2:00 AM',
      phone: '+92 21 3584-1122',
    },
    {
      city: 'Lahore (Main Dispensary)',
      address: 'Main Boulevard, Near Liberty Chowk, Gulberg III',
      timing: 'Open 24/7 (365 Days)',
      phone: '+92 42 3578-9011',
    },
    {
      city: 'Islamabad (Capital Dispensary)',
      address: 'Blue Area, Sector F-6/G-6, Jinnah Avenue',
      timing: 'Open 24/7 (365 Days)',
      phone: '+92 51 280-4455',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Upload Prescription */}
        <div
          id="quick-card-upload-rx"
          onClick={() => navigate('/upload-prescription')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 bg-white/20 text-emerald-100 rounded-full tracking-wide">
              Fastest
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-bold text-white leading-tight">
              Upload Prescription
            </h3>
            <p className="text-xs text-emerald-100/80 mt-1">
              Upload doctor’s slip & our pharmacist will prepare your order.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-200 group-hover:text-white">
            <span>Upload Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Order via WhatsApp */}
        <a
          id="quick-card-whatsapp"
          href="https://wa.me/923001234567?text=Hi%20DawaStore%20Pharmacy,%20I%20want%20to%20order%20medicines"
          target="_blank"
          rel="noreferrer"
          className="p-5 rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-900 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white">
              <WhatsAppIcon className="w-7 h-7" />
            </div>
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 bg-white/20 text-teal-100 rounded-full tracking-wide">
              WhatsApp Desk
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-bold text-white leading-tight">
              Order via WhatsApp
            </h3>
            <p className="text-xs text-teal-100/80 mt-1">
              Send pictures of medicines or prescriptions directly to +92 300 1234567.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-teal-200 group-hover:text-white">
            <span>Chat with Pharmacist</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        {/* Card 3: Find Nearest Pharmacy */}
        <div
          id="quick-card-nearest-pharmacy"
          onClick={() => setShowPharmacyModal(true)}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500/80 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-full tracking-wide">
              24/7 Stores
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Find Nearest Pharmacy
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              View registered physical dispensaries in Karachi, Lahore, and Islamabad.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-sky-900">
            <span>View Locations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Request a Medicine */}
        <div
          id="quick-card-request-medicine"
          onClick={() => setShowRequestModal(true)}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500/80 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full tracking-wide">
              Special Sourcing
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Request a Medicine
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Can't find a rare medicine or insulin? We source it for you from authorized distributors.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-900">
            <span>Make a Request</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Nearest Pharmacy Branches Modal */}
      {showPharmacyModal && (
        <div
          id="branches-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPharmacyModal(false);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-animate"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto modal-content-animate">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  DawaStore Physical Pharmacy Branches
                </h3>
              </div>
              <button
                onClick={() => setShowPharmacyModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {pharmacyBranches.map((branch, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{branch.city}</h4>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      DRAP Verified
                    </span>
                  </div>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{branch.address}</span>
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{branch.timing}</span>
                  </p>
                  <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{branch.phone}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowPharmacyModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request a Medicine Modal */}
      {showRequestModal && (
        <div
          id="request-med-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowRequestModal(false);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-animate"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 modal-content-animate">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Request Unavailable Medicine
                </h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isRequested ? (
              <div className="py-8 text-center text-emerald-700">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 mb-2" />
                <p className="font-bold text-sm">Request Submitted!</p>
                <p className="text-xs text-slate-500 mt-1">
                  Our pharmacists will check distributor stocks and notify you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="mt-4 space-y-3 text-xs">
                <p className="text-slate-500 leading-relaxed">
                  Can't find a medicine on DawaStore? Let us know the medicine name and we will source it for you from authorized pharmaceutical importers.
                </p>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Medicine / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lipitor 20mg or Lantus Solostar"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Generic Formula (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Atorvastatin or Insulin Glargine"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Required Quantity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Packs / 60 Tabs"
                      value={medQty}
                      onChange={(e) => setMedQty(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Medicine Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
