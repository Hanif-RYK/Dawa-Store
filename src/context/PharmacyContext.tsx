import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  Category,
  CartItem,
  Address,
  Order,
  OrderStatus,
  User,
  ToastMessage,
  FilterState,
  PaymentSettings,
  DEFAULT_PAYMENT_SETTINGS,
  StoreSettings,
  DEFAULT_STORE_SETTINGS,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
} from '../data/mockData';

interface PharmacyContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  compareList: string[];
  orders: Order[];
  user: User | null;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  // Cart Actions
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;
  appliedPromo: string | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  // Wishlist & Compare
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  // UI Drawers & Modals
  isMiniCartOpen: boolean;
  setIsMiniCartOpen: (open: boolean) => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  drawerShowLowStock: boolean;
  setDrawerShowLowStock: (show: boolean) => void;
  openLowStockDrawer: () => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register' | 'forgot';
  setAuthModalTab: (tab: 'login' | 'register' | 'forgot') => void;
  isLicenseModalOpen: boolean;
  setIsLicenseModalOpen: (open: boolean) => void;
  // User & Addresses
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, phone: string, password?: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  // Orders
  createOrder: (orderData: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: 'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'bank';
    prescriptionImage?: string;
    whatsappPhone?: string;
    notes?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorder: (orderId: string) => void;
  // Admin Product CRUD
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Routing
  currentPath: string;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  goBack: () => void;
  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  // Filters helper
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: (shouldNavigate?: boolean) => void;
  filteredProducts: Product[];
  totalFilteredCount: number;
  // Payment Settings
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => void;
  // Store, Contact, Licensing & Express Cities Settings
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
}

