import React, { useState, useRef } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { ProductCard } from '../common/ProductCard';
import { ChevronLeft, ChevronRight, TrendingUp, Award, Sparkles } from 'lucide-react';

export const FeaturedTabsCarousel: React.FC = () => {
  const { products, navigate } = usePharmacy();
  const [activeTab, setActiveTab] = useState<'trending' | 'bestSellers' | 'newArrivals'>('trending');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter products by tab
  const tabProducts = products.filter((p) => {
    if (activeTab === 'trending') return p.isTrending || p.rating >= 4.7;
    if (activeTab === 'bestSellers') return p.isBestSeller;
    if (activeTab === 'newArrivals') return p.isNewArrival || p.rating >= 4.6;
    return true;
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Verified Healthcare
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Featured Medicines & Essentials
          </h2>
        </div>

        {/* Tab Buttons & Nav Arrows */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              id="tab-trending"
              type="button"
              onClick={() => setActiveTab('trending')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                activeTab === 'trending'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>

            <button
              id="tab-bestsellers"
              type="button"
              onClick={() => setActiveTab('bestSellers')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                activeTab === 'bestSellers'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Best Sellers</span>
            </button>

            <button
              id="tab-newarrivals"
              type="button"
              onClick={() => setActiveTab('newArrivals')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                activeTab === 'newArrivals'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Arrivals</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => handleScroll('left')}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-90 text-slate-700 shadow-xs transition-all duration-150 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-90 text-slate-700 shadow-xs transition-all duration-150 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel View */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabProducts.map((prod) => (
          <div
            key={prod.id}
            className="w-[240px] sm:w-[260px] md:w-[280px] shrink-0 snap-start"
          >
            <ProductCard product={prod} layout="grid" />
          </div>
        ))}
      </div>
    </section>
  );
};
