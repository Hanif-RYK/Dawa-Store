import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { EmptyState } from '../common/EmptyState';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Truck,
  Tag,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  X,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    appliedPromo,
    applyPromo,
    removePromo,
    navigate,
    goBack,
    storeSettings,
  } = usePharmacy();

  const [promoInput, setPromoInput] = useState('');
  const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromo(promoInput);
    setPromoInput('');
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id);
      setItemToRemove(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 py-8">
        <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <EmptyState
            id="empty-cart-state"
            icon={ShoppingBag}
            title="Your Shopping Cart is Empty"
            description="Looks like you haven't added any medicines, multivitamins, or medical essentials to your cart yet."
            actionText="Start Shopping"
            actionPath="/category/otc-medicines"
            secondaryActionText="Go Back"
            onSecondaryAction={goBack}
          />
        </div>
      </div>
    );
  }

  const hasRxItem = cart.some((i) => i.product.isRxRequired);
  const freeDeliveryThreshold = storeSettings?.freeDeliveryThreshold ?? 2000;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-28 lg:pb-6">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review your medicines and verify quantities before proceeding to checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-4 py-2.5 min-h-[44px] rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {hasRxItem && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-amber-900 text-xs sm:text-sm shadow-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Prescription Notice:</strong> One or more items in your cart require a valid prescription. You can upload your doctor’s prescription in Step 2 of checkout or have our licensed pharmacist call you.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
              <span className="block text-sm font-bold text-slate-800">
                Cart Items ({cart.reduce((s, i) => s + i.quantity, 0)})
              </span>
              {/* Show how close the order is to free delivery, like the mini cart */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center justify-between gap-3 text-xs mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-900">
                    <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                    {amountToFreeDelivery === 0 ? (
                      <span className="font-bold text-emerald-800">You unlocked FREE Express Delivery!</span>
                    ) : (
                      <span>
                        Add <strong className="text-emerald-800">Rs. {amountToFreeDelivery.toLocaleString()}</strong> more for FREE delivery
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-emerald-700 shrink-0">{Math.round(freeDeliveryProgress)}%</span>
                </div>
                <div
                  className="w-full h-1.5 bg-emerald-200/70 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label="Progress to free delivery"
                  aria-valuenow={Math.round(freeDeliveryProgress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${freeDeliveryProgress}%` }} />
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover bg-slate-100 border border-slate-200 rounded-xl shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                          {item.product.brand}
                        </span>
                        {item.product.isRxRequired && (
                          <span className="text-xs font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                            Rx Required
                          </span>
                        )}
                      </div>
                      <h3
                        onClick={() => navigate(`/product/${item.product.slug}`)}
                        className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.product.packSize} • {item.product.dosageForm}
                      </p>
                      <p className="text-xs font-semibold text-emerald-700 mt-1 sm:hidden">
                        Rs. {item.product.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden min-h-[38px]">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 active:scale-90 transition-all cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 active:scale-90 transition-all cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price & Delete */}
                    <div className="text-right shrink-0">
                      <div className="text-sm sm:text-base font-extrabold text-slate-900">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 hidden sm:block">
                        Rs. {item.product.price.toLocaleString()} / pack
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setItemToRemove({ id: item.product.id, name: item.product.name })}
                      className="p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-90 rounded-lg transition-all cursor-pointer"
                      title="Remove product"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Promo Code */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Express Delivery (2-4 Hrs)</span>
                  <span className="font-semibold text-slate-900">
                    {cartDeliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `Rs. ${cartDeliveryFee}`
                    )}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1 font-semibold text-xs">
                      <Tag className="w-3.5 h-3.5" />
                      Promo ({appliedPromo})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">
                        - Rs. {cartDiscount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={removePromo}
                        className="text-emerald-800 hover:text-rose-600 text-xs font-bold underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-base font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-xl text-emerald-700">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="mt-5 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try HEALTH10 or FIRSTAID"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2.5 min-h-[44px] text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 uppercase transition-all"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 min-h-[44px] bg-slate-800 hover:bg-slate-900 active:scale-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  >
                    Apply
                  </button>
                </div>
              </form>

              {/* Proceed to Checkout Button */}
              <button
                id="cart-proceed-checkout-btn"
                type="button"
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full py-4 min-h-[48px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine Medicines Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: total and checkout stay in reach while scrolling the item list */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(15,23,43,0.06)] px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="block text-xs text-slate-500">Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span className="block text-lg font-extrabold text-slate-900 leading-tight">Rs. {cartTotal.toLocaleString()}</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="shrink-0 px-5 py-3 min-h-[48px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Item Remove Confirmation Modal */}
      {itemToRemove && (
        <div
          id="remove-item-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setItemToRemove(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-animate"
        >
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 modal-content-animate">
            <button
              onClick={() => setItemToRemove(null)}
              className="absolute top-3 right-3 p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-transform cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="text-base font-bold text-slate-900">
              Remove Medicine?
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to remove <strong className="text-slate-800">{itemToRemove.name}</strong> from your shopping cart?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setItemToRemove(null)}
                className="w-full py-3 min-h-[44px] bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                id="confirm-remove-btn"
                type="button"
                onClick={confirmRemoveItem}
                className="w-full py-3 min-h-[44px] bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
