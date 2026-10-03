import React, { useState, useMemo } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';
import {
  Upload,
  ShieldCheck,
  Flame,
  Pill,
  Activity,
  Heart,
  Baby,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  Store,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface TabItem {
  id: string;
  name: string;
  icon: React.ElementType;
  filterFn: (product: Product) => boolean;
}

export const HomePage: React.FC = () => {
  const { products, navigate, resetFilters } = usePharmacy();

  // Active Health Concern / Category Tab
  const [activeTab, setActiveTab] = useState<string>('all');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 6);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
    }
  }, []);

  React.useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 320);
    }
  };

  // Define D. Watson style Health Concern & Category Tabs
  const STORE_TABS: TabItem[] = useMemo(
    () => [
      {
        id: 'all',
        name: 'All Medicines & Products',
        icon: Pill,
        filterFn: () => true,
      },
      {
        id: 'fever-pain',
        name: 'Fever & Pain Relief',
        icon: Flame,
        filterFn: (p) =>
          p.subcategoryId === 'fever-pain' ||
          (p.categoryId === 'otc-medicines' &&
            /panadol|paracetamol|brufen|ibuprofen|disprin|ponstan|aspirin|pain|fever/i.test(
              p.name + ' ' + p.genericName + ' ' + (p.tags?.join(' ') || '')
            )),
      },
      {
        id: 'stomach',
        name: 'Stomach & Digestion',
        icon: ShieldCheck,
        filterFn: (p) =>
          p.subcategoryId === 'gastrointestinal' ||
          p.subcategoryId === 'digestive-health' ||
          /risek|omeprazole|gaviscon|nexum|antacid|ulcer|digestive|famotidine|flagyl|esomeprazole/i.test(
            p.name + ' ' + p.genericName + ' ' + (p.tags?.join(' ') || '')
          ),
      },
      {
        id: 'antibiotics',
        name: 'Infections & Antibiotics',
        icon: Pill,
        filterFn: (p) =>
          p.subcategoryId === 'antibiotics' ||
          /amoxicillin|augmentin|azithromycin|azomax|cipro|antibiotic|clarithromycin|cefixime/i.test(
            p.name + ' ' + p.genericName + ' ' + (p.tags?.join(' ') || '')
          ),
      },
      {
        id: 'cardiac',
        name: 'Heart & Blood Pressure',
        icon: Heart,
        filterFn: (p) =>
          p.subcategoryId === 'cardiovascular' ||
          /concor|lipiget|lowplat|bisoprolol|atorvastatin|blood pressure|cardiac|hypertension|norvasc/i.test(
            p.name + ' ' + p.genericName + ' ' + (p.tags?.join(' ') || '')
          ),
      },
      {
        id: 'diabetes',
        name: 'Diabetes & Sugar',
        icon: Activity,
        filterFn: (p) =>
          /diabetes|glucophage|metformin|insulin|jardiance|januvia|sugar|getryl/i.test(
            p.name + ' ' + p.genericName + ' ' + (p.tags?.join(' ') || '')
          ),
      },
      {
        id: 'respiratory',
        name: 'Cough, Cold & Allergy',
        icon: Activity,
        filterFn: (p) =>
          p.subcategoryId === 'respiratory-rx' ||
          p.subcategoryId === 'cough-cold' ||
          /ventolin|inhaler|cough|salbutamol|arinac|panadol cf|allergy|respiratory|hydryllin/i.test(
            p.name + ' ' + p.genericName + ' ' + (p.tags?.join(' ') || '')
          ),
      },
      {
        id: 'vitamins',
        name: 'Vitamins & Supplements',
        icon: Sparkles,
        filterFn: (p) =>
          p.categoryId === 'vitamins-supplements' ||
          /vitamin|calcium|cac-1000|surbex|neurobion|supplement|mineral|omega/i.test(
            p.name + ' ' + p.genericName + ' ' + (p.tags?.join(' ') || '')
          ),
      },
      {
        id: 'devices',
        name: 'Medical Devices & BP Monitors',
        icon: Activity,
        filterFn: (p) =>
          p.categoryId === 'medical-devices' ||
          /monitor|glucometer|thermometer|nebulizer|device|gauge/i.test(
            p.name + ' ' + p.genericName + ' ' + (p.tags?.join(' ') || '')
          ),
      },
      {
        id: 'first-aid',
        name: 'First Aid & Antiseptics',
        icon: ShieldCheck,
        filterFn: (p) =>
          p.categoryId === 'personal-care' ||
          /bandage|pyodine|dettol|saniplast|cotton|antiseptic|gauze|first aid/i.test(
            p.name + ' ' + p.genericName + ' ' + (p.tags?.join(' ') || '')
          ),
      },
      {
        id: 'baby',
        name: 'Mother & Baby Care',
        icon: Baby,
        filterFn: (p) =>
          p.categoryId === 'baby-mother-care' ||
          /baby|diaper|pampers|cerelac|lactogen|gripe|infant/i.test(
            p.name + ' ' + p.genericName + ' ' + (p.tags?.join(' ') || '')
          ),
      },
    ],
    []
  );

  // Filter products based on active category tab
  const filteredProducts = useMemo(() => {
    const activeTabObj = STORE_TABS.find((t) => t.id === activeTab) || STORE_TABS[0];

    return products
      .filter((p) => activeTabObj.filterFn(p))
      .sort((a, b) => {
        // featured first, then higher rating
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [products, activeTab, STORE_TABS]);

  const activeTabItem = STORE_TABS.find((t) => t.id === activeTab) || STORE_TABS[0];

  return (
    <div id="home-online-store" className="min-h-screen bg-slate-50 pb-16">
      {/* 1. HEALTH CONCERN & CATEGORY TABS */}
      <div className="bg-transparent border-b border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          {/* Left scroll affordance & button */}
          {canScrollLeft && (
            <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex items-center">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition-all hover:text-emerald-700"
                title="Scroll categories left"
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-10" />
          )}

          {/* Right scroll affordance & button */}
          {canScrollRight && (
            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex items-center">
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition-all hover:text-emerald-700"
                title="Scroll categories right"
                aria-label="Scroll categories right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-10" />
          )}

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2.5 overflow-x-auto py-3.5 px-1 thin-scrollbar scroll-smooth"
          >
            {STORE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`scrolling-category-tab-${tab.id}`}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    const el = document.getElementById(`scrolling-category-tab-${tab.id}`);
                    el?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
                  }}
                  className={`group shrink-0 w-auto min-w-max flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'text-emerald-950 bg-emerald-50 border-2 border-emerald-600 shadow-xs ring-1 ring-emerald-500/20'
                      : 'text-slate-700 bg-white hover:text-slate-900 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-700' : 'text-slate-500 group-hover:text-slate-800'
                    }`}
                  />
                  <span className="whitespace-nowrap inline-block">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. PRODUCT CATALOG */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6">
        {/* Catalog Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Store className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              <span>{activeTabItem.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing {filteredProducts.length} verified medicines & healthcare essentials
            </p>
          </div>
          <button
            type="button"
            id="home-open-full-catalog-btn"
            onClick={() => {
              resetFilters(false);
              navigate('/admin?tab=products');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200/80 transition-all cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
            title="Open Medicines Catalog in Admin Panel"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open Medicine Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PRODUCT CATALOG GRID */}
        {filteredProducts.length > 0 ? (
          <div
            id="store-product-grid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} layout="grid" />
            ))}
          </div>
        ) : (
          /* Empty Search or Filter Result */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Pill className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No medicines found in this category
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We could not find medicines in {activeTabItem.name}. Don&apos;t worry! Upload your doctor&apos;s slip or WhatsApp us and our registered pharmacists will arrange it from our central depot.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Show All Medicines</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/upload-prescription')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Doctor Prescription</span>
              </button>
            </div>
          </div>
        )}



      </div>
    </div>
  );
};
