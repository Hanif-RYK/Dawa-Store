import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Send,
  CreditCard,
  Truck,
  HeartHandshake,
  CheckCircle2,
  Facebook,
  Instagram,
  Linkedin,
  Banknote,
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { AcceptedPaymentBadges } from '../common/AcceptedPaymentBadges';
import { FaqModal } from '../common/FaqModal';

export const Footer: React.FC = () => {
  const { navigate, addToast, storeSettings, setIsLicenseModalOpen } = usePharmacy();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
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
    setNewsletterEmail('');
  };

  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Core Pharmacy Guarantees Bar (Unified, No Duplication) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white leading-snug">100% Genuine Medicines</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Direct from DRAP licensed pharmaceutical manufacturers</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white leading-snug">{storeSettings.expressDeliveryTime} Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {storeSettings.expressDeliveryCities.slice(0, 4).join(', ')} & nationwide
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white leading-snug">Licensed Pharmacists</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Prescription audit & free dosage advice on call</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white leading-snug">Helpline: {storeSettings.helpline}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Toll-free customer care & order support 24/7</p>
            </div>
          </div>
        </div>

        {/* Middle Navigation Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          {/* Col 1: About & DRAP Licensing */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-white text-lg">
                +
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {storeSettings.pharmacyName}
              </span>
              <button
                type="button"
                onClick={() => setIsLicenseModalOpen(true)}
                className="text-xs font-medium px-2.5 py-0.5 bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-emerald-400 border border-slate-700/80 rounded-md transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs group"
                title="Click to view government DRAP pharmacy license and verification details"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0" />
                <span>Pharmacy Reg # {storeSettings.pharmacyRegNumber}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              {storeSettings.pharmacyName} is Pakistan’s leading digital healthcare dispensary and medicine delivery service. We provide 100% authentic medicines, temperature-regulated cold chain delivery for insulins and vaccines, and digital prescription consultations adhering to the {storeSettings.licensingAuthority}.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{storeSettings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>UAN: {storeSettings.uan} | Toll Free: {storeSettings.helpline}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{storeSettings.supportEmail} | {storeSettings.pharmacistEmail}</span>
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore Pharmacy
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/category/prescription-medicines')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Prescription Medicines
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/category/otc-medicines')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Over The Counter (OTC)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/category/vitamins-supplements')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Vitamins & Supplements
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/category/mother-baby')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Mother & Baby Care
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/category/devices-first-aid')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Medical Diagnostic Devices
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/products?deals=true')}
                  className="hover:text-rose-400 font-semibold transition-colors cursor-pointer text-left"
                >
                  Hot Deals & Offers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Policies & Help
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  About DawaStore
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Contact & Pharmacist Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/returns')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Return & Exchange Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/privacy')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Privacy & Health Data Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/terms')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/shipping')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Express Cities & Shipping
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsFaqOpen(true)}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Frequently Asked Questions (FAQs)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsLicenseModalOpen(true)}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  <span>DRAP License & Verification</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Health Newsletter
            </h4>
            <p className="text-xs text-slate-400">
              Get monthly chronic refill alerts, doctor health tips, and verified discounts.
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    id="newsletter-email-input"
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                  />
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-90 text-white rounded-lg transition-all cursor-pointer"
                    aria-label="Subscribe to newsletter"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Social media icons */}
            <div className="pt-3">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Connect With Us:</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={storeSettings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                  title={`WhatsApp: ${storeSettings.whatsapp}`}
                  aria-label="WhatsApp Pharmacy Desk"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                </a>
                <a
                  href={storeSettings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                  title="Facebook"
                  aria-label="Facebook Page"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={storeSettings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                  title="Instagram"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={storeSettings.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#0A66C2] hover:bg-[#095196] text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                  title="LinkedIn"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payment icons & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DawaStore Pakistan (Pvt) Ltd. All rights reserved.</p>

          <AcceptedPaymentBadges variant="dark" />
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Modal */}
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </footer>
  );
};
