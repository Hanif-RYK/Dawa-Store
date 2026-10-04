import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { currentPath } = usePharmacy();
  // Cart (below lg) and product pages (below sm) have a fixed bottom bar on phones; sit above it
  const offset = currentPath === '/cart'
    ? 'bottom-24 lg:bottom-6'
    : currentPath.startsWith('/product/')
    ? 'bottom-24 sm:bottom-6'
    : 'bottom-6';

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      id="back-to-top-btn"
      onClick={scrollToTop}
      className={`fixed ${offset} left-6 z-40 p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-hidden focus:ring-4 focus:ring-emerald-300 flex items-center justify-center cursor-pointer group`}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
};
