import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Category, SubCategory } from '../../types';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Pill,
  Activity,
  ShieldCheck,
  HeartHandshake,
  Stethoscope,
  Sparkles,
  Upload,
  User as UserIcon,
  Heart,
  Scale,
  Flame,
  Store,
  Package,
  Truck,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Pill,
  Activity,
  ShieldCheck,
  HeartHandshake,
  Stethoscope,
  Sparkles,
};

interface MobileDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawerMenu: React.FC<MobileDrawerMenuProps> = ({ isOpen, onClose }) => {
  const {
    categories,
    navigate,
    user,
    setIsAuthModalOpen,
    setFilters,
    resetFilters,
    wishlist,
    compareList,
    setIsCompareOpen,
    storeSettings,
    setIsLicenseModalOpen,
    products,
    drawerShowLowStock,
    setDrawerShowLowStock,
  } = usePharmacy();

  const lowStockProducts = products.filter(
    (p) => p.stockCount <= (p.lowStockThreshold ?? 15)
  );
  const lowStockCount = lowStockProducts.length;

  // Navigation Drill-Down State:
  // Level 0: Top-level Menu
  // Level 1: Category -> Subcategories
  // Level 2: Subcategory -> Sub-subcategories
  // Level LowStock: In-drawer low stock products list
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubCategory | null>(null);
  const [showLowStockView, setShowLowStockView] = useState(drawerShowLowStock);

  const handleBrowseAllMedicines = () => {
    resetFilters(false);
    setShowLowStockView(false);
    setDrawerShowLowStock(false);
    setSelectedCat(null);
    setSelectedSub(null);
    onClose();
    navigate('/admin?tab=products');
  };