const DEFAULT_FILTERS: FilterState = {
  categoryId: undefined,
  subcategoryId: undefined,
  subSubcategory: undefined,
  search: undefined,
  searchQuery: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  priceRange: [0, 10000],
  dosageForms: [],
  forms: [],
  brands: [],
  ingredients: [],
  manufacturers: [],
  inStockOnly: false,
  lowStockOnly: false,
  rxRequired: undefined,
  rxOnly: false,
  sort: 'popularity',
  sortBy: 'popular',
  viewMode: 'grid',
  page: 1,
  limit: 12,
  perPage: 12,
};

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Persistence Loaders
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('dawastore_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dawastore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dawastore_wishlist');
      return saved ? JSON.parse(saved) : ['prod-panadol-500', 'prod-surbex-z'];
    } catch {
      return ['prod-panadol-500', 'prod-surbex-z'];
    }
  });

  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('dawastore_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('dawastore_user');
      if (saved) return JSON.parse(saved);
      // Default initial mock logged-in user for rich immediate experience
      return {
        id: 'usr-1',
        name: 'Mohammad Hanif Chohan',
        email: 'hanifchohanryk@gmail.com',
        phone: '+92 300 1234567',
        addresses: INITIAL_ADDRESSES,
        isAdmin: true,
      };
    } catch {
      return null;
    }
  });

  const [selectedCity, setSelectedCity] = useState<string>('Karachi');

  // UI state
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountRate, setPromoDiscountRate] = useState<number>(0);

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem('dawastore_payment_settings');
      if (saved) {
        return { ...DEFAULT_PAYMENT_SETTINGS, ...JSON.parse(saved) };
      }
      return DEFAULT_PAYMENT_SETTINGS;
    } catch {
      return DEFAULT_PAYMENT_SETTINGS;
    }
  });

  const updatePaymentSettings = (newSettings: Partial<PaymentSettings>) => {
    setPaymentSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('dawastore_payment_settings', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save payment settings', err);
      }
      return updated;
    });
  };

  // Store, Contact, Licensing, Express Delivery & Policies Settings
  const cleanPolicyText = (text: string | undefined, fallbackKey?: keyof typeof DEFAULT_STORE_SETTINGS.policies): string => {
    if (!text || typeof text !== 'string') {
      return fallbackKey ? DEFAULT_STORE_SETTINGS.policies[fallbackKey] || '' : '';
    }
    let cleaned = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

    // 1. Remove duplicate identical halves if string was accidentally doubled
    const half = Math.floor(cleaned.length / 2);
    const p1 = cleaned.slice(0, half).trim();
    const p2 = cleaned.slice(half).trim();
    if (p1 && p2 && p1 === p2) {
      cleaned = p1;
    }

    // 2. Remove any embedded UI headers or labels that might have leaked into policy text
    const displayedAtLineRegex = /(?:^|\n)[^\n]*(?:Displayed\s+at\s*\/|\/(?:returns|privacy|terms|about|shipping))[^\n]*(?:\n|$)/gi;
    cleaned = cleaned.replace(displayedAtLineRegex, '\n\n');

    const headerLineRegex = /(?:^|\n)[^\n]*(?:Return,?\s*Exchange\s*&\s*Refund|Privacy(?:\s*&\s*Patient\s*Health\s*Data\s*Security)?\s*Policy|Terms\s*&\s*Conditions|About\s*Us(?:\s*&\s*Company\s*Vision)?|Express\s*Delivery(?:\s*&\s*Cold-Chain)?\s*Policy)[^\n]*(?:\n|$)/gi;
    cleaned = cleaned.replace(headerLineRegex, '\n\n');

    // 3. Clean up excessive newlines left behind
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

    // 4. Fallback if content was corrupted or too short
    if (cleaned.length < 35 && fallbackKey && DEFAULT_STORE_SETTINGS.policies[fallbackKey]) {
      return DEFAULT_STORE_SETTINGS.policies[fallbackKey];
    }

    return cleaned;
  };

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('dawastore_store_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const rawPolicies = { ...DEFAULT_STORE_SETTINGS.policies, ...(parsed.policies || {}) };
        const cleanedPolicies = {
          aboutUs: cleanPolicyText(rawPolicies.aboutUs, 'aboutUs'),
          returnPolicy: cleanPolicyText(rawPolicies.returnPolicy, 'returnPolicy'),
          privacyPolicy: cleanPolicyText(rawPolicies.privacyPolicy, 'privacyPolicy'),
          termsConditions: cleanPolicyText(rawPolicies.termsConditions, 'termsConditions'),
          shippingPolicy: cleanPolicyText(rawPolicies.shippingPolicy, 'shippingPolicy'),
        };
        const sanitized: StoreSettings = {
          ...DEFAULT_STORE_SETTINGS,
          ...parsed,
          socialLinks: { ...DEFAULT_STORE_SETTINGS.socialLinks, ...(parsed.socialLinks || {}) },
          policies: cleanedPolicies,
        };
        try {
          localStorage.setItem('dawastore_store_settings', JSON.stringify(sanitized));
        } catch {
          // ignore
        }
        return sanitized;
      }
      return DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => {
      const updatedPolicies = newSettings.policies
        ? {
            aboutUs: cleanPolicyText(newSettings.policies.aboutUs, 'aboutUs'),
            returnPolicy: cleanPolicyText(newSettings.policies.returnPolicy, 'returnPolicy'),
            privacyPolicy: cleanPolicyText(newSettings.policies.privacyPolicy, 'privacyPolicy'),
            termsConditions: cleanPolicyText(newSettings.policies.termsConditions, 'termsConditions'),
            shippingPolicy: cleanPolicyText(newSettings.policies.shippingPolicy, 'shippingPolicy'),
          }
        : prev.policies;

      const updated = {
        ...prev,
        ...newSettings,
        socialLinks: {
          ...prev.socialLinks,
          ...(newSettings.socialLinks || {}),
        },
        policies: updatedPolicies,
      };
      try {
        localStorage.setItem('dawastore_store_settings', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save store settings', err);
      }
      return updated;
    });
  };

  // Filters state
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Helper to normalize path
  const normalizePath = (raw: string): string => {
    if (!raw) return '/';
    let path = raw.trim();
    if (path.startsWith('#')) {
      path = path.slice(1);
    }
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return path;
  };

  // Mobile Drawer & Low Stock States
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [drawerShowLowStock, setDrawerShowLowStock] = useState(false);

  const openLowStockDrawer = () => {
    setIsMobileDrawerOpen(true);
    setDrawerShowLowStock(true);
  };

  // Client-Side Routing with Browser History & Iframe-Safe Navigation
  const getInitialRoute = (): string => {
    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        const hash = window.location.hash.replace(/^#/, '');
        if (hash) return normalizePath(hash);
      }
      const initial = window.location.pathname + window.location.search;
      return initial && initial !== '' && initial !== '/' ? normalizePath(initial) : '/';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialRoute);
  // Synchronous in-memory navigation stack
  const navigationStackRef = useRef<string[]>([getInitialRoute()]);

  useEffect(() => {
    const syncRouteFromLocation = (e?: PopStateEvent) => {
      let nextPath = '/';
      if (e?.state && typeof e.state.path === 'string') {
        nextPath = normalizePath(e.state.path);
      } else if (typeof window !== 'undefined') {
        if (window.location.hash) {
          const hash = window.location.hash.replace(/^#/, '');
          if (hash) {
            nextPath = normalizePath(hash);
          }
        } else {
          const path = window.location.pathname + window.location.search;
          if (path && path !== '/') {
            nextPath = normalizePath(path);
          }
        }
      }
      setCurrentPath(nextPath);
      if (
        navigationStackRef.current.length === 0 ||
        navigationStackRef.current[navigationStackRef.current.length - 1] !== nextPath
      ) {
        navigationStackRef.current.push(nextPath);
      }
    };

    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
    };
  }, []);

  const navigate = (path: string, options?: { replace?: boolean; isBack?: boolean }) => {
    const cleanPath = normalizePath(path);
    const inIframe = typeof window !== 'undefined' && window.self !== window.top;

    if (options?.isBack) {
      if (navigationStackRef.current.length > 1) {
        navigationStackRef.current.pop();
      } else {
        navigationStackRef.current = [cleanPath];
      }
    } else if (options?.replace) {
      if (navigationStackRef.current.length > 0) {
        navigationStackRef.current[navigationStackRef.current.length - 1] = cleanPath;
      } else {
        navigationStackRef.current = [cleanPath];
      }
    } else {
      if (
        navigationStackRef.current.length === 0 ||
        navigationStackRef.current[navigationStackRef.current.length - 1] !== cleanPath
      ) {
        navigationStackRef.current.push(cleanPath);
      }
    }

    try {
      if (typeof window !== 'undefined') {
        if (inIframe) {
          // In sandboxed iframes, use hash routing for zero page reload
          if (window.history && window.history.replaceState) {
            window.history.replaceState({ path: cleanPath }, '', '#' + cleanPath);
          } else {
            window.location.hash = cleanPath;
          }
        } else {
          // In standalone browser tab
          if (window.history) {
            if (options?.replace) {
              window.history.replaceState({ path: cleanPath }, '', cleanPath);
            } else {
              window.history.pushState({ path: cleanPath }, '', cleanPath);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Navigation history update failed (handled gracefully):', e);
    }

    setCurrentPath(cleanPath);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    let targetPath = '/';
    if (navigationStackRef.current.length > 1) {
      // Pop the current page off the stack
      navigationStackRef.current.pop();
      // Previous route is now the top of stack
      targetPath = navigationStackRef.current[navigationStackRef.current.length - 1];
    } else {
      targetPath = '/';
      navigationStackRef.current = ['/'];
    }

    const cleanPath = normalizePath(targetPath);
    const inIframe = typeof window !== 'undefined' && window.self !== window.top;

    try {
      if (typeof window !== 'undefined') {
        if (inIframe) {
          if (window.history && window.history.replaceState) {
            window.history.replaceState({ path: cleanPath }, '', '#' + cleanPath);
          } else {
            window.location.hash = cleanPath;
          }
        } else {
          if (window.history) {
            window.history.replaceState({ path: cleanPath }, '', cleanPath);
          }
        }
      }
    } catch (e) {
      console.warn('goBack history update failed:', e);
    }

    setCurrentPath(cleanPath);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('dawastore_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('dawastore_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('dawastore_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('dawastore_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('dawastore_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('dawastore_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, openDrawer = true) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${quantity}x ${product.name} added.`,
    });

    if (openDrawer) {
      setIsMiniCartOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      addToast({
        type: 'info',
        title: 'Removed from Cart',
        message: `${item.product.name} was removed.`,
      });
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Delivery: Free delivery above storeSettings.freeDeliveryThreshold, otherwise storeSettings.deliveryFee
  const freeThreshold = storeSettings?.freeDeliveryThreshold ?? 2000;
  const defaultDeliveryFee = storeSettings?.deliveryFee ?? 150;
  const cartDeliveryFee = cartSubtotal === 0 || cartSubtotal >= freeThreshold ? 0 : defaultDeliveryFee;
  const cartDiscount = Math.round(cartSubtotal * promoDiscountRate);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  const applyPromo = (code: string) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'HEALTH10') {
      setAppliedPromo('HEALTH10');
      setPromoDiscountRate(0.1); // 10% off
      addToast({
        type: 'success',
        title: 'Promo Applied!',
        message: '10% discount applied on your order.',
      });
      return { success: true, message: '10% discount applied!' };
    }
    if (formatted === 'FIRSTAID') {
      setAppliedPromo('FIRSTAID');
      setPromoDiscountRate(0.15); // 15% off
      addToast({
        type: 'success',
        title: 'Promo Applied!',
        message: '15% welcome discount applied.',
      });
      return { success: true, message: '15% welcome discount applied!' };
    }
    addToast({
      type: 'error',
      title: 'Invalid Promo Code',
      message: 'Code not recognized or expired. Try "HEALTH10" or "FIRSTAID".',
    });
    return { success: false, message: 'Invalid promo code' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoDiscountRate(0);
    addToast({
      type: 'info',
      title: 'Promo Removed',
      message: 'Promotional discount has been removed.',
    });
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      addToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: product?.name || 'Item removed from your saved list.',
      });
    } else {
      setWishlist((prev) => [...prev, productId]);
      addToast({
        type: 'success',
        title: 'Saved to Wishlist',
        message: product?.name || 'Item saved to your wishlist.',
      });
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const toggleCompare = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (compareList.includes(productId)) {
      setCompareList((prev) => prev.filter((id) => id !== productId));
    } else {
      if (compareList.length >= 4) {
        addToast({
          type: 'warning',
          title: 'Compare Limit Reached',
          message: 'You can compare up to 4 medicines at a time.',
        });
        return;
      }
      setCompareList((prev) => [...prev, productId]);
      addToast({
        type: 'success',
        title: 'Added to Compare',
        message: `${product?.name} added to comparison table.`,
      });
    }
  };

  const isInCompare = (productId: string) => compareList.includes(productId);
  const clearCompare = () => setCompareList([]);

  // Auth & Profile
  const login = (email: string) => {
    const existing = user || {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0],
      email,
      phone: '+92 300 0000000',
      addresses: INITIAL_ADDRESSES,
      isAdmin: email.includes('admin'),
    };
    setUser({ ...existing, email });
    addToast({
      type: 'success',
      title: 'Welcome Back!',
      message: `Signed in as ${email}`,
    });
    return true;
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      addresses: [],
      isAdmin: false,
    };
    setUser(newUser);
    addToast({
      type: 'success',
      title: 'Account Created',
      message: `Welcome to DawaStore, ${name}!`,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been successfully signed out.',
    });
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal information has been saved.',
    });
  };

  const addAddress = (address: Omit<Address, 'id'>): Address => {
    const newAddr: Address = {
      ...address,
      id: 'addr-' + Date.now(),
    };
    if (user) {
      const updatedAddresses = address.isDefault
        ? user.addresses.map((a) => ({ ...a, isDefault: false }))
        : [...user.addresses];
      setUser({
        ...user,
        addresses: [...updatedAddresses, newAddr],
      });
    }
    addToast({
      type: 'success',
      title: 'Address Added',
      message: `${newAddr.area}, ${newAddr.city} saved.`,
    });
    return newAddr;
  };

  const updateAddress = (id: string, updated: Partial<Address>) => {
    if (!user) return;
    setUser({
      ...user,
      addresses: user.addresses.map((addr) => {
        if (addr.id === id) {
          return { ...addr, ...updated };
        }
        if (updated.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      }),
    });
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    setUser({
      ...user,
      addresses: user.addresses.filter((a) => a.id !== id),
    });
    addToast({
      type: 'info',
      title: 'Address Deleted',
    });
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    setUser({
      ...user,
      addresses: user.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    });
  };

  // Orders
  const createOrder = async (orderData: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: 'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'bank';
    prescriptionImage?: string;
    whatsappPhone?: string;
    notes?: string;
  }): Promise<Order> => {
    // Generate order
    const isDirectRx = orderData.items.length === 0;
    const orderNumber = isDirectRx
      ? 'DS-RX-' + Math.floor(10000 + Math.random() * 90000)
      : 'PK-PHARM-' + Math.floor(10000 + Math.random() * 90000);
    const sub = orderData.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const disc = Math.round(sub * promoDiscountRate);
    const delFee = isDirectRx ? 0 : sub >= (storeSettings?.freeDeliveryThreshold ?? 2000) ? 0 : (storeSettings?.deliveryFee ?? 150);
    const tot = sub - disc + delFee;

    const items = isDirectRx
      ? [
          {
            productId: 'rx-direct-request',
            productName: 'Doctor Prescription Order (Pharmacist Audit & Dispense)',
            brand: 'Verified Pharmaceutical Grade',
            packSize: 'Full Course as Prescribed',
            price: 0,
            quantity: 1,
            image:
              orderData.prescriptionImage ||
              'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
            isRxRequired: true,
          },
        ]
      : orderData.items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          brand: item.product.brand,
          packSize: item.product.packSize,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          isRxRequired: item.product.isRxRequired,
        }));

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending',
      items,
      subtotal: sub,
      deliveryFee: delFee,
      discount: disc,
      promoCode: appliedPromo || undefined,
      total: tot,
      totalAmount: tot,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'Pending',
      shippingAddress: orderData.shippingAddress,
      prescriptionImage: orderData.prescriptionImage,
      whatsappPhone: orderData.whatsappPhone,
      notes: orderData.notes,
      estimatedDelivery: isDirectRx
        ? 'Pharmacist reviewing Rx — Call confirmation within 15 mins'
        : 'Today within 2-4 Hours (Express Pharmacy Courier)',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedPromo(null);
    setPromoDiscountRate(0);

    addToast({
      type: 'success',
      title: isDirectRx ? 'Prescription Order Placed!' : 'Order Placed Successfully!',
      message: isDirectRx
        ? `Prescription #${orderNumber} submitted for pharmacist verification.`
        : `Order #${orderNumber} is being processed.`,
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    addToast({
      type: 'info',
      title: 'Order Status Updated',
      message: `Order marked as ${status}.`,
    });
  };

  const reorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity, false);
      }
    });
    setIsMiniCartOpen(true);
    addToast({
      type: 'success',
      title: 'Items Added to Cart',
      message: `Items from ${order.orderNumber} added back to your cart.`,
    });
  };

  // Admin Product CRUD
  const addProduct = (prodData: Omit<Product, 'id'>): Product => {
    const newProd: Product = {
      ...prodData,
      id: 'prod-' + Date.now(),
    };
    setProducts((prev) => [newProd, ...prev]);
    addToast({
      type: 'success',
      title: 'Product Added',
      message: `${newProd.name} is now in the catalog.`,
    });
    return newProd;
  };

  const updateProduct = (id: string, prodData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...prodData } : p))
    );
    addToast({
      type: 'success',
      title: 'Product Updated',
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast({
      type: 'info',
      title: 'Product Removed',
    });
  };

  const resetFilters = (shouldNavigate: boolean = true) => {
    setFilters(DEFAULT_FILTERS);
    if (
      shouldNavigate &&
      (currentPath.startsWith('/category/') ||
        currentPath.startsWith('/search') ||
        currentPath.includes('?'))
    ) {
      navigate('/products');
    }
  };

  // Compute filtered products based on active filters
  const allFiltered = products.filter((p) => {
    if (filters.lowStockOnly) {
      const threshold = p.lowStockThreshold ?? 15;
      if (p.stockCount > threshold) return false;
    }

    if (filters.categoryId && p.categoryId !== filters.categoryId) return false;
    if (filters.subcategoryId && p.subcategoryId !== filters.subcategoryId) return false;
    if (filters.subSubcategory && p.subSubcategory !== filters.subSubcategory) return false;

    const query = (filters.search || filters.searchQuery || '').trim().toLowerCase();
    if (query) {
      const matchName = p.name.toLowerCase().includes(query);
      const matchGeneric = p.genericName.toLowerCase().includes(query);
      const matchBrand = p.brand.toLowerCase().includes(query);
      const matchDesc = (p.description || '').toLowerCase().includes(query);
      if (!matchName && !matchGeneric && !matchBrand && !matchDesc) return false;
    }

    const minP = filters.minPrice ?? filters.priceRange?.[0] ?? 0;
    const maxP = filters.maxPrice ?? filters.priceRange?.[1] ?? 10000;
    if (p.price < minP || p.price > maxP) return false;

    const forms = filters.dosageForms || filters.forms || [];
    if (forms.length > 0 && !forms.includes(p.dosageForm)) return false;

    const brands = filters.brands || filters.manufacturers || [];
    if (brands.length > 0 && !brands.includes(p.brand) && !brands.includes(p.manufacturer)) return false;

    if (filters.ingredients && filters.ingredients.length > 0 && !filters.ingredients.includes(p.genericName)) return false;

    if (filters.inStockOnly && !p.inStock) return false;

    if (filters.rxRequired !== undefined && p.isRxRequired !== filters.rxRequired) return false;
    if (filters.rxOnly && !p.isRxRequired) return false;

    return true;
  }).sort((a, b) => {
    const sortVal = filters.sort || filters.sortBy || 'popularity';
    if (sortVal === 'price-asc') return a.price - b.price;
    if (sortVal === 'price-desc') return b.price - a.price;
    if (sortVal === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    if (sortVal === 'name-asc') return a.name.localeCompare(b.name);
    if (sortVal === 'name-desc') return b.name.localeCompare(a.name);
    return b.rating - a.rating;
  });

  const totalFilteredCount = allFiltered.length;
  const page = filters.page || 1;
  const limit = filters.limit || filters.perPage || 12;
  const filteredProducts = allFiltered.slice((page - 1) * limit, page * limit);

  return (
    <PharmacyContext.Provider
      value={{
        products,
        filteredProducts,
        totalFilteredCount,
        categories,
        cart,
        wishlist,
        compareList,
        orders,
        user,
        selectedCity,
        setSelectedCity,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,
        appliedPromo,
        applyPromo,
        removePromo,
        toggleWishlist,
        isInWishlist,
        toggleCompare,
        isInCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        isMiniCartOpen,
        setIsMiniCartOpen,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        drawerShowLowStock,
        setDrawerShowLowStock,
        openLowStockDrawer,
        quickViewProduct,
        setQuickViewProduct,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        isLicenseModalOpen,
        setIsLicenseModalOpen,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        createOrder,
        updateOrderStatus,
        reorder,
        addProduct,
        updateProduct,
        deleteProduct,
        currentPath,
        navigate,
        goBack,
        toasts,
        addToast,
        removeToast,
        filters,
        setFilters,
        resetFilters,
        paymentSettings,
        updatePaymentSettings,
        storeSettings,
        updateStoreSettings,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
