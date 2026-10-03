import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Flame, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const DealsBanner: React.FC = () => {
  const { navigate, products, addToCart } = usePharmacy();

  // Deal countdown timer (e.g. counting down to midnight or dynamic 14h 23m 45s)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => (p.originalPrice || 0) > p.price).slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 p-6 sm:p-10 text-white shadow-xl border border-rose-800/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Deal Info & Live Countdown */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 border border-rose-400/30 rounded-full text-rose-300 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Flash Health Sale</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
              Deal of the Day: Up to 35% Off
            </h2>

            <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
              Stock up on multivitamins, first aid diagnostics, and daily healthcare essentials at guaranteed best prices in Pakistan.
            </p>

            {/* Live Countdown Timer */}
            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-200 mb-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>Offer expires in:</span>
              </div>
              <div className="flex items-center gap-3 text-center">
                <div className="w-16 py-2 bg-black/40 border border-rose-500/30 rounded-xl backdrop-blur-xs">
                  <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-rose-300 font-semibold uppercase">Hours</div>
                </div>
                <span className="text-xl font-bold text-rose-400">:</span>
                <div className="w-16 py-2 bg-black/40 border border-rose-500/30 rounded-xl backdrop-blur-xs">
                  <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-rose-300 font-semibold uppercase">Mins</div>
                </div>
                <span className="text-xl font-bold text-rose-400">:</span>
                <div className="w-16 py-2 bg-black/40 border border-rose-500/30 rounded-xl backdrop-blur-xs">
                  <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-rose-300 font-semibold uppercase">Secs</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/products?deals=true')}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer group"
              >
                <span>Browse All Discounted Medicines</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right: Featured 3 Deal Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {dealProducts.map((p) => {
              const discountPercent = p.originalPrice
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : 20;

              return (
                <div
                  key={p.id}
                  className="p-3.5 bg-white rounded-xl text-slate-800 flex flex-col justify-between shadow-md relative group border border-slate-100"
                >
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-rose-600 text-white text-xs font-bold rounded-md shadow-xs">
                    {discountPercent}% OFF
                  </span>

                  <div
                    onClick={() => navigate(`/product/${p.slug}`)}
                    className="w-full h-32 bg-white rounded-lg mb-2 overflow-hidden border border-slate-100/90 cursor-pointer"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase">
                      {p.brand}
                    </span>
                    <h4
                      onClick={() => navigate(`/product/${p.slug}`)}
                      className="text-xs font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer"
                    >
                      {p.name}
                    </h4>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-emerald-700">
                        Rs. {p.price.toLocaleString()}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          Rs. {p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(p, 1)}
                    className="mt-3 w-full py-2 bg-slate-900 hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center"
                  >
                    Claim Deal
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