  // Reset drill-down on drawer close or sync drawerShowLowStock
  useEffect(() => {
    if (isOpen && drawerShowLowStock) {
      setShowLowStockView(true);
    } else if (!isOpen) {
      setSelectedCat(null);
      setSelectedSub(null);
      setShowLowStockView(false);
      setDrawerShowLowStock(false);
    }
  }, [isOpen, drawerShowLowStock, setDrawerShowLowStock]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectSubSub = (subSub: string) => {
    if (!selectedCat || !selectedSub) return;
    setFilters((prev) => ({
      ...prev,
      categoryId: selectedCat.id,
      subcategoryId: selectedSub.id,
      subSubcategory: subSub,
      page: 1,
    }));
    navigate(
      `/category/${selectedCat.slug}?sub=${selectedSub.slug}&subSub=${encodeURIComponent(subSub)}`
    );
    onClose();
  };

  const handleViewAllSub = (sub: SubCategory) => {
    if (!selectedCat) return;
    setFilters((prev) => ({
      ...prev,
      categoryId: selectedCat.id,
      subcategoryId: sub.id,
      subSubcategory: undefined,
      page: 1,
    }));
    navigate(`/category/${selectedCat.slug}?sub=${sub.slug}`);
    onClose();
  };

  const handleViewAllCat = (cat: Category) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: cat.id,
      subcategoryId: undefined,
      subSubcategory: undefined,
      page: 1,
    }));
    navigate(`/category/${cat.slug}`);
    onClose();
  };

  return (
    <div
      id="mobile-drawer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex modal-backdrop-animate"
    >
      <div
        id="mobile-drawer-content"
        className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden drawer-content-animate"
      >
        {/* Drawer Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">
              +
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">DawaStore</h3>
              <p className="text-xs text-emerald-200">Pakistan Online Pharmacy</p>
            </div>
          </div>
          <button
            id="mobile-drawer-close-btn"
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-95 rounded-full transition-all cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* LEVEL 2: Sub-subcategory view */}
          {selectedSub && selectedCat ? (
            <div className="p-4 animate-in slide-in-from-right duration-150">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 mb-4 px-3 py-2.5 min-h-[44px] bg-emerald-50 rounded-xl cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to {selectedCat.name}</span>
              </button>

              <div className="pb-3 border-b border-slate-100 mb-3">
                <h4 className="font-bold text-slate-800 text-base">
                  {selectedSub.name}
                </h4>
                <p className="text-xs text-slate-500">In {selectedCat.name}</p>
              </div>

              <button
                type="button"
                onClick={() => handleViewAllSub(selectedSub)}
                className="w-full text-left py-3 px-3 min-h-[44px] text-xs font-bold text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/50 rounded-xl mb-2 flex items-center justify-between cursor-pointer"
              >
                <span>View All {selectedSub.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <ul className="space-y-1">
                {selectedSub.subSubcategories.map((subSub, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleSelectSubSub(subSub)}
                      className="w-full text-left py-2.5 px-3 min-h-[40px] text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{subSub}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : /* LEVEL 1: Subcategories of selected Category */
          selectedCat ? (
            <div className="p-4 animate-in slide-in-from-right duration-150">
              <button
                type="button"
                onClick={() => setSelectedCat(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 mb-4 px-3 py-2.5 min-h-[44px] bg-emerald-50 rounded-xl cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to All Categories</span>
              </button>

              <div className="pb-3 border-b border-slate-100 mb-3">
                <h4 className="font-bold text-slate-800 text-base">
                  {selectedCat.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedCat.itemCount}+ Products available
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleViewAllCat(selectedCat)}
                className="w-full text-left py-3 px-3 min-h-[44px] text-xs font-bold text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/50 rounded-xl mb-2 flex items-center justify-between cursor-pointer"
              >
                <span>Browse Entire {selectedCat.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                {selectedCat.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSub(sub)}
                    className="w-full text-left py-3 px-3 min-h-[44px] rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    <span>{sub.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : showLowStockView ? (
            /* LEVEL LOW STOCK: In-Drawer Low Stock Products View (Does not open admin panel) */
            <div className="p-4 animate-in slide-in-from-right duration-150">
              <button
                type="button"
                id="drawer-back-from-low-stock-btn"
                onClick={() => {
                  setShowLowStockView(false);
                  setDrawerShowLowStock(false);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 mb-4 px-3 py-2.5 min-h-[44px] bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Menu</span>
              </button>

              <div className="pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <span>Low Stock Medicines</span>
                    {lowStockCount > 0 ? (
                      <span className="text-xs bg-rose-600 text-white font-black px-2.5 py-0.5 rounded-full shadow-xs">
                        {lowStockCount}
                      </span>
                    ) : (
                      <span className="text-xs bg-emerald-700 text-white font-black px-2.5 py-0.5 rounded-full shadow-xs">
                        OK
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {lowStockCount > 0
                      ? `${lowStockCount} ${lowStockCount === 1 ? 'medicine needs' : 'medicines need'} attention`
                      : 'All inventory levels are healthy'}
                  </p>
                </div>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3 my-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-emerald-900 text-sm">All Stock Levels OK</h5>
                  <p className="text-xs text-emerald-700 max-w-xs mx-auto leading-relaxed">
                    No medicines are currently at or below their alert limit (default 15). All products are fully available!
                  </p>
                  <button
                    type="button"
                    onClick={handleBrowseAllMedicines}
                    className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors inline-block"
                  >
                    Browse All Medicines
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Medicines at or below their custom threshold:</span>
                  </div>

                  <ul className="space-y-2.5">
                    {lowStockProducts.map((p) => {
                      const threshold = p.lowStockThreshold ?? 15;
                      return (
                        <li
                          key={p.id}
                          className="p-3 rounded-2xl border border-rose-200/80 bg-rose-50/20 hover:bg-rose-50/40 shadow-xs transition-all space-y-2.5"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80'}
                              alt={p.name}
                              className="w-12 h-12 object-contain rounded-xl border border-slate-200 p-1 bg-white shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-xs text-slate-900 truncate">{p.name}</h5>
                              <p className="text-xs text-slate-500 truncate">{p.genericName}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="font-bold text-xs text-emerald-700">
                                  Rs. {p.price.toLocaleString()}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-black text-white bg-rose-600 px-1.5 py-0.5 rounded shadow-xs">
                                    {p.stockCount} left
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    (Alert: &le;{threshold})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-rose-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                navigate(`/product/${p.slug}?from=drawer-lowstock`);
                              }}
                              className="flex-1 text-center py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                navigate('/admin?tab=products&filter=lowStock');
                              }}
                              className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                              title="Restock in Admin Panel"
                            >
                              Restock
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="pt-2">
                    <button
                      type="button"
                      id="drawer-browse-all-medicines-btn"
                      onClick={handleBrowseAllMedicines}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      Browse All Medicines
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* LEVEL 0: Main Menu */
            <div className="p-4 space-y-5">
              {/* Low Stock Quick Access */}
              <div className="space-y-2">
                {/* Low Stock Warning Option (Changes Color Green for OK, Red with Count 1, 2... for Low Stock) */}
                {lowStockCount === 0 ? (
                  /* GREEN / OK STATE */
                  <button
                    id="drawer-low-stock-btn"
                    type="button"
                    onClick={() => setShowLowStockView(true)}
                    className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/90 text-emerald-100 flex items-center justify-between border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-950 transition-all cursor-pointer group shadow-xs"
                    title="Stock status is OK - Click to view status"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-emerald-200">
                            Low Stock Alert
                          </span>
                          <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-xs">
                            OK
                          </span>
                        </div>
                        <p className="text-xs text-emerald-300/80">
                          All medicines are well-stocked &bull; Click to view status
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  /* RED / LOW STOCK STATE WITH EXACT COUNT 1, 2, ... */
                  <button
                    id="drawer-low-stock-btn"
                    type="button"
                    onClick={() => setShowLowStockView(true)}
                    className="w-full p-2.5 rounded-xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950/90 text-rose-100 flex items-center justify-between border border-rose-500/70 hover:border-rose-400 hover:bg-rose-900/60 shadow-md shadow-rose-950/40 transition-all cursor-pointer group"
                    title={`Click to open ${lowStockCount} low stock medicines`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                        <AlertTriangle className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-rose-200">
                            Low Stock Alert
                          </span>
                          <span className="text-xs bg-rose-600 text-white font-black px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                            {lowStockCount}
                          </span>
                        </div>
                        <p className="text-xs text-rose-300">
                          {lowStockCount} {lowStockCount === 1 ? 'medicine needs' : 'medicines need'} restocking &bull; Click to open
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs bg-rose-800/80 text-rose-200 px-2 py-1 rounded-lg border border-rose-500/40 font-semibold">
                        View ({lowStockCount})
                      </span>
                      <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                )}
              </div>

              {/* Categories Section */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Browse by Category
                </div>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const Icon = ICON_MAP[cat.icon] || Pill;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCat(cat)}
                        className="w-full text-left p-3 min-h-[44px] rounded-xl hover:bg-emerald-50/60 transition-colors flex items-center justify-between text-sm font-semibold text-slate-800 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span>{cat.name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Store Services & Quick Actions */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Store Services & Functions
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={handleBrowseAllMedicines}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-emerald-800 font-semibold text-sm flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span>Browse All Medicines</span>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      500+ Items
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/upload-prescription');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 font-bold text-sm flex items-center justify-between cursor-pointer border border-emerald-200/60"
                  >
                    <div className="flex items-center gap-3">
                      <Upload className="w-4 h-4 text-emerald-700" />
                      <span>Upload Doctor Prescription</span>
                    </div>
                    <span className="text-xs bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded">
                      2-Hr Express
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (user) navigate('/account?tab=orders');
                      else {
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm flex items-center gap-3 cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-indigo-600" />
                    <span>Track My Orders</span>
                  </button>

                  <a
                    href="https://wa.me/923001234567?text=Hello,%20I%20want%20to%20order%20medicines"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-emerald-800 font-medium text-sm flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <WhatsAppIcon className="w-5 h-5 shrink-0" />
                      <span>Order via WhatsApp</span>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                      0300-1234567
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/products?deals=true');
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-rose-50 text-rose-700 font-semibold text-sm flex items-center gap-3 cursor-pointer"
                  >
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span>Hot Deals & Discounts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (user) navigate('/account?tab=wishlist');
                      else setIsAuthModalOpen(true);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>My Wishlist</span>
                    </div>
                    {wishlist.length > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsCompareOpen(true);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Scale className="w-4 h-4 text-sky-600" />
                      <span>Compare Medicines</span>
                    </div>
                    {compareList.length > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 font-bold rounded-full">
                        {compareList.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/shipping');
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 font-medium text-sm flex items-center gap-3 cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>2-4 Hr Express Delivery Cities</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsLicenseModalOpen(true);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 font-medium text-sm flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>DRAP Pharmacy License</span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      #{storeSettings.pharmacyRegNumber}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/contact');
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 font-medium text-sm flex items-center gap-3 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>Contact Us & Policies</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer: My Account */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <button
            id="drawer-my-account-btn"
            type="button"
            onClick={() => {
              onClose();
              if (user) {
                navigate('/account');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="w-full flex items-center justify-between p-3 bg-white hover:bg-emerald-50 active:bg-emerald-100/60 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-slate-800 group-hover:text-emerald-800">
                  My Account
                </span>
                <span className="block text-xs text-slate-400">
                  {user ? 'View profile & orders' : 'Sign in or register'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
