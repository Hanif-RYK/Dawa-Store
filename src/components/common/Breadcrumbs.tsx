import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  truncateLabels?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = 'flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-slate-500 py-2.5 px-4 bg-white/60 border-b border-slate-200/80 backdrop-blur-xs',
  truncateLabels = true,
}) => {
  const { navigate } = usePharmacy();

  return (
    <nav
      id="breadcrumbs-nav"
      aria-label="Breadcrumb"
      className={className}
    >
      <button
        id="breadcrumb-home-btn"
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast || !item.path ? (
              <span
                className={`font-semibold text-slate-800 ${truncateLabels ? 'truncate max-w-[200px] sm:max-w-xs' : ''}`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <button
                id={`breadcrumb-item-${index}`}
                onClick={() => navigate(item.path!)}
                className={`text-slate-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer shrink-0 ${truncateLabels ? 'truncate max-w-[150px] sm:max-w-xs' : ''}`}
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
