import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Address, Order } from '../../types';
import { PAKISTANI_CITIES, CITY_AREAS } from '../../data/mockData';
import { formatOrderDate } from '../../utils/formatDate';
import {
  User,
  Package,
  FileText,
  MapPin,
  Heart,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  ShoppingBag,
  Upload,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  LogOut,
  X,
  Phone,
} from 'lucide-react';

export const UserAccountPage: React.FC = () => {
  const {
    user,
    orders,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    logout,
    navigate,
    addToast,
    updateProfile,
    setIsAuthModalOpen,
  } = usePharmacy();

  // Tab: 'profile' | 'orders' | 'prescriptions' | 'addresses' | 'wishlist'
  const [activeTab, setActiveTab] = useState<
    'profile' | 'orders' | 'prescriptions' | 'addresses' | 'wishlist'
  >('orders');

  // Synchronize tab from URL query param, e.g. /account?tab=wishlist
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (
        tabParam &&
        ['profile', 'orders', 'prescriptions', 'addresses', 'wishlist'].includes(tabParam)
      ) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Address Modal State
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newFullName, setNewFullName] = useState(user?.name || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '+92 ');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('Karachi');
  const [newArea, setNewArea] = useState('Clifton');
  const [newLandmark, setNewLandmark] = useState('');

  // Selected order details popup
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-slate-50 py-12 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6 text-center max-w-sm">
          Access your orders, digital prescriptions, refill reminders, and saved addresses.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Sign In / Register
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast({
        type: 'error',
        title: 'Name Required',
        message: 'Please provide your full legal name.',
      });
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please provide a valid email address for order invoices.',
      });
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      addToast({
        type: 'error',
        title: 'Valid Phone Required',
        message: 'Please provide a valid Pakistani phone number (e.g. +92 300 1234567).',
      });
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newAddressLine) {
      addToast({
        type: 'error',
        title: 'Incomplete Address',
        message: 'Please provide full name, phone number, and street address.',
      });
      return;
    }

    addAddress({
      fullName: newFullName,
      phone: newPhone,
      email: user.email,
      addressLine: newAddressLine,
      city: newCity,
      area: newArea,
      landmark: newLandmark,
      isDefault: user.addresses.length === 0,
    });

    setIsAddAddressOpen(false);
    setNewAddressLine('');
    setNewLandmark('');
    addToast({
      type: 'success',
      title: 'Address Added',
      message: 'New delivery address has been saved.',
    });
  };

  const handleReorder = (order: Order) => {
    let addedCount = 0;
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity, false);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      addToast({
        type: 'success',
        title: 'Items Added to Cart',
        message: `Medicines from Order #${order.orderNumber} added to cart.`,
      });
      navigate('/cart');
    } else {
      addToast({
        type: 'info',
        title: 'Prescription Upload Order',
        message: `This was a prescription order. Please re-upload your prescription slip.`,
      });
      navigate('/upload-prescription');
    }
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // Prescriptions mock data associated with user
  const userPrescriptions = [
    {
      id: 'rx-01',
      date: '04 Mar 2026',
      doctorName: 'Dr. Zulfiqar Ahmed (FCPS Cardiology)',
      hospital: 'Aga Khan University Hospital',
      status: 'Approved',
      notes: 'Dosage verified for 30-day refill. Dispensed as prescribed.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'rx-02',
      date: '21 Jan 2026',
      doctorName: 'Dr. Fatima Tariq (General Physician)',
      hospital: 'South City Hospital Karachi',
      status: 'Approved',
      notes: 'Antibiotics course audited & validated.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div id="user-account-container" className="min-h-screen bg-slate-50 py-6">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs text-center">
              <div className="w-18 h-18 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-md">
                {user.name.charAt(0)}
              </div>
              <h2 className="font-black text-lg text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500">{user.email}</p>
              <p className="text-xs font-semibold text-emerald-700 mt-1">{user.phone}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-around text-center text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 text-base">
                    {orders.length}
                  </span>
                  <span className="block text-slate-400 text-xs">Orders</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div>
                  <span className="font-extrabold text-slate-900 text-base">
                    {wishlist.length}
                  </span>
                  <span className="block text-slate-400 text-xs">Wishlist</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div>
                  <span className="font-extrabold text-slate-900 text-base">
                    {user.addresses.length}
                  </span>
                  <span className="block text-slate-400 text-xs">Addresses</span>
                </div>
              </div>
            </div>

            {/* Account Navigation Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-2 space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Order History</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-xs bg-black/10">
                  {orders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('prescriptions')}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'prescriptions'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Doctor Prescriptions</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-xs bg-black/10">
                  {userPrescriptions.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>Saved Addresses</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-xs bg-black/10">
                  {user.addresses.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wishlist')}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist / Saved Medicines</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-xs bg-black/10">
                  {wishlist.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Personal Profile</span>
                </div>
              </button>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full text-left p-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Panels */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
            {/* 1. ORDER HISTORY TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Order History ({orders.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Track delivery progress, inspect items, and reorder medications.
                    </p>
                  </div>
                </div>

                {/* Order status filter tabs with auto-adjusting width and horizontal scroll affordance */}
                <div className="relative pt-1 pb-1">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 thin-scrollbar scroll-smooth">
                    {['All', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => {
                      const count =
                        st === 'All'
                          ? orders.length
                          : orders.filter((o) => o.status === st).length;
                      const isActive = orderStatusFilter === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOrderStatusFilter(st)}
                          className={`shrink-0 w-auto min-w-max flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-400/30'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="whitespace-nowrap font-bold">{st}</span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap ${
                              isActive
                                ? 'bg-emerald-800 text-emerald-100'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No orders yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Start browsing medicines to place your first delivery!
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/products')}
                      className="mt-4 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Browse Medicines</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders
                      .filter((ord) => orderStatusFilter === 'All' || ord.status === orderStatusFilter)
                      .map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-500/80 transition-all bg-slate-50/40 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                          <div>
                            <span className="font-extrabold text-slate-900 text-sm">
                              Order #{ord.orderNumber}
                            </span>
                            <span className="text-slate-400 block sm:inline sm:ml-2">
                              Placed on {formatOrderDate(ord.date, ord.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Status badge */}
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'Shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'Confirmed'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {ord.status}
                            </span>

                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex -space-x-2 overflow-hidden">
                            {ord.items.map((item, i) => (
                              <img
                                key={item.product?.id || i}
                                src={item.image || item.product?.images?.[0]}
                                alt={item.productName || item.product?.name || 'Medicine'}
                                className="w-10 h-10 object-contain rounded-lg border-2 border-white bg-slate-100 p-0.5"
                                title={item.productName || item.product?.name}
                              />
                            ))}
                          </div>

                          <div className="text-right">
                            <div className="text-xs text-slate-400">Total Amount:</div>
                            <div className="text-base font-black text-emerald-700">
                              Rs. {(ord.totalAmount ?? ord.total).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="pt-2 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">
                            {ord.items.length} items • Delivery to {ord.shippingAddress.city}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleReorder(ord)}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Order Again</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. PRESCRIPTIONS TAB */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Doctor Prescriptions
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Prescription slips audited by licensed DawaStore pharmacists.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/upload-prescription')}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Rx</span>
                  </button>
                </div>

                {userPrescriptions.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No prescriptions uploaded yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload your doctor's slip to get medicines verified and delivered to your doorstep.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/upload-prescription')}
                      className="mt-4 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Rx</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userPrescriptions.map((rx) => (
                      <div
                        key={rx.id}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">
                            Uploaded: {rx.date}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            {rx.status}
                          </span>
                        </div>

                        <div className="h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={rx.image}
                            alt="Doctor prescription"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="text-xs space-y-0.5">
                          <p className="font-bold text-slate-900">{rx.doctorName}</p>
                          <p className="text-slate-500">{rx.hospital}</p>
                        </div>

                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/70 text-xs text-emerald-950">
                          <strong className="font-bold block mb-0.5">Pharmacist Audit:</strong>
                          <span>{rx.notes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Saved Delivery Addresses
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manage home, office, and patient addresses for express medicine drops.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddAddressOpen(true)}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {user.addresses.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <MapPin className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No saved addresses yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Add your home or workplace address for faster, seamless checkout.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddAddressOpen(true)}
                      className="mt-4 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 rounded-2xl border-2 transition-all space-y-2.5 ${
                          addr.isDefault
                            ? 'border-emerald-600 bg-emerald-50/30'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900">
                            {addr.fullName}
                          </span>
                          {addr.isDefault ? (
                            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                              Default Address
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {addr.addressLine}, {addr.area}, {addr.city}
                        </p>

                        <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{addr.phone}</span>
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => deleteAddress(addr.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      My Wishlist ({wishlistedProducts.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your saved medicines and medical devices.
                    </p>
                  </div>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <Heart className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">Your wishlist is empty</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click the heart icon on any medicine card to save it for later.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/products')}
                      className="mt-4 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Explore Medicines</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-white flex items-center gap-3 justify-between"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-16 h-16 object-contain bg-slate-50 rounded-xl p-1 border"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-emerald-700 uppercase">
                            {p.brand}
                          </span>
                          <h4
                            onClick={() => navigate(`/product/${p.slug}`)}
                            className="text-xs font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer"
                          >
                            {p.name}
                          </h4>
                          <p className="text-xs font-black text-emerald-700 mt-0.5">
                            Rs. {p.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(p, 1);
                              toggleWishlist(p.id);
                            }}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Move to Cart</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(p.id)}
                            className="text-xs font-semibold text-rose-600 hover:underline text-center cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-black text-slate-900">
                    Personal Profile
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your contact details for prescription delivery dispatch.
                  </p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address (Order Confirmations & Invoices)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mobile Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div
          id="add-address-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddAddressOpen(false);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Add New Delivery Location
              </h3>
              <button
                onClick={() => setIsAddAddressOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Phone Number (For Rider) *
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <select
                    value={newCity}
                    onChange={(e) => {
                      setNewCity(e.target.value);
                      const areas = CITY_AREAS[e.target.value] || [];
                      setNewArea(areas[0] || '');
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {PAKISTANI_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Area / Sector *
                  </label>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {(CITY_AREAS[newCity] || ['Main Town', 'Saddar', 'Cantt']).map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Street Address (House/Building/Road) *
                </label>
                <input
                  type="text"
                  required
                  value={newAddressLine}
                  onChange={(e) => setNewAddressLine(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          id="order-details-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Order Details #{selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-slate-400">Placed on {formatOrderDate(selectedOrder.date, selectedOrder.createdAt)}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-500 uppercase">Delivery Address</span>
                <p className="font-bold text-slate-900 mt-1">
                  {selectedOrder.shippingAddress.fullName}
                </p>
                <p className="text-slate-600">
                  {selectedOrder.shippingAddress.addressLine}, {selectedOrder.shippingAddress.area}, {selectedOrder.shippingAddress.city}
                </p>
                <p className="text-slate-600">Phone: {selectedOrder.shippingAddress.phone}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase block mb-2">
                  Items ({selectedOrder.items.length})
                </span>
                <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{item.productName || item.product?.name}</p>
                        <p className="text-slate-400">
                          {item.packSize || item.product?.packSize} • Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-slate-800">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-sm font-black text-slate-900">
                <span>Total Amount Paid</span>
                <span className="text-emerald-700 text-base">
                  Rs. {(selectedOrder.totalAmount ?? selectedOrder.total).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
