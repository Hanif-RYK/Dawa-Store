export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  subSubcategories: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image?: string;
  description: string;
  itemCount: number;
  subcategories: SubCategory[];
}

export type DosageForm = 
  | 'Tablet'
  | 'Syrup'
  | 'Capsule'
  | 'Suspension'
  | 'Injection'
  | 'Cream'
  | 'Ointment'
  | 'Drops'
  | 'Inhaler'
  | 'Sachet'
  | 'Device';

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string; // e.g. GSK, Abbott, Getz Pharma
  manufacturer: string;
  genericName: string; // e.g. Paracetamol, Ibuprofen, Omeprazole
  dosageForm: DosageForm;
  packSize: string; // e.g. "Pack of 20 Tablets", "120ml Bottle"
  price: number; // in PKR Rs.
  originalPrice?: number;
  discountPercent?: number;
  inStock: boolean;
  stockCount: number;
  lowStockThreshold?: number; // Custom threshold for low stock alert (defaults to 15)
  isRxRequired: boolean; // Prescription required
  images: string[];
  categoryId: string;
  subcategoryId?: string;
  subSubcategory?: string;
  description: string;
  composition: string;
  howToUse: string;
  sideEffects: string;
  faqs: { question: string; answer: string }[];
  isFeatured?: boolean;
  isHotDeal?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  reviewCount?: number;
  sku?: string;
  indications?: string;
  dosage?: string;
  storage?: string;
  reviews?: {
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    verifiedPurchase: boolean;
  }[];
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  area: string;
  landmark?: string;
  isDefault: boolean;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  date?: string;
  status: OrderStatus;
  items: {
    productId: string;
    productName: string;
    brand: string;
    packSize: string;
    price: number;
    quantity: number;
    image: string;
    isRxRequired: boolean;
    product?: {
      id: string;
      name: string;
      brand: string;
      packSize: string;
      price: number;
      images: string[];
      isRxRequired: boolean;
    };
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  totalAmount?: number;
  paymentMethod: 'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'bank';
  paymentStatus?: 'Paid' | 'Unpaid' | 'Pending';
  shippingAddress: Address;
  prescriptionImage?: string;
  whatsappPhone?: string;
  notes?: string;
  estimatedDelivery: string;
  // 'pickup' = customer collects from the pharmacy counter (no delivery fee)
  deliveryMethod?: 'delivery' | 'pickup';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  role?: 'customer' | 'admin' | 'pharmacist';
  isAdmin?: boolean;
}

export type SortOption = 'popularity' | 'popular' | 'price-asc' | 'price-desc' | 'newest' | 'name-asc' | 'name-desc' | 'stock';

