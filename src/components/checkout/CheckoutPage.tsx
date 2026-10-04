import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Address, getActivePaymentMethods } from '../../types';
import { PAKISTANI_CITIES, CITY_AREAS } from '../../data/mockData';
import { PrescriptionUploadPage } from '../prescription/PrescriptionUploadPage';
import {
  MapPin,
  FileText,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Upload,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Truck,
  Lock,
  Banknote,
  Building2,
  Copy,
  Check,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    user,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    addAddress,
    createOrder,
    navigate,
    goBack,
    addToast,
    currentPath,
    paymentSettings,
  } = usePharmacy();

  // Multi-step: 1 = Address, 2 = Prescription, 3 = Payment, 4 = Review
  const [currentStep, setCurrentStep] = useState<number>(1);

  // If URL parameter specifies step, e.g. ?step=prescription
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get('step');
      if (stepParam === 'prescription') setCurrentStep(2);
      else if (stepParam === 'payment') setCurrentStep(3);
    }
  }, []);

  const hasRxItem = cart.some((i) => i.product.isRxRequired);

  // Step 1: Address State
  const defaultAddr = user?.addresses.find((a) => a.isDefault) || user?.addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || 'new');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(user?.addresses.length === 0);

  // New Address Form fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+92 ');
  const [email, setEmail] = useState(user?.email || '');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Karachi');
  const [area, setArea] = useState('Clifton');
  const [landmark, setLandmark] = useState('');
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Step 2: Prescription State
  const [rxFile, setRxFile] = useState<string | null>(
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
  );
  const [rxFileName, setRxFileName] = useState('Doctor_Prescription_Cardiology.jpg');
  const [whatsappPhone, setWhatsappPhone] = useState(user?.phone || '+92 ');
  const [rxOption, setRxOption] = useState<'upload' | 'whatsapp' | 'later'>('upload');

  // Step 3: Payment Method
  const activeMethods = getActivePaymentMethods(paymentSettings);
  const initialPaymentMethod = (activeMethods[0]?.id || 'cod') as
    | 'cod'
    | 'card'
    | 'jazzcash'
    | 'easypaisa'
    | 'bank';

  const [paymentMethod, setPaymentMethod] = useState<
    'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'bank'
  >(initialPaymentMethod);

  // Sync if settings change
  useEffect(() => {
    if (activeMethods.length > 0 && !activeMethods.some((m) => m.id === paymentMethod)) {
      setPaymentMethod(activeMethods[0].id as any);
    }
  }, [paymentSettings]);

  const [transactionId, setTransactionId] = useState('');
  const [senderAccountPhone, setSenderAccountPhone] = useState(user?.phone || '');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
      addToast({
        type: 'info',
        title: 'Copied to Clipboard',
        message: `${text} copied!`,
      });
    }
  };

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // If cart is empty, check if user specifically came to upload a prescription
  if (cart.length === 0) {
    if (
      currentPath.includes('step=prescription') ||
      currentPath.includes('/upload-prescription') ||
      currentStep === 2
    ) {
      return <PrescriptionUploadPage />;
    }

    return (
      <div className="min-h-[70vh] bg-slate-50 py-12 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6 max-w-md">
          Please add items to your cart before proceeding to checkout, or place an order directly with your doctor’s prescription slip.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('/category/otc-medicines')}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            Browse Medicines
          </button>
          <button
            onClick={() => navigate('/upload-prescription')}
            className="px-6 py-2.5 bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            Upload Doctor Prescription
          </button>
        </div>
      </div>
    );
  }

  // Handle Address validation
  const validateAddress = () => {
    if (!isAddingNewAddress && selectedAddressId !== 'new') return true;
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!phone.trim() || phone.length < 10) errs.phone = 'Valid phone number is required';
    if (!addressLine.trim()) errs.addressLine = 'Street address / House # is required';
    if (!city) errs.city = 'City selection required';
    if (!area) errs.area = 'Area / Sector required';
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getEffectiveAddress = (): Address => {
    if (!isAddingNewAddress && selectedAddressId !== 'new') {
      const found = user?.addresses.find((a) => a.id === selectedAddressId);
      if (found) return found;
    }
    return {
      id: 'addr-temp',
      fullName,
      phone,
      email,
      addressLine,
      city,
      area,
      landmark,
      isDefault: true,
    };
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateAddress()) return;
      if (isAddingNewAddress) {
        addAddress({
          fullName,
          phone,
          email,
          addressLine,
          city,
          area,
          landmark,
          isDefault: true,
        });
        setIsAddingNewAddress(false);
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (hasRxItem && rxOption === 'upload' && !rxFile) {
        addToast({
          type: 'warning',
          title: 'Prescription Image Required',
          message: 'Please attach your prescription photo or select "Send via WhatsApp".',
        });
        return;
      }
      if (hasRxItem && rxOption === 'whatsapp' && (!whatsappPhone.trim() || whatsappPhone.length < 10)) {
        addToast({
          type: 'warning',
          title: 'WhatsApp Number Required',
          message: 'Please enter a valid WhatsApp number so our pharmacist can contact you.',
        });
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3) {
      if (paymentMethod === 'card') {
        if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
          addToast({
            type: 'error',
            title: 'Invalid Card Number',
            message: 'Please enter a valid 16-digit debit or credit card number.',
          });
          return;
        }
        if (!cardExpiry.trim()) {
          addToast({
            type: 'error',
            title: 'Expiry Required',
            message: 'Please enter your card expiry date (MM/YY).',
          });
          return;
        }
        if (!cardCvc.trim() || cardCvc.length < 3) {
          addToast({
            type: 'error',
            title: 'CVC Required',
            message: 'Please enter the 3-digit security code from the back of your card.',
          });
          return;
        }
      }
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      goBack();
    }
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const address = getEffectiveAddress();
      let finalNotes = orderNotes;
      if (transactionId) {
        finalNotes = `${finalNotes ? finalNotes + ' | ' : ''}Payment TID: ${transactionId} (Sender: ${senderAccountPhone})`;
      }
      const order = await createOrder({
        items: cart,
        shippingAddress: address,
        paymentMethod,
        prescriptionImage: rxOption === 'upload' ? rxFile || undefined : undefined,
        whatsappPhone: rxOption === 'whatsapp' ? whatsappPhone : undefined,
        notes: finalNotes,
      });

      navigate(`/order-confirmation/${order.orderNumber}`);
    } catch (e) {
      console.error(e);
      addToast({
        type: 'error',
        title: 'Order Failed',
        message: 'There was an error processing your order. Please try again.',
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const steps = [
    // shortTitle fits four steps across a phone screen without truncating
    { num: 1, title: 'Delivery Address', shortTitle: 'Address', icon: MapPin },
    { num: 2, title: 'Prescription', shortTitle: 'Rx Upload', icon: FileText },
    { num: 3, title: 'Payment Method', shortTitle: 'Payment', icon: CreditCard },
    { num: 4, title: 'Review & Place', shortTitle: 'Review', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <Breadcrumbs items={[{ label: 'Cart', path: '/cart' }, { label: 'Checkout' }]} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-8">
          Express 2-4 hour delivery by verified pharmacy couriers across Pakistan.
        </p>

        {/* Stepper Progress Bar */}
        <div className="mb-8 bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-4 relative">
            {steps.map((step) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              const Icon = step.icon;

              return (
                <div
                  key={step.num}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (step.num < currentStep) setCurrentStep(step.num);
                    }}
                    disabled={step.num > currentStep}
                    className={`w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-700 text-white shadow-xs active:scale-95'
                        : isCurrent
                        ? 'bg-emerald-950 text-white ring-4 ring-emerald-100 shadow-md'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                  <span
                    className={`text-xs font-bold mt-2 whitespace-nowrap ${
                      isCurrent
                        ? 'text-emerald-800'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="sm:hidden">{step.shortTitle}</span>
                    <span className="hidden sm:inline">{step.title}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checkout Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Wizard Steps Content */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-8">
            {/* STEP 1: Delivery Address */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>Step 1: Choose or Enter Delivery Address</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide exact address and phone number for the rider to deliver your medicines safely.
                  </p>
                </div>

                {/* Saved addresses options if available */}
                {user && user.addresses.length > 0 && !isAddingNewAddress && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Saved Delivery Locations
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(true)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Address</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {user.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                            selectedAddressId === addr.id
                              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-slate-900">
                              {addr.fullName}
                            </span>
                            {addr.isDefault && (
                              <span className="text-xs font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {addr.addressLine}, {addr.area}, {addr.city}
                          </p>
                          <p className="text-xs font-semibold text-emerald-800 mt-2 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {addr.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Address Form */}
                {isAddingNewAddress && (
                  <div className="space-y-4 pt-2">
                    {user && user.addresses.length > 0 && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(false)}
                          className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                        >
                          Cancel and select from saved addresses
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Recipient Full Name *
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Mohammad Hanif"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                        />
                        {addressErrors.fullName && (
                          <p className="text-xs text-rose-500 mt-1">{addressErrors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Mobile Phone (For Courier Call) *
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 300 1234567"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                        />
                        {addressErrors.phone && (
                          <p className="text-xs text-rose-500 mt-1">{addressErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          City *
                        </label>
                        <select
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            const areas = CITY_AREAS[e.target.value] || [];
                            setArea(areas[0] || '');
                          }}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500 font-medium"
                        >
                          {PAKISTANI_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Area / Sector / Town *
                        </label>
                        <select
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500 font-medium"
                        >
                          {(CITY_AREAS[city] || ['Main Town', 'Saddar', 'Cantt', 'DHA', 'Gulberg']).map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Complete Street Address (House / Flat / Building / Street) *
                      </label>
                      <input
                        type="text"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="e.g. House # 42-B, Street 14, Block 5"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                      />
                      {addressErrors.addressLine && (
                        <p className="text-xs text-rose-500 mt-1">{addressErrors.addressLine}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near South City Hospital or Bilawal Chowrangi"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Prescription Upload */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span>Step 2: Prescription Verification</span>
                    </h2>
                    {hasRxItem ? (
                      <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Rx Items in Cart
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        No Rx Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    As mandated by the Drug Regulatory Authority of Pakistan (DRAP), prescription drugs require licensed pharmacist verification.
                  </p>
                </div>

                {/* Option selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setRxOption('upload')}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      rxOption === 'upload'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Upload className="w-5 h-5 text-emerald-600 mb-1.5" />
                    <h4 className="text-xs font-bold text-slate-900">Upload Doctor Rx</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Attach photo or PDF</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRxOption('whatsapp')}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      rxOption === 'whatsapp'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Phone className="w-5 h-5 text-emerald-600 mb-1.5" />
                    <h4 className="text-xs font-bold text-slate-900">Send via WhatsApp</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Pharmacist will message you</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRxOption('later')}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      rxOption === 'later'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1.5" />
                    <h4 className="text-xs font-bold text-slate-900">Pharmacist Call</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Call me before dispensing</p>
                  </button>
                </div>

                {rxOption === 'upload' && (
                  <div className="p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl bg-slate-50 text-center transition-colors">
                    {rxFile ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={rxFile}
                          alt="Prescription preview"
                          className="w-48 h-36 object-cover rounded-xl border border-slate-200 shadow-xs mb-3"
                        />
                        <p className="text-xs font-bold text-slate-800">{rxFileName}</p>
                        <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                          ✓ Attached successfully (Pharmacist will audit)
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setRxFile(null);
                            setRxFileName('');
                          }}
                          className="mt-3 text-xs text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove and upload another photo
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          Drag and drop doctor’s prescription here
                        </p>
                        <p className="text-xs text-slate-500 mt-1 mb-4">
                          Supported formats: JPG, PNG, PDF (Max size: 10MB)
                        </p>
                        <label className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs">
                          <span>Browse Files / Camera</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setRxFileName(file.name);
                                setRxFile(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {rxOption === 'whatsapp' && (
                  <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-emerald-900">
                      WhatsApp Prescription Submission
                    </h4>
                    <p className="text-xs text-slate-600">
                      Our registered pharmacist desk will message you directly on WhatsApp to confirm the prescription before releasing your order.
                    </p>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Payment Method */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span>Step 3: Select Payment Method</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose how you would like to pay for your delivery.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Notice if no payment method enabled */}
                  {activeMethods.length === 0 && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                      No payment methods are currently enabled by store administrator. Please contact pharmacy support.
                    </div>
                  )}

                  {/* COD */}
                  {paymentSettings.cod.enabled && (
                    <label
                      className={`flex items-start gap-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {paymentSettings.cod.instructions || 'Pay in cash or QR code when our rider arrives at your doorstep.'}
                        </p>
                      </div>
                    </label>
                  )}

                  {/* JAZZCASH */}
                  {paymentSettings.jazzcash.enabled && (
                    <label
                      className={`flex items-start gap-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        paymentMethod === 'jazzcash'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'jazzcash'}
                        onChange={() => setPaymentMethod('jazzcash')}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              JazzCash
                            </span>
                            <div className="h-4 px-1.5 bg-[#171717] rounded flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-[#D81E27] flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-[#FFD200]"></div>
                              </div>
                              <span className="text-[9px] font-black text-white">Jazz<span className="text-[#D81E27]">Cash</span></span>
                            </div>
                          </div>
                          <span className="text-xs font-bold px-1.5 py-0.5 bg-rose-100 text-rose-900 rounded">
                            Instant Mobile Wallet
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Direct mobile transfer to pharmacy account or automated prompt.
                        </p>

                        {/* JazzCash Details when selected */}
                        {paymentMethod === 'jazzcash' && (
                          <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-3">
                            {(paymentSettings.paymentMode === 'manual' || paymentSettings.paymentMode === 'both') && (
                              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                  Pharmacy JazzCash Receiving Account:
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                    <span className="text-slate-500">Account Title:</span>
                                    <span className="font-bold text-slate-900">{paymentSettings.jazzcash.accountTitle}</span>
                                  </div>
                                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                    <span className="text-slate-500">JazzCash Number:</span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-rose-600">{paymentSettings.jazzcash.accountNumber}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(paymentSettings.jazzcash.accountNumber, 'jc-num');
                                        }}
                                        className="p-1 text-slate-400 hover:text-slate-700"
                                      >
                                        {copiedField === 'jc-num' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {paymentSettings.jazzcash.tillNumber && (
                                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs">
                                    <span className="text-slate-500">Till ID:</span>
                                    <span className="font-bold text-slate-900">{paymentSettings.jazzcash.tillNumber}</span>
                                  </div>
                                )}

                                <p className="text-xs text-slate-500">
                                  Please transfer Rs. {cartTotal.toLocaleString()} to the number above via JazzCash App or *786#, then enter your details:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                      Your Sender JazzCash Number
                                    </label>
                                    <input
                                      type="text"
                                      value={senderAccountPhone}
                                      onChange={(e) => setSenderAccountPhone(e.target.value)}
                                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                      Transaction ID (TID from 8558 SMS)
                                    </label>
                                    <input
                                      type="text"
                                      value={transactionId}
                                      onChange={(e) => setTransactionId(e.target.value)}
                                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {paymentSettings.paymentMode === 'gateway' && (
                              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                                <p className="font-semibold text-slate-900 mb-1">Automated JazzCash Checkout</p>
                                <p>You will receive an MPIN authorization prompt on your phone to approve the payment automatically.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  )}

                  {/* EASYPAISA */}
                  {paymentSettings.easypaisa.enabled && (
                    <label
                      className={`flex items-start gap-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        paymentMethod === 'easypaisa'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'easypaisa'}
                        onChange={() => setPaymentMethod('easypaisa')}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              Easypaisa
                            </span>
                            <div className="h-4 px-1.5 bg-white border border-slate-200 rounded flex items-center gap-1">
                              <span className="text-[#00A859] font-black text-[9px]">easy<span className="text-slate-900">paisa</span></span>
                            </div>
                          </div>
                          <span className="text-xs font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-900 rounded">
                            Mobile Wallet
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Direct transfer to pharmacy Easypaisa account or merchant gateway.
                        </p>

                        {/* Easypaisa Details when selected */}
                        {paymentMethod === 'easypaisa' && (
                          <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-3">
                            {(paymentSettings.paymentMode === 'manual' || paymentSettings.paymentMode === 'both') && (
                              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                  Pharmacy Easypaisa Receiving Account:
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                    <span className="text-slate-500">Account Title:</span>
                                    <span className="font-bold text-slate-900">{paymentSettings.easypaisa.accountTitle}</span>
                                  </div>
                                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                    <span className="text-slate-500">Easypaisa Number:</span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-[#00A859]">{paymentSettings.easypaisa.accountNumber}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(paymentSettings.easypaisa.accountNumber, 'ep-num');
                                        }}
                                        className="p-1 text-slate-400 hover:text-slate-700"
                                      >
                                        {copiedField === 'ep-num' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <p className="text-xs text-slate-500">
                                  Please transfer Rs. {cartTotal.toLocaleString()} to the Easypaisa number above, then enter your details:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                      Your Sender Easypaisa Number
                                    </label>
                                    <input
                                      type="text"
                                      value={senderAccountPhone}
                                      onChange={(e) => setSenderAccountPhone(e.target.value)}
                                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                      Transaction ID (TID from 3737 SMS)
                                    </label>
                                    <input
                                      type="text"
                                      value={transactionId}
                                      onChange={(e) => setTransactionId(e.target.value)}
                                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  )}

                  {/* BANK TRANSFER / RAAST */}
                  {paymentSettings.bankTransfer.enabled && (
                    <label
                      className={`flex items-start gap-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        paymentMethod === 'bank'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              Direct Bank Transfer / Raast (1Link)
                            </span>
                            <Building2 className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-xs font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-900 rounded">
                            Any Bank in PK
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Transfer via Meezan, HBL, Alfalah, Standard Chartered or any mobile banking app.
                        </p>

                        {/* Bank Details when selected */}
                        {paymentMethod === 'bank' && (
                          <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-3">
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Pharmacy Bank Account Information:
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                  <span className="text-slate-500 block text-xs">Bank Name:</span>
                                  <span className="font-bold text-slate-900">{paymentSettings.bankTransfer.bankName}</span>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg">
                                  <span className="text-slate-500 block text-xs">Account Title:</span>
                                  <span className="font-bold text-slate-900">{paymentSettings.bankTransfer.accountTitle}</span>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg">
                                  <span className="text-slate-500 block text-xs">Account Number:</span>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900 font-mono">{paymentSettings.bankTransfer.accountNumber}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(paymentSettings.bankTransfer.accountNumber, 'bank-acc');
                                      }}
                                      className="p-1 text-slate-400 hover:text-slate-700"
                                    >
                                      {copiedField === 'bank-acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg">
                                  <span className="text-slate-500 block text-xs">IBAN:</span>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900 font-mono text-xs">{paymentSettings.bankTransfer.iban}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(paymentSettings.bankTransfer.iban, 'bank-iban');
                                      }}
                                      className="p-1 text-slate-400 hover:text-slate-700"
                                    >
                                      {copiedField === 'bank-iban' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-2">
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                  Your Transfer Reference / Sender Name / TID
                                </label>
                                <input
                                  type="text"
                                  value={transactionId}
                                  onChange={(e) => setTransactionId(e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  )}

                  {/* DEBIT / CREDIT CARDS */}
                  {paymentSettings.card.enabled && (
                    <label
                      className={`flex items-start gap-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">
                            Credit / Debit Card (Visa / MasterCard)
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="px-1.5 py-0.5 text-xs font-bold bg-[#1A1F71] text-white rounded">VISA</span>
                            <span className="px-1.5 py-0.5 text-xs font-bold bg-[#EB001B] text-white rounded">MasterCard</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Encrypted 256-bit secure checkout via {paymentSettings.card.provider.toUpperCase()} Gateway.
                        </p>

                        {paymentMethod === 'card' && (
                          <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                Card Number
                              </label>
                              <input
                                type="text"
                                placeholder="4242 •••• •••• 4242"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                  Expiry (MM/YY)
                                </label>
                                <input
                                  type="text"
                                  placeholder="12/28"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                  CVC / CVV
                                </label>
                                <input
                                  type="text"
                                  placeholder="892"
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value)}
                                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                Name on Card
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Mohammad Hanif"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  )}
                </div>

                {/* Delivery rider instructions */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Instructions for Pharmacist or Rider (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Please ring doorbell twice, deliver medicines before 6 PM, or keep cold."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Order Review */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Step 4: Final Order Review</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Please review your medicine quantities, delivery destination, and payment method before placing order.
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        Delivery To
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    {(() => {
                      const addr = getEffectiveAddress();
                      return (
                        <div className="space-y-0.5 text-slate-600">
                          <p className="font-bold text-slate-900">{addr.fullName}</p>
                          <p>{addr.addressLine}</p>
                          <p>{addr.area}, {addr.city}</p>
                          <p className="font-semibold text-emerald-800">{addr.phone}</p>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        Payment
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-bold text-slate-900 capitalize">
                      {paymentMethod === 'cod'
                        ? 'Cash on Delivery (COD)'
                        : paymentMethod === 'card'
                        ? 'Credit / Debit Card'
                        : paymentMethod === 'jazzcash'
                        ? 'JazzCash Wallet / Transfer'
                        : paymentMethod === 'easypaisa'
                        ? 'Easypaisa Mobile Wallet'
                        : 'Direct Bank Transfer / Raast'}
                    </p>
                    {transactionId && (
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        Ref / TID: {transactionId}
                      </p>
                    )}
                    <p className="text-slate-500 mt-1">
                      Estimated Delivery: Today within 2-4 hours.
                    </p>
                  </div>
                </div>

                {/* Items preview list */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Ordered Medicines ({cart.reduce((s, i) => s + i.quantity, 0)})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {cart.map((item) => (
                      <div key={item.product.id} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-10 h-10 object-contain rounded bg-slate-50 p-0.5 border"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.product.name}</p>
                            <p className="text-slate-500">{item.product.packSize} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-800">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons (Back & Next) */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <button
                id="checkout-back-btn"
                type="button"
                onClick={handlePrevStep}
                className="w-full sm:w-auto px-5 py-3 min-h-[44px] bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{currentStep === 1 ? 'Back to Cart' : 'Previous Step'}</span>
              </button>

              {currentStep < 4 ? (
                <button
                  id="checkout-next-btn"
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Step {currentStep + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="checkout-place-order-btn"
                  type="button"
                  disabled={isPlacingOrder}
                  onClick={handlePlaceOrder}
                  className="w-full sm:w-auto px-8 py-3.5 min-h-[48px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isPlacingOrder ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>Place Order (Rs. {cartTotal.toLocaleString()})</span>
                </button>
              )}
            </div>
          </div>

          {/* Sticky Order Breakdown Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-slate-900">
                  Rs. {cartSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Express Courier Delivery</span>
                <span className="font-semibold text-slate-900">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `Rs. ${cartDeliveryFee}`
                  )}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Promotional Discount</span>
                  <span>- Rs. {cartDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-black text-slate-900">
                <span>Payable Amount</span>
                <span className="text-emerald-700 text-lg">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Delivery: Today within 2-4 Hours</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cold Chain Packaged for Sensitive Drugs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
