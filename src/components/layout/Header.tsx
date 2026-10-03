import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { SearchBar } from './SearchBar';
import { MegaMenu } from './MegaMenu';
import { MobileDrawerMenu } from './MobileDrawerMenu';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import {
  ShoppingBag,
  User,
  Heart,
  Plus,
  MapPin,
  Upload,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { PAKISTANI_CITIES } from '../../data/mockData';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    compareList,
    setIsCompareOpen,
    setIsMiniCartOpen,
    user,
    setIsAuthModalOpen,
    setAuthModalTab,
    navigate,
    currentPath,
    selectedCity,
    setSelectedCity,
    storeSettings,
    setIsLicenseModalOpen,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
  } = usePharmacy();

  const isProductScreen = currentPath.startsWith('/product/');

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200/80">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Plus Icon Menu Trigger, Brand Logo & City Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Plus Icon Hamburger Menu Button */}
          <button
            id="main-hamburger-menu-btn"
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center shadow-md hover:shadow-emerald-200/80 hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0 group"
            aria-label="Open navigation menu and categories"
            title="Open Menu & Categories"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" strokeWidth={3} />
          </button>

          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            type="button"
            onClick={() => navigate('/')}
            className="cursor-pointer text-left group active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Dawa<span className="text-emerald-600">Store</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-wide hidden sm:block">
              100% Genuine Pakistani Pharmacy
            </p>
          </button>

          {/* City Delivery Selector */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200/70 px-2.5 py-1.5 rounded-xl transition-colors border border-slate-200/80 ml-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-xs text-slate-500 font-normal">To:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-bold cursor-pointer focus:outline-hidden"
              title="Deliver to City"
            >
              {PAKISTANI_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* DRAP Pharmacy License Verification Badge */}
          <button
            id="header-drap-license-badge"
            type="button"
            onClick={() => setIsLicenseModalOpen(true)}
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 hover:text-emerald-700 border border-slate-200/80 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs group ml-0.5"
            title="Click to view official DRAP Pharmacy License and Government verification"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
            <span>DRAP Lic #{storeSettings.pharmacyRegNumber}</span>
          </button>
        </div>

        {/* Center: Desktop Search Bar & Direct Quick CTAs Below Search (Hidden on product detail screen) */}
        {!isProductScreen ? (
          <div className="hidden md:flex flex-col flex-1 max-w-xl mx-2 sm:mx-4">
            <SearchBar />
            <div className="flex items-center justify-between gap-3 mt-1.5 px-0.5 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 overflow-hidden text-xs">
                <span className="text-slate-400 font-medium">Popular:</span>
                <button
                  type="button"
                  onClick={() => navigate('/products?search=Panadol')}
                  className="text-slate-600 hover:text-emerald-700 font-semibold hover:underline cursor-pointer"
                >
                  Panadol
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => navigate('/products?search=Brufen')}
                  className="text-slate-600 hover:text-emerald-700 font-semibold hover:underline cursor-pointer"
                >
                  Brufen
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => navigate('/products?search=Risek')}
                  className="text-slate-600 hover:text-emerald-700 font-semibold hover:underline cursor-pointer"
                >
                  Risek
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => navigate('/products?search=Surbex')}
                  className="text-slate-600 hover:text-emerald-700 font-semibold hover:underline cursor-pointer"
                >
                  Surbex Z
                </button>
              </div>
              <a
                id="desktop-search-whatsapp-btn"
                href={storeSettings.socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer text-xs shrink-0"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right Actions: Prescription upload, Wishlist, Compare, Account, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Quick Prescription Upload Button (Hidden on product detail screen) */}
          {!isProductScreen && (
            <button
              id="header-rx-upload-btn"
              type="button"
              onClick={() => navigate('/upload-prescription')}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200/80 transition-all cursor-pointer shadow-xs"
              title="Upload prescription for rapid order processing"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">Upload Doctor Rx</span>
              <span className="xl:hidden">Upload Rx</span>
            </button>
          )}

          {/* Compare Button */}
          {compareList.length > 0 && (
            <button
              id="header-compare-btn"
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2 sm:p-2.5 text-slate-700 hover:text-sky-700 hover:bg-slate-100 active:scale-95 rounded-xl transition-all cursor-pointer"
              aria-label="Compare medicines"
              title="Compare medicines"
            >
              <Scale className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sky-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {compareList.length}
              </span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            id="header-wishlist-btn"
            type="button"
            onClick={() => {
              if (user) {
                navigate('/account?tab=wishlist');
              } else {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }
            }}
            className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 hover:text-rose-600 hover:bg-slate-100 active:scale-95 rounded-xl transition-all cursor-pointer hidden xs:flex"
            aria-label="View saved wishlist"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Account Button */}
          <button
            id="header-account-btn"
            type="button"
            onClick={() => {
              if (user) {
                navigate('/account');
              } else {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }
            }}
            className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 min-w-[44px] min-h-[44px] text-slate-700 hover:text-emerald-700 hover:bg-slate-100 active:scale-95 rounded-xl transition-all cursor-pointer"
            aria-label="User account"
          >
            <User className="w-5 h-5" />
            <div className="hidden lg:block text-left text-xs">
              <span className="block text-xs text-slate-400 font-medium">
                {user ? 'Signed In' : 'Sign In'}
              </span>
              <span className="block font-bold text-slate-800 truncate max-w-[90px]">
                {user ? user.name.split(' ')[0] : 'My Account'}
              </span>
            </div>
          </button>

          {/* Cart Icon with Live Item Count Badge */}
          <button
            id="header-cart-btn"
            type="button"
            onClick={() => setIsMiniCartOpen(true)}
            className="relative flex items-center justify-center gap-2 p-2 sm:px-3.5 sm:py-2 min-w-[44px] min-h-[44px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-95 text-white rounded-xl shadow-xs transition-all cursor-pointer group"
            aria-label={`Cart with ${cartCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  id="header-cart-badge"
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50"
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold tracking-wide">
              Cart
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row with Action Buttons Directly Below Search (Hidden on product detail screen) */}
      {!isProductScreen && (
        <div className="md:hidden px-3 pb-2.5 pt-0.5 w-full space-y-2">
          <SearchBar
            className="relative w-full"
            placeholder="Search medicines (Panadol, Brufen), brands..."
          />
          {/* Directly Below Search Bar: Upload Prescription & Order via WhatsApp */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              id="mobile-search-upload-rx-btn"
              type="button"
              onClick={() => navigate('/upload-prescription')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 shrink-0" />
              <span className="truncate">Upload Rx</span>
            </button>
            <a
              id="mobile-search-whatsapp-btn"
              href="https://wa.me/923001234567?text=Hello,%20I%20want%20to%20order%20medicines"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 min-h-[44px] bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0 text-white" />
              <span className="truncate">WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Desktop Mega Menu Bar */}
      <MegaMenu />

      {/* Mobile Drawer */}
      <MobileDrawerMenu
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </header>
  );
};
