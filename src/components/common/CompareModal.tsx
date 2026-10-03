import React, { useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { X, Trash2, ShoppingBag, ShieldAlert, Check } from 'lucide-react';

export const CompareModal: React.FC = () => {
  const {
    compareList,
    toggleCompare,
    clearCompare,
    isCompareOpen,
    setIsCompareOpen,
    products,
    addToCart,
  } = usePharmacy();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCompareOpen) {
        setIsCompareOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompareOpen, setIsCompareOpen]);

  if (!isCompareOpen) return null;

  const comparedProducts = products.filter((p) => compareList.includes(p.id));

  return (
    <div
      id="compare-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCompareOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop-animate"
    >
      <div
        id="compare-modal-content"
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] modal-content-animate"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Medicine Comparison ({comparedProducts.length}/4)
            </h3>
            <p className="text-xs sm:text-xs text-slate-500">
              Compare active ingredients, dosage forms, manufacturers, and prices
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {comparedProducts.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 active:scale-95 flex items-center gap-1 p-2 min-h-[40px] transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Clear All</span>
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 active:scale-95 rounded-full transition-all cursor-pointer"
              aria-label="Close compare modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-3 sm:p-6 overflow-x-auto overflow-y-auto thin-scrollbar">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-base font-semibold">No medicines in comparison table.</p>
              <p className="text-xs text-slate-400 mt-1">
                Click the compare icon on product cards to view them side-by-side.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {/* Product Card Top Row */}
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 sm:p-3 w-28 sm:w-40 min-w-[110px] sm:min-w-[160px] font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/70">
                    Product
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-2.5 sm:p-3 w-56 sm:w-64 min-w-[180px] sm:min-w-[220px] align-top">
                      <div className="relative p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col items-center text-center">
                        <button
                          type="button"
                          onClick={() => toggleCompare(p.id)}
                          className="absolute top-2 right-2 p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-full hover:bg-white transition-colors cursor-pointer"
                          title="Remove from compare"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-24 h-24 object-contain mix-blend-multiply mb-2"
                        />
                        <span className="text-xs font-semibold text-emerald-700">{p.brand}</span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-2">
                          {p.name}
                        </h4>
                        <div className="mt-2 text-base font-extrabold text-emerald-700">
                          Rs. {p.price.toLocaleString()}
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(p, 1)}
                          className="mt-3 w-full py-2 min-h-[40px] bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Active Ingredient */}
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-semibold text-xs text-slate-600 bg-slate-50/70">
                    Active Ingredient
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 font-medium text-slate-800">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-xs rounded-md border border-emerald-200">
                        {p.genericName}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Dosage Form */}
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-semibold text-xs text-slate-600 bg-slate-50/70">
                    Dosage Form
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-slate-700">
                      {p.dosageForm}
                    </td>
                  ))}
                </tr>

                {/* Pack Size */}
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-semibold text-xs text-slate-600 bg-slate-50/70">
                    Pack Size
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-slate-700">
                      {p.packSize}
                    </td>
                  ))}
                </tr>

                {/* Manufacturer */}
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-semibold text-xs text-slate-600 bg-slate-50/70">
                    Manufacturer
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-slate-700">
                      {p.manufacturer}
                    </td>
                  ))}
                </tr>

                {/* Prescription Status */}
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-semibold text-xs text-slate-600 bg-slate-50/70">
                    Prescription Required?
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3">
                      {p.isRxRequired ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          <ShieldAlert className="w-3.5 h-3.5" /> Rx Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Check className="w-3.5 h-3.5" /> OTC (No Rx)
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Stock Status */}
                <tr>
                  <td className="p-3 font-semibold text-xs text-slate-600 bg-slate-50/70">
                    Stock Availability
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3">
                      {p.inStock ? (
                        <span className="text-xs font-semibold text-emerald-700">
                          In Stock ({p.stockCount} units)
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-rose-600">
                          Out of Stock
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
