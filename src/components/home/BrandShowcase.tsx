import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { PHARMA_BRANDS } from '../../data/mockData';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const BrandShowcase: React.FC = () => {
  const { navigate, setFilters } = usePharmacy();

  const handleSelectBrand = (brandName: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: [brandName],
      page: 1,
    }));
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            DRAP Certified Manufacturers
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Trusted Pharmaceutical Brands
          </h2>
        </div>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer inline-flex items-center gap-1"
        >
          <span>View All Brands</span>
          <span>&rarr;</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {PHARMA_BRANDS.map((brand) => (
          <button
            key={brand.id}
            id={`brand-${brand.id}`}
            type="button"
            onClick={() => handleSelectBrand(brand.name)}
            className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500/80 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center p-2 mb-2 group-hover:scale-105 transition-transform duration-200">
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
                loading="lazy"
              />
            </div>
            <h3 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
              {brand.name}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {brand.productCount} medicines
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
