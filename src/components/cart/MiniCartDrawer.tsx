import React, { useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Truck,
} from 'lucide-react';

export const MiniCartDrawer: React.FC = () => {
  const {
    cart,
    isMiniCartOpen,
    setIsMiniCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    navigate,
    storeSettings,
  } = usePharmacy();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMiniCartOpen) {
        setIsMiniCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMiniCartOpen, setIsMiniCartOpen]);

  if (!isMiniCartOpen) return null;

  const hasRxItem = cart.some((item) => item.product.isRxRequired);
  const freeDeliveryThreshold = storeSettings?.freeDeliveryThreshold ?? 2000;
  const progressToFreeDelivery = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  const handleViewCart = () => {
    setIsMiniCartOpen(false);
    navigate('/cart');
  };

  const handleCheckout = () => {
    setIsMiniCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      id="mini-cart-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsMiniCartOpen(false);
      }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end modal-backdrop-animate"
    >
      <div
        id="mini-cart-drawer"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden drawer-content-animate"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">
              My Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            id="mini-cart-close-btn"
            type="button"
            onClick={() => setIsMiniCartOpen(false)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 active:scale-95 rounded-full transition-all cursor-pointer"
            aria-label="Close cart drawer"
            title="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        {cart.length > 0 && (
          <div className="px-4 py-2.5 bg-emerald-50/70 border-b border-emerald-100 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1 font-semibold text-emerald-900">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                {cartSubtotal >= freeDeliveryThreshold ? (
                  <span className="text-emerald-700 font-bold">You unlocked FREE Express Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-emerald-800">Rs. {freeDeliveryThreshold - cartSubtotal}</strong> more for Free Delivery
                  </span>
                )}
              </span>
              <span className="font-bold text-emerald-700">{Math.round(progressToFreeDelivery)}%</span>
            </div>
            <div className="w-full bg-emerald-200/70 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeDelivery}%` }}
              />
            </div>
          </div>
        )}

        {/* Prescription Required Alert Banner */}
        {hasRxItem && (
          <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-200 flex items-center gap-2 text-xs text-indigo-800">
            <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Cart contains prescription items. Doctor Rx upload requested at checkout.</span>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-700">Your cart is empty</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Explore medicines, vitamins, and healthcare essentials.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsMiniCartOpen(false);
                  navigate('/category/otc-medicines');
                }}
                className="px-5 py-3 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-3 flex gap-3 group items-center">
                <div className="w-[72px] h-[72px] sm:w-[76px] sm:h-[76px] bg-slate-50 border border-slate-200/90 rounded-xl p-1.5 shrink-0 flex items-center justify-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain object-center"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0 pr-1">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                        {item.product.brand}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {item.product.packSize}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-2.5 min-w-[44px] min-h-[44px] -mr-1.5 -mt-1.5 flex items-center justify-center cursor-pointer rounded-xl hover:bg-rose-50 active:scale-95 transition-all shrink-0"
                      title="Remove item"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 min-h-[36px]">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-90 transition-transform cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-90 transition-transform cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/90 space-y-4">
            <div className="space-y-2.5 py-1 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  Rs. {cartSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Express Delivery</span>
                <span className="font-semibold text-slate-900">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `Rs. ${cartDeliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-2.5 border-t border-slate-200">
                <span>Estimated Total</span>
                <span className="text-emerald-700 text-base">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                id="mini-cart-view-cart-btn"
                type="button"
                onClick={handleViewCart}
                className="w-full py-3 min-h-[44px] bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer text-center flex items-center justify-center shadow-2xs"
              >
                View Full Cart
              </button>

              <button
                id="mini-cart-checkout-btn"
                type="button"
                onClick={handleCheckout}
                className="w-full py-3 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
