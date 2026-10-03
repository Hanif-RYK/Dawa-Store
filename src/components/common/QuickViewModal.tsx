import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { X, Plus, Minus, ShoppingBag, ShieldAlert, Heart, ArrowRight, Check } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
  } = usePharmacy();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setQuantity(1);
    setActiveImageIndex(0);
  }, [quickViewProduct]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && quickViewProduct) {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
  };

  const handleViewFullDetails = () => {
    setQuickViewProduct(null);
    navigate(`/product/${product.slug}`);
  };

  return (
    <div
      id="quick-view-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setQuickViewProduct(null);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop-animate"
    >
      <div
        id="quick-view-content"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row max-h-[92vh] modal-content-animate"
      >
        {/* Close Button */}
        <button
          id="quick-view-close-btn"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-2.5 right-2.5 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 active:scale-95 rounded-full transition-all z-20 cursor-pointer"
          aria-label="Close quick view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-slate-50 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-200/80">
          <div className="relative w-full aspect-square max-h-52 sm:max-h-64 rounded-xl overflow-hidden bg-white border border-slate-200/60 shadow-xs flex items-center justify-center p-3 sm:p-4">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
              }}
            />
            {product.discountPercent ? (
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-xs font-bold bg-rose-600 text-white rounded-md shadow-xs">
                {product.discountPercent}% OFF
              </span>
            ) : null}
            {product.isRxRequired && (
              <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Rx Required
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 sm:mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-lg border-2 overflow-hidden bg-white p-1 transition-all cursor-pointer ${
                    activeImageIndex === i ? 'border-emerald-600 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-emerald-700 uppercase tracking-wider">{product.brand}</span>
              <span className="text-slate-400">{product.dosageForm}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {product.name}
            </h3>

            <p className="text-xs text-slate-600 mt-1">
              <strong className="text-slate-800">Generic:</strong> {product.genericName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              <strong className="text-slate-700">Pack:</strong> {product.packSize}
            </p>

            <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-slate-100">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs sm:text-sm text-slate-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  product.inStock
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Check className="w-3 h-3" />
                {product.inStock ? `In Stock (${product.stockCount} units)` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 space-y-3">
            {product.inStock && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 min-h-[38px]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                id="quick-view-add-cart-btn"
                type="button"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className="flex-1 py-3 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleViewFullDetails}
              className="w-full text-center text-xs font-semibold text-emerald-700 hover:text-emerald-900 py-2 min-h-[40px] flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Full Details, Side Effects & Composition</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
