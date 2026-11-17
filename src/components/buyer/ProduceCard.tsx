import React from 'react';
import { ArrowRight, BadgeCheck, MapPin } from 'lucide-react';
import { FarmerProfile, Language, ProduceListing } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { SafeImage } from '../common/SafeImage';

interface ProduceCardProps {
  listing: ProduceListing;
  farmer?: FarmerProfile;
  language: Language;
  onViewDetails: (listingId: string) => void;
}

export const ProduceCard: React.FC<ProduceCardProps> = ({
  listing,
  farmer,
  language,
  onViewDetails,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <article className="bg-white rounded-2xl border border-[#E2E8DC] overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="relative aspect-[4/3] bg-[#F2F6EE] overflow-hidden">
        <SafeImage
          src={listing.image}
          alt={listing.cropName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-[#252B25] leading-snug">
              {listing.cropName}
            </h3>
            <span className="font-mono text-lg font-bold text-[#176B38] whitespace-nowrap tabular-nums">
              ₹{listing.pricePerKg}/kg
            </span>
          </div>

          <p className="text-xs text-[#252B25]/70">
            {listing.category} · {t.harvestDate}: {listing.harvestDate}
          </p>

          <div className="pt-1 space-y-1 text-sm text-[#252B25]/85">
            <p className="font-medium flex items-center gap-1.5">
              <span className="truncate">{farmer?.name || 'Local Farmer'}</span>
              {farmer?.verified && (
                <BadgeCheck
                  className="w-4 h-4 text-[#176B38] shrink-0"
                  aria-label={t.verifiedFarmer}
                />
              )}
            </p>
            <p className="text-xs text-[#252B25]/70 flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#176B38] shrink-0" />
              <span className="truncate">
                {listing.location} · {listing.distanceKm} km
              </span>
            </p>
            <p className="text-xs font-semibold text-[#252B25] tabular-nums pt-0.5">
              {t.availableQty}: {listing.quantityKg} kg
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(listing.id)}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#176B38] hover:bg-[#12562C] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>{t.viewDetails}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
