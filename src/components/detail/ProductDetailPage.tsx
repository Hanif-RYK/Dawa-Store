import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
  ArrowLeft,
  X,
  Heart,
  Scale,
  ShoppingBag,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Truck,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Thermometer,
  Pill,
  Clock,
  Award,
  Layers,
  FileText,
  Share2,
  Package,
  ArrowLeftRight,
  AlertTriangle,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const {
    products,
    categories,
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    navigate,
    goBack,
    addToast,
    currentPath,
    openLowStockDrawer,
  } = usePharmacy();

  // Find product by slug (fallback to first product)
  const product = products.find((p) => p.slug === slug) || products[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAlternativesModalOpen, setIsAlternativesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs'>('details');

  // URL query params for context preservation (e.g. from drawer-lowstock or admin-lowstock)
  const searchStr = currentPath.includes('?')
    ? '?' + currentPath.split('?')[1]
    : typeof window !== 'undefined'
    ? window.location.search
    : '';
  const urlParams = new URLSearchParams(searchStr);
  const fromParam = urlParams.get('from');

  const handleBack = () => {
    if (fromParam === 'drawer-lowstock') {
      goBack();
      openLowStockDrawer();
      return;
    }
    if (fromParam === 'admin-lowstock') {
      navigate('/admin?tab=products&filter=lowStock');
      return;
    }
    goBack();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false);
        if (isAlternativesModalOpen) setIsAlternativesModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, isAlternativesModalOpen]);

  // Same active generic molecule or therapeutic class alternatives
  const alternativeProducts = products
    .filter((p) => p.id !== product.id)
    .filter(
      (p) =>
        p.genericName.toLowerCase() === product.genericName.toLowerCase() ||
        p.categoryId === product.categoryId
    )
    .sort((a, b) => {
      const aMatches = a.genericName.toLowerCase() === product.genericName.toLowerCase() ? 1 : 0;
      const bMatches = b.genericName.toLowerCase() === product.genericName.toLowerCase() ? 1 : 0;
      return bMatches - aMatches;
    })
    .slice(0, 8);

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Approximate per-unit calculation if pack size has numbers
  const packUnitsMatch = product.packSize.match(/(\d+)/);
  const totalUnits = packUnitsMatch ? parseInt(packUnitsMatch[1], 10) : null;
  const unitPrice = totalUnits && totalUnits > 1 ? (product.price / totalUnits).toFixed(2) : null;

  const category = categories.find((c) => c.id === product.categoryId);

  // Breadcrumbs items (Home > Store > Category; product name omitted to prevent wrapping)
  const breadcrumbItems = [
    { label: 'Store', path: '/products' },
    ...(category ? [{ label: category.name, path: `/category/${category.slug}` }] : []),
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${quantity}x ${product.name} added to your shopping cart.`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Product link copied to clipboard.',
      });
    }
  };

  // Structured directions parser (numbered list or fallback)
  const directionsList = product.howToUse
    ? product.howToUse
        .split('\n')
        .map((s) => s.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(Boolean)
    : [
        'Take strictly according to your physician’s prescription.',
        'Swallow the tablet whole with a glass of water.',
        'Take medication at the specified time as directed by your doctor.',
        'Do not crush, split, or chew unless explicitly directed.',
      ];

  // Structured precautions parser (bullet list or fallback)
  const precautionsList = product.sideEffects
    ? product.sideEffects
        .split('\n')
        .map((s) => s.replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean)
    : [
        'Do not drive or operate heavy machinery if experiencing drowsiness or dizziness.',
        'Avoid exceeding the prescribed dose to prevent adverse reactions.',
        'Consult your doctor before use if you are pregnant or breastfeeding.',
        'Store in a cool, dry place away from children and pets.',
      ];

  // Key benefits defaults
  // Products carry no per-medicine benefits data, so show points that are true
  // for every item rather than medicine-specific claims.
  const qualityPoints = [
    '100% genuine stock sourced from DRAP-licensed distributors',
    'Manufactured under Good Manufacturing Practices (GMP) and DRAP oversight',
    "Stored and dispatched as per the manufacturer's storage instructions",
    'Use only as directed on the label or by your doctor or pharmacist',
    'Read the directions and precautions below before use',
  ];

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <Package className="w-16 h-16 text-slate-300 mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Medicine Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6 max-w-sm">
          The requested medicine does not exist or has been removed from our catalog.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          Browse All Medicines
        </button>
      </div>
    );
  }

  return (
    <div id="product-detail-view" className="min-h-screen bg-slate-50 py-4 sm:py-6 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        {/* TOP BAR: Clean Breadcrumbs & Quick Back / Close Navigation */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <button
              id="pdp-back-btn"
              type="button"
              onClick={handleBack}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>Back</span>
            </button>
            <div className="min-w-0 flex-1 overflow-hidden">
              <Breadcrumbs
                items={breadcrumbItems}
                className="flex items-center flex-nowrap overflow-hidden gap-1 sm:gap-1.5 text-xs text-slate-500 py-1 bg-transparent"
                truncateLabels={true}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Share Button */}
            <button
              id="pdp-share-btn"
              type="button"
              onClick={handleShare}
              className="p-2.5 min-w-[40px] min-h-[40px] rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Copy product link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">Share</span>
            </button>

            {/* Compare Toggle */}
            <button
              id="pdp-toggle-compare-btn"
              type="button"
              onClick={() => toggleCompare(product.id)}
              className={`p-2.5 min-w-[40px] min-h-[40px] rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                isCompared
                  ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Compare with other medicines"
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            {/* Wishlist Toggle */}
            <button
              id="pdp-toggle-wishlist-btn"
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`p-2.5 min-w-[40px] min-h-[40px] rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Save to wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>
        </div>

        {/* Low Stock Context Notification Banner */}
        {fromParam === 'drawer-lowstock' && (
          <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Viewing from <strong>Low Stock Alerts</strong> (Current: {product.stockCount} units, alert limit &le; {product.lowStockThreshold ?? 15})
              </span>
            </div>
            <button
              type="button"
              id="pdp-back-to-low-stock-banner-btn"
              onClick={handleBack}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Low Stock Menu</span>
            </button>
          </div>
        )}

        {fromParam === 'admin-lowstock' && (
          <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-rose-900 shadow-2xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Viewing from <strong>Admin Low Stock Filter</strong>
              </span>
            </div>
            <button
              type="button"
              id="pdp-back-to-admin-banner-btn"
              onClick={handleBack}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Inventory</span>
            </button>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SINGLE UNIFIED PRODUCT MASTER CARD (All Product Details in ONE Card)  */}
        {/* ==================================================================== */}
        <div
          id="single-product-master-card"
          className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden"
        >
          {/* SECTION A: PRODUCT HERO (IMAGE & PURCHASE BOX) */}
          <div className="p-5 sm:p-7 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: Product Images & Quality Assurance */}
            <div className="lg:col-span-5 space-y-5">
              <div
                className="relative aspect-square w-full rounded-2xl bg-white border border-slate-200/90 overflow-hidden cursor-zoom-in group"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Status Badges in Respective Corners */}
                {discountPercent > 0 && (
                  <div className="absolute top-3.5 left-3.5 pointer-events-none z-10">
                    <span className="inline-flex items-center bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs tracking-wide">
                      Save {discountPercent}%
                    </span>
                  </div>
                )}
                {product.isRxRequired && (
                  <div className="absolute top-3.5 right-3.5 pointer-events-none z-10">
                    <span className="inline-flex items-center gap-1 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs tracking-wide">
                      <ShieldAlert className="w-3.5 h-3.5" /> Rx Prescription
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery (if more than 1 image) */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-20 sm:w-[84px] sm:h-[84px] rounded-xl border-2 bg-white shrink-0 overflow-hidden transition-all cursor-pointer shadow-2xs ${
                        selectedImageIndex === idx
                          ? 'border-emerald-600 shadow-xs ring-2 ring-emerald-100'
                          : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Pharmacy Guarantees */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-5 border-t border-slate-200/80 text-center">
                <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/70 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center mb-2 text-emerald-700 shrink-0">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <strong className="block text-slate-900 text-xs font-bold leading-tight">100% Genuine</strong>
                  <span className="text-xs text-slate-500 mt-1 leading-tight">DRAP Licensed</span>
                </div>
                <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/70 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-sky-100/70 border border-sky-200/80 flex items-center justify-center mb-2 text-sky-700 shrink-0">
                    <Thermometer className="w-4.5 h-4.5" />
                  </div>
                  <strong className="block text-slate-900 text-xs font-bold leading-tight">Cold Chain</strong>
                  <span className="text-xs text-slate-500 mt-1 leading-tight">Temp Protected</span>
                </div>
                <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/70 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-teal-100/70 border border-teal-200/80 flex items-center justify-center mb-2 text-teal-700 shrink-0">
                    <Truck className="w-4.5 h-4.5" />
                  </div>
                  <strong className="block text-slate-900 text-xs font-bold leading-tight">Fast Delivery</strong>
                  <span className="text-xs text-slate-500 mt-1 leading-tight">Express dispatch</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: D-Watson Style Essential Medicine Details & Order Card */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Title & Brand */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      {product.brand}
                    </span>
                    {product.sku && (
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        SKU: {product.sku}
                      </span>
                    )}
                    {product.isRxRequired && (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Schedule G Controlled
                      </span>
                    )}
                  </div>

                  <button
                    id="pdp-view-alternatives-btn"
                    type="button"
                    onClick={() => setIsAlternativesModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 px-2.5 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>View Alternative Medicines</span>
                  </button>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {product.name}
                </h1>
              </div>

              {/* D-Watson Authentic Specifications Summary Table */}
              <div className="mb-6 bg-slate-50/90 rounded-2xl border border-slate-200/90 p-4 divide-y divide-slate-200/80 text-xs sm:text-sm">
                <div className="grid grid-cols-3 py-2.5 first:pt-0">
                  <span className="text-slate-500 font-semibold">Manufacturer:</span>
                  <span className="col-span-2 font-bold text-slate-900">{product.manufacturer}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5">
                  <span className="text-slate-500 font-semibold">Ingredients (API):</span>
                  <span className="col-span-2 font-bold text-emerald-700 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{product.genericName}</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 py-2.5">
                  <span className="text-slate-500 font-semibold">Form:</span>
                  <span className="col-span-2 font-semibold text-slate-800">{product.dosageForm}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5">
                  <span className="text-slate-500 font-semibold">Size:</span>
                  <span className="col-span-2 font-semibold text-slate-800">{product.packSize}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 last:pb-0">
                  <span className="text-slate-500 font-semibold">Availability:</span>
                  <span className="col-span-2">
                    {product.inStock ? (
                      product.stockCount <= (product.lowStockThreshold ?? 15) ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Low Stock: Only {product.stockCount} packs left</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          <Check className="w-3.5 h-3.5" /> In Stock ({product.stockCount} packs available)
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                        Out of Stock
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Price Box with Unit Breakdown */}
              <div className="mb-6 p-4 sm:p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Retail Price (MRP)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {unitPrice && (
                    <span className="text-xs text-emerald-800 font-medium">
                      (Approximately Rs. {unitPrice} per {product.dosageForm.toLowerCase()})
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-800 font-bold bg-white px-3 py-1.5 rounded-xl border border-emerald-200 block shadow-2xs">
                    Official DRAP Rate
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">Inclusive of all taxes</span>
                </div>
              </div>

              {/* Prescription Notice (If Rx Required) */}
              {product.isRxRequired && (
                <div className="mb-6 p-3.5 sm:p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-950 text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block text-[13px]">Prescription Required (Schedule G / Controlled)</strong>
                    <span className="text-slate-600 text-xs mt-0.5 block">A valid doctor's prescription will be verified by a licensed pharmacist prior to order dispatch.</span>
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart / Buy Now Action Buttons */}
              <div className="space-y-3.5 mb-2">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Quantity:</span>
                    <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-2xs min-h-[40px]">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-30 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stockCount || 10, q + 1))}
                        disabled={quantity >= (product.stockCount || 10)}
                        className="p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Subtotal</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      Rs. {(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    id="pdp-add-to-cart-btn"
                    type="button"
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                    className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:bg-slate-300 text-white font-black text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    id="pdp-buy-now-btn"
                    type="button"
                    disabled={!product.inStock}
                    onClick={handleBuyNow}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-300 text-white font-black text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Buy Now (Instant Checkout)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: CLINICAL DETAILS & SPECIFICATIONS (INSIDE THE SAME CARD) */}
          <div className="border-t border-slate-200 bg-slate-50/50">
            {/* Tab navigation inside this card */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8 pt-3 gap-3 overflow-x-auto">
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`pb-3.5 px-4 font-black text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
                    activeTab === 'details'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Details & Usage</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`pb-3.5 px-4 font-black text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
                    activeTab === 'specs'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>More Information</span>
                </button>
              </div>

              <button
                id="pdp-view-alternatives-tab-btn"
                type="button"
                onClick={() => setIsAlternativesModalOpen(true)}
                className="mb-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>View Alternative Medicines</span>
              </button>
            </div>

            {/* TAB 1: DETAILS & USAGE */}
            {activeTab === 'details' && (
              <div className="p-6 sm:p-8 space-y-8 bg-white animate-in fade-in duration-150">
                {/* Product Overview */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-base border-b border-slate-100 pb-2">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <h3>Product Overview</h3>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
                    {product.description}
                  </p>
                </div>

                {/* Quality & Safe Use */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-base border-b border-slate-100 pb-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <h3>Quality &amp; Safe Use</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {qualityPoints.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700"
                      >
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How It Works */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-base border-b border-slate-100 pb-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <h3>How It Works</h3>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
                    {product.composition}
                  </p>
                </div>

                {/* Directions for Use */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-base border-b border-slate-100 pb-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <h3>Directions for Use</h3>
                  </div>
                  <div className="space-y-2 max-w-4xl">
                    {directionsList.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700"
                      >
                        <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="mt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Precautions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-base border-b border-slate-100 pb-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <h3>Precautions & Safety Warnings</h3>
                  </div>
                  <div className="space-y-2 max-w-4xl">
                    {precautionsList.map((precaution, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/50 border border-rose-200/60 text-xs sm:text-sm text-slate-700"
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span>{precaution}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage Instructions & Manufacturer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Thermometer className="w-4 h-4 text-sky-600" />
                      <span>Storage Instructions</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {product.storage ||
                        'Store at room temperature away from moisture and heat. Keep the medication out of reach of children and pets. Do not store in bathrooms or areas exposed to high humidity.'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Manufacturer Information</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Manufactured by <strong className="text-slate-900">{product.manufacturer}</strong>. Licensed pharmaceutical manufacturer complying with official Drug Regulatory Authority of Pakistan (DRAP) quality standards.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MORE INFORMATION (Technical Specifications Attribute Table) */}
            {activeTab === 'specs' && (
              <div className="p-6 sm:p-8 bg-white animate-in fade-in duration-150">
                <div className="max-w-3xl">
                  <h3 className="text-lg font-black text-slate-900 mb-1">Drug Specifications</h3>
                  <p className="text-xs text-slate-500 mb-5">
                    Verified technical and regulatory information for {product.name}.
                  </p>

                  <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs sm:text-sm divide-y divide-slate-200">
                    <div className="grid grid-cols-3 p-3 sm:p-4 bg-slate-50">
                      <span className="font-bold text-slate-700">Manufacturer</span>
                      <span className="col-span-2 text-slate-900 font-medium">{product.manufacturer}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 sm:p-4 bg-white">
                      <span className="font-bold text-slate-700">Active Ingredients (API)</span>
                      <span className="col-span-2 text-emerald-700 font-bold">{product.genericName}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 sm:p-4 bg-slate-50">
                      <span className="font-bold text-slate-700">Dosage Form</span>
                      <span className="col-span-2 text-slate-900 font-medium">{product.dosageForm}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 sm:p-4 bg-white">
                      <span className="font-bold text-slate-700">Packaging Size</span>
                      <span className="col-span-2 text-slate-900 font-medium">{product.packSize}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 sm:p-4 bg-slate-50">
                      <span className="font-bold text-slate-700">Product SKU Code</span>
                      <span className="col-span-2 font-mono text-slate-800">{product.sku || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 sm:p-4 bg-white">
                      <span className="font-bold text-slate-700">Prescription Status</span>
                      <span className="col-span-2">
                        {product.isRxRequired ? (
                          <span className="text-amber-800 font-bold">Schedule G Prescription Required</span>
                        ) : (
                          <span className="text-emerald-700 font-bold">Over the Counter (OTC)</span>
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 p-3 sm:p-4 bg-slate-50">
                      <span className="font-bold text-slate-700">Regulatory Oversight</span>
                      <span className="col-span-2 text-slate-900 font-medium">Drug Regulatory Authority of Pakistan (DRAP)</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 sm:p-4 bg-white">
                      <span className="font-bold text-slate-700">Recommended Storage</span>
                      <span className="col-span-2 text-slate-700">Store below 25°C in a dry place, away from sunlight and moisture.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR ON MOBILE FOR SEAMLESS ORDERING */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 sm:hidden shadow-lg flex items-center justify-between gap-3 safe-area-bottom">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-900 truncate block">
              {product.name}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-emerald-700">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                ({product.packSize})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className="px-4 py-2.5 min-h-[44px] bg-emerald-700 active:bg-emerald-900 disabled:bg-slate-300 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleBuyNow}
              className="px-3.5 py-2.5 min-h-[44px] bg-slate-900 active:bg-slate-950 disabled:bg-slate-300 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Buy</span>
            </button>
          </div>
        </div>

        {/* Full Image Lightbox Modal */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className="relative max-w-2xl w-full bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-3 right-3 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close image lightbox"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
              <p className="mt-4 text-sm font-bold text-slate-800">{product.name}</p>
            </div>
          </div>
        )}

        {/* Alternative Medicines Modal / Bottom Sheet Popup */}
        {isAlternativesModalOpen && (
          <div
            id="alternatives-modal-backdrop"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsAlternativesModalOpen(false)}
          >
            <div
              id="alternatives-modal"
              className="relative w-full sm:max-w-2xl lg:max-w-3xl max-h-[88vh] sm:max-h-[82vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50/90 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/80">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        Alternative Medicines
                      </h3>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0 hidden sm:inline-block">
                        {alternativeProducts.length} options available
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      Same formula / generic molecule: <span className="font-bold text-emerald-700">{product.genericName}</span>
                    </p>
                  </div>
                </div>
                <button
                  id="close-alternatives-modal-btn"
                  type="button"
                  onClick={() => setIsAlternativesModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  aria-label="Close alternative medicines dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Cards List */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5">
                {alternativeProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {alternativeProducts.map((altProd) => {
                      const isExactFormula =
                        altProd.genericName.toLowerCase() === product.genericName.toLowerCase();
                      const isCheaper = altProd.price < product.price;
                      const savings = isCheaper ? product.price - altProd.price : 0;

                      return (
                        <div
                          key={altProd.id}
                          id={`alt-card-${altProd.id}`}
                          className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                          <div className="flex gap-3">
                            {/* Product Thumbnail */}
                            <div
                              className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 shrink-0 overflow-hidden cursor-pointer"
                              onClick={() => {
                                setIsAlternativesModalOpen(false);
                                navigate(`/product/${altProd.slug || altProd.id}`);
                              }}
                            >
                              <img
                                src={altProd.images[0]}
                                alt={altProd.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70">
                                  {altProd.brand}
                                </span>
                                {isExactFormula && (
                                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/70">
                                    Same Formula
                                  </span>
                                )}
                              </div>

                              <h4
                                className="text-xs sm:text-sm font-bold text-slate-900 mt-1 leading-snug hover:text-emerald-700 cursor-pointer line-clamp-2"
                                onClick={() => {
                                  setIsAlternativesModalOpen(false);
                                  navigate(`/product/${altProd.slug || altProd.id}`);
                                }}
                              >
                                {altProd.name}
                              </h4>

                              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                <span>{altProd.packSize}</span>
                                <span>•</span>
                                <span>{altProd.dosageForm}</span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing & Add to Cart Footer */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-sm sm:text-base font-black text-slate-900">
                                  Rs. {altProd.price.toLocaleString()}
                                </span>
                                {altProd.originalPrice && altProd.originalPrice > altProd.price && (
                                  <span className="text-xs text-slate-400 line-through">
                                    Rs. {altProd.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {isCheaper && savings > 0 && (
                                <span className="text-xs font-bold text-emerald-700 block">
                                  Save Rs. {savings.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <button
                              id={`alt-add-to-cart-${altProd.id}`}
                              type="button"
                              disabled={!altProd.inStock}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(altProd, 1);
                                addToast({
                                  type: 'success',
                                  title: 'Added to Cart',
                                  message: `1x ${altProd.name} added to your shopping cart.`,
                                });
                              }}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold">No direct generic alternatives found for this product.</p>
                    <p className="text-xs text-slate-400 mt-1">Please consult your doctor or our licensed pharmacist for suitable substitutes.</p>
                  </div>
                )}
              </div>

              {/* Modal Footer helper */}
              <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500 shrink-0">
                <span className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>All alternative brands are DRAP licensed & quality checked</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAlternativesModalOpen(false)}
                  className="mt-2 sm:mt-0 font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
