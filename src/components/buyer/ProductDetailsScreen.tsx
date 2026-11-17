import React from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CreditCard,
  MapPin,
  MessageCircle,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { FarmerProfile, Language, ProduceListing } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { SafeImage } from '../common/SafeImage';
import { ProduceCard } from './ProduceCard';

interface ProductDetailsScreenProps {
  listing: ProduceListing;
  farmer: FarmerProfile;
  similarListings: ProduceListing[];
  allFarmers: FarmerProfile[];
  language: Language;
  onBack: () => void;
  onChatWhatsApp: () => void;
  onPayNow: () => void;
  onOpenFarmerDetails: (farmerId: string) => void;
  onViewDetails: (listingId: string) => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  listing,
  farmer,
  similarListings,
  allFarmers,
  language,
  onBack,
  onChatWhatsApp,
  onPayNow,
  onOpenFarmerDetails,
  onViewDetails,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] px-3.5 rounded-xl border border-[#DCE5D7] bg-white hover:bg-[#EFF4EC] text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.backBtn}</span>
      </button>

      {/* Contiguous PDP Module */}
      <div className="bg-white rounded-3xl border border-[#DCE5D7] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 bg-[#F2F6EE] min-h-[280px] sm:min-h-[360px]">
            <SafeImage
              src={listing.image}
              alt={listing.cropName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#176B38]">
                  {listing.category} · {listing.distanceKm} km away
                </p>
                <div className="flex flex-wrap items-baseline justify-between gap-3 mt-1">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
                    {listing.cropName}
                  </h1>
                  <div className="text-right">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[#176B38] tabular-nums">
                      ₹{listing.pricePerKg}/kg
                    </span>
                    {listing.marketRatePerKg && (
                      <p className="text-xs text-[#252B25]/60 tabular-nums">
                        Retail mandi rate: ~₹{listing.marketRatePerKg}/kg
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#176B38] bg-[#EFF7F1] px-3.5 py-2.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{t.directPriceNote}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E5ECE0]">
                  <p className="text-xs text-[#252B25]/65 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#176B38]" />
                    <span>{t.availableQty}</span>
                  </p>
                  <p className="font-mono text-lg font-bold text-[#252B25] tabular-nums mt-0.5">
                    {listing.quantityKg} kg
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E5ECE0]">
                  <p className="text-xs text-[#252B25]/65 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#176B38]" />
                    <span>{t.harvestDate}</span>
                  </p>
                  <p className="font-mono text-base font-bold text-[#252B25] tabular-nums mt-0.5">
                    {listing.harvestDate}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#252B25]/85 leading-relaxed">
                {listing.description}
              </p>

              {/* Clickable Farmer Summary */}
              <button
                type="button"
                onClick={() => onOpenFarmerDetails(farmer.id)}
                className="w-full p-3.5 rounded-2xl border border-[#DCE5D7] bg-[#F8FAF5] hover:bg-[#EFF5EB] flex items-center gap-3.5 text-left transition-colors cursor-pointer"
              >
                <SafeImage
                  src={farmer.photo}
                  alt={farmer.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#DCE5D7] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm text-[#252B25] truncate">
                      {farmer.name}
                    </span>
                    {farmer.verified && (
                      <BadgeCheck
                        className="w-4 h-4 text-[#176B38] shrink-0"
                        aria-label={t.verifiedFarmer}
                      />
                    )}
                  </div>
                  <p className="text-xs text-[#252B25]/70 flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {farmer.village}, {farmer.district} · {farmer.distanceKm} km away
                    </span>
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#176B38] whitespace-nowrap">
                  View Farm
                </span>
              </button>
            </div>

            {/* Two Primary Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onChatWhatsApp}
                className="min-h-[52px] px-4 py-3 rounded-2xl border-2 border-[#176B38] bg-white hover:bg-[#EFF7F1] text-[#176B38] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t.chatWhatsApp}</span>
              </button>

              <button
                type="button"
                onClick={onPayNow}
                className="min-h-[52px] px-4 py-3 rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CreditCard className="w-5 h-5" />
                <span>{t.payNow}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Produce Nearby */}
      {similarListings.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-[#252B25]">
            {t.similarProduce}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similarListings.slice(0, 3).map((item) => (
              <ProduceCard
                key={item.id}
                listing={item}
                farmer={allFarmers.find((f) => f.id === item.farmerId)}
                language={language}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
