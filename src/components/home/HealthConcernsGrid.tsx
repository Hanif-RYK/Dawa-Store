import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { HEALTH_CONCERNS } from '../../data/mockData';
import {
  Activity,
  Heart,
  ShieldCheck,
  Flame,
  Sparkles,
  Baby,
  Brain,
  Pill,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Activity,
  Heart,
  ShieldCheck,
  Flame,
  Sparkles,
  Baby,
  Brain,
  Pill,
};

export const HealthConcernsGrid: React.FC = () => {
  const { navigate, setFilters } = usePharmacy();

  const handleSelectConcern = (concernName: string) => {
    setFilters((prev) => ({
      ...prev,
      search: concernName,
      page: 1,
    }));
    navigate(`/products?concern=${encodeURIComponent(concernName)}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Targeted Care
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Browse by Health Concern
          </h2>
        </div>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer inline-flex items-center gap-1"
        >
          <span>View All Concerns</span>
          <span>&rarr;</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {HEALTH_CONCERNS.map((concern) => {
          const Icon = ICON_MAP[concern.icon] || Pill;

          return (
            <button
              key={concern.id}
              id={`concern-${concern.id}`}
              type="button"
              onClick={() => handleSelectConcern(concern.name)}
              className="group flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500/80 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer text-center"
            >
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden mb-2.5 bg-slate-100 p-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <img
                  src={concern.image}
                  alt={concern.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-emerald-900/10 rounded-full transition-colors" />
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white shadow-xs flex items-center justify-center text-emerald-700">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <h3 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight">
                {concern.name}
              </h3>
              <span className="text-xs text-slate-400 font-medium mt-0.5">
                {concern.itemCount}+ Medicines
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
