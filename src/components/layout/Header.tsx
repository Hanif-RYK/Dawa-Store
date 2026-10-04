import React, { useEffect, useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { SearchBar } from './SearchBar';
import { MobileDrawerMenu } from './MobileDrawerMenu';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import {
  Plus,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Upload,
  User,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartCount,
    compareList,
    setIsCompareOpen,
    setIsMiniCartOpen,
    user,
    setIsAuthModalOpen,
    setAuthModalTab,
    navigate,
    currentPath,
    storeSettings,
    setIsLicenseModalOpen,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
  } = usePharmacy();
  const isProductScreen = currentPath.startsWith('/product/');

  // Mobile: the header is sticky, so hide the Upload Rx / WhatsApp row while the
  // user scrolls down and bring it back on scroll up (or near the top).
  const [isCompact, setIsCompact] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let compact = false;
    // Toggling changes the header height, and the browser's scroll anchoring then
    // nudges scrollY. Ignore scroll events until the 200ms transition settles so
    // that nudge isn't read as the user scrolling (which would flip it back).
    let lockUntil = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (performance.now() < lockUntil) {
        lastY = y;
        return;
      }
      const delta = y - lastY;
      let next = compact;
      if (y < 80) {
        next = false;
        lastY = y;
      } else if (Math.abs(delta) > 8) {
        next = delta > 0;
        lastY = y;
      }
      if (next !== compact) {
        compact = next;
        lockUntil = performance.now() + 300;
        setIsCompact(next);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header id="app-header" className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              id="main-hamburger-menu-btn"
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="hit-area w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center active:scale-95 transition-colors cursor-pointer shrink-0 group"
              aria-label="Open navigation menu and categories"
              title="Open Menu & Categories"
            >
              <Plus
                className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-90 transition-transform duration-200"
                strokeWidth={2.5}
              />
            </button>
            <button
              id="brand-logo-btn"
              type="button"
              onClick={() => navigate('/')}
              className="cursor-pointer text-left group active:scale-[0.98] transition-transform"
            >
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                Dawa<span className="text-emerald-600">Store</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block leading-tight">
                Pakistan Online Pharmacy
              </p>
            </button>
            <button
              id="header-drap-license-badge"
              type="button"
              onClick={() => setIsLicenseModalOpen(true)}
              className="hidden xl:inline-flex items-center gap-1 px-2 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-slate-200 rounded-md text-xs font-medium transition-colors cursor-pointer ml-1"
              title="View DRAP Pharmacy License"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>DRAP #{storeSettings.pharmacyRegNumber}</span>
            </button>
          </div>
          {isProductScreen ? (
            <div className="flex-1" />
          ) : (
            <div className="hidden md:flex flex-1 max-w-lg mx-3">
              <SearchBar />
            </div>
          )}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {!isProductScreen && (
              <div className="hidden md:flex items-center gap-1.5 mr-1">
                <button
                  id="header-rx-upload-btn"
                  type="button"
                  onClick={() => navigate('/upload-prescription')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Upload prescription"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden xl:inline">Upload Rx</span>
                </button>
                <a
                  id="header-whatsapp-btn"
                  href={storeSettings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#168049] hover:bg-[#126b3d] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Order via WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                  <span className="hidden xl:inline">WhatsApp</span>
                </a>
              </div>
            )}
            {compareList.length > 0 && (
              <button
                id="header-compare-btn"
                type="button"
                onClick={() => setIsCompareOpen(true)}
                className="hit-area relative p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-50 active:scale-95 rounded-lg transition-colors cursor-pointer"
                aria-label="Compare medicines"
                title="Compare medicines"
              >
                <Scale className="w-[18px] h-[18px]" />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-sky-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              </button>
            )}
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
              className="hit-area flex items-center gap-1.5 p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-50 active:scale-95 rounded-lg transition-colors cursor-pointer"
              aria-label="User account"
            >
              <User className="w-[18px] h-[18px]" />
              <div className="hidden lg:block text-left leading-none">
                <span className="block text-[11px] text-slate-400 font-medium">{user ? 'Account' : 'Sign In'}</span>
                <span className="block text-xs font-bold text-slate-700 truncate max-w-[80px]">
                  {user ? user.name.split(' ')[0] : 'My Account'}
                </span>
              </div>
            </button>
            <button
              id="header-cart-btn"
              type="button"
              onClick={() => setIsMiniCartOpen(true)}
              className="hit-area relative flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-lg transition-colors cursor-pointer ml-0.5"
              aria-label={cartCount === 1 ? 'Cart with 1 item' : `Cart with ${cartCount} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span
                    id="header-cart-badge"
                    className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-0.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            </button>
          </div>
        </div>
        {!isProductScreen && (
          <div className="md:hidden px-3 pb-1 w-full">
            <SearchBar className="relative w-full" placeholder="Search medicines, brands..." />
            {/* Collapses while scrolling down (see isCompact) */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                isCompact ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
              }`}
              inert={isCompact}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 gap-1.5 pt-1.5 pb-1">
                  <button
                    id="mobile-search-upload-rx-btn"
                    type="button"
                    onClick={() => navigate('/upload-prescription')}
                    className="hit-area-y flex items-center justify-center gap-1.5 py-2 px-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 shrink-0" />
                    <span>Upload Rx</span>
                  </button>
                  <a
                    id="mobile-search-whatsapp-btn"
                    href={storeSettings.socialLinks.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="hit-area-y flex items-center justify-center gap-1.5 py-2 px-2 bg-[#168049] hover:bg-[#126b3d] active:scale-[0.98] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 shrink-0 text-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      <MobileDrawerMenu isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} />
    </>
  );
};
