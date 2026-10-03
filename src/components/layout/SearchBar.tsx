import React, { useState, useEffect, useRef } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Search, X, Pill, Tag, Layers, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = 'relative flex-1 max-w-xl mx-2 sm:mx-4',
  placeholder = 'Search medicines (Panadol, Brufen), generics, brands...',
}) => {
  const { products, categories, navigate, setFilters } = usePharmacy();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();

  // Search matches
  const productMatches = trimmed.length >= 2
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.brand.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const ingredientMatches: string[] = trimmed.length >= 2
    ? Array.from<string>(
        new Set(
          products
            .filter((p) => p.genericName.toLowerCase().includes(trimmed))
            .map((p) => p.genericName)
        )
      ).slice(0, 3)
    : [];

  const categoryMatches = trimmed.length >= 2
    ? categories.flatMap((cat) => {
        const matches = [];
        if (cat.name.toLowerCase().includes(trimmed)) {
          matches.push({ type: 'category', name: cat.name, slug: cat.slug, id: cat.id });
        }
        cat.subcategories.forEach((sub) => {
          if (sub.name.toLowerCase().includes(trimmed)) {
            matches.push({ type: 'subcategory', name: `${cat.name} > ${sub.name}`, slug: sub.slug, catId: cat.id, subId: sub.id });
          }
        });
        return matches;
      }).slice(0, 3)
    : [];

  const hasSuggestions =
    productMatches.length > 0 || ingredientMatches.length > 0 || categoryMatches.length > 0;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trimmed) return;
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${slug}`);
  };

  const handleSelectIngredient = (ingredient: string) => {
    setIsOpen(false);
    setQuery('');
    setFilters((prev) => ({
      ...prev,
      ingredients: [ingredient],
      page: 1,
    }));
    navigate(`/products?ingredient=${encodeURIComponent(ingredient)}`);
  };

  const handleSelectCategory = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/category/${slug}`);
  };

  return (
    <div ref={containerRef} className={className}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          id="global-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-[13px] text-slate-800 rounded-lg border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && trimmed.length >= 2 && (
        <div
          id="search-autocomplete-dropdown"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* Products Group */}
          {productMatches.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                <span>Medicines & Products</span>
              </div>
              <div className="space-y-1">
                {productMatches.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelectProduct(prod.slug)}
                    className="w-full text-left p-2 rounded-xl hover:bg-emerald-50/70 flex items-center gap-3 transition-colors cursor-pointer group"
                  >
                    <img
                      src={prod.images[0]}
                      alt=""
                      className="w-9 h-9 object-contain bg-white rounded-lg border border-slate-100 p-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 truncate">
                        {prod.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {prod.brand} • {prod.packSize}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-700">
                        Rs. {prod.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Ingredients Group */}
          {ingredientMatches.length > 0 && (
            <div className="p-2 bg-slate-50/50">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-sky-600" />
                <span>By Active Generic Ingredient</span>
              </div>
              <div className="space-y-0.5">
                {ingredientMatches.map((ingredient, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectIngredient(ingredient)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 text-xs font-medium text-slate-700 hover:text-sky-800 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{ingredient} (Browse all formulations)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories Group */}
          {categoryMatches.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Categories</span>
              </div>
              <div className="space-y-0.5">
                {categoryMatches.map((cat, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectCategory(cat.slug)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 text-xs font-medium text-slate-700 hover:text-amber-800 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer of search dropdown */}
          <div className="p-2 bg-slate-50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleSearchSubmit()}
              className="w-full text-center py-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>See all search results for &ldquo;{query}&rdquo;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!hasSuggestions && (
            <div className="p-6 text-center text-slate-500">
              <p className="text-sm font-medium">No direct matches for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">
                Press Enter to search full catalog or browse categories.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
