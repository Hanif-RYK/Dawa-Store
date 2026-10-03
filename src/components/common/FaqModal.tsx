import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, HelpCircle, ChevronDown, ChevronUp, PhoneCall } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { usePharmacy } from '../../context/PharmacyContext';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Delivery',
    question: 'How fast will my medicines be delivered?',
    answer:
      'We offer express same-day delivery (within 2–4 hours) in major cities for urgent orders. For standard delivery across Pakistan, orders are typically delivered safely within 24 to 48 hours.',
  },
  {
    id: 'faq-2',
    category: 'Prescription',
    question: 'Do I need a doctor’s prescription for all medicines?',
    answer:
      'No. Over-the-counter (OTC) products like fever relievers, cough drops, pain balms, vitamins, and supplements do not require a prescription. Only prescription-only (Rx) medications require an authentic doctor’s prescription slip.',
  },
  {
    id: 'faq-3',
    category: 'Payment',
    question: 'What payment methods are accepted?',
    answer:
      'You can pay using Cash on Delivery (COD), JazzCash, EasyPaisa, or any Visa/Mastercard Debit or Credit card at checkout.',
  },
  {
    id: 'faq-4',
    category: 'Quality',
    question: 'Are all medicines authentic and genuine?',
    answer:
      'Yes, 100%. We are licensed by the Drug Regulatory Authority of Pakistan (DRAP). All pharmaceuticals are sourced strictly from verified manufacturers (GSK, Abbott, Getz, Searle, Hilton, Martin Dow) with cold-chain temperature control (2°C–8°C) for insulins & biologics.',
  },
  {
    id: 'faq-5',
    category: 'Returns',
    question: 'What is your return and exchange policy?',
    answer:
      'If you receive an incorrect, damaged, or broken medicine pack, notify us within 48 hours of delivery. We will arrange a free immediate replacement or full refund.',
  },
  {
    id: 'faq-6',
    category: 'Order',
    question: 'Can I order directly by sending a picture on WhatsApp?',
    answer:
      'Yes! Click the "Order via WhatsApp" button or message us directly at 0300-1234567 with your prescription or medicine list. Our licensed pharmacist will prepare your cart and dispatch your order.',
  },
];

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  const { storeSettings } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = useMemo(() => {
    return ['All', 'Delivery', 'Prescription', 'Payment', 'Quality', 'Returns'];
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      id="faq-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop-animate"
    >
      <div
        id="faq-modal-content"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] modal-content-animate"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Frequently Asked Questions (FAQs)
              </h3>
              <p className="text-xs text-slate-500">
                Common questions regarding medicines, ordering, and delivery
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Close FAQs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your question (e.g. delivery, prescription, refund)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl transition-all ${
                    isExpanded
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-md text-slate-400 shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-emerald-100/60 mt-1 pt-2.5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm font-medium">No matching questions found.</p>
              <p className="text-xs mt-1 text-slate-400">
                You can reach our licensed pharmacist directly below.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Help Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-600 font-medium text-center sm:text-left">
            Have another question? Contact our pharmacy team:
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${storeSettings.helpline.replace(/[^0-9+]/g, '')}`}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>{storeSettings.helpline}</span>
            </a>
            <a
              href={storeSettings.socialLinks.whatsapp || `https://wa.me/923001234567?text=Hello,%20I%20have%20a%20question%20about%20my%20order`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
