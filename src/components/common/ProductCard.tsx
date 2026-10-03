import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Product } from '../../types';
import {
  Heart,
  Eye,
  Scale,
  ShoppingBag,
  ShieldAlert,
  Check,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

const DOSAGE_COLORS: Record<string, string> = {
  Tablet: 'bg-blue-50 text-blue-700 border-blue-200',
  Capsule: 'bg-purple-50 text-purple-700 border-purple-200',
  Syrup: 'bg-amber-50 text-amber-800 border-amber-200',
  Injection: 'bg-rose-50 text-rose-700 border-rose-200',
  Cream: 'bg-teal-50 text-teal-700 border-teal-200',
  Drops: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Inhaler: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Device: 'bg-slate-100 text-slate-700 border-slate-300',
  Sachet: 'bg-orange-50 text-orange-700 border-orange-200',
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
}) => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    setQuickViewProduct,
    navigate,
  } = usePharmacy();

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const cartItem = cart.find((i) => i.product.id === product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const dosageBadgeColor =
    DOSAGE_COLORS[product.dosageForm] || 'bg-slate-100 text-slate-700 border-slate-200';

  if (layout === 'list') {
    return (
      <div
        id={`product-card-${product.id}`}
        onClick={() => navigate(`/product/${product.slug}`)}
        className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 transition-all hover:shadow-md group cursor-pointer"
      >
        {/* Left image */}
        <div
          className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 bg-white rounded-xl overflow-hidden border border-slate-100/90"
          title={`View details for ${product.name}`}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
            }}
          />

          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-xs font-bold rounded-md shadow-xs pointer-events-none">
              {discountPercent}% OFF
            </span>
          )}

          {product.isRxRequired && (
            <span
              className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-indigo-600 text-white text-[11px] leading-none font-bold rounded-md flex items-center gap-0.5 shadow-xs pointer-events-none"
              title="Doctor Prescription Required"
            >
              <ShieldAlert className="w-2.5 h-2.5" /> Rx
            </span>
          )}
        </div>

        {/* Middle Details */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
            <span className="text-xs font-bold text-emerald-700 tracking-wide">
              {product.brand}
            </span>
            <span className="text-slate-300">•</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${dosageBadgeColor}`}>
              {product.dosageForm}
            </span>
            <span className="text-slate-400 text-xs">{product.packSize}</span>
          </div>

          <h3
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Formula: <span className="font-semibold text-slate-700">{product.genericName}</span>
          </p>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 hidden md:block leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Right Price & Actions */}
        <div className="flex flex-col items-center sm:items-end justify-between gap-3 sm:border-l sm:border-slate-100 sm:pl-6 shrink-0 w-full sm:w-44">
          <div className="text-center sm:text-right">
            <div className="text-base font-extrabold text-emerald-700">
              Rs. {product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-slate-400 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </div>
            )}
            <div className="text-xs text-slate-500 mt-0.5">
              {product.inStock ? (
                <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> In Stock
                </span>
              ) : (
                <span className="text-rose-500 font-semibold">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full">
            {/* Quick View Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="p-2.5 sm:p-2 min-w-[40px] min-h-[40px] flex items-center justify-center border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer"
              title="Quick view medicine"
              aria-label="Quick view medicine"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`p-2.5 sm:p-2 min-w-[40px] min-h-[40px] flex items-center justify-center border rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
                isWishlisted
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-slate-50'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Cart Button or Stepper */}
            {cartItem ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-between border border-emerald-300 rounded-xl bg-emerald-50/50 p-1 min-h-[40px]"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCartQuantity(product.id, cartItem.quantity - 1);
                  }}
                  className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-emerald-800 hover:bg-white active:scale-90 rounded-lg transition-all cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-emerald-900 px-1">
                  {cartItem.quantity}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCartQuantity(product.id, cartItem.quantity + 1);
                  }}
                  className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-emerald-800 hover:bg-white active:scale-90 rounded-lg transition-all cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={!product.inStock}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="flex-1 py-2.5 sm:py-2 min-h-[40px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] disabled:bg-slate-300 disabled:pointer-events-none text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (Default)
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => navigate(`/product/${product.slug}`)}
      className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/80 p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-lg group relative cursor-pointer"
    >
      {/* Product Image Stage */}
      <div
        className="relative w-full h-44 sm:h-48 bg-white rounded-xl overflow-hidden border border-slate-100/90 group-hover:border-emerald-200 transition-colors"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Badges overlaid on the image itself (Discount & Rx side-by-side horizontally) */}
        <div className="absolute top-2.5 left-2.5 flex flex-row items-center gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-xs font-bold rounded-md shadow-xs pointer-events-auto leading-none">
              {discountPercent}% OFF
            </span>
          )}
          {product.isRxRequired && (
            <span
              className="px-1.5 py-0.5 bg-indigo-600 text-white text-[11px] font-bold rounded-md inline-flex items-center gap-1 shadow-xs pointer-events-auto leading-none"
              title="Doctor Prescription Required"
            >
              <ShieldAlert className="w-2.5 h-2.5" /> Rx
            </span>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Row 1: Form badge on Left + Compare & Wishlist icons on Right */}
          <div className="flex items-center justify-between gap-1 mb-1.5 min-h-[28px]">
            <span className={`px-2 py-0.5 rounded-md font-semibold text-xs border shrink-0 ${dosageBadgeColor}`}>
              {product.dosageForm}
            </span>

            {/* Action icons (Wishlist & Compare) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompare(product.id);
                }}
                className={`w-7 h-7 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full transition-all duration-150 active:scale-95 cursor-pointer border ${
                  isCompared
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-100 text-slate-500 hover:text-sky-600 hover:bg-slate-200/80 border-slate-200/80 shadow-2xs'
                }`}
                title={isCompared ? 'Remove from compare' : 'Add to compare'}
                aria-label={isCompared ? 'Remove from compare' : 'Add to compare'}
              >
                <Scale className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={`w-7 h-7 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full transition-all duration-150 active:scale-95 cursor-pointer border ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs'
                    : 'bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-slate-200/80 border-slate-200/80 shadow-2xs'
                }`}
                title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Row 2: Brand Name on its own line above Product Title (Full space, never cramped) */}
          <div className="mb-1">
            <span
              className="text-xs font-bold text-emerald-700 block truncate"
              title={product.brand}
            >
              {product.brand}
            </span>
          </div>

          {/* Row 3: Product Title */}
          <h3
            className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug min-h-[2lh]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Generic formula */}
          <p className="text-xs text-slate-500 mt-1 truncate">
            {product.genericName}
          </p>

          {/* Pack size */}
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Pack: {product.packSize}
          </p>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-extrabold text-emerald-700">
              Rs. {product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-slate-400 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          {/* Cart action */}
          {cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border border-emerald-300 rounded-xl bg-emerald-50/50 p-1 min-h-[38px]"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, cartItem.quantity - 1);
                }}
                className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center text-emerald-800 hover:bg-white active:scale-90 rounded-lg transition-all cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-emerald-900">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, cartItem.quantity + 1);
                }}
                className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center text-emerald-800 hover:bg-white active:scale-90 rounded-lg transition-all cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!product.inStock}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="p-2 sm:px-3 sm:py-2 min-w-[38px] min-h-[38px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] disabled:bg-slate-300 disabled:pointer-events-none text-white font-bold text-xs rounded-xl transition-all shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
              title="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
