import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Category, SubCategory } from '../../types';
import {
  ChevronDown,
  Pill,
  Activity,
  ShieldCheck,
  HeartHandshake,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Truck,
  PhoneCall,
  Store,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Pill,
  Activity,
  ShieldCheck,
  HeartHandshake,
  Stethoscope,
  Sparkles,
};

export const MegaMenu: React.FC = () => {
  const { categories, navigate, setFilters, resetFilters, storeSettings } = usePharmacy();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const handleSelectSubcategory = (category: Category, subcategory: SubCategory, subSub?: string) => {
    setActiveCategory(null);
    setFilters((prev) => ({
      ...prev,
      categoryId: category.id,
      subcategoryId: subcategory.id,
      subSubcategory: subSub,
      page: 1,
    }));
    navigate(`/category/${category.slug}?sub=${subcategory.slug}${subSub ? `&subSub=${encodeURIComponent(subSub)}` : ''}`);
  };

  const handleSelectCategory = (category: Category) => {
    setActiveCategory(null);
    setFilters((prev) => ({
      ...prev,
      categoryId: category.id,
      subcategoryId: undefined,
      subSubcategory: undefined,
      page: 1,
    }));
    navigate(`/category/${category.slug}`);
  };

  return (
    <div
      id="desktop-mega-menu-bar"
      className="hidden lg:flex items-center justify-between border-t border-slate-200/80 bg-white px-4 sm:px-8 text-sm font-medium relative"
      onMouseLeave={() => setActiveCategory(null)}
    >
      {/* One row: long category names never wrap; the list scrolls sideways if it runs out of room */}
      <div className="flex items-center gap-1 min-w-0 overflow-x-auto thin-scrollbar">
        {/* Direct Link to Storefront Medicine Catalog */}
        <button
          id="mega-menu-all-medicines-btn"
          type="button"
          onClick={() => {
            setActiveCategory(null);
            resetFilters(false);
            navigate('/products');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-all cursor-pointer mr-1 shrink-0 whitespace-nowrap"
          title="Browse All Medicines in Catalog"
        >
          <Store className="w-4 h-4 text-emerald-700" />
          <span>All Medicines</span>
        </button>

        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Pill;
          const isActive = activeCategory?.id === cat.id;

          return (
            <div
              key={cat.id}
              className="relative py-2.5 shrink-0"
              onMouseEnter={() => setActiveCategory(cat)}
            >
              <button
                id={`mega-menu-trigger-${cat.id}`}
                onClick={() => handleSelectCategory(cat)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-600" />
                <span>{cat.name}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isActive ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick link on right side */}
      <div className="flex items-center gap-2.5 py-2 pl-3 text-xs shrink-0 whitespace-nowrap">
        <button
          type="button"
          onClick={() => navigate('/shipping')}
          className="font-semibold text-slate-600 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-slate-50 cursor-pointer hidden 2xl:flex items-center gap-1.5"
          title="2-4 Hours Express Delivery Cities"
        >
          <Truck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Express Cities</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/contact')}
          className="font-semibold text-slate-600 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-slate-50 cursor-pointer hidden 2xl:flex items-center gap-1.5"
          title={`Helpline: ${storeSettings.helpline}`}
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
          <span>Help: {storeSettings.helpline}</span>
        </button>

        <button
          onClick={() => navigate('/products?deals=true')}
          className="font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1 bg-rose-50 rounded-full cursor-pointer flex items-center gap-1"
        >
          <span>🔥 Hot Deals</span>
        </button>
      </div>

      {/* Mega Dropdown Panel */}
      {activeCategory && (
        <div
          id="mega-menu-dropdown-panel"
          className="absolute left-0 right-0 top-full bg-white border-t border-slate-200 shadow-2xl z-40 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={() => setActiveCategory(activeCategory)}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <div className="max-w-7xl mx-auto p-6 grid grid-cols-4 gap-8">
            {/* Category Overview Card */}
            <div className="col-span-1 p-5 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex flex-col justify-between shadow-md">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-emerald-100 backdrop-blur-xs mb-3">
                  {activeCategory.itemCount}+ Products
                </span>
                <h3 className="text-xl font-bold leading-tight">
                  {activeCategory.name}
                </h3>
                <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                  {activeCategory.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSelectCategory(activeCategory)}
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-emerald-950 bg-white hover:bg-emerald-50 px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer w-fit"
              >
                <span>View All {activeCategory.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subcategories & Sub-Subcategories Columns */}
            <div className="col-span-3 grid grid-cols-3 gap-6">
              {activeCategory.subcategories.map((sub) => (
                <div key={sub.id} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSelectSubcategory(activeCategory, sub)}
                    className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors flex items-center justify-between group cursor-pointer w-full text-left"
                  >
                    <span>{sub.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity" />
                  </button>

                  <ul className="space-y-1.5 pl-1 border-l-2 border-slate-100">
                    {sub.subSubcategories.map((subSub, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => handleSelectSubcategory(activeCategory, sub, subSub)}
                          className="text-xs text-slate-600 hover:text-emerald-700 hover:font-medium transition-colors cursor-pointer text-left block w-full py-0.5"
                        >
                          {subSub}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
