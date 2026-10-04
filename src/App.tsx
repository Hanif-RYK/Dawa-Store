import React, { Component, Suspense, lazy, useEffect } from 'react';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { ProductListingPage } from './components/listing/ProductListingPage';
import { ProductDetailPage } from './components/detail/ProductDetailPage';
import { CartPage } from './components/cart/CartPage';
import { ToastContainer } from './components/common/ToastContainer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { CompareModal } from './components/common/CompareModal';
import { AuthModal } from './components/common/AuthModal';
import { MiniCartDrawer } from './components/cart/MiniCartDrawer';
import { BackToTop } from './components/common/BackToTop';
import { LicenseVerificationModal } from './components/common/LicenseVerificationModal';

// Pages most visitors never open first are split into their own chunks, so the
// storefront loads less JavaScript (the admin panel alone pulls in the charts library).
const CheckoutPage = lazy(() => import('./components/checkout/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('./components/checkout/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })));
const PrescriptionUploadPage = lazy(() => import('./components/prescription/PrescriptionUploadPage').then((m) => ({ default: m.PrescriptionUploadPage })));
const UserAccountPage = lazy(() => import('./components/account/UserAccountPage').then((m) => ({ default: m.UserAccountPage })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const StaffLoginPage = lazy(() => import('./components/admin/StaffLoginPage').then((m) => ({ default: m.StaffLoginPage })));
const ContactAndPolicyPage = lazy(() => import('./components/common/ContactAndPolicyPage').then((m) => ({ default: m.ContactAndPolicyPage })));

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App caught unexpected error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 text-2xl font-black">
            +
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">DawaStore Online Pharmacy</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            We recovered from a display glitch. Tap below to return to the store safely.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Return to Storefront
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const RouteLoading: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-label="Loading page">
    <div className="w-8 h-8 border-[3px] border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
  </div>
);

// Navigates after render (never during it) and replaces the history entry.
const Redirect: React.FC<{ to: string }> = ({ to }) => {
  const { navigate } = usePharmacy();
  useEffect(() => {
    navigate(to, { replace: true });
  }, [to]);
  return null;
};

const AppContent: React.FC = () => {
  const { currentPath, user } = usePharmacy();

  // Route matching
  const renderRoute = () => {
    // 1. Staff Portal sign-in and Admin Panel (staff only)
    if (currentPath === '/admin/login') {
      return user?.isAdmin ? <Redirect to="/admin" /> : <StaffLoginPage />;
    }
    if (currentPath === '/admin' || currentPath.startsWith('/admin/') || currentPath.startsWith('/admin?')) {
      return user?.isAdmin ? <AdminDashboard /> : <Redirect to="/admin/login" />;
    }

    // 2. User Account
    if (currentPath === '/account' || currentPath.startsWith('/account/')) {
      return <UserAccountPage />;
    }

    // 3. Cart
    if (currentPath === '/cart') {
      return <CartPage />;
    }

    // 3.5 Upload Prescription (Direct flow)
    if (
      currentPath === '/upload-prescription' ||
      currentPath.startsWith('/upload-prescription') ||
      currentPath === '/prescription-upload' ||
      currentPath.startsWith('/prescription-upload')
    ) {
      return <PrescriptionUploadPage />;
    }

    // 3.6 Contact Us, Policies & Help Routes
    if (currentPath.startsWith('/contact')) {
      return <ContactAndPolicyPage initialTab="contact" />;
    }
    if (currentPath.startsWith('/about')) {
      return <ContactAndPolicyPage initialTab="about" />;
    }
    if (currentPath.startsWith('/returns') || currentPath.startsWith('/refund')) {
      return <ContactAndPolicyPage initialTab="returns" />;
    }
    if (currentPath.startsWith('/privacy')) {
      return <ContactAndPolicyPage initialTab="privacy" />;
    }
    if (currentPath.startsWith('/terms')) {
      return <ContactAndPolicyPage initialTab="terms" />;
    }
    if (currentPath.startsWith('/shipping') || currentPath.startsWith('/delivery')) {
      return <ContactAndPolicyPage initialTab="shipping" />;
    }

    // 4. Checkout
    if (currentPath.startsWith('/checkout')) {
      return <CheckoutPage />;
    }

    // 5. Order Confirmation
    if (currentPath.startsWith('/order-confirmation')) {
      const orderNum = currentPath.replace('/order-confirmation/', '').split('?')[0];
      return <OrderConfirmationPage orderNumber={orderNum || undefined} />;
    }

    // 6. Product Detail Page: /product/:slug
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '').split('?')[0];
      return <ProductDetailPage slug={slug} />;
    }

    // 7. Category Page: /category/:slug
    if (currentPath.startsWith('/category/')) {
      const categorySlug = currentPath.replace('/category/', '').split('?')[0];
      return <ProductListingPage categorySlug={categorySlug} />;
    }

    // 8. Search / Products Listing & Catalog
    if (
      currentPath.startsWith('/products') ||
      currentPath.startsWith('/catalog') ||
      currentPath.startsWith('/medicines') ||
      currentPath.startsWith('/search')
    ) {
      return <ProductListingPage isSearch={currentPath.startsWith('/search')} />;
    }

    // Default: Home Page
    return <HomePage />;
  };

  const isAdminView = currentPath === '/admin' || currentPath.startsWith('/admin/') || currentPath.startsWith('/admin?') || currentPath.startsWith('/admin#');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-clip">
      {/* Global Header (sticky, with mega-menu & mobile drawer) - hidden on dedicated admin workspace */}
      {!isAdminView && <Header />}

      {/* Main Routed Content View */}
      <main className="flex-1">
        <Suspense fallback={<RouteLoading />}>{renderRoute()}</Suspense>
      </main>

      {/* Global Footer */}
      {!isAdminView && <Footer />}

      {/* Global Drawers & Modals */}
      <MiniCartDrawer />
      <QuickViewModal />
      <CompareModal />
      <ToastContainer />
      <AuthModal />
      <LicenseVerificationModal />
      <BackToTop />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <PharmacyProvider>
        <AppContent />
      </PharmacyProvider>
    </ErrorBoundary>
  );
}
