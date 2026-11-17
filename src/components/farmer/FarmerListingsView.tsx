import React, { useState } from 'react';
import { Calendar, CheckCircle2, Edit3, MapPin, Plus, RotateCcw, Search } from 'lucide-react';
import { FarmerProfile, Language, ProduceListing } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { SafeImage } from '../common/SafeImage';

interface FarmerListingsViewProps {
  farmer: FarmerProfile;
  listings: ProduceListing[];
  language: Language;
  onAddProduce: () => void;
  onEditListing: (listingId: string) => void;
  onToggleSold: (listingId: string) => void;
}

export const FarmerListingsView: React.FC<FarmerListingsViewProps> = ({
  farmer,
  listings,
  language,
  onAddProduce,
  onEditListing,
  onToggleSold,
}) => {
  const t = TRANSLATIONS[language];
  const [filter, setFilter] = useState<'all' | 'active' | 'sold'>('all');
  const [query, setQuery] = useState('');

  const myListings = listings.filter((l) => l.farmerId === farmer.id);
  const filtered = myListings.filter((item) => {
    const matchesStatus = filter === 'all' || item.status === filter;
    const matchesQuery =
      !query.trim() ||
      item.cropName.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
            {t.navMyListings}
          </h1>
          <p className="text-sm text-[#252B25]/70 mt-0.5">
            Update stock, change price per kg, or mark sold crops anytime.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddProduce}
          className="min-h-[48px] px-5 py-3 rounded-xl bg-[#176B38] hover:bg-[#12562C] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>{t.listMyProduceBtn.replace(/^\+\s*/, '')}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="inline-flex p-1 bg-[#EBF1E7] rounded-xl self-start">
          {(['all', 'active', 'sold'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`min-h-[40px] px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-white text-[#176B38] shadow-xs'
                  : 'text-[#252B25]/75 hover:text-[#252B25]'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'active' ? t.activeLabel : t.soldLabel}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-[#252B25]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your crops..."
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-[#D4DFCE] bg-white text-sm focus:border-[#176B38] focus:outline-none"
          />
        </div>
      </div>

      {/* Listings Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8DC] p-10 text-center space-y-2">
          <p className="text-base font-semibold text-[#252B25]">No crops match this filter.</p>
          <p className="text-sm text-[#252B25]/70">
            Try switching tabs or add a new produce listing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => {
            const isSold = item.status === 'sold';
            return (
              <article
                key={item.id}
                className={`bg-white rounded-2xl border border-[#E2E8DC] overflow-hidden flex flex-col ${
                  isSold ? 'opacity-80' : ''
                }`}
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  <SafeImage
                    src={item.image}
                    alt={item.cropName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-bold text-[#252B25] truncate">
                        {item.cropName}
                      </h3>
                      <span className="font-mono font-bold text-base text-[#176B38] whitespace-nowrap tabular-nums">
                        ₹{item.pricePerKg}/kg
                      </span>
                    </div>

                    <p className="text-xs text-[#252B25]/70">
                      {item.category} ·{' '}
                      <span
                        className={`font-semibold ${
                          isSold ? 'text-[#252B25]/60' : 'text-[#176B38]'
                        }`}
                      >
                        {isSold ? t.soldLabel : t.activeLabel}
                      </span>
                    </p>

                    <div className="pt-1 space-y-1 text-sm text-[#252B25]/85">
                      <p className="font-semibold tabular-nums">
                        {t.availableQty}: {item.quantityKg} kg
                      </p>
                      <p className="text-xs text-[#252B25]/70 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.harvestDate}</span>
                      </p>
                      <p className="text-xs text-[#252B25]/70 flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-5 py-3 bg-[#F8FAF5] border-t border-[#EEF2EA] flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onEditListing(item.id)}
                    className="flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-[#D4DFCE] bg-white hover:bg-[#EFF4EC] text-sm font-semibold text-[#252B25] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{t.editBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleSold(item.id)}
                    className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isSold
                        ? 'bg-[#FEF8E2] hover:bg-[#FCEFB8] text-[#7D5802]'
                        : 'bg-[#EAF5ED] hover:bg-[#D7ECD9] text-[#176B38]'
                    }`}
                  >
                    {isSold ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        <span>{t.reactivateBtn}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.markSoldBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
