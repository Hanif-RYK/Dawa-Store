import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
  CheckCircle2,
  Package,
  Calendar,
  Truck,
  MapPin,
  ArrowRight,
  Printer,
  ShieldCheck,
  PhoneCall,
  Clock,
} from 'lucide-react';

interface OrderConfirmationPageProps {
  orderNumber?: string;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderNumber,
}) => {
  const { orders, navigate } = usePharmacy();

  const order = (orderNumber ? orders.find((o) => o.orderNumber === orderNumber) : null) || orders[0];
  const displayOrderNumber = order?.orderNumber || orderNumber || 'DS-89241';

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <Breadcrumbs
        items={[
          { label: 'Cart', path: '/cart' },
          { label: 'Checkout', path: '/checkout' },
          { label: `Order #${displayOrderNumber}` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 text-center relative overflow-hidden">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 uppercase tracking-wider">
            Order Successfully Placed
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Your medicines are being prepared by our licensed pharmacists and will be dispatched via express courier.
          </p>

          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Order Tracking ID
              </span>
              <p className="text-base font-extrabold text-slate-900">
                {order ? order.orderNumber : orderNumber}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Estimated Delivery
              </span>
              <p className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Today (2-4 Hours)</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="confirmation-track-btn"
              type="button"
              onClick={() => navigate(`/account?tab=orders`)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Live</span>
            </button>

            <button
              id="confirmation-continue-btn"
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Order Details
              </h3>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>

            {/* Delivery address & Payment info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Delivery Address
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-slate-600 mt-0.5">
                  {order.shippingAddress.addressLine}
                </p>
                <p className="text-slate-600">
                  {order.shippingAddress.area}, {order.shippingAddress.city}
                </p>
                <p className="text-slate-700 font-semibold mt-1">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 mb-2">
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  Payment Summary
                </span>
                <p className="font-bold text-slate-900 capitalize text-sm">
                  {order.paymentMethod === 'cod'
                    ? 'Cash on Delivery (COD)'
                    : order.paymentMethod === 'card'
                    ? 'Credit / Debit Card'
                    : order.paymentMethod === 'jazzcash'
                    ? 'JazzCash Wallet / Transfer'
                    : order.paymentMethod === 'easypaisa'
                    ? 'Easypaisa Mobile Wallet'
                    : 'Bank / Raast Transfer'}
                </p>
                <p className="text-slate-500 mt-0.5">
                  Status:{' '}
                  <span className="font-semibold text-amber-700 uppercase">
                    {order.paymentStatus || 'Confirmed'}
                  </span>
                </p>
                <p className="text-emerald-700 font-black text-base mt-2">
                  Total Paid / Due: Rs. {(order.totalAmount ?? order.total).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Items table */}
            <div>
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">
                Purchased Medicines ({order.items.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || item.product?.images?.[0]}
                        alt=""
                        className="w-10 h-10 object-contain rounded bg-slate-50 p-0.5 border"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.productName || item.product?.name}</p>
                        <p className="text-slate-400">
                          {item.brand || item.product?.brand} • {item.packSize || item.product?.packSize} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpline notice */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-medium">
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>Need help with this order? Call our pharmacist helpline</span>
              </div>
              <a
                href="tel:080074276"
                className="font-bold text-emerald-700 underline"
              >
                0800-PHARM
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
