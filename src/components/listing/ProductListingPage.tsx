import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { ProductCard } from '../common/ProductCard';
import { ProductFiltersSidebar } from './ProductFiltersSidebar';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { EmptyState } from '../common/EmptyState';
import {
  LayoutGrid,
  List,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { SortOption } from '../../types';

interface ProductListingPageProps {
  categorySlug?: string;
  isSearch?: boolean;
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({
  categorySlug,
  isSearch = false,
}) => {
  const {
    filteredProducts,
    categories,
    filters,
    setFilters,
    resetFilters,
    navigate,
    currentPath,
    totalFilteredCount,
  } = usePharmacy();

  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Sync categorySlug and query params if provided in URL
  useEffect(() => {
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug);
      if (cat) {
        const searchStr = currentPath.includes('?')
          ? currentPath.slice(currentPath.indexOf('?') + 1)
          : (typeof window !== 'undefined' ? window.location.search : '');
        const urlParams = new URLSearchParams(searchStr);
        const subSlug = urlParams.get('sub');
        const subCat = subSlug ? cat.subcategories.find((s) => s.slug === subSlug) : undefined;
        const subSub = urlParams.get('subSub') || undefined;

        setFilters((prev) => {
          const targetSubId = subCat ? subCat.id : (prev.categoryId === cat.id ? prev.subcategoryId : undefined);
          const targetSubSub = subSub || (prev.categoryId === cat.id ? prev.subSubcategory : undefined);

          if (
            prev.categoryId === cat.id &&
            prev.subcategoryId === targetSubId &&
            prev.subSubcategory === targetSubSub
          ) {
            return prev;
          }

          return {
            ...prev,
            categoryId: cat.id,
            subcategoryId: targetSubId,
            subSubcategory: targetSubSub,
            page: 1,
          };
        });
      }
    } else if (!isSearch && !currentPath.startsWith('/category/')) {
      // Browsing all medicines catalog - clear any leftover category filters
      setFilters((prev) => {
        if (prev.categoryId || prev.subcategoryId || prev.subSubcategory) {
          return {
            ...prev,
            categoryId: undefined,
            subcategoryId: undefined,
            subSubcategory: undefined,
            page: 1,
          };
        }
        return prev;
      });
    }
  }, [categorySlug, isSearch, currentPath, categories, setFilters]);

  // Sync query parameters (e.g. ?search=, ?q=, ?ingredient=, ?filter=lowStock)
  useEffect(() => {
    const searchString = currentPath.includes('?')
      ? currentPath.slice(currentPath.indexOf('?') + 1)
      : '';
    const urlParams = new URLSearchParams(searchString);
    const q = urlParams.get('q') || urlParams.get('search');
    const ingredient = urlParams.get('ingredient');
    const filterParam = urlParams.get('filter');
    const isLowStockParam =
      filterParam === 'lowStock' ||
      urlParams.get('lowStock') === 'true' ||
      currentPath.includes('filter=lowStock') ||
      currentPath.includes('lowStock=true');

    if (isLowStockParam) {
      setFilters((prev) => (prev.lowStockOnly ? prev : { ...prev, lowStockOnly: true, page: 1 }));
    } else if (!categorySlug && !currentPath.includes('lowStock')) {
      setFilters((prev) => (prev.lowStockOnly ? { ...prev, lowStockOnly: false } : prev));
    }

    if (q) {
      setFilters((prev) => (prev.search === q ? prev : { ...prev, search: q, page: 1 }));
    }
    if (ingredient) {
      setFilters((prev) =>
        prev.ingredients?.includes(ingredient) ? prev : { ...prev, ingredients: [ingredient], page: 1 }
      );
    }
  }, [currentPath, categorySlug, setFilters]);

  const activeCategory = categories.find((c) => c.id === filters.categoryId);
  const activeSubcategory = activeCategory?.subcategories.find(
    (s) => s.id === filters.subcategoryId
  );

  const handleRemoveCategory = () => {
    setFilters((prev) => ({
      ...prev,
      categoryId: undefined,
      subcategoryId: undefined,
      subSubcategory: undefined,
      page: 1,
    }));
    navigate('/products');
  };

  const handleRemoveSubcategory = () => {
    setFilters((prev) => ({
      ...prev,
      subcategoryId: undefined,
      subSubcategory: undefined,
      page: 1,
    }));
    if (activeCategory) {
      navigate(`/category/${activeCategory.slug}`);
    } else {
      navigate('/products');
    }
  };

  const handleSelectCategoryPill = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      navigate(`/category/${cat.slug}`);
    }
  };

  const handleSelectSubcategoryPill = (subId: string) => {
    if (activeCategory) {
      const sub = activeCategory.subcategories.find((s) => s.id === subId);
      if (sub) {
        navigate(`/category/${activeCategory.slug}?sub=${sub.slug}`);
      }
    }
  };

  const handleRemoveSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: undefined,
      searchQuery: undefined,
      page: 1,
    }));
    if (activeCategory) {
      navigate(`/category/${activeCategory.slug}`);
    } else {
      navigate('/products');
    }
  };

  const handleClearAll = () => {
    resetFilters();
    navigate('/products');
  };

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / filters.limit));
  const currentPage = filters.page;

  // Active filter chips detection
  const hasActiveFilters =
    Boolean(filters.lowStockOnly) ||
    Boolean(filters.categoryId) ||
    Boolean(filters.subcategoryId) ||
    Boolean(filters.subSubcategory) ||
    (filters.brands && filters.brands.length > 0) ||
    (filters.dosageForms && filters.dosageForms.length > 0) ||
    (filters.ingredients && filters.ingredients.length > 0) ||
    filters.rxRequired !== undefined ||
    filters.inStockOnly ||
    filters.minPrice !== undefined ||
    (filters.maxPrice !== undefined && filters.maxPrice < 3500) ||
    Boolean(filters.search);

  // Breadcrumbs items
  const breadcrumbItems: { label: string; path?: string }[] = [{ label: 'All Products', path: '/products' }];
  if (filters.lowStockOnly) {
    breadcrumbItems.push({ label: 'Low Stock Alert Items' });
  } else if (activeCategory) {
    breadcrumbItems.push({
      label: activeCategory.name,
      path: `/category/${activeCategory.slug}`,
    });
  }
  if (!filters.lowStockOnly && activeSubcategory && activeCategory) {
    breadcrumbItems.push({
      label: activeSubcategory.name,
      path: `/category/${activeCategory.slug}?sub=${activeSubcategory.slug}`,
    });
  }
  if (!filters.lowStockOnly && filters.subSubcategory) {
    breadcrumbItems.push({ label: filters.subSubcategory });
  } else if (!filters.lowStockOnly && filters.search) {
    breadcrumbItems.push({ label: `Search: "${filters.search}"` });
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setJumpPageInput('');
    }
  };

  return (
    <div id="product-listing-container" className="min-h-screen bg-slate-50 py-6">
      {/* Breadcrumb Trail */}
      <Breadcrumbs items={breadcrumbItems} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        {/* Page Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {filters.lowStockOnly ? (
                <>
                  <span className="text-rose-600 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-rose-600" />
                    Low Stock Alert
                  </span>{' '}
                  Medicines
                </>
              ) : filters.search ? (
                `Search Results for "${filters.search}"`
              ) : activeCategory ? (
                activeCategory.name
              ) : (
                'All Medicines & Healthcare Essentials'
              )}
            </h1>
            {filters.lowStockOnly ? (
              <p className="text-xs sm:text-sm text-rose-600 font-semibold mt-1 flex items-center gap-1.5">
                Showing {filteredProducts.length} of {totalFilteredCount} medicines running low in stock (units &le; alert threshold)
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {filteredProducts.length} of {totalFilteredCount} verified pharmaceutical products
              </p>
            )}
          </div>

          {/* Controls: Grid/List View, Mobile Filter Trigger, Sort */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Mobile filter button */}
            <button
              id="mobile-filters-trigger-btn"
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 min-h-[40px] bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 min-h-[40px] rounded-xl shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                id="sort-products-dropdown"
                value={filters.sort}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sort: e.target.value as SortOption,
                    page: 1,
                  }))
                }
                className="text-xs font-bold text-slate-700 bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="popularity">Popularity / Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-white border border-slate-200 p-1 min-h-[40px] rounded-xl shadow-xs">
              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                className={`p-2 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  viewLayout === 'grid'
                    ? 'bg-slate-100 text-emerald-700'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                aria-label="Grid View"
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('list')}
                className={`p-2 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  viewLayout === 'list'
                    ? 'bg-slate-100 text-emerald-700'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                aria-label="List View"
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category & Subcategory Filter Pills with Horizontal Scroll Affordance */}
        <div className="pt-3 pb-1 border-b border-slate-200/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 thin-scrollbar scroll-smooth">
            {activeCategory ? (
              <>
                <button
                  type="button"
                  onClick={handleRemoveSubcategory}
                  className={`shrink-0 w-auto min-w-max flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    !filters.subcategoryId
                      ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-400/30'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <span className="whitespace-nowrap">All {activeCategory.name}</span>
                </button>
                {activeCategory.subcategories.map((sub) => {
                  const isSelected = filters.subcategoryId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSelectSubcategoryPill(sub.id)}
                      className={`shrink-0 w-auto min-w-max flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-400/30'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <span className="whitespace-nowrap">{sub.name}</span>
                    </button>
                  );
                })}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => resetFilters(false)}
                  className={`shrink-0 w-auto min-w-max flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    !filters.categoryId
                      ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-400/30'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <span className="whitespace-nowrap">All Medicines</span>
                </button>
                {categories.map((cat) => {
                  const isSelected = filters.categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategoryPill(cat.id)}
                      className={`shrink-0 w-auto min-w-max flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-400/30'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <span className="whitespace-nowrap">{cat.name}</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active:
            </span>

            {filters.lowStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold rounded-lg shrink-0 w-auto min-w-max whitespace-nowrap shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span className="whitespace-nowrap">Low Stock Alert ({totalFilteredCount})</span>
                <button
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, lowStockOnly: false, page: 1 }));
                    navigate('/products');
                  }}
                  className="hover:text-rose-950 p-0.5 rounded cursor-pointer shrink-0"
                  title="Remove Low Stock filter"
                  aria-label="Remove Low Stock filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.categoryId && activeCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg shrink-0 w-auto min-w-max whitespace-nowrap">
                <span className="whitespace-nowrap">Cat: {activeCategory.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveCategory}
                  className="hover:text-emerald-950 p-0.5 rounded cursor-pointer shrink-0"
                  title="Remove category filter"
                  aria-label="Remove category filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.subcategoryId && activeSubcategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg shrink-0 w-auto min-w-max whitespace-nowrap">
                <span className="whitespace-nowrap">Sub: {activeSubcategory.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveSubcategory}
                  className="hover:text-emerald-950 p-0.5 rounded cursor-pointer shrink-0"
                  title="Remove subcategory filter"
                  aria-label="Remove subcategory filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.subSubcategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg shrink-0 w-auto min-w-max whitespace-nowrap">
                <span className="whitespace-nowrap">Type: {filters.subSubcategory}</span>
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, subSubcategory: undefined, page: 1 }))}
                  className="hover:text-emerald-950 p-0.5 rounded cursor-pointer shrink-0"
                  title="Remove type filter"
                  aria-label="Remove type filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg shrink-0 w-auto min-w-max whitespace-nowrap">
                <span className="whitespace-nowrap">Search: "{filters.search}"</span>
                <button
                  type="button"
                  onClick={handleRemoveSearch}
                  className="hover:text-emerald-950 p-0.5 rounded cursor-pointer shrink-0"
                  title="Remove search filter"
                  aria-label="Remove search filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.rxRequired !== undefined && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold rounded-lg shrink-0 w-auto min-w-max whitespace-nowrap">
                <span className="whitespace-nowrap">{filters.rxRequired ? 'Rx Required' : 'OTC Only'}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, rxRequired: undefined, page: 1 }))
                  }
                  className="hover:text-amber-950 p-0.5 rounded cursor-pointer shrink-0"
                  title="Remove Rx filter"
                  aria-label="Remove Rx filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {((filters.minPrice !== undefined && filters.minPrice > 0) ||
              (filters.maxPrice !== undefined && filters.maxPrice < 3500)) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold rounded-lg shrink-0 w-auto min-w-max whitespace-nowrap">
                <span className="whitespace-nowrap">Price: Rs. {filters.minPrice || 0} - Rs. {filters.maxPrice || 3500}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, minPrice: undefined, maxPrice: undefined, page: 1 }))
                  }
                  className="hover:text-indigo-950 p-0.5 rounded cursor-pointer shrink-0"
                  title="Remove price filter"
                  aria-label="Remove price filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.brands?.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg shrink-0 w-auto min-w-max whitespace-nowrap"
              >
                <span className="whitespace-nowrap">{brand}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      brands: prev.brands?.filter((b) => b !== brand),
                      page: 1,
                    }))
                  }
                  className="hover:text-slate-950 p-0.5 rounded cursor-pointer shrink-0"
                  title={`Remove ${brand} filter`}
                  aria-label={`Remove ${brand} filter`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {filters.dosageForms?.map((form) => (
              <span
                key={form}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold rounded-lg shrink-0 w-auto min-w-max whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Form: {form}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      dosageForms: prev.dosageForms?.filter((f) => f !== form),
                      page: 1,
                    }))
                  }
                  className="hover:text-blue-950 p-0.5 rounded cursor-pointer shrink-0"
                  title={`Remove ${form} form filter`}
                  aria-label={`Remove ${form} form filter`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {filters.ingredients?.map((ing) => (
              <span
                key={ing}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold rounded-lg"
              >
                <span>Generic: {ing}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      ingredients: prev.ingredients?.filter((i) => i !== ing),
                      page: 1,
                    }))
                  }
                  className="hover:text-teal-950 p-0.5 rounded cursor-pointer"
                  title={`Remove ${ing} generic filter`}
                  aria-label={`Remove ${ing} generic filter`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg">
                <span>In-Stock Only</span>
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: false, page: 1 }))}
                  className="hover:text-emerald-950 p-0.5 rounded cursor-pointer"
                  title="Remove in-stock filter"
                  aria-label="Remove in-stock filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              id="clear-all-filters-btn"
              type="button"
              onClick={handleClearAll}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer ml-1 py-1 px-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Low Stock Active Notification Banner with Direct Action Buttons */}
        {filters.lowStockOnly && (
          <div
            id="low-stock-active-banner"
            className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50/50 to-rose-50 border border-rose-200 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-rose-950">Low Stock Filter Applied</span>
                  <span className="text-xs font-black bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                    {totalFilteredCount} {totalFilteredCount === 1 ? 'Product' : 'Products'}
                  </span>
                </div>
                <p className="text-xs text-rose-700 mt-0.5">
                  Showing only medicines currently running low in stock. You can clear this filter or open all categories anytime.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                id="clear-low-stock-top-btn"
                onClick={handleClearAll}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-white hover:bg-rose-100/70 text-rose-700 text-xs font-bold rounded-xl border border-rose-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Filter</span>
              </button>
              <button
                type="button"
                id="open-all-categories-top-btn"
                onClick={handleClearAll}
                className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Open All Categories</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Listing Layout: Left Sidebar + Right Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6 items-start">
          {/* Desktop Left Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <ProductFiltersSidebar />
          </div>

          {/* Right Product Grid/List */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
                <EmptyState
                  id="empty-listing-state"
                  title={filters.lowStockOnly ? 'No Low Stock Medicines' : 'No medicines found'}
                  description={
                    filters.lowStockOnly
                      ? 'All medicines in your inventory are currently well-stocked. Tap below to browse all categories with no filters.'
                      : "We couldn't find any products matching your selected filters. Try broadening your criteria or reset filters."
                  }
                  actionText="Open All Categories"
                  onAction={handleClearAll}
                />
              </div>
            ) : (
              <div>
                <div
                  className={
                    viewLayout === 'grid'
                      ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4'
                      : 'space-y-4'
                  }
                >
                  {filteredProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} layout={viewLayout} />
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Items per page selector */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Items per page:</span>
                    <select
                      value={filters.limit}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          limit: Number(e.target.value),
                          page: 1,
                        }))
                      }
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold"
                    >
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                  </div>

                  {/* Page Stepper */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                      .map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          className={`w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                            p === currentPage
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Jump to Page */}
                  <form onSubmit={handleJumpPage} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Jump to:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={jumpPageInput}
                      onChange={(e) => setJumpPageInput(e.target.value)}
                      placeholder={String(currentPage)}
                      className="w-12 px-2 py-1.5 min-h-[32px] bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 min-h-[32px] bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Go
                    </button>
                  </form>
                </div>

                {/* Bottom Section: Open All Categories & Clear Filters */}
                {filters.lowStockOnly && (
                  <div
                    id="open-all-categories-bottom-section"
                    className="mt-8 p-6 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border-2 border-emerald-300/80 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-5"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
                        <LayoutGrid className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">Explore All Medicine Categories</h3>
                          <span className="text-xs uppercase tracking-wider font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            Full Catalog
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                          You are currently viewing low stock medicines only. Click below to remove this filter and open all medicine categories without any active filter.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                      <button
                        type="button"
                        id="clear-filter-bottom-btn"
                        onClick={handleClearAll}
                        className="flex-1 md:flex-initial px-5 py-3 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4 text-slate-500" />
                        <span>Clear Filter</span>
                      </button>

                      <button
                        type="button"
                        id="open-all-categories-bottom-btn"
                        onClick={handleClearAll}
                        className="flex-1 md:flex-initial px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-600/25 cursor-pointer flex items-center justify-center gap-2 group"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span>Open All Categories</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-in Modal */}
      {isMobileFilterOpen && (
        <div
          id="mobile-filters-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMobileFilterOpen(false);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
        >
          <div className="w-full max-w-xs bg-white h-full shadow-2xl p-4 overflow-y-auto overscroll-contain">
            <ProductFiltersSidebar onCloseMobile={() => setIsMobileFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
