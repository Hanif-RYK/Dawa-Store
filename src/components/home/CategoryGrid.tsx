import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Category } from '../../types';
import { ArrowRight, Pill } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { categories, navigate, setFilters } = usePharmacy();

  const handleSelectCategory = (cat: Category) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: cat.id,
      subcategoryId: undefined,
      subSubcategory: undefined,
      page: 1,
    }));
    navigate(`/category/${cat.slug}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Departments
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Shop by Category
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            id={`category-card-${cat.id}`}
            onClick={() => handleSelectCategory(cat)}
            className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-500/80 active:scale-[0.99] transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            {/* Image Banner */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-700 text-white rounded-full tracking-wide">
                  {cat.itemCount}+ Products
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5 leading-tight">
                  {cat.name}
                </h3>
              </div>
            </div>

            {/* Subcategories tags list */}
            <div className="p-4 bg-white flex-1 flex flex-col justify-between">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {cat.subcategories.slice(0, 4).map((sub) => (
                  <span
                    key={sub.id}
                    className="text-xs font-medium px-2 py-0.5 bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-800 text-slate-600 rounded-lg transition-colors"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