export interface FilterState {
  categoryId?: string;
  subcategoryId?: string;
  subSubcategory?: string;
  search?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: [number, number];
  dosageForms?: string[];
  forms?: DosageForm[];
  brands?: string[];
  ingredients?: string[];
  manufacturers?: string[];
  inStockOnly?: boolean;
  lowStockOnly?: boolean;
  rxRequired?: boolean;
  rxOnly?: boolean;
  sort?: SortOption;
  sortBy?: SortOption;
  viewMode?: 'grid' | 'list';
  page: number;
  limit: number;
  perPage?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export type PaymentMode = 'manual' | 'gateway' | 'both';

export interface PaymentSettings {
  paymentMode: PaymentMode; // 'manual' | 'gateway' | 'both'
  cod: {
    enabled: boolean;
    instructions: string;
  };
  jazzcash: {
    enabled: boolean;
    accountTitle: string;
    accountNumber: string;
    tillNumber?: string;
    instructions: string;
    gatewayMerchantId?: string;
    gatewayPassword?: string;
    gatewayHashKey?: string;
  };
  easypaisa: {
    enabled: boolean;
    accountTitle: string;
    accountNumber: string;
    tillNumber?: string;
    instructions: string;
    gatewayStoreId?: string;
    gatewayHashKey?: string;
  };
  bankTransfer: {
    enabled: boolean;
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    raastId?: string;
    instructions: string;
  };
  card: {
    enabled: boolean;
    provider: 'safepay' | 'paymob' | 'stripe';
    isSandbox: boolean;
    apiKey?: string;
    secretKey?: string;
    instructions: string;
  };
  whatsappOrder: {
    enabled: boolean;
    phone: string;
  };
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  paymentMode: 'manual',
  cod: {
    enabled: true,
    instructions: 'Pay in cash or mobile wallet QR code when rider arrives at your doorstep.',
  },
  jazzcash: {
    enabled: true,
    accountTitle: '',
    accountNumber: '',
    tillNumber: '',
    instructions: 'Send payment to JazzCash mobile account or Till ID, then enter your Transaction ID (TID) below.',
    gatewayMerchantId: '',
    gatewayPassword: '',
    gatewayHashKey: '',
  },
  easypaisa: {
    enabled: true,
    accountTitle: '',
    accountNumber: '',
    tillNumber: '',
    instructions: 'Transfer to EasyPaisa wallet, then enter your Transaction ID (TID) below.',
    gatewayStoreId: '',
    gatewayHashKey: '',
  },
  bankTransfer: {
    enabled: true,
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    raastId: '',
    instructions: 'Transfer via online banking or Raast ID and enter your transaction reference number.',
  },
  card: {
    enabled: false,
    provider: 'safepay',
    isSandbox: true,
    apiKey: '',
    secretKey: '',
    instructions: 'Secure 256-bit encrypted card processing via Safepay / PayMob gateway.',
  },
  whatsappOrder: {
    enabled: true,
    phone: '',
  },
};

export interface ActivePaymentMethodInfo {
  id: 'cod' | 'jazzcash' | 'easypaisa' | 'bankTransfer' | 'card';
  name: string;
  shortName: string;
  badgeType: 'cod' | 'jazzcash' | 'easypaisa' | 'bank' | 'card';
  description: string;
}

export function getActivePaymentMethods(settings: PaymentSettings): ActivePaymentMethodInfo[] {
  const active: ActivePaymentMethodInfo[] = [];

  if (settings.cod.enabled) {
    active.push({
      id: 'cod',
      name: 'Cash on Delivery',
      shortName: 'COD',
      badgeType: 'cod',
      description: 'Pay cash to delivery rider',
    });
  }

  if (settings.jazzcash.enabled) {
    active.push({
      id: 'jazzcash',
      name: 'JazzCash',
      shortName: 'JazzCash',
      badgeType: 'jazzcash',
      description: settings.paymentMode === 'gateway' ? 'JazzCash Instant Gateway' : 'Direct JazzCash Mobile Account',
    });
  }

  if (settings.easypaisa.enabled) {
    active.push({
      id: 'easypaisa',
      name: 'EasyPaisa',
      shortName: 'EasyPaisa',
      badgeType: 'easypaisa',
      description: settings.paymentMode === 'gateway' ? 'EasyPaisa Merchant API' : 'Direct EasyPaisa Mobile Wallet',
    });
  }

  if (settings.card.enabled) {
    active.push({
      id: 'card',
      name: 'Visa / MasterCard',
      shortName: 'Cards (Visa/MC)',
      badgeType: 'card',
      description: 'Debit & Credit Card Gateway',
    });
  }

  if (settings.bankTransfer.enabled) {
    active.push({
      id: 'bankTransfer',
      name: 'Bank Transfer / Raast',
      shortName: 'Bank / 1Link',
      badgeType: 'bank',
      description: 'Direct IBAN / Raast Transfer',
    });
  }

  return active;
}

export interface StoreSettings {
  pharmacyName: string;
  tagline: string;
  pharmacyRegNumber: string;
  licensingAuthority: string;
  chiefPharmacist: string;
  rPhNumber?: string;
  licenseType?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  licenseStatus?: 'active' | 'under_renewal' | 'suspended';
  licenseCertificateImage?: string;
  helpline: string;
  uan: string;
  phone: string;
  whatsapp: string;
  supportEmail: string;
  pharmacistEmail: string;
  address: string;
  operatingHours: string;
  expressDeliveryCities: string[];
  expressDeliveryTime: string;
  standardDeliveryTime: string;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  socialLinks: {
    whatsapp: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter?: string;
    youtube?: string;
  };
  policies: {
    aboutUs: string;
    returnPolicy: string;
    privacyPolicy: string;
    termsConditions: string;
    shippingPolicy: string;
  };
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  pharmacyName: 'DawaStore',
  tagline: '100% Genuine Pakistani Pharmacy & Health Delivery',
  pharmacyRegNumber: '09412',
  licensingAuthority: 'Drug Regulatory Authority of Pakistan (DRAP) & Provincial Health Dept',
  chiefPharmacist: 'Dr. Sarah Khan, Pharm-D',
  rPhNumber: 'R.Ph # 4182 (Pharmacy Council of Pakistan)',
  licenseType: 'Form-9 (Drug Sale License - Retail Pharmacy & Digital Dispensary)',
  licenseIssueDate: '15 Jan 2022',
  licenseExpiryDate: '31 Dec 2027',
  licenseStatus: 'active',
  licenseCertificateImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
  helpline: '0800-74276',
  uan: '+92 21 111-329-278',
  phone: '+92 300 1234567',
  whatsapp: '+92 300 1234567',
  supportEmail: 'support@dawastore.pk',
  pharmacistEmail: 'pharmacist@dawastore.pk',
  address: 'Plot 42-C, Medical District, Shahrah-e-Faisal, Karachi, Pakistan',
  operatingHours: '24/7 Digital Pharmacy & Customer Care Desk',
  expressDeliveryCities: [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Rahim Yar Khan',
    'Faisalabad',
    'Multan',
    'Peshawar',
  ],
  expressDeliveryTime: '2 to 4 Hours',
  standardDeliveryTime: '24 to 48 Hours',
  freeDeliveryThreshold: 2000,
  deliveryFee: 150,
  socialLinks: {
    whatsapp: 'https://wa.me/923001234567?text=Hello,%20I%20need%20medicines%20delivered',
    facebook: 'https://facebook.com/dawastore.pk',
    instagram: 'https://instagram.com/dawastore.pk',
    linkedin: 'https://linkedin.com/company/dawastore-pakistan',
    twitter: 'https://twitter.com/dawastore_pk',
    youtube: 'https://youtube.com/@dawastorepk',
  },
  policies: {
    aboutUs: `DawaStore is Pakistan’s leading digital healthcare dispensary and licensed online pharmacy. We are committed to eradicating counterfeit medications by sourcing 100% genuine pharmaceutical products directly from DRAP-licensed manufacturers.\n\nOur temperature-controlled cold chain logistics ensure sensitive medicines, insulins, and biologicals reach your doorstep at optimal therapeutic efficacy. With on-call certified pharmacists, we verify all prescription orders to ensure patient safety and rational drug use.`,
    returnPolicy: `1. In accordance with Drug Regulatory Authority of Pakistan (DRAP) quality guidelines, opened or used medicines cannot be returned once delivered to maintain pharmacological integrity.\n2. In the rare event of damaged packaging, expired batch, or incorrect medicine delivered, please report within 48 hours of delivery along with photographic proof.\n3. Temperature-sensitive items (Insulins, Vaccines, Injections requiring 2°C to 8°C cold chain) cannot be returned once handed over unless a temperature excursion or dispatch error occurred on our part.\n4. Refunds for verified claims are processed within 3 to 5 business days to your original payment method (JazzCash, EasyPaisa, Bank, or Store Credit).`,
    privacyPolicy: `1. We treat your personal details, clinical prescriptions, doctor consult notes, and delivery addresses with the highest degree of confidentiality.\n2. Prescriptions uploaded to our platform are only accessible to certified pharmacists and licensed healthcare staff for verification purposes.\n3. We never sell, rent, or lease patient data or prescription history to third-party marketing companies.\n4. All transactions and health records are encrypted using industry-standard 256-bit SSL protocols.`,
    termsConditions: `1. Prescription Medications (Schedule G / Controlled drugs) require a verifiable prescription from a PMDC/PMC-registered medical practitioner before dispatch.\n2. Our clinical team reserves the right to withhold medication if the dosage or contraindication presents a documented health hazard, pending physician re-confirmation.\n3. Product prices are set in strict compliance with the Drug Regulatory Authority of Pakistan (DRAP) Maximum Retail Price (MRP) statutory regulations.\n4. Customers must be at least 18 years of age to order prescription items.`,
    shippingPolicy: `1. 2 to 4 Hours Express Delivery is active in designated city zones (Karachi, Lahore, Islamabad, Rawalpindi, Rahim Yar Khan, Faisalabad, Multan, Peshawar) for orders placed between 8:00 AM and 10:00 PM.\n2. Nationwide Standard Delivery across all other cities and tehsils in Pakistan takes 24 to 48 hours via TCS, Leopards, and Call Courier.\n3. Orders above Rs. 2,000 enjoy 100% Free Shipping.\n4. Cold-chain orders are packed with thermal insulation and calibrated gel ice-packs to guarantee 2°C–8°C storage throughout transit.`,
  },
};

