import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { DOSAGE_FORMS } from '../../data/mockData';
import {
  Filter,
  X,
  RotateCcw,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';

interface ProductFiltersSidebarProps {
  onCloseMobile?: () => void;
}

export const ProductFiltersSidebar: React.FC<ProductFiltersSidebarProps> = ({
  onCloseMobile,
}) => {
  const {
    filters,
    setFilters,
    resetFilters,
    categories,
    products,
    navigate,
  } = usePharmacy();

  const handleResetFilters = () => {
    resetFilters();
    navigate('/products');
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const [brandSearch, setBrandSearch] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');

  // Extract all distinct brands and active ingredients from dataset
  const allBrands: string[] = Array.from<string>(new Set(products.map((p) => p.brand))).sort();
  const allIngredients: string[] = Array.from<string>(new Set(products.map((p) => p.genericName))).sort();

  const filteredBrands = allBrands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );
  const filteredIngredients = allIngredients.filter((i) =>
    i.toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  const selectedCategory = categories.find((c) => c.id === filters.categoryId);

  const handleToggleBrand = (brand: string) => {
    const current = filters.brands || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    setFilters((prev) => ({ ...prev, brands: updated, page: 1 }));
  };

  const handleToggleDosageForm = (form: string) => {
    const current = filters.dosageForms || [];
    const updated = current.includes(form)
      ? current.filter((f) => f !== form)
      : [...current, form];
    setFilters((prev) => ({ ...prev, dosageForms: updated, page: 1 }));
  };

  const handleToggleIngredient = (ingredient: string) => {
    const current = filters.ingredients || [];
    const updated = current.includes(ingredient)
      ? current.filter((i) => i !== ingredient)
      : [...current, ingredient];
    setFilters((prev) => ({ ...prev, ingredients: updated, page: 1 }));
  };

  return (
    <aside
      id="product-filters-sidebar"
      className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-6 shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900">Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category & Subcategory Selection */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Category
        </h4>
        <select
          value={filters.categoryId || ''}
          onChange={(e) => {
            const catId = e.target.value || undefined;
            setFilters((prev) => ({
              ...prev,
              categoryId: catId,
              subcategoryId: undefined,
              subSubcategory: undefined,
              page: 1,
            }));
            if (!catId) {
              navigate('/products');
            } else {
              const selectedCat = categories.find((c) => c.id === catId);
              if (selectedCat) {
                navigate(`/category/${selectedCat.slug}`);
              }
            }
          }}
          className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.itemCount})
            </option>
          ))}
        </select>

        {selectedCategory && (
          <div className="mt-2.5 pl-2 space-y-1 border-l-2 border-emerald-500">
            <span className="text-xs font-bold text-emerald-800 block mb-1">
              Subcategories:
            </span>
            {selectedCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  const isAlreadySelected = filters.subcategoryId === sub.id;
                  const newSubId = isAlreadySelected ? undefined : sub.id;
                  setFilters((prev) => ({
                    ...prev,
                    subcategoryId: newSubId,
                    page: 1,
                  }));
                  if (newSubId) {
                    navigate(`/category/${selectedCategory.slug}?sub=${sub.slug}`);
                  } else {
                    navigate(`/category/${selectedCategory.slug}`);
                  }
                }}
                className={`w-full text-left text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                  filters.subcategoryId === sub.id
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{sub.name}</span>
                {filters.subcategoryId === sub.id && <Check className="w-3 h-3 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Prescription Required Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Prescription Requirement
        </h4>
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, rxRequired: undefined, page: 1 }))}
            className={`py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              filters.rxRequired === undefined
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, rxRequired: true, page: 1 }))}
            className={`py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              filters.rxRequired === true
                ? 'bg-white text-rose-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rx Only
          </button>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, rxRequired: false, page: 1 }))}
            className={`py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              filters.rxRequired === false
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            OTC Only
          </button>
        </div>
      </div>

      {/* 3. Price Range Slider & Inputs */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Price Range (PKR)
          </h4>
          <span className="text-xs font-bold text-emerald-700">
            Rs. {filters.minPrice || 0} - Rs. {filters.maxPrice || 3500}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="3500"
          step="50"
          value={filters.maxPrice || 3500}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value), page: 1 }))
          }
          className="w-full accent-emerald-600 cursor-pointer"
        />

        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1">
            <span className="text-xs text-slate-400 block mb-0.5">Min (Rs.)</span>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                }))
              }
              placeholder="0"
              className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
          <span className="text-slate-400 text-xs mt-3">-</span>
          <div className="flex-1">
            <span className="text-xs text-slate-400 block mb-0.5">Max (Rs.)</span>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                }))
              }
              placeholder="3500"
              className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* 4. Dosage Form Checkboxes */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Dosage Form
        </h4>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {DOSAGE_FORMS.map((form) => {
            const isChecked = (filters.dosageForms || []).includes(form);
            return (
              <label
                key={form}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleDosageForm(form)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span>{form}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Brand/Manufacturer Checkboxes with Search-Within-Filter */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Brand / Manufacturer
        </h4>
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search brands..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
        </div>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {filteredBrands.map((brand) => {
            const isChecked = (filters.brands || []).includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleBrand(brand)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="truncate">{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Active Generic Ingredient with Search-Within-Filter */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Active Generic Ingredient
        </h4>
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search active ingredient..."
            value={ingredientSearch}
            onChange={(e) => setIngredientSearch(e.target.value)}
            className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
        </div>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {filteredIngredients.map((ingredient) => {
            const isChecked = (filters.ingredients || []).includes(ingredient);
            return (
              <label
                key={ingredient}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleIngredient(ingredient)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="truncate">{ingredient}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. Stock Filters */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-slate-800">In-Stock Only</span>
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked, page: 1 }))
            }
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Low Stock Alert Only</span>
          </span>
          <input
            type="checkbox"
            checked={!!filters.lowStockOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, lowStockOnly: e.target.checked, page: 1 }))
            }
            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
          />
        </label>
      </div>
    </aside>
  );
};
