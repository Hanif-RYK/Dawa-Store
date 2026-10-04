import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { FaqModal } from '../common/FaqModal';
import { AcceptedPaymentBadges } from '../common/AcceptedPaymentBadges';
import {
  ChevronDown,
  CircleCheck,
  Facebook,
  HeartHandshake,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  PhoneCall,
  Send,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, addToast, storeSettings, setIsLicenseModalOpen } = usePharmacy();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  // Mobile: link columns collapse into an accordion so the footer isn't a long wall of links
  const [openSection, setOpenSection] = useState<'explore' | 'policies' | null>(null);
  const toggleSection = (key: 'explore' | 'policies') => setOpenSection((prev) => (prev === key ? null : key));
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email for newsletter updates.',
      });
      return;
    }
    setIsSubscribed(true);
    addToast({
      type: 'success',
      title: 'Subscribed to Health Alerts!',
      message: 'You will receive medicine refill reminders and health discounts.',
    });
    setEmail('');
  };
  return (
    <footer id="app-footer" className="print:hidden bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white leading-snug">100% Genuine Medicines</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Direct from DRAP licensed pharmaceutical manufacturers
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white leading-snug">
                {storeSettings.expressDeliveryTime}
                {' Express Delivery'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {storeSettings.expressDeliveryCities.slice(0, 4).join(', ')}
                {' & nationwide'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white leading-snug">Licensed Pharmacists</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {'Prescription audit & free dosage advice on call'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white leading-snug">
                {'Helpline: '}
                {storeSettings.helpline}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {'Toll-free customer care & order support 24/7'}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10 border-b border-slate-800">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-white text-lg shadow-xs">
                +
              </div>
              <span className="text-xl font-black text-white tracking-tight">{storeSettings.pharmacyName}</span>
              <button
                type="button"
                onClick={() => setIsLicenseModalOpen(true)}
                className="text-xs font-medium px-2.5 py-0.5 bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-emerald-400 border border-slate-700 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs ml-1"
                title="Click to view government DRAP pharmacy license"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>DRAP Reg #{storeSettings.pharmacyRegNumber}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              {storeSettings.pharmacyName}
              {
                ' is Pakistan’s leading digital healthcare dispensary and medicine delivery service. We provide 100% authentic medicines, temperature-regulated cold chain delivery for insulins and vaccines, and digital prescription consultations adhering to the '
              }
              {storeSettings.licensingAuthority}.
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{storeSettings.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {'UAN: '}
                  {storeSettings.uan}
                  {' | Toll Free: '}
                  {storeSettings.helpline}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {storeSettings.supportEmail}
                  {' | '}
                  {storeSettings.pharmacistEmail}
                </span>
              </p>
            </div>
          </div>
          <div>
            <h4 className="md:mb-4">
              <button
                type="button"
                onClick={() => toggleSection('explore')}
                aria-expanded={openSection === 'explore'}
                aria-controls="footer-explore-links"
                className="w-full flex items-center justify-between py-2 md:py-0 text-xs font-bold uppercase tracking-wider text-slate-200 cursor-pointer md:cursor-default md:pointer-events-none"
              >
                Explore Pharmacy
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform ${openSection === 'explore' ? 'rotate-180' : ''}`}
                />
              </button>
            </h4>
            <ul
              id="footer-explore-links"
              className={`space-y-2.5 text-xs pt-2 md:pt-0 ${openSection === 'explore' ? 'block' : 'hidden'} md:block`}
            >
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/category/prescription-medicines')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  Prescription Medicines
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/category/otc-medicines')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  Over The Counter (OTC)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/category/vitamins-supplements')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  {'Vitamins & Supplements'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/category/mother-baby')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  {'Mother & Baby Care'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/category/devices-first-aid')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  Medical Diagnostic Devices
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="md:mb-4">
              <button
                type="button"
                onClick={() => toggleSection('policies')}
                aria-expanded={openSection === 'policies'}
                aria-controls="footer-policies-links"
                className="w-full flex items-center justify-between py-2 md:py-0 text-xs font-bold uppercase tracking-wider text-slate-200 cursor-pointer md:cursor-default md:pointer-events-none"
              >
                {'Policies & Help'}
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform ${openSection === 'policies' ? 'rotate-180' : ''}`}
                />
              </button>
            </h4>
            <ul
              id="footer-policies-links"
              className={`space-y-2.5 text-xs pt-2 md:pt-0 ${openSection === 'policies' ? 'block' : 'hidden'} md:block`}
            >
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  About DawaStore
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  {'Contact & Support'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/returns')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  {'Return & Exchange Policy'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/privacy')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  {'Privacy & Health Data'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/terms')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  {'Terms & Conditions'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/shipping')}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  {'Express Cities & Shipping'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsFaqOpen(true)}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsLicenseModalOpen(true)}
                  className="hover:text-emerald-400 hover:translate-x-0.5 transition-all cursor-pointer text-left inline-flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>DRAP Verification</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-200">Health Newsletter</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get refill reminders, health tips, and verified discounts directly to your inbox.
            </p>
            {isSubscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CircleCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    id="newsletter-email-input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-md transition-all cursor-pointer flex items-center justify-center"
                    aria-label="Subscribe to newsletter"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={storeSettings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#168049] hover:bg-[#126b3d] active:scale-95 text-white flex items-center justify-center transition-all shadow-xs"
                  title={`WhatsApp: ${storeSettings.whatsapp}`}
                  aria-label="WhatsApp Pharmacy Desk"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                </a>
                <a
                  href={storeSettings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] active:scale-95 text-white flex items-center justify-center transition-all shadow-xs"
                  title="Facebook"
                  aria-label="Facebook Page"
                >
                  <Facebook className="w-4 h-4 text-white" />
                </a>
                <a
                  href={storeSettings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 active:scale-95 text-white flex items-center justify-center transition-all shadow-xs"
                  title="Instagram"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>
                <a
                  href={storeSettings.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#0A66C2] hover:bg-[#095196] active:scale-95 text-white flex items-center justify-center transition-all shadow-xs"
                  title="LinkedIn"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {'© '}
            {new Date().getFullYear()} {storeSettings.pharmacyName}
            {' Pakistan (Pvt) Ltd. All rights reserved.'}
          </p>
          <AcceptedPaymentBadges variant="dark" />
        </div>
      </div>
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </footer>
  );
};
