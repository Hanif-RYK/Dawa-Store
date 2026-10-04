import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { EmptyState } from '../common/EmptyState';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import {
  CheckCircle2,
  Check,
  Copy,
  Package,
  Truck,
  MapPin,
  ArrowRight,
  Printer,
  PhoneCall,
  Clock,
  FileSearch,
  Home,
  Store,
} from 'lucide-react';

interface OrderConfirmationPageProps {
  orderNumber?: string;
}

const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery (COD)',
  card: 'Credit / Debit Card',
  jazzcash: 'JazzCash Wallet / Transfer',
  easypaisa: 'Easypaisa Mobile Wallet',
  bank: 'Bank / Raast Transfer',
};

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderNumber,
}) => {
  const { orders, navigate, storeSettings } = usePharmacy();
  const [copied, setCopied] = useState(false);

  // Only show the order that was asked for; never fall back to someone else's latest order
  const order = orderNumber ? orders.find((o) => o.orderNumber === orderNumber) : orders[0];

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 py-6">
        <EmptyState
          id="order-not-found"
          icon={Package}
          title="Order not found"
          description={`We couldn't find order ${orderNumber ? `#${orderNumber}` : ''} on this device. Check My Orders or contact our helpline.`}
          actionText="Go to My Orders"
          actionPath="/account?tab=orders"
          secondaryActionText="Continue Shopping"
          onSecondaryAction={() => navigate('/')}
        />
      </div>
    );
  }

  const hasRxItem = order.items.some((i) => i.isRxRequired || i.product?.isRxRequired);
  const isCod = order.paymentMethod === 'cod';
  const isPickup = order.deliveryMethod === 'pickup';
  const total = order.totalAmount ?? order.total;
  const helplineTel = storeSettings.helpline.replace(/[^0-9+]/g, '');
  const whatsappHref = storeSettings.socialLinks.whatsapp;

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context / permissions); the ID stays selectable
    }
  };

  // What the customer can expect next; the first step is always done
  const nextSteps = [
    { icon: CheckCircle2, title: 'Order placed', text: 'We have received your order' },
    hasRxItem
      ? { icon: FileSearch, title: 'Rx verification', text: 'Pharmacist checks your prescription' }
      : { icon: Package, title: 'Packing', text: 'Pharmacist packs your medicines' },
    isPickup
      ? { icon: Store, title: 'Ready for pickup', text: "We'll call or WhatsApp you" }
      : { icon: Truck, title: 'Out for delivery', text: 'Rider is on the way' },
    isPickup
      ? { icon: Home, title: 'Collected', text: isCod ? 'Pay at the counter' : 'Bring your order ID' }
      : { icon: Home, title: 'Delivered', text: isCod ? 'Pay the rider in cash' : 'Enjoy good health' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: 'My Orders', path: '/account?tab=orders' },
            { label: `Order #${order.orderNumber}` },
          ]}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* Success Banner */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-10 text-center">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
            {hasRxItem
              ? 'A licensed pharmacist will verify your prescription, then your medicines will be dispatched.'
              : 'Your medicines are being prepared by our licensed pharmacists and will be dispatched via express courier.'}
          </p>

          <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto bg-slate-50 rounded-xl border border-slate-200/80 text-left divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
            <div className="p-3 sm:p-4 min-w-0">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Order ID</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-base font-extrabold text-slate-900 break-all select-all">
                  {order.orderNumber}
                </p>
                <button
                  type="button"
                  onClick={copyOrderNumber}
                  className="hit-area shrink-0 p-1 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-white transition-colors cursor-pointer print:hidden"
                  aria-label={copied ? 'Order ID copied' : 'Copy order ID'}
                  title={copied ? 'Copied' : 'Copy order ID'}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="p-3 sm:p-4 min-w-0">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {isPickup ? 'Ready for Pickup' : 'Estimated Delivery'}
              </span>
              <p className="text-sm font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isPickup ? 'Today, 1-2 hrs' : 'Today, 2-4 hrs'}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
            <button
              id="confirmation-track-btn"
              type="button"
              onClick={() => navigate('/account?tab=orders')}
              className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order</span>
            </button>

            <button
              id="confirmation-continue-btn"
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-8 print:hidden">
          <h2 className="font-bold text-slate-900 text-base mb-4">What happens next</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
            {nextSteps.map((step, idx) => {
              const Icon = step.icon;
              const done = idx === 0;
              return (
                <li key={step.title} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                  <span
                    className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${
                      done ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${done ? 'text-emerald-800' : 'text-slate-800'}`}>{step.title}</p>
                    <p className="text-xs text-slate-500">{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Order Details Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base">Order Details</h2>
            <button
              type="button"
              onClick={() => window.print()}
              className="hit-area text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Delivery address & Payment info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 mb-2">
                {isPickup ? <Store className="w-3.5 h-3.5 text-emerald-600" /> : <MapPin className="w-3.5 h-3.5 text-emerald-600" />}
                {isPickup ? 'Store Pickup' : 'Delivery Address'}
              </span>
              <p className="font-bold text-slate-900 text-sm">{order.shippingAddress.fullName}</p>
              {isPickup ? (
                <>
                  <p className="text-slate-600 mt-0.5">Collect from {order.shippingAddress.area}</p>
                  <p className="text-slate-600">{order.shippingAddress.addressLine}</p>
                  <p className="text-slate-600">{storeSettings.operatingHours}</p>
                </>
              ) : (
                <>
                  <p className="text-slate-600 mt-0.5">{order.shippingAddress.addressLine}</p>
                  <p className="text-slate-600">
                    {order.shippingAddress.area}, {order.shippingAddress.city}
                  </p>
                </>
              )}
              <p className="text-slate-700 font-semibold mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 mb-2">
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                Payment
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {isPickup && isCod ? 'Pay at Counter (Cash)' : PAYMENT_LABELS[order.paymentMethod] || PAYMENT_LABELS.bank}
              </p>
              <p className="text-slate-500 mt-0.5">
                {isCod ? (
                  isPickup ? 'Pay in cash at the pharmacy counter' : 'Pay the rider when your order arrives'
                ) : (
                  <>
                    Status:{' '}
                    <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {order.paymentStatus === 'Paid' ? 'Paid' : 'Awaiting confirmation'}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">
              Medicines ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={item.productId || idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image || item.product?.images?.[0]}
                      alt=""
                      className="w-12 h-12 shrink-0 object-cover rounded-lg bg-slate-100 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 line-clamp-2">{item.productName || item.product?.name}</p>
                      <p className="text-slate-500">
                        {item.packSize || item.product?.packSize} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 whitespace-nowrap shrink-0">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <dl className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-slate-900">Rs. {order.subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{isPickup ? 'Store pickup' : 'Delivery'}</dt>
                <dd className="font-semibold text-slate-900">
                  {order.deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `Rs. ${order.deliveryFee.toLocaleString()}`}
                </dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <dt>Discount{order.promoCode ? ` (${order.promoCode})` : ''}</dt>
                  <dd>- Rs. {order.discount.toLocaleString()}</dd>
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
                <dt>{isCod ? (isPickup ? 'Amount due at pickup' : 'Amount due on delivery') : 'Total'}</dt>
                <dd className="text-emerald-700 text-lg">Rs. {total.toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          {/* Help */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 print:hidden">
            <div className="flex items-center gap-2 font-medium">
              <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Need help with this order? Our pharmacists are here.</span>
            </div>
            <div className="grid grid-cols-2 sm:flex gap-2 shrink-0">
              <a
                href={`tel:${helplineTel}`}
                className="min-h-[40px] px-3 py-2 bg-white hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{storeSettings.helpline}</span>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="min-h-[40px] px-3 py-2 bg-[#168049] hover:bg-[#126b3d] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
