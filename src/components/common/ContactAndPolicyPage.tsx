import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  MessageSquare,
  FileText,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Breadcrumbs } from './Breadcrumbs';

interface ContactAndPolicyPageProps {
  initialTab?: 'contact' | 'about' | 'returns' | 'privacy' | 'terms' | 'shipping';
}

export const ContactAndPolicyPage: React.FC<ContactAndPolicyPageProps> = ({
  initialTab = 'contact',
}) => {
  const { storeSettings, addToast, navigate, setIsLicenseModalOpen } = usePharmacy();
  const [activeTab, setActiveTab] = useState<'contact' | 'about' | 'returns' | 'privacy' | 'terms' | 'shipping'>(
    initialTab
  );

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.phone.trim() || !contactForm.message.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please provide your name, phone number, and query message.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      addToast({
        type: 'success',
        title: 'Message Dispatched to Pharmacist Desk',
        message: 'Thank you! Our registered pharmacist or customer support will call/WhatsApp you shortly.',
      });
      setContactForm({
        name: '',
        phone: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
      });
    }, 600);
  };

  return (
    <div id="contact-policies-page" className="min-h-screen bg-slate-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <Breadcrumbs items={[{ label: 'Help & Policies' }]} />

        {/* Top Header Hero */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                Official Pharmacy Support
              </span>
              <span className="text-xs text-emerald-200/80">
                DRAP Licensed Dispensary Reg # {storeSettings.pharmacyRegNumber}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {activeTab === 'contact' && 'Contact & Pharmacist Helpline'}
              {activeTab === 'about' && `About ${storeSettings.pharmacyName}`}
              {activeTab === 'returns' && 'Return, Exchange & Refund Policy'}
              {activeTab === 'privacy' && 'Privacy & Patient Health Data Security'}
              {activeTab === 'terms' && 'Terms & Clinical Dispensing Conditions'}
              {activeTab === 'shipping' && '2-4 Hours Express & Nationwide Shipping'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect with our licensed healthcare team, track express delivery availability in your city, or review our DRAP-compliant pharmacy policies.
            </p>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-200">
          {[
            { id: 'contact', label: 'Contact Us & Helpline', icon: PhoneCall },
            { id: 'shipping', label: '2-4 Hr Express Cities', icon: Truck },
            { id: 'about', label: 'About Pharmacy', icon: Building2 },
            { id: 'returns', label: 'Return Policy', icon: FileText },
            { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
            { id: 'terms', label: 'Terms & Conditions', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSubmittedSuccess(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-emerald-800 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. CONTACT US TAB */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Direct Contact Channels & Registration */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Call & Helpline Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-600" />
                  <span>Immediate Assistance</span>
                </h3>

                <div className="space-y-4">
                  {/* Toll-Free Helpline */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                        Toll-Free Helpline (24/7)
                      </span>
                      <a
                        href={`tel:${storeSettings.helpline}`}
                        className="text-lg font-black text-emerald-950 hover:text-emerald-700 tracking-tight"
                      >
                        {storeSettings.helpline}
                      </a>
                      <p className="text-xs text-emerald-700/80 mt-0.5">Free call from any mobile or landline</p>
                    </div>
                    <a
                      href={`tel:${storeSettings.helpline}`}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                    >
                      Call Now
                    </a>
                  </div>

                  {/* UAN & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xs text-slate-500 font-bold uppercase block">UAN Landline</span>
                      <strong className="text-slate-900 block mt-0.5 font-bold">{storeSettings.uan}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xs text-slate-500 font-bold uppercase block">Mobile Support</span>
                      <strong className="text-slate-900 block mt-0.5 font-bold">{storeSettings.phone}</strong>
                    </div>
                  </div>

                  {/* Direct WhatsApp Ordering */}
                  <div className="p-4 rounded-xl bg-[#168049]/10 border border-[#168049]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#168049] text-white flex items-center justify-center shrink-0">
                        <WhatsAppIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-[#128C7E] block">WhatsApp Pharmacy Desk</span>
                        <span className="text-xs text-slate-700 font-semibold">{storeSettings.whatsapp}</span>
                      </div>
                    </div>
                    <a
                      href={storeSettings.socialLinks.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-[#168049] hover:bg-[#126b3d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      <span>Chat</span>
                    </a>
                  </div>

                  {/* Emails */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-slate-500 text-xs block">Customer Support:</span>
                        <a href={`mailto:${storeSettings.supportEmail}`} className="font-semibold text-emerald-700 hover:underline">
                          {storeSettings.supportEmail}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700 pt-1">
                      <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-slate-500 text-xs block">Prescription Verification Desk:</span>
                        <a href={`mailto:${storeSettings.pharmacistEmail}`} className="font-semibold text-emerald-700 hover:underline">
                          {storeSettings.pharmacistEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Pharmacy & Regulatory Info Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Licensed Dispensary Location</span>
                </h4>

                <div className="text-xs text-slate-600 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{storeSettings.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5 pt-1">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{storeSettings.operatingHours}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">DRAP Pharmacy License:</span>
                    <span className="font-mono font-bold text-emerald-700">#{storeSettings.pharmacyRegNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Chief Pharmacist:</span>
                    <span className="font-semibold text-slate-800">{storeSettings.chiefPharmacist}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLicenseModalOpen(true)}
                    className="w-full mt-2 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>View Official DRAP License Certificate</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Send Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Send an Inquiry or Prescription Query</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Have a question regarding drug dosage, medicine availability, or express delivery? Fill out the form below.
                  </p>
                </div>

                {submittedSuccess ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-in fade-in">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-emerald-950">Inquiry Received</h4>
                    <p className="text-xs text-emerald-800 max-w-md mx-auto">
                      Your query has been assigned to our on-duty clinical pharmacist. We will respond via phone or WhatsApp within 15-30 minutes.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmittedSuccess(false)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="e.g. Muhammad Usman"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Phone Number (with WhatsApp) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="e.g. 0300 1234567"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Inquiry Subject
                        </label>
                        <select
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:bg-white focus:border-emerald-600 transition-colors cursor-pointer"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Prescription Verification">Prescription Verification</option>
                          <option value="Order Status & Express Delivery">Order Status & Express Delivery</option>
                          <option value="Medicine Availability Check">Medicine Availability Check</option>
                          <option value="Pharmacist Dosage Consultation">Pharmacist Dosage Consultation</option>
                          <option value="Returns & Refunds">Returns & Refunds</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Query / Medicine Details <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Please mention product name, dosage, delivery city or your specific medical concern..."
                        className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-600 transition-colors leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending to Pharmacist...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. SHIPPING & 2-4 HOURS EXPRESS CITIES TAB */}
        {activeTab === 'shipping' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {storeSettings.expressDeliveryTime} Express Delivery Coverage
                </h3>
                <p className="text-xs text-slate-500">
                  Temperature-calibrated rider dispatch for urgent emergency and chronic medications.
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800 uppercase block">Express Delivery Time</span>
                <strong className="text-xl font-black text-emerald-950 mt-1 block">
                  {storeSettings.expressDeliveryTime}
                </strong>
                <p className="text-xs text-emerald-700 mt-1">In designated active cities</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-600 uppercase block">Nationwide Delivery</span>
                <strong className="text-xl font-black text-slate-900 mt-1 block">
                  {storeSettings.standardDeliveryTime}
                </strong>
                <p className="text-xs text-slate-500 mt-1">All other tehsils & cities across Pakistan</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-600 uppercase block">Free Delivery Benefit</span>
                <strong className="text-xl font-black text-slate-900 mt-1 block">
                  Orders over Rs. {storeSettings.freeDeliveryThreshold.toLocaleString()}
                </strong>
                <p className="text-xs text-slate-500 mt-1">Standard shipping fee Rs. {storeSettings.deliveryFee}</p>
              </div>
            </div>

            {/* Active Express Cities List */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Cities Active for {storeSettings.expressDeliveryTime} Express Rider Dispatch:</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {storeSettings.expressDeliveryCities.map((city) => (
                  <div
                    key={city}
                    className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-slate-800">{city}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title="Active Hub" />
                  </div>
                ))}
              </div>
            </div>

            {/* Full Shipping Policy text */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Detailed Shipping Terms:</h4>
              <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {storeSettings.policies.shippingPolicy}
              </div>
            </div>
          </div>
        )}

        {/* 3. ABOUT US TAB */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">About {storeSettings.pharmacyName}</h3>
                <p className="text-xs text-slate-500">{storeSettings.tagline}</p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
              {storeSettings.policies.aboutUs}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Licensing Authority</span>
                <strong className="text-slate-800 font-bold">{storeSettings.licensingAuthority}</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Pharmacy Reg Number</span>
                <strong className="text-emerald-700 font-bold font-mono">#{storeSettings.pharmacyRegNumber}</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Chief Pharmacist</span>
                <strong className="text-slate-800 font-bold">{storeSettings.chiefPharmacist}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 4. RETURNS POLICY TAB */}
        {activeTab === 'returns' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Return, Exchange & Refund Policy</h3>
                <p className="text-xs text-slate-500">
                  DRAP-mandated guidelines regarding medication safety and returns.
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-slate-50 border border-slate-200">
              {storeSettings.policies.returnPolicy}
            </div>
          </div>
        )}

        {/* 5. PRIVACY POLICY TAB */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Privacy & Health Data Security Policy</h3>
                <p className="text-xs text-slate-500">
                  How we protect patient prescriptions, diagnostic consults, and identity records.
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-slate-50 border border-slate-200">
              {storeSettings.policies.privacyPolicy}
            </div>
          </div>
        )}

        {/* 6. TERMS & CONDITIONS TAB */}
        {activeTab === 'terms' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Terms & Conditions of Service</h3>
                <p className="text-xs text-slate-500">
                  Schedule G prescription dispensing rules, physician validation, and customer obligations.
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-slate-50 border border-slate-200">
              {storeSettings.policies.termsConditions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
