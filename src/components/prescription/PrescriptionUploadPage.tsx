import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { PAKISTANI_CITIES, CITY_AREAS } from '../../data/mockData';
import {
  Upload,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Phone,
  AlertCircle,
  Trash2,
  ArrowRight,
  User,
  MapPin,
  Truck,
  Sparkles,
  Info,
  Clock,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

const SAMPLE_PRESCRIPTIONS = [
  {
    id: 'sample-1',
    title: 'Cardiology & Blood Pressure Rx',
    doctor: 'Dr. Tariq Shah, FCPS (Cardiology), NICVD Karachi',
    medicines: 'Lipiget 20mg, Concor 5mg, Lowplat 75mg',
    image:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-2',
    title: 'Diabetes & Metabolism Rx',
    doctor: 'Dr. Ayesha Siddiqui, Consultant Endocrinologist',
    medicines: 'Glucophage 500mg, Jardiance 10mg, Januvia 100mg',
    image:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-3',
    title: 'General Physician & Antibiotic Slip',
    doctor: 'Dr. Muhammad Kamran, MBBS, Shifa International',
    medicines: 'Augmentin 625mg, Panadol CF, Risek 20mg',
    image:
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80',
  },
];

export const PrescriptionUploadPage: React.FC = () => {
  const { user, createOrder, navigate, addToast, selectedCity, paymentSettings } = usePharmacy();

  // Prescription file state
  const [rxImage, setRxImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
  );
  const [rxFileName, setRxFileName] = useState<string>('Cardiology_NICVD_Prescription.jpg');
  const [isDragOver, setIsDragOver] = useState(false);

  // Fulfillment preferences
  const [fulfillmentType, setFulfillmentType] = useState<'full' | 'call_first' | 'whatsapp_quote'>(
    'whatsapp_quote'
  );
  const [allowGenerics, setAllowGenerics] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  // Patient Contact & Delivery Details
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '+92 3');
  const [city, setCity] = useState<string>(selectedCity || 'Karachi');
  const [area, setArea] = useState<string>(
    CITY_AREAS[selectedCity || 'Karachi']?.[0] || 'Clifton'
  );
  const [addressLine, setAddressLine] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa' | 'bank'>(
    paymentSettings.cod.enabled
      ? 'cod'
      : paymentSettings.jazzcash.enabled
      ? 'jazzcash'
      : paymentSettings.easypaisa.enabled
      ? 'easypaisa'
      : paymentSettings.bankTransfer.enabled
      ? 'bank'
      : 'cod'
  );

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    patientName: string;
    city: string;
  } | null>(null);

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File too large',
        message: 'Prescription image must be under 10MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRxImage(reader.result as string);
      setRxFileName(file.name);
      addToast({
        type: 'success',
        title: 'Prescription Attached',
        message: `${file.name} uploaded successfully.`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRxImage(reader.result as string);
        setRxFileName(file.name);
        addToast({
          type: 'success',
          title: 'Prescription Attached',
          message: `${file.name} uploaded.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    const availableAreas = CITY_AREAS[newCity] || [];
    setArea(availableAreas[0] || 'Central Area');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!rxImage) {
      newErrors.rxImage = 'Please upload a photo of your prescription or select a sample.';
    }
    if (!fullName.trim()) {
      newErrors.fullName = 'Patient or contact name is required';
    }
    if (!phone.trim() || phone.length < 10) {
      newErrors.phone = 'Valid Pakistani mobile number is required (e.g. +92 300 1234567)';
    }
    if (!addressLine.trim()) {
      newErrors.addressLine = 'Street address / House # is required for delivery';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast({
        type: 'error',
        title: 'Missing Details',
        message: 'Please complete all required fields and attach your prescription.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedNotes = [
        `Fulfillment Preference: ${
          fulfillmentType === 'full'
            ? 'Deliver Complete Course'
            : fulfillmentType === 'call_first'
            ? 'Call patient before dispensing'
            : 'Send WhatsApp quotation first'
        }`,
        `Generic Alternatives: ${allowGenerics ? 'Allowed (Save cost)' : 'Exact Brands Only'}`,
        notes ? `Patient Notes: ${notes}` : '',
        landmark ? `Landmark: ${landmark}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const placedOrder = await createOrder({
        items: [],
        shippingAddress: {
          id: 'rx-addr-' + Date.now(),
          fullName,
          phone,
          email: user?.email || '',
          addressLine,
          city,
          area,
          landmark,
          isDefault: false,
        },
        paymentMethod,
        prescriptionImage: rxImage || undefined,
        whatsappPhone: phone,
        notes: formattedNotes,
      });

      setOrderSuccess({
        orderNumber: placedOrder.orderNumber,
        patientName: fullName,
        city,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Could not place prescription order. Please try again or use WhatsApp.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200">
            DRAP Prescription Order Registered
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Prescription Received Successfully!
          </h1>
          <p className="text-sm font-semibold text-emerald-800 mt-1">
            Order Reference: <span className="font-mono font-black">{orderSuccess.orderNumber}</span>
          </p>

          <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed max-w-lg mx-auto">
            Thank you, <strong className="text-slate-900">{orderSuccess.patientName}</strong>.
            Your doctor’s prescription slip has been routed to our licensed pharmacist on duty in{' '}
            <strong className="text-slate-900">{orderSuccess.city}</strong>.
          </p>

          {/* Workflow Steps Card */}
          <div className="mt-6 bg-slate-50 border border-slate-200/90 rounded-2xl p-5 text-left space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              What Happens Next?
            </h4>

            <div className="flex items-start gap-3 text-xs text-slate-700">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="font-bold text-slate-900">Pharmacist Rx Audit (10-15 Mins):</strong>
                <p className="text-slate-500">
                  A registered pharmacist verifies medicine strengths, dosage safety, and stock availability.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-700">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="font-bold text-slate-900">Price & Brand Confirmation:</strong>
                <p className="text-slate-500">
                  You will receive a WhatsApp message or brief call with the exact invoice amount before dispatch.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-700">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="font-bold text-slate-900">Express Delivery to Doorstep:</strong>
                <p className="text-slate-500">
                  Medicines are sealed in temperature-controlled tamper-evident packaging and delivered within 2-4 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/923001234567?text=Hi%20DawaStore%20Pharmacist,%20I%20just%20submitted%20Prescription%20Order%20${orderSuccess.orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Message Pharmacist on WhatsApp</span>
            </a>

            <button
              onClick={() => navigate('/account?tab=orders')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <span>Track in My Account</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <span>Back to Store</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="prescription-upload-page" className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Upload Prescription', path: '/upload-prescription' },
          ]}
        />

        {/* Page Title & Trust Header */}
        <div className="mt-4 mb-8 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider backdrop-blur-xs mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>DRAP Regulated Pharmacy Service</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Order Medicines via Doctor’s Prescription
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-2.5 leading-relaxed">
              No need to search for every individual medicine. Simply upload your doctor’s prescription
              or hospital discharge slip. Our licensed Pakistani pharmacists will verify the dosage,
              confirm prices with you via WhatsApp/call, and deliver to your doorstep in 2 hours.
            </p>

            {/* Quick Feature Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-emerald-100 font-semibold pt-4 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Genuine Pakistani Brands
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                2-4 Hours Express Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                Free Pharmacist Consultation
              </span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Prescription Upload & Preferences (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Upload Doctor Slip */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Upload Prescription Slip
                    </h2>
                    <p className="text-xs text-slate-500">
                      Clear photo of doctor prescription or hospital discharge slip
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full">
                  Required
                </span>
              </div>

              {/* Upload Dropzone */}
              <div className="mt-5">
                {rxImage ? (
                  <div className="relative rounded-2xl border-2 border-emerald-500/50 bg-emerald-50/20 p-4 text-center">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={rxImage}
                        alt="Prescription preview"
                        className="w-32 h-28 object-cover rounded-xl border border-slate-200 shadow-sm shrink-0 bg-white"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Prescription Attached & Ready</span>
                        </div>
                        <p className="text-sm font-black text-slate-900 truncate mt-1">
                          {rxFileName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Pharmacist will audit dosage, frequency, and regulatory compliance.
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <label className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer underline">
                            <span>Change Photo</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setRxImage(null);
                              setRxFileName('');
                            }}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                      isDragOver
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-7 h-7 text-emerald-600" />
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-800">
                      Drag & drop your prescription here
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Supports JPG, PNG, HEIC, or PDF. Ensure doctor’s signature and medicine names are visible.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <label className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer">
                        <span>Browse from Device / Camera</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {errors.rxImage && (
                  <p className="text-xs text-rose-600 font-semibold mt-2 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {errors.rxImage}
                  </p>
                )}
              </div>

              {/* Sample Prescriptions Selector (1-click prototype testing) */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Or select a sample prescription to test:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_PRESCRIPTIONS.map((samp) => (
                    <button
                      key={samp.id}
                      type="button"
                      onClick={() => {
                        setRxImage(samp.image);
                        setRxFileName(samp.title);
                        addToast({
                          type: 'info',
                          title: 'Sample Selected',
                          message: `Loaded ${samp.title}`,
                        });
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        rxImage === samp.image
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-900 truncate">{samp.title}</div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">{samp.doctor}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp Alternative */}
              <div className="mt-4 p-3 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span className="text-xs text-teal-900 font-medium">
                    Prefer WhatsApp? Send Rx picture directly to{' '}
                    <strong className="font-bold text-teal-950">+92 300 1234567</strong>
                  </span>
                </div>
                <a
                  href="https://wa.me/923001234567?text=Hi%20DawaStore,%20I%20want%20to%20send%20my%20prescription%20photo"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-lg shrink-0 transition-colors flex items-center gap-1.5"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp Now</span>
                </a>
              </div>
            </div>

            {/* Step 2: Fulfillment & Generic Preferences */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Fulfillment & Brand Preferences
                  </h2>
                  <p className="text-xs text-slate-500">
                    Instruct our dispensing pharmacist how to fulfill your order
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {/* Fulfillment Choices */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    How would you like us to proceed?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('whatsapp_quote')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fulfillmentType === 'whatsapp_quote'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">Send WhatsApp Quote</div>
                      <p className="text-xs text-slate-500 mt-1">
                        Send medicine list & prices before confirming
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentType('call_first')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fulfillmentType === 'call_first'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">Call Me First</div>
                      <p className="text-xs text-slate-500 mt-1">
                        Pharmacist call to discuss dosage & quantities
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentType('full')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fulfillmentType === 'full'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">Dispense Full Course</div>
                      <p className="text-xs text-slate-500 mt-1">
                        Pack all prescribed items directly for express dispatch
                      </p>
                    </button>
                  </div>
                </div>

                {/* Generic Alternative Option */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <input
                    id="generic-checkbox"
                    type="checkbox"
                    checked={allowGenerics}
                    onChange={(e) => setAllowGenerics(e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="generic-checkbox" className="text-xs cursor-pointer">
                    <strong className="font-bold text-slate-900 block">
                      Allow DRAP-approved high-quality generic equivalents (Save up to 40%)
                    </strong>
                    <span className="text-slate-500">
                      If the prescribed brand is short or expensive, our pharmacist will suggest bio-equivalent alternatives with identical active ingredients (e.g. Paracetamol, Omeprazole).
                    </span>
                  </label>
                </div>

                {/* Additional Patient Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Special Instructions / Medicine notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please send only 1 strip of Concor, patient is allergic to penicillin, call after 2 PM..."
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Patient Details & Submission (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 3: Patient Contact & Address */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Patient & Delivery Details
                  </h2>
                  <p className="text-xs text-slate-500">Where should we deliver your medicines?</p>
                </div>
              </div>

              <div className="mt-5 space-y-3.5">
                {/* Patient Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient / Receiver Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Muhammad Usman"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">
                    Our pharmacist will WhatsApp or call this number with your bill.
                  </p>
                </div>

                {/* City Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <select
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Area / Sector</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Clifton, Gulberg, F-7"
                      className="w-full px-3 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address / House # *
                  </label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="e.g. Flat 402, Al-Rahim Towers, Street 5"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                  {errors.addressLine && (
                    <p className="text-xs text-rose-600 mt-1">{errors.addressLine}</p>
                  )}
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near South City Hospital"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                {/* Payment Option */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Payment on Delivery
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {paymentSettings.cod.enabled && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === 'cod'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Cash on Delivery
                      </button>
                    )}
                    {paymentSettings.jazzcash.enabled && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('jazzcash')}
                        className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === 'jazzcash'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        JazzCash
                      </button>
                    )}
                    {paymentSettings.easypaisa.enabled && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('easypaisa')}
                        className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === 'easypaisa'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Easypaisa
                      </button>
                    )}
                    {paymentSettings.bankTransfer.enabled && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === 'bank'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Bank Transfer
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Submitting to Pharmacist Queue...</span>
                  ) : (
                    <>
                      <span>Submit Prescription Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400 mt-2.5">
                  No payment required now. You will confirm the bill with our pharmacist before delivery.
                </p>
              </div>
            </div>

            {/* DRAP Guidelines Checklist Card */}
            <div className="bg-slate-100/80 rounded-3xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2.5">
              <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-600" />
                Prescription Guidelines (DRAP Pakistan):
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-xs">
                <li>Prescription must show the doctor's name, degree, and clinic stamp.</li>
                <li>Patient name and date of consultation must be legible.</li>
                <li>Medicine names, dosages (e.g. 500mg, 10mg), and durations must be visible.</li>
                <li>Government-controlled Schedule G drugs strictly require original physical slip at delivery.</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
