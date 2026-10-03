import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { HERO_SLIDES } from '../../data/mockData';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { navigate } = usePharmacy();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel every 5 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div
      id="hero-banner-carousel"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-2xl overflow-hidden min-h-[360px] sm:min-h-[420px] md:min-h-[460px] bg-slate-900 shadow-xl border border-slate-200/50">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col justify-center p-6 sm:p-12 md:p-16 max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs mb-4 w-fit animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{slide.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-500">
            {slide.title}
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            {slide.description}
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <button
              id={`hero-cta-${slide.id}`}
              type="button"
              onClick={() => navigate(slide.ctaLink)}
              className="px-6 sm:px-8 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer group"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-white/10 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>2-4 Hr Delivery Nationwide</span>
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Arrows */}
        <button
          id="hero-prev-btn"
          type="button"
          onClick={handlePrev}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 active:scale-90 text-white flex items-center justify-center backdrop-blur-xs transition-all duration-150 cursor-pointer border border-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          id="hero-next-btn"
          type="button"
          onClick={handleNext}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 active:scale-90 text-white flex items-center justify-center backdrop-blur-xs transition-all duration-150 cursor-pointer border border-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'w-7 bg-emerald-500'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
