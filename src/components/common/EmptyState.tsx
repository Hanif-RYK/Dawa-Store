import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { LucideIcon, ArrowLeft, ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  id?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionPath?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id = 'empty-state',
  icon: Icon = ShoppingBag,
  title,
  description,
  actionText = 'Continue Shopping',
  actionPath = '/',
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  const { navigate, goBack } = usePharmacy();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <div
      id={id}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 my-8 max-w-lg mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xs"
    >
      <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5 shadow-inner">
        <Icon className="w-10 h-10 stroke-[1.75]" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
        {title}
      </h3>

      <p className="text-slate-500 text-sm sm:text-base mt-2 mb-6 max-w-md leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          id={`${id}-action-btn`}
          onClick={handleAction}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{actionText}</span>
        </button>

        {secondaryActionText && (
          <button
            id={`${id}-secondary-btn`}
            onClick={onSecondaryAction || goBack}
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{secondaryActionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};
