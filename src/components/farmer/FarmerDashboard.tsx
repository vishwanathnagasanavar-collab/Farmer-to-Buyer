import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Edit3,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Scale,
  TrendingUp,
} from 'lucide-react';
import { FarmerProfile, Language, ProduceListing } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { SafeImage } from '../common/SafeImage';

interface FarmerDashboardProps {
  farmer: FarmerProfile;
  listings: ProduceListing[];
  language: Language;
  onAddProduce: () => void;
  onEditListing: (listingId: string) => void;
  onToggleSold: (listingId: string) => void;
  onViewAllListings: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  farmer,
  listings,
  language,
  onAddProduce,
  onEditListing,
  onToggleSold,
  onViewAllListings,
}) => {
  const t = TRANSLATIONS[language];
  const myListings = listings.filter((l) => l.farmerId === farmer.id);
  const activeListings = myListings.filter((l) => l.status === 'active');
  const totalQuantity = activeListings.reduce((sum, item) => sum + item.quantityKg, 0);
  const totalEnquiries = myListings.reduce((sum, item) => sum + item.enquiriesCount, 0);

  const recentActivities = [
    {
      id: 'act-1',
      text: 'Hotel Annapurna sent an enquiry for 80 kg Tomatoes',
      time: '12 mins ago',
    },
    {
      id: 'act-2',
      text: 'Anand Fresh Mart paid ₹900 via UPI for 50 kg Tomatoes',
      time: '1 hour ago',
    },
    {
      id: 'act-3',
      text: '5 nearby buyers viewed Fresh Green Chilli',
      time: '3 hours ago',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting + Primary CTA */}
      <section className="bg-white rounded-3xl border border-[#DCE5D7] p-6 sm:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <SafeImage
            src={farmer.photo}
            alt={farmer.name}
            className="w-16 h-16 rounded-2xl object-cover border border-[#DCE5D7] shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-[#176B38]">
              {farmer.village}, {farmer.district}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
              {t.namaste}, {farmer.name.split(' ')[0]}
            </h1>
            <p className="text-sm sm:text-base text-[#252B25]/75 mt-0.5">
              {t.farmerDashSub}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddProduce}
          className="min-h-[56px] px-7 py-3.5 rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-colors shrink-0 cursor-pointer shadow-xs"
        >
          <Plus className="w-6 h-6" />
          <span>{t.listMyProduceBtn.replace(/^\+\s*/, '')}</span>
        </button>
      </section>

      {/* Metrics Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8DC] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF7F1] text-[#176B38] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#252B25]/70">{t.activeListingsLabel}</p>
            <p className="font-display text-2xl font-bold text-[#252B25] tabular-nums">
              {activeListings.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8DC] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF8E2] text-[#A17407] flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#252B25]/70">{t.totalQuantityLabel}</p>
            <p className="font-display text-2xl font-bold text-[#252B25] tabular-nums">
              {totalQuantity.toLocaleString('en-IN')} kg
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8DC] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF7F1] text-[#176B38] flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#252B25]/70">{t.buyerEnquiriesLabel}</p>
            <p className="font-display text-2xl font-bold text-[#252B25] tabular-nums">
              {totalEnquiries}
            </p>
          </div>
        </div>
      </section>

      {/* Your Active Listings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#252B25]">
            {t.yourActiveListings}
          </h2>
          <button
            type="button"
            onClick={onViewAllListings}
            className="min-h-[44px] px-3 text-sm font-semibold text-[#176B38] hover:underline cursor-pointer"
          >
            View All ({myListings.length})
          </button>
        </div>

        {activeListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8DC] p-8 text-center space-y-3">
            <p className="text-base font-semibold text-[#252B25]">
              No active listings right now.
            </p>
            <p className="text-sm text-[#252B25]/70">
              Tap "+ List My Produce" above to share your harvest with local buyers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeListings.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-[#E2E8DC] overflow-hidden flex flex-col"
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  <SafeImage
                    src={item.image}
                    alt={item.cropName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 bg-[#F2F6EE]"
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
                      <span className="text-[#176B38] font-semibold">
                        {t.activeLabel}
                      </span>
                    </p>

                    <div className="pt-1 space-y-1 text-sm text-[#252B25]/85">
                      <p className="font-semibold tabular-nums">
                        {t.availableQty}: {item.quantityKg} kg
                      </p>
                      <p className="text-xs text-[#252B25]/70 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {t.harvestDate}: {item.harvestDate}
                        </span>
                      </p>
                      <p className="text-xs text-[#252B25]/70 flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-5 py-3 bg-[#F8FAF5] border-t border-[#EEF2EA] flex items-center justify-between gap-3">
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
                    className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-[#EAF5ED] hover:bg-[#D7ECD9] text-sm font-semibold text-[#176B38] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.markSoldBtn}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-2xl border border-[#E2E8DC] p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#176B38]" />
          <h2 className="font-display text-lg font-bold text-[#252B25]">
            {t.recentActivity}
          </h2>
        </div>
        <div className="divide-y divide-[#EEF2EA]">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
            >
              <p className="text-sm font-medium text-[#252B25]">{act.text}</p>
              <span className="text-xs text-[#252B25]/60 whitespace-nowrap">{act.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
