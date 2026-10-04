import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Product, Order, OrderStatus, DosageForm } from '../../types';
import {
  DollarSign,
  Package,
  FileCheck,
  FileText,
  AlertTriangle,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  RotateCw,
  ZoomIn,
  Truck,
  Filter,
  Layers,
  ArrowUpRight,
  TrendingUp,
  X,
  Home,
  ArrowLeft,
  CreditCard,
  Building2,
  ArrowLeftRight,
} from 'lucide-react';
import { AdminRevenueChart } from './AdminRevenueChart';
import { AdminPaymentSettings } from './AdminPaymentSettings';
import { AdminStoreSettings } from './AdminStoreSettings';
import { formatOrderDate } from '../../utils/formatDate';


// Sales trends data for chart
const REVENUE_DATA = [
  { day: 'Mon', revenue: 48500, orders: 24 },
  { day: 'Tue', revenue: 62000, orders: 31 },
  { day: 'Wed', revenue: 54200, orders: 28 },
  { day: 'Thu', revenue: 78900, orders: 42 },
  { day: 'Fri', revenue: 95400, orders: 53 },
  { day: 'Sat', revenue: 112000, orders: 67 },
  { day: 'Sun', revenue: 84300, orders: 48 },
];

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    categories,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    addToast,
    navigate,
    currentPath,
  } = usePharmacy();

  // Parse query parameters helper for initial tab & filters
  const parseQueryParams = () => {
    try {
      const searchStr = currentPath.includes('?')
        ? '?' + currentPath.split('?')[1]
        : (typeof window !== 'undefined' ? window.location.search : '');
      return new URLSearchParams(searchStr);
    } catch {
      return new URLSearchParams();
    }
  };

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'prescriptions' | 'payments' | 'settings'
  >(() => {
    const urlParams = parseQueryParams();
    const tabParam = urlParams.get('tab');
    if (
      tabParam === 'products' ||
      tabParam === 'orders' ||
      tabParam === 'prescriptions' ||
      tabParam === 'payments' ||
      tabParam === 'settings'
    ) {
      return tabParam;
    }
    return 'overview';
  });

  // Product Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(() => {
    const urlParams = parseQueryParams();
    return urlParams.get('filter') === 'lowStock';
  });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Sync tab & filter from URL query parameters (e.g. from hamburger menu or external links)
  useEffect(() => {
    try {
      const urlParams = parseQueryParams();
      const tabParam = urlParams.get('tab');
      const filterParam = urlParams.get('filter');

      if (tabParam === 'products') {
        setActiveTab('products');
      } else if (tabParam === 'orders') {
        setActiveTab('orders');
      } else if (tabParam === 'prescriptions') {
        setActiveTab('prescriptions');
      } else if (tabParam === 'payments') {
        setActiveTab('payments');
      } else if (tabParam === 'settings') {
        setActiveTab('settings');
      } else if (currentPath === '/admin' || currentPath === '/admin/') {
        setActiveTab('overview');
      }

      if (filterParam === 'lowStock') {
        setShowLowStockOnly(true);
      } else {
        setShowLowStockOnly(false);
      }
    } catch (err) {
      console.error('Failed to parse URL query params in AdminDashboard:', err);
    }
  }, [currentPath]);

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<Order | null>(null);

  // Prescription Queue State
  const [prescriptionQueue, setPrescriptionQueue] = useState([
    {
      id: 'rx-q-101',
      patientName: 'Kashif Mehmood',
      patientPhone: '+92 321 4455667',
      orderNumber: 'DS-2026-904',
      date: 'Today, 11:20 AM',
      doctorName: 'Dr. Shahzad Latif (Pulmonologist)',
      hospital: 'Liaquat National Hospital',
      status: 'Pending Verification',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1000&auto=format&fit=crop&q=80',
      medicines: ['Augmentin 625mg', 'Panadol Extra'],
    },
    {
      id: 'rx-q-102',
      patientName: 'Zainab Bibi',
      patientPhone: '+92 300 8899112',
      orderNumber: 'DS-2026-905',
      date: 'Today, 09:45 AM',
      doctorName: 'Dr. Noman Ali (Cardiology)',
      hospital: 'NICVD Karachi',
      status: 'Pending Verification',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1000&auto=format&fit=crop&q=80',
      medicines: ['Lipiget 20mg'],
    },
  ]);

  const [selectedRx, setSelectedRx] = useState<any>(null);
  const [rxRejectReason, setRxRejectReason] = useState('Illegible / Blurry handwriting');
  const [pharmacistNote, setPharmacistNote] = useState('');

  // Calculations for Stats (respecting per-product lowStockThreshold with default 15)
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount ?? o.total ?? 0), 185400);
  const lowStockCount = products.filter(
    (p) => p.stockCount <= (p.lowStockThreshold ?? 15)
  ).length;
  const pendingRxCount = prescriptionQueue.filter((r) => r.status === 'Pending Verification').length;

  // Filtered Products (combines search, category, and low stock threshold filter)
  const adminFilteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.genericName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory =
      !productCategoryFilter || p.categoryId === productCategoryFilter;
    const threshold = p.lowStockThreshold ?? 15;
    const matchLowStock = !showLowStockOnly || p.stockCount <= threshold;
    return matchSearch && matchCategory && matchLowStock;
  });

  // Filtered Orders
  const adminFilteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'All') return true;
    return o.status === orderStatusFilter;
  });

  // Handle Add or Edit Product Submission
  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const nameStr = String(formData.get('name') || '').trim();
    const cleanSlug = nameStr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `item-${Date.now()}`;
    const catId = String(formData.get('categoryId') || categories[0]?.id || 'otc-medicines');
    const matchedCategory = categories.find((c) => c.id === catId);
    const subcatId = formData.get('subcategoryId')
      ? String(formData.get('subcategoryId'))
      : (editingProduct?.subcategoryId || matchedCategory?.subcategories[0]?.id || 'sub-general');

    const salePrice = Number(formData.get('price'));
    let origPriceVal = formData.get('originalPrice') ? Number(formData.get('originalPrice')) : undefined;
    const manualDiscountVal = formData.get('discountPercent') ? Number(formData.get('discountPercent')) : undefined;

    let computedDiscount = manualDiscountVal;
    if (origPriceVal && origPriceVal > salePrice) {
      computedDiscount = Math.round(((origPriceVal - salePrice) / origPriceVal) * 100);
    } else if (manualDiscountVal && manualDiscountVal > 0 && (!origPriceVal || origPriceVal <= salePrice)) {
      origPriceVal = Math.round(salePrice / (1 - manualDiscountVal / 100));
      computedDiscount = manualDiscountVal;
    }

    const rawThreshold = formData.get('lowStockThreshold');
    const customThreshold =
      rawThreshold !== null && rawThreshold !== '' && !isNaN(Number(rawThreshold))
        ? Math.max(0, Number(rawThreshold))
        : 15;

    const fallbackImg = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80';
    const productPayload: Omit<Product, 'id'> = {
      name: nameStr,
      slug: editingProduct?.slug || cleanSlug,
      genericName: String(formData.get('genericName') || ''),
      brand: String(formData.get('brand') || ''),
      manufacturer: String(formData.get('manufacturer') || ''),
      categoryId: catId,
      subcategoryId: subcatId,
      price: salePrice,
      originalPrice: origPriceVal,
      discountPercent: computedDiscount && computedDiscount > 0 ? computedDiscount : undefined,
      inStock: formData.get('inStock') === 'on',
      stockCount: Number(formData.get('stockCount')),
      lowStockThreshold: customThreshold,
      dosageForm: String(formData.get('dosageForm') || 'Tablet') as DosageForm,
      packSize: String(formData.get('packSize') || 'Standard Pack'),
      sku: String(formData.get('sku') || `SKU-${Date.now().toString().slice(-4)}`),
      isRxRequired: formData.get('isRxRequired') === 'on',
      images: [String(formData.get('image')) || products[0]?.images?.[0] || fallbackImg],
      indications: String(formData.get('indications') || ''),
      dosage: String(formData.get('dosage') || ''),
      sideEffects: String(formData.get('sideEffects') || ''),
      storage: String(formData.get('storage') || ''),
      description: String(formData.get('indications') || formData.get('name') || ''),
      composition: String(formData.get('genericName') || ''),
      howToUse: String(formData.get('dosage') || 'As directed by registered physician'),
      faqs: [],
      rating: editingProduct?.rating || 4.8,
      reviewsCount: editingProduct?.reviewsCount || 0,
      reviewCount: editingProduct?.reviewCount || 0,
      reviews: editingProduct?.reviews || [],
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleApproveRx = (id: string) => {
    setPrescriptionQueue((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'Approved', notes: pharmacistNote || 'Verified by Chief Pharmacist.' } : r
      )
    );
    setSelectedRx(null);
    addToast({
      type: 'success',
      title: 'Prescription Approved',
      message: 'Dispense clearance issued to pharmacy order dispatch.',
    });
  };

  const handleRejectRx = (id: string) => {
    setPrescriptionQueue((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Rejected',
              notes: `${rxRejectReason}: ${pharmacistNote}`,
            }
          : r
      )
    );
    setSelectedRx(null);
    addToast({
      type: 'error',
      title: 'Prescription Rejected',
      message: `Notification sent to patient: ${rxRejectReason}`,
    });
  };

  return (
    <div id="admin-panel-container" className="min-h-screen bg-slate-900 text-slate-100 py-6 sm:py-8 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
                DRAP Pharmacy Management
              </span>
              <span className="text-xs text-slate-400">v2.4 Live Store</span>
              <span className="text-xs text-emerald-400 font-bold px-2 py-0.5 bg-emerald-950/80 border border-emerald-800 rounded-md">
                Admin Session Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Admin & Pharmacist Operations
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              title="Return to public e-commerce store"
            >
              <Home className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-700 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Medicine</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="my-6 p-1.5 bg-slate-800 rounded-2xl border border-slate-700/80 flex flex-wrap items-center gap-2 shadow-inner relative z-10">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
            { id: 'products', label: 'Medicine Catalog', icon: Layers },
            { id: 'orders', label: 'Dispatch Orders', icon: Package },
            { id: 'prescriptions', label: 'Rx Verification Queue', icon: FileCheck, badge: pendingRxCount },
            { id: 'payments', label: 'Payment Accounts Setup', icon: CreditCard },
            { id: 'settings', label: 'Store & Contact Setup', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 min-w-max ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                    : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-black shrink-0">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  Rs. {totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% this week</span>
                </p>
              </div>

              {/* Stat 2 */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <Package className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {orders.length + 142}
                </div>
                <p className="text-xs text-sky-400 font-semibold">98.2% on-time 2hr delivery</p>
              </div>

              {/* Stat 3 */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Rx Slips</span>
                  <FileCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">
                  {pendingRxCount}
                </div>
                <p className="text-xs text-slate-400 font-semibold">Awaiting pharmacist approval</p>
              </div>

              {/* Stat 4 - Low Stock Alerts */}
              <button
                type="button"
                id="admin-overview-low-stock-stat-btn"
                onClick={() => {
                  setActiveTab('products');
                  setShowLowStockOnly(true);
                }}
                className="text-left w-full p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-rose-500/60 hover:bg-slate-800/90 transition-all cursor-pointer group space-y-2"
                title="Click to view and restock low inventory medicines"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider group-hover:text-rose-300 transition-colors">
                    Low Stock Alerts
                  </span>
                  <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-400 flex items-center justify-between">
                  <span>{lowStockCount} {lowStockCount === 1 ? 'item' : 'items'}</span>
                  <span className="text-xs text-rose-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    View list &rarr;
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">
                  Stock &le; alert limit (default 15)
                </p>
              </button>
            </div>

            {/* Sales Chart (Crash-Free SVG Revenue Chart) */}
            <div className="p-4 sm:p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Weekly Revenue Trend (PKR)</h3>
                  <p className="text-xs text-slate-400">Live order checkout flow</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 bg-emerald-950/80 border border-emerald-800/60 rounded-full">
                  Live Analytics
                </span>
              </div>

              <AdminRevenueChart data={REVENUE_DATA} />
            </div>

            {/* Recent Orders Table with quick status update */}
            <div className="p-4 sm:p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Recent Orders Dispatch</h3>
                  <span className="text-xs text-slate-400 font-normal">({orders.length} total)</span>
                </div>
                {/* Visual horizontal swipe indicator badge for mobile */}
                <div className="flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-semibold text-emerald-300 shadow-xs">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                  <span>Scroll table</span>
                </div>
              </div>

              {/* Scrollable table container with high-visibility scrollbar */}
              <div className="overflow-x-auto visible-table-scrollbar pb-2">
                <table className="w-full min-w-[660px] text-left text-xs border-collapse">
                  <thead className="border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-xs">
                    <tr className="h-10">
                      <th className="py-3 px-3 whitespace-nowrap min-w-[100px]">Order ID</th>
                      <th className="py-3 px-3 whitespace-nowrap min-w-[160px]">Recipient</th>
                      <th className="py-3 px-3 whitespace-nowrap min-w-[100px]">City</th>
                      <th className="py-3 px-3 whitespace-nowrap min-w-[120px]">Amount</th>
                      <th className="py-3 px-3 whitespace-nowrap min-w-[95px]">Status</th>
                      <th className="py-3 px-3 whitespace-nowrap min-w-[120px]">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="h-14 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-3 font-bold text-white whitespace-nowrap align-middle">
                          #{ord.orderNumber}
                        </td>
                        <td className="py-3 px-3 text-slate-200 align-middle">
                          <div
                            className="max-w-[150px] sm:max-w-[200px] truncate font-medium cursor-help"
                            title={`Recipient: ${ord.shippingAddress.fullName}\nCity: ${ord.shippingAddress.city}\nAddress: ${ord.shippingAddress.addressLine || ''}`}
                          >
                            {ord.shippingAddress.fullName}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-300 whitespace-nowrap align-middle">
                          {ord.shippingAddress.city}
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-400 whitespace-nowrap align-middle min-w-[120px]">
                          Rs. {(ord.totalAmount ?? ord.total).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap align-middle">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : ord.status === 'Shipped'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap align-middle">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              updateOrderStatus(ord.id, e.target.value as OrderStatus)
                            }
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs font-semibold focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile bottom swipe indicator bar */}
              <div className="flex md:hidden items-center justify-between pt-2 px-1 text-xs text-slate-400 border-t border-slate-700/40 mt-1">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Swipe horizontally to view all columns</span>
                </span>
                <span className="text-slate-500 font-mono text-xs">6 columns</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Search, Category & Low Stock Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search medicines, formula, brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Low Stock Quick Filter Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="admin-filter-low-stock-btn"
                  onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                    showLowStockOnly
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-xs'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <AlertTriangle className={`w-3.5 h-3.5 ${showLowStockOnly ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span>Low Stock Warnings</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-xs font-black ${
                      showLowStockOnly
                        ? 'bg-rose-500 text-white'
                        : lowStockCount > 0
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {lowStockCount}
                  </span>
                </button>

                {showLowStockOnly && (
                  <button
                    type="button"
                    onClick={() => setShowLowStockOnly(false)}
                    className="px-2.5 py-2 text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Active Low Stock Banner when filter is enabled */}
            {showLowStockOnly && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    <strong>Showing Low Stock Medicines:</strong> Displaying items where stock &le; individual alert threshold (default 15).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLowStockOnly(false)}
                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg font-bold text-xs border border-rose-500/40 shrink-0 cursor-pointer w-fit"
                >
                  Show All Medicines
                </button>
              </div>
            )}

            {/* Products Table */}
            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700 overflow-x-auto thin-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-700 text-slate-400 font-bold uppercase bg-slate-800/95">
                  <tr>
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Generic / Formula</th>
                    <th className="py-3 px-3">Price (PKR)</th>
                    <th className="py-3 px-3">Stock Units / Limit</th>
                    <th className="py-3 px-3">Rx Req?</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {adminFilteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                        {showLowStockOnly
                          ? 'No medicines are currently at or below their low-stock threshold.'
                          : 'No medicines match your search criteria.'}
                      </td>
                    </tr>
                  ) : (
                    adminFilteredProducts.map((p) => {
                      const threshold = p.lowStockThreshold ?? 15;
                      const isLow = p.stockCount <= threshold;
                      return (
                      <tr key={p.id} className={`hover:bg-slate-700/30 ${isLow ? 'bg-rose-950/10' : ''}`}>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 object-contain bg-white rounded-lg p-0.5 shrink-0"
                            />
                          <div className="min-w-0">
                            <div className="font-bold text-white max-w-[200px] truncate" title={p.name}>{p.name}</div>
                            <div className="text-xs text-slate-400 max-w-[200px] truncate" title={`${p.brand} • ${p.packSize}`}>
                              {p.brand} • {p.packSize}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-medium">
                        {p.genericName}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-emerald-400">
                          Rs. {p.price.toLocaleString()}
                        </div>
                        {p.originalPrice && p.originalPrice > p.price ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-slate-400 line-through">
                              Rs. {p.originalPrice.toLocaleString()}
                            </span>
                            <span className="px-1.5 py-0.2 text-[11px] font-bold bg-rose-500/20 text-rose-300 rounded">
                              {p.discountPercent || Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        ) : p.discountPercent ? (
                          <span className="px-1.5 py-0.2 text-[11px] font-bold bg-rose-500/20 text-rose-300 rounded mt-0.5 inline-block">
                            {p.discountPercent}% OFF
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold ${
                                isLow ? 'text-rose-400 font-black' : 'text-slate-200'
                              }`}
                            >
                              {p.stockCount} in stock
                            </span>
                            {isLow && (
                              <span className="px-1.5 py-0.2 text-[11px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded">
                                LOW
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Alert limit: &le; {threshold}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {p.isRxRequired ? (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                            Rx Required
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                            OTC
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 text-slate-300 hover:text-emerald-400 bg-slate-900 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 text-slate-300 hover:text-rose-400 bg-slate-900 rounded-lg cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                }))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Order Status Filter buttons with horizontal scroll affordance and auto-adjusting width */}
            <div className="relative">
              <div className="flex items-center gap-2 overflow-x-auto pb-2.5 pt-1 thin-scrollbar scroll-smooth">
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
                      className={`shrink-0 w-auto min-w-max flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-400/40'
                          : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700'
                      }`}
                    >
                      <span className="whitespace-nowrap font-bold">{st}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-black whitespace-nowrap ${
                          isActive
                            ? 'bg-emerald-800/80 text-emerald-100'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders Table */}
            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700 overflow-x-auto thin-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-700 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="py-3 px-3">Order Number</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Recipient</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {adminFilteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                        No orders match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    adminFilteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-700/30">
                        <td className="py-3 px-3 font-bold text-white">#{ord.orderNumber}</td>
                        <td className="py-3 px-3 text-slate-400">{formatOrderDate(ord.date, ord.createdAt)}</td>
                        <td className="py-3 px-3 text-slate-200">
                          {ord.shippingAddress.fullName} ({ord.shippingAddress.city})
                        </td>
                        <td className="py-3 px-3 text-slate-400 uppercase font-semibold">
                          {ord.paymentMethod}
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-400">
                          Rs. {(ord.totalAmount ?? ord.total).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              updateOrderStatus(ord.id, e.target.value as OrderStatus)
                            }
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs font-bold"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedAdminOrder(ord)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-lg cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRESCRIPTION QUEUE */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
              <h3 className="text-base font-bold text-white">Pharmacist Verification Queue</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review scanned doctor prescriptions before dispensing restricted medicines.
              </p>
            </div>

            {prescriptionQueue.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-slate-800/40 rounded-3xl border border-slate-700">
                <FileText className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                <p className="font-bold text-slate-300 text-sm">Prescription Queue Clear</p>
                <p className="text-xs text-slate-400 mt-1">
                  All customer uploaded prescriptions have been reviewed by the pharmacist team.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prescriptionQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-slate-800/60 border border-slate-700 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400">
                        Order #{item.orderNumber}
                      </span>
                      <h4 className="text-sm font-black text-white">{item.patientName}</h4>
                      <span className="text-xs text-slate-400">{item.patientPhone}</span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : item.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Prescription image thumbnail with zoom button */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 group">
                    <img
                      src={item.image}
                      alt="Prescription"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedRx(item)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-1.5 text-xs font-bold"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Inspect Rx Slip</span>
                    </button>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-300">
                      Doctor: <strong className="text-white">{item.doctorName}</strong>
                    </p>
                    <p className="text-slate-400">{item.hospital}</p>
                    <p className="text-slate-400">
                      Medicines to Dispense:{' '}
                      <span className="text-emerald-400 font-bold">
                        {item.medicines.join(', ')}
                      </span>
                    </p>
                  </div>

                  {item.status === 'Pending Verification' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                      <button
                        type="button"
                        onClick={() => handleApproveRx(item.id)}
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve Rx</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRx(item)}
                        className="flex-1 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject Rx</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 5: PAYMENT SETTINGS */}
        {activeTab === 'payments' && <AdminPaymentSettings />}

        {/* TAB 6: STORE & CONTACT SETTINGS */}
        {activeTab === 'settings' && <AdminStoreSettings />}
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div
          id="product-admin-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsProductModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? 'Edit Medicine' : 'Add New Medicine to Catalog'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Medicine Brand Name *
                  </label>
                  <input
                    name="name"
                    required
                    defaultValue={editingProduct?.name || ''}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Active Generic / Formula *
                  </label>
                  <input
                    name="genericName"
                    required
                    defaultValue={editingProduct?.genericName || ''}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Brand *</label>
                  <input
                    name="brand"
                    required
                    defaultValue={editingProduct?.brand || 'GSK'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Manufacturer *
                  </label>
                  <input
                    name="manufacturer"
                    required
                    defaultValue={editingProduct?.manufacturer || 'GlaxoSmithKline Pakistan'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    name="categoryId"
                    defaultValue={editingProduct?.categoryId || categories[0]?.id}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Pricing, Cut-Price & Discounts
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">
                    Products with original price show a highlighted % OFF badge
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Selling Price (PKR) *
                    </label>
                    <input
                      name="price"
                      type="number"
                      required
                      defaultValue={editingProduct?.price || 150}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                    />
                    <span className="text-xs text-slate-400">Actual price charged to customer</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Original MRP (Cut-out Price)
                    </label>
                    <input
                      name="originalPrice"
                      type="number"
                      defaultValue={editingProduct?.originalPrice || ''}
                      placeholder="e.g. 200"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                    <span className="text-xs text-slate-400">Shows crossed out (e.g. ~Rs. 200~)</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Discount Badge (%)
                    </label>
                    <input
                      name="discountPercent"
                      type="number"
                      min="1"
                      max="99"
                      defaultValue={editingProduct?.discountPercent || ''}
                      placeholder="Auto or e.g. 15"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                    <span className="text-xs text-slate-400">Auto-calculated or enter custom %</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Stock Units *
                  </label>
                  <input
                    name="stockCount"
                    type="number"
                    required
                    defaultValue={editingProduct?.stockCount || 50}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                  <span className="text-xs text-slate-400">Current available warehouse stock</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-semibold">
                      Low Stock Alert Limit
                    </label>
                    <span className="text-xs text-amber-400 font-bold">Default: 15</span>
                  </div>
                  <input
                    name="lowStockThreshold"
                    type="number"
                    min="0"
                    defaultValue={editingProduct?.lowStockThreshold ?? 15}
                    placeholder="15"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
                  />
                  <span className="text-xs text-slate-400">
                    Triggers warning when stock &le; this limit (editable)
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dosage Form</label>
                  <input
                    name="dosageForm"
                    defaultValue={editingProduct?.dosageForm || 'Tablet'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                  <span className="text-xs text-slate-400">e.g. Tablet, Syrup, Injection</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pack Size</label>
                  <input
                    name="packSize"
                    defaultValue={editingProduct?.packSize || 'Strip of 10 Tablets'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SKU</label>
                  <input
                    name="sku"
                    defaultValue={editingProduct?.sku || `SKU-${Date.now().toString().slice(-4)}`}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                <input
                  name="image"
                  defaultValue={editingProduct?.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    name="inStock"
                    type="checkbox"
                    defaultChecked={editingProduct ? editingProduct.inStock : true}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Mark as In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    name="isRxRequired"
                    type="checkbox"
                    defaultChecked={editingProduct?.isRxRequired || false}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Requires Doctor Prescription (Rx)</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Indications & Uses</label>
                <textarea
                  name="indications"
                  rows={2}
                  defaultValue={editingProduct?.indications || 'Relief of pain, fever, and discomfort.'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dosage</label>
                  <input
                    name="dosage"
                    defaultValue={editingProduct?.dosage || '1 tablet every 6 to 8 hours as needed.'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Side Effects</label>
                  <input
                    name="sideEffects"
                    defaultValue={editingProduct?.sideEffects || 'Mild nausea or dizziness.'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Storage</label>
                  <input
                    name="storage"
                    defaultValue={editingProduct?.storage || 'Store below 25°C in a dry place.'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Prescription Modal */}
      {selectedRx && (
        <div
          id="inspect-rx-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRx(null);
          }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-white text-base">
                Prescription Inspection - Order #{selectedRx.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedRx(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="h-80 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-700">
                <img
                  src={selectedRx.image}
                  alt="Doctor Slip"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400">Patient:</span>
                  <p className="font-bold text-white">{selectedRx.patientName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Doctor / Clinic:</span>
                  <p className="font-bold text-white">{selectedRx.doctorName}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block text-slate-300 font-semibold">
                  Pharmacist Audit Notes:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Antibiotics approved for 7-day course..."
                  value={pharmacistNote}
                  onChange={(e) => setPharmacistNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => handleRejectRx(selectedRx.id)}
                  className="px-4 py-2 bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Reject Prescription
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveRx(selectedRx.id)}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
                >
                  Approve & Release Dispense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Product?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove <span className="text-white font-semibold">{deletingProduct.name}</span> from the catalog? This will immediately reflect on the public storefront.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(deletingProduct.id);
                  setDeletingProduct(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
