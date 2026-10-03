import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Heart,
  HeartHandshake,
  Package,
  Pill,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TriangleAlert,
  Upload,
  User,
  X,
} from 'lucide-react';

interface MobileDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Pill: Pill,
  Activity: Activity,
  ShieldCheck: ShieldCheck,
  HeartHandshake: HeartHandshake,
  Stethoscope: Stethoscope,
  Sparkles: Sparkles,
};
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
  const lowStockProducts = products.filter((product) => product.stockCount <= (product.lowStockThreshold ?? 15));
  const lowStockCount = lowStockProducts.length;
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showLowStockView, setShowLowStockView] = useState(drawerShowLowStock);
  const [categorySearch, setCategorySearch] = useState('');
  const handleBrowseAllMedicines = () => {
    resetFilters(false);
    setShowLowStockView(false);
    setDrawerShowLowStock(false);
    setSelectedCat(null);
    setSelectedSub(null);
    setCategorySearch('');
    onClose();
    navigate('/products');
  };
  useEffect(() => {
    if (isOpen && drawerShowLowStock) {
      setShowLowStockView(true);
    } else {
      if (!isOpen) {
        setSelectedCat(null);
        setSelectedSub(null);
        setShowLowStockView(false);
        setDrawerShowLowStock(false);
        setCategorySearch('');
      }
    }
  }, [isOpen, drawerShowLowStock, setDrawerShowLowStock]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const handleSelectSubSub = (subSub) => {
    if (!(!selectedCat || !selectedSub)) {
      setFilters((prev) => ({
        ...prev,
        categoryId: selectedCat.id,
        subcategoryId: selectedSub.id,
        subSubcategory: subSub,
        page: 1,
      }));
      navigate(`/category/${selectedCat.slug}?sub=${selectedSub.slug}&subSub=${encodeURIComponent(subSub)}`);
      onClose();
    }
  };
  const handleViewAllSub = (sub) => {
    if (selectedCat) {
      setFilters((prev) => ({
        ...prev,
        categoryId: selectedCat.id,
        subcategoryId: sub.id,
        subSubcategory: undefined,
        page: 1,
      }));
      navigate(`/category/${selectedCat.slug}?sub=${sub.slug}`);
      onClose();
    }
  };
  const handleViewAllCat = (cat) => {
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
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );
  return (
    <div
      id="mobile-drawer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-xs flex modal-backdrop-animate transition-opacity duration-200"
    >
      <div
        id="mobile-drawer-content"
        className="relative w-[300px] xs:w-80 sm:w-96 max-w-[85vw] bg-slate-50 h-full h-[100dvh] shadow-2xl flex flex-col justify-between overflow-hidden drawer-content-animate"
      >
        <div className="relative p-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg border border-white/20">
                +
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight leading-tight">DawaStore</h3>
                <p className="text-xs text-emerald-200 font-medium">Pakistan Online Pharmacy</p>
              </div>
            </div>
            <button
              id="mobile-drawer-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {user && (
            <div className="mt-2.5 pt-2 border-t border-white/15 text-xs text-emerald-100">
              <span>
                {'Welcome, '}
                <strong className="text-white font-semibold">{user.name.split(' ')[0]}</strong>
                {' 👋'}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain bg-slate-50">
          {selectedSub && selectedCat ? (
            <div className="p-4 animate-in slide-in-from-right duration-300">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900 mb-5 px-4 py-3 min-h-[44px] bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-xl cursor-pointer transition-all hover:shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>
                  {'Back to '}
                  {selectedCat.name}
                </span>
              </button>
              <div className="pb-4 border-b border-slate-200/60 mb-4 px-1">
                <h4 className="font-extrabold text-slate-800 text-lg tracking-tight">{selectedSub.name}</h4>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  {'In '}
                  {selectedCat.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleViewAllSub(selectedSub)}
                className="w-full text-left py-3.5 px-4 min-h-[44px] text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl mb-3 flex items-center justify-between cursor-pointer transition-colors border border-emerald-100"
              >
                <span>
                  {'View All '}
                  {selectedSub.name}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <ul className="space-y-1.5">
                {selectedSub.subSubcategories.map((subSubcategory, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => handleSelectSubSub(subSubcategory)}
                      className="w-full text-left py-3 px-4 min-h-[44px] text-sm font-semibold text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100 rounded-xl transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md"
                    >
                      <span>{subSubcategory}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : selectedCat ? (
            <div className="p-4 animate-in slide-in-from-right duration-300">
              <button
                type="button"
                onClick={() => setSelectedCat(null)}
                className="flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900 mb-5 px-4 py-3 min-h-[44px] bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-xl cursor-pointer transition-all hover:shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to All Categories</span>
              </button>
              <div className="pb-4 border-b border-slate-200/60 mb-4 px-1">
                <h4 className="font-extrabold text-slate-800 text-lg tracking-tight">{selectedCat.name}</h4>
                <p className="text-sm text-slate-500 font-medium mt-0.5">{selectedCat.itemCount}+ Products available</p>
              </div>
              <button
                type="button"
                onClick={() => handleViewAllCat(selectedCat)}
                className="w-full text-left py-3.5 px-4 min-h-[44px] text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl mb-3 flex items-center justify-between cursor-pointer transition-colors border border-emerald-100"
              >
                <span>
                  {'Browse Entire '}
                  {selectedCat.name}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="space-y-2">
                {selectedCat.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    type="button"
                    onClick={() => setSelectedSub(subcategory)}
                    className="w-full text-left py-3.5 px-4 min-h-[44px] bg-white rounded-xl border border-slate-200/60 hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-md transition-all flex items-center justify-between text-sm font-bold text-slate-700 cursor-pointer group"
                  >
                    <span>{subcategory.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : showLowStockView ? (
            <div className="p-4 animate-in slide-in-from-right duration-300">
              <button
                type="button"
                id="drawer-back-from-low-stock-btn"
                onClick={() => {
                  setShowLowStockView(false);
                  setDrawerShowLowStock(false);
                }}
                className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 mb-5 px-4 py-3 min-h-[44px] bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-xl cursor-pointer transition-all hover:shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Menu</span>
              </button>
              <div className="pb-4 border-b border-slate-200/60 mb-5 flex items-center justify-between px-1">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 tracking-tight">
                    <span>Low Stock Medicines</span>
                    {lowStockCount > 0 ? (
                      <span className="text-xs bg-rose-500 text-white font-black px-2.5 py-0.5 rounded-full shadow-sm">
                        {lowStockCount}
                      </span>
                    ) : (
                      <span className="text-xs bg-emerald-500 text-white font-black px-2.5 py-0.5 rounded-full shadow-sm">
                        OK
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">
                    {lowStockCount > 0
                      ? `${lowStockCount} ${lowStockCount === 1 ? 'medicine needs' : 'medicines need'} attention`
                      : 'All inventory levels are healthy'}
                  </p>
                </div>
              </div>
              {lowStockProducts.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm space-y-3 my-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CircleCheck className="w-7 h-7" />
                  </div>
                  <h5 className="font-bold text-emerald-900 text-base">All Stock Levels OK</h5>
                  <p className="text-sm text-emerald-700/80 max-w-xs mx-auto leading-relaxed">
                    No medicines are currently at or below their alert limit (default 15). All products are fully
                    available!
                  </p>
                  <button
                    type="button"
                    onClick={handleBrowseAllMedicines}
                    className="mt-3 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl cursor-pointer shadow-md transition-all hover:shadow-lg inline-block"
                  >
                    Browse All Medicines
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/60 text-xs font-medium text-rose-800 flex items-center gap-2.5 shadow-sm">
                    <TriangleAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Medicines at or below their custom threshold:</span>
                  </div>
                  <ul className="space-y-3">
                    {lowStockProducts.map((product) => {
                      const threshold = product.lowStockThreshold ?? 15;
                      return (
                        <li
                          key={product.id}
                          className="p-4 rounded-2xl border border-rose-200/60 bg-white shadow-sm hover:shadow-md transition-all space-y-3"
                        >
                          <div className="flex items-start gap-3.5">
                            <img
                              src={
                                product.images?.[0] ||
                                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80'
                              }
                              alt={product.name}
                              className="w-14 h-14 object-contain rounded-xl border border-slate-100 p-1.5 bg-slate-50 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-extrabold text-sm text-slate-900 truncate">{product.name}</h5>
                              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                                {product.genericName}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-sm text-emerald-700">
                                  {'Rs. '}
                                  {product.price.toLocaleString()}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-black text-white bg-rose-500 px-2 py-0.5 rounded-md shadow-sm">
                                    {product.stockCount}
                                    {' left'}
                                  </span>
                                  <span className="text-xs font-medium text-slate-400">(Alert: ≤{threshold})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                navigate(`/product/${product.slug}?from=drawer-lowstock`);
                              }}
                              className="flex-1 text-center py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                            >
                              View Details
                            </button>
                            {user?.isAdmin && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  navigate('/admin?tab=products&filter=lowStock');
                                }}
                                className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all hover:shadow-md cursor-pointer shadow-sm"
                                title="Restock in Admin Panel"
                              >
                                Restock
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="pt-3 pb-2">
                    <button
                      type="button"
                      id="drawer-browse-all-medicines-btn"
                      onClick={handleBrowseAllMedicines}
                      className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      Browse All Medicines
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 sm:p-3.5 space-y-3.5 animate-in fade-in duration-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {categorySearch && (
                  <button
                    type="button"
                    onClick={() => setCategorySearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">
                  Browse Categories
                </div>
                <div className="space-y-1">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                      const Icon = ICON_MAP[category.icon] || Pill;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCat(category)}
                          className="w-full text-left p-2.5 bg-white rounded-lg border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer group shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-1.5">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {category.itemCount}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400">No categories found</div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">
                  Quick Actions
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (user) {
                        navigate('/account?tab=orders');
                      } else {
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="w-full text-left p-2.5 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center transition-colors shrink-0">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <span>Track My Orders</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (user) {
                        navigate('/account?tab=wishlist');
                      } else {
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="w-full text-left p-2.5 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-rose-50 group-hover:text-rose-500 flex items-center justify-center transition-colors shrink-0">
                        <Heart className="w-3.5 h-3.5" />
                      </div>
                      <span>My Wishlist</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {wishlist && wishlist.length > 0 && (
                        <span className="text-[9px] font-bold text-white bg-rose-500 px-1.5 py-0.5 rounded-full">
                          {wishlist.length}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-500 transition-colors" />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/upload-prescription');
                    }}
                    className="w-full text-left p-2.5 bg-white rounded-lg border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700 flex items-center justify-center transition-colors shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                      <span>Upload Prescription</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </button>
                  {storeSettings?.socialLinks?.whatsapp && (
                    <a
                      href={storeSettings.socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left p-2.5 bg-white rounded-lg border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-green-50 text-[#25D366] flex items-center justify-center shrink-0">
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                        </div>
                        <span>Order via WhatsApp</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-green-600 transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 bg-white border-t border-slate-200">
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
            className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50/60 active:scale-[0.99] border border-slate-200 hover:border-emerald-300 rounded-xl transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left flex flex-col">
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                  {user ? user.name : 'My Account'}
                </span>
                <span className="text-xs text-slate-400">{user ? user.email : 'Sign in or register'}</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
