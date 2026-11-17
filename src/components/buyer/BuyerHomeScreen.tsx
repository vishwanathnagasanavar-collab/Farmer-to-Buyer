import React from 'react';
import {
  Apple,
  ArrowRight,
  Leaf,
  MapPin,
  Package,
  Search,
  Sprout,
  Wheat,
} from 'lucide-react';
import {
  BuyerProfile,
  FarmerProfile,
  Language,
  ProduceCategory,
  ProduceListing,
} from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { IMAGES } from '../../data/mockData';
import { SafeImage } from '../common/SafeImage';
import { ProduceCard } from './ProduceCard';

interface BuyerHomeScreenProps {
  buyer: BuyerProfile;
  listings: ProduceListing[];
  farmers: FarmerProfile[];
  language: Language;
  searchQuery: string;
  selectedCategory: ProduceCategory | 'All';
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onSelectCategory: (cat: ProduceCategory | 'All') => void;
  onViewDetails: (listingId: string) => void;
  onOpenExplore: () => void;
}

export const BuyerHomeScreen: React.FC<BuyerHomeScreenProps> = ({
  buyer,
  listings,
  farmers,
  language,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onSearchSubmit,
  onSelectCategory,
  onViewDetails,
  onOpenExplore,
}) => {
  const t = TRANSLATIONS[language];

  const categoryButtons: {
    id: ProduceCategory | 'All';
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'All', label: t.catAll, icon: <Sprout className="w-5 h-5" /> },
    { id: 'Vegetables', label: t.catVegetables, icon: <Leaf className="w-5 h-5" /> },
    { id: 'Fruits', label: t.catFruits, icon: <Apple className="w-5 h-5" /> },
    { id: 'Grains', label: t.catGrains, icon: <Wheat className="w-5 h-5" /> },
    { id: 'Pulses', label: t.catPulses, icon: <Sprout className="w-5 h-5" /> },
    { id: 'Other crops', label: t.catOther, icon: <Package className="w-5 h-5" /> },
  ];

  const activeListings = listings.filter((l) => {
    if (l.status !== 'active') return false;
    const matchesCat = selectedCategory === 'All' || l.category === selectedCategory;
    const farmer = farmers.find((f) => f.id === l.farmerId);
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      l.cropName.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q) ||
      (farmer && farmer.name.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Delivery Location + Search Bar */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-sm text-[#252B25]">
            <MapPin className="w-4 h-4 text-[#176B38]" />
            <span className="font-semibold">
              {buyer.location}, {buyer.district}
            </span>
            <span className="text-[#252B25]/50" aria-hidden="true">·</span>
            <span className="text-xs text-[#252B25]/70">{buyer.businessType}</span>
          </div>
          <button
            type="button"
            onClick={onOpenExplore}
            className="text-sm font-semibold text-[#176B38] hover:underline cursor-pointer min-h-[40px] px-1"
          >
            Filters & Radius
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
          className="relative flex items-center"
        >
          <Search className="w-5 h-5 text-[#176B38] absolute left-4 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="w-full min-h-[52px] pl-12 pr-28 rounded-2xl border border-[#D4DFCE] bg-white text-base text-[#252B25] placeholder:text-[#252B25]/55 focus:border-[#176B38] focus:outline-none shadow-2xs"
          />
          <button
            type="submit"
            className="absolute right-2 min-h-[40px] px-4 rounded-xl bg-[#176B38] hover:bg-[#12562C] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </section>

      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-[#DCE5D7] min-h-[220px] sm:min-h-[260px] flex items-end">
        <SafeImage
          src={IMAGES.heroFarm}
          alt="Fresh vegetables harvested directly from local Indian farms"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="relative z-10 p-6 sm:p-8 max-w-xl text-white space-y-3">
          <h1 className="font-display text-2xl sm:text-4xl font-bold leading-tight text-balance">
            {t.heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {t.heroSubtitle}
          </p>
          <button
            type="button"
            onClick={onOpenExplore}
            className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F4C542] hover:bg-[#eab932] text-[#252B25] font-bold text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>{t.browseMarketplace}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Crop Categories */}
      <section className="space-y-3.5">
        <h2 className="font-display text-xl font-bold text-[#252B25]">
          {t.categoriesTitle}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {categoryButtons.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`min-h-[72px] p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'border-[#176B38] bg-[#176B38] text-white'
                    : 'border-[#E2E8DC] bg-white text-[#252B25] hover:border-[#4CAF50]'
                }`}
              >
                {cat.icon}
                <span className="truncate max-w-full">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Nearby Produce Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#252B25]">
              {t.nearbyProduce}
            </h2>
            <p className="text-xs text-[#252B25]/70">
              {activeListings.length} harvests available within 25 km
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenExplore}
            className="min-h-[44px] px-3 text-sm font-semibold text-[#176B38] hover:underline cursor-pointer"
          >
            Filter & Sort
          </button>
        </div>

        {activeListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8DC] p-8 text-center space-y-3">
            <p className="text-base font-bold text-[#252B25]">{t.noResultsTitle}</p>
            <p className="text-sm text-[#252B25]/70">{t.noResultsSub}</p>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('All');
                onSearchChange('');
              }}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#176B38] text-white text-sm font-semibold cursor-pointer"
            >
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeListings.map((item) => (
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
      </section>
    </div>
  );
};
