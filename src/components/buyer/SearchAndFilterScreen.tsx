import React, { useState } from 'react';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  FarmerProfile,
  FilterState,
  Language,
  ProduceCategory,
  ProduceListing,
} from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { ProduceCard } from './ProduceCard';

interface SearchAndFilterScreenProps {
  listings: ProduceListing[];
  farmers: FarmerProfile[];
  language: Language;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
  onViewDetails: (listingId: string) => void;
}

const CATEGORIES: (ProduceCategory | 'All')[] = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Other crops',
];

export const SearchAndFilterScreen: React.FC<SearchAndFilterScreenProps> = ({
  listings,
  farmers,
  language,
  filters,
  setFilters,
  onResetFilters,
  onViewDetails,
}) => {
  const t = TRANSLATIONS[language];
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered = listings
    .filter((item) => {
      if (item.status !== 'active') return false;
      if (filters.category !== 'All' && item.category !== filters.category) return false;
      if (item.distanceKm > filters.maxDistanceKm) return false;

      const minP = filters.minPrice ? Number(filters.minPrice) : 0;
      const maxP = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
      if (item.pricePerKg < minP || item.pricePerKg > maxP) return false;

      const minQty = filters.minQuantityKg ? Number(filters.minQuantityKg) : 0;
      if (item.quantityKg < minQty) return false;

      if (filters.harvestWindow === 'today' && item.harvestDate !== '2026-11-17') {
        return false;
      }
      if (
        filters.harvestWindow === 'last3days' &&
        !['2026-11-17', '2026-11-16', '2026-11-15'].includes(item.harvestDate)
      ) {
        return false;
      }

      const q = filters.search.trim().toLowerCase();
      if (q) {
        const farmer = farmers.find((f) => f.id === item.farmerId);
        const match =
          item.cropName.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          (farmer && farmer.name.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'lowest-price') return a.pricePerKg - b.pricePerKg;
      if (filters.sortBy === 'nearest') return a.distanceKm - b.distanceKm;
      return b.harvestDate.localeCompare(a.harvestDate);
    });

  const filterControls = (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold text-[#252B25] mb-2">{t.selectCategory}</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                filters.category === cat
                  ? 'bg-[#176B38] text-white border-[#176B38]'
                  : 'bg-[#F8FAF5] text-[#252B25] border-[#DCE5D7] hover:border-[#4CAF50]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-sm font-bold mb-1.5">
          <span>Location Radius</span>
          <span className="font-mono text-[#176B38] tabular-nums">
            Within {filters.maxDistanceKm} km
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={50}
          step={5}
          value={filters.maxDistanceKm}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxDistanceKm: Number(e.target.value) }))
          }
          className="w-full accent-[#176B38]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold mb-1">Min Price (₹/kg)</label>
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
            placeholder="0"
            className="w-full min-h-[42px] px-3 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-sm font-mono tabular-nums"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Max Price (₹/kg)</label>
          <input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
            placeholder="150"
            className="w-full min-h-[42px] px-3 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-sm font-mono tabular-nums"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold mb-1">Minimum Quantity Needed (kg)</label>
        <input
          type="number"
          min={0}
          value={filters.minQuantityKg}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, minQuantityKg: e.target.value }))
          }
          placeholder="e.g. 50"
          className="w-full min-h-[42px] px-3 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-sm font-mono tabular-nums"
        />
      </div>

      <div>
        <p className="text-xs font-bold mb-2">Harvest Date</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'all', label: 'Any Date' },
            { id: 'today', label: 'Today' },
            { id: 'last3days', label: 'Last 3 Days' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  harvestWindow: opt.id as FilterState['harvestWindow'],
                }))
              }
              className={`min-h-[38px] px-2 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                filters.harvestWindow === opt.id
                  ? 'bg-[#176B38] text-white border-[#176B38]'
                  : 'bg-[#F8FAF5] text-[#252B25] border-[#DCE5D7]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onResetFilters}
        className="w-full min-h-[44px] rounded-xl border border-[#D4DFCE] text-sm font-semibold text-[#252B25] hover:bg-[#EFF4EC] cursor-pointer"
      >
        {t.clearFilters}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
            {t.navExplore}
          </h1>
          <p className="text-sm text-[#252B25]/70">
            Filter local crops by distance, price per kg, quantity, and harvest freshness.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-semibold text-[#252B25]/70">
            Sort:
          </label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as FilterState['sortBy'],
              }))
            }
            className="min-h-[44px] px-3.5 rounded-xl border border-[#D4DFCE] bg-white text-sm font-semibold text-[#252B25]"
          >
            <option value="nearest">Nearest farmer</option>
            <option value="lowest-price">Lowest price</option>
            <option value="recent">Recently listed</option>
          </select>
        </div>
      </div>

      {/* Search + Mobile Filter Trigger */}
      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-[#176B38] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder={t.searchPlaceholder}
            className="w-full min-h-[48px] pl-11 pr-4 rounded-xl border border-[#D4DFCE] bg-white text-base focus:border-[#176B38] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="xl:hidden min-h-[48px] px-4 rounded-xl border border-[#176B38] bg-white text-[#176B38] font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Split Filter Panel + Results */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <aside className="hidden xl:block xl:col-span-4 bg-white rounded-2xl border border-[#E2E8DC] p-5 sticky top-24">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EEF2EA]">
            <Filter className="w-4 h-4 text-[#176B38]" />
            <h2 className="font-display text-base font-bold text-[#252B25]">Filter Produce</h2>
          </div>
          {filterControls}
        </aside>

        <div className="xl:col-span-8 space-y-4">
          <p className="text-sm font-medium text-[#252B25]/75 tabular-nums">
            Showing {filtered.length} direct farm listings
          </p>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8DC] p-10 text-center space-y-3">
              <p className="text-base font-bold text-[#252B25]">{t.noResultsTitle}</p>
              <p className="text-sm text-[#252B25]/70">{t.noResultsSub}</p>
              <button
                type="button"
                onClick={onResetFilters}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#176B38] text-white text-sm font-semibold cursor-pointer"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filtered.map((item) => (
                <ProduceCard
                  key={item.id}
                  listing={item}
                  farmer={farmers.find((f) => f.id === item.farmerId)}
                  language={language}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end xl:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2EA]">
              <h2 className="font-display text-lg font-bold">Filter Produce</h2>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#EFF4EC]"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterControls}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full min-h-[48px] rounded-xl bg-[#176B38] text-white font-semibold text-sm cursor-pointer"
            >
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
