import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Product } from '../../types';
import {
  Check,
  Eye,
  Heart,
  Minus,
  Plus,
  Scale,
  ShieldAlert,
  ShoppingBag,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

const DOSAGE_FORM_COLORS: Record<string, string> = {
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
export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
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
  const isInWishlist = wishlist.includes(product.id);
  const isInCompare = compareList.includes(product.id);
  const cartItem = cart.find((e) => e.product.id === product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const dosageFormColor = DOSAGE_FORM_COLORS[product.dosageForm] || 'bg-slate-100 text-slate-700 border-slate-200';
  return layout === 'list' ? (
    <div
      id={`product-card-${product.id}`}
      onClick={() => navigate(`/product/${product.slug}`)}
      className="bg-white rounded-xl border border-slate-200/90 hover:border-emerald-500/80 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 transition-all hover:shadow-md group cursor-pointer"
    >
      <div
        className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-100"
        title={`View details for ${product.name}`}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {discountPercent > 0 && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-rose-600 text-white text-[11px] font-bold rounded shadow-2xs pointer-events-none">
            {discountPercent}% OFF
          </span>
        )}
        {product.isRxRequired && (
          <span
            className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-indigo-600 text-white text-xs leading-none font-bold rounded flex items-center gap-0.5 shadow-2xs pointer-events-none"
            title="Doctor Prescription Required"
          >
            <ShieldAlert className="w-2.5 h-2.5" />
            {' Rx'}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{product.brand}</span>
          <span className="text-slate-300">•</span>
          <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded border ${dosageFormColor}`}>
            {product.dosageForm}
          </span>
          <span className="text-slate-400 text-xs">{product.packSize}</span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {'Formula: '}
          <span className="font-semibold text-slate-700">{product.genericName}</span>
        </p>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1 hidden md:block leading-relaxed">
          {product.description}
        </p>
      </div>
      <div className="flex flex-col items-center sm:items-end justify-between gap-2.5 sm:border-l sm:border-slate-100 sm:pl-5 shrink-0 w-full sm:w-44">
        <div className="text-center sm:text-right">
          <div className="text-sm sm:text-base font-bold text-slate-900 leading-none">
            {'Rs. '}
            {product.price.toLocaleString()}
          </div>
          {product.originalPrice && (
            <div className="text-xs text-slate-400 line-through mt-0.5">
              {'Rs. '}
              {product.originalPrice.toLocaleString()}
            </div>
          )}
          <div className="text-xs text-slate-500 mt-0.5">
            {product.inStock ? (
              <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                <Check className="w-3 h-3" />
                {' In Stock'}
              </span>
            ) : (
              <span className="text-rose-500 font-semibold">Out of Stock</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="hit-area-y p-2 min-w-[34px] min-h-[34px] flex items-center justify-center border border-slate-200 text-slate-500 hover:text-emerald-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            title="Quick view medicine"
            aria-label="Quick view medicine"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`hit-area-y p-2 min-w-[34px] min-h-[34px] flex items-center justify-center border rounded-lg transition-colors cursor-pointer ${isInWishlist ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-slate-50'}`}
            title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-rose-500' : ''}`} />
          </button>
          {cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-between border border-emerald-300 rounded-lg bg-emerald-50/50 p-0.5 min-h-[34px]"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, cartItem.quantity - 1);
                }}
                className="hit-area w-6 h-6 flex items-center justify-center text-emerald-800 hover:bg-white active:scale-90 rounded transition-all cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-emerald-900 px-1">{cartItem.quantity}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, cartItem.quantity + 1);
                }}
                className="hit-area w-6 h-6 flex items-center justify-center text-emerald-800 hover:bg-white active:scale-90 rounded transition-all cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!product.inStock}
              title={product.isRxRequired ? 'Prescription required at checkout' : undefined}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="flex-1 py-1.5 px-3 min-h-[34px] bg-emerald-700 hover:bg-emerald-800 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:pointer-events-none text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div
      id={`product-card-${product.id}`}
      onClick={() => navigate(`/product/${product.slug}`)}
      className="bg-white rounded-xl border border-slate-200/90 hover:border-emerald-500/80 p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-md group relative cursor-pointer"
    >
      {/* Photo fills the frame (product photos are mostly landscape, so "contain" left empty bands) */}
      <div className="relative w-full aspect-square sm:aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-100 group-hover:border-slate-200 transition-colors">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 flex flex-row items-center gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[11px] font-bold rounded shadow-2xs pointer-events-auto leading-none">
              {discountPercent}% OFF
            </span>
          )}
          {product.isRxRequired && (
            <span
              className="px-1.5 py-0.5 bg-indigo-600 text-white text-xs leading-none font-bold rounded inline-flex items-center gap-0.5 shadow-2xs pointer-events-auto leading-none"
              title="Doctor Prescription Required"
            >
              <ShieldAlert className="w-2.5 h-2.5" />
              {' Rx'}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1 min-h-[24px]">
            <span className={`px-1.5 py-0.5 rounded font-semibold text-[11px] border shrink-0 ${dosageFormColor}`}>
              {product.dosageForm}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompare(product.id);
                }}
                className={`hit-area w-6 h-6 min-w-[24px] min-h-[24px] flex items-center justify-center rounded-md transition-colors cursor-pointer border ${isInCompare ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-400 hover:text-sky-600 hover:border-sky-300 border-slate-200'}`}
                title={isInCompare ? 'Remove from compare' : 'Add to compare'}
                aria-label={isInCompare ? 'Remove from compare' : 'Add to compare'}
              >
                <Scale className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={`hit-area w-6 h-6 min-w-[24px] min-h-[24px] flex items-center justify-center rounded-md transition-colors cursor-pointer border ${isInWishlist ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-slate-400 hover:text-rose-600 hover:border-rose-300 border-slate-200'}`}
                title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-3 h-3 ${isInWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>
          <div className="mb-0.5">
            <span
              className="text-xs font-bold text-emerald-700 block truncate uppercase tracking-wider"
              title={product.brand}
            >
              {product.brand}
            </span>
          </div>
          <h3
            className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug min-h-[2lh]"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{product.genericName}</p>
          <p className="text-xs text-slate-400 font-medium">
            {'Pack: '}
            {product.packSize}
          </p>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm sm:text-[15px] font-bold text-slate-900 leading-none">
              {'Rs. '}
              {product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-slate-400 line-through mt-0.5">
                {'Rs. '}
                {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
          {cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border border-emerald-300 rounded-lg bg-emerald-50/50 p-0.5 min-h-[32px]"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, cartItem.quantity - 1);
                }}
                className="hit-area w-6 h-6 flex items-center justify-center text-emerald-800 hover:bg-white active:scale-90 rounded transition-all cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-emerald-900">{cartItem.quantity}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, cartItem.quantity + 1);
                }}
                className="hit-area w-6 h-6 flex items-center justify-center text-emerald-800 hover:bg-white active:scale-90 rounded transition-all cursor-pointer"
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
              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:pointer-events-none text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
              title={product.isRxRequired ? 'Add to cart (prescription required at checkout)' : 'Add to cart'}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
