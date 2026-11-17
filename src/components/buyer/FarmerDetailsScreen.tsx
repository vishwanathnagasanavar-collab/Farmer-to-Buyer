import React from 'react';
import { ArrowLeft, BadgeCheck, MapPin, MessageCircle, Phone, Sprout } from 'lucide-react';
import { FarmerProfile, Language, ProduceListing } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { SafeImage } from '../common/SafeImage';
import { ProduceCard } from './ProduceCard';

interface FarmerDetailsScreenProps {
  farmer: FarmerProfile;
  listings: ProduceListing[];
  language: Language;
  onBack: () => void;
  onChatWhatsApp: () => void;
  onViewDetails: (listingId: string) => void;
}

export const FarmerDetailsScreen: React.FC<FarmerDetailsScreenProps> = ({
  farmer,
  listings,
  language,
  onBack,
  onChatWhatsApp,
  onViewDetails,
}) => {
  const t = TRANSLATIONS[language];
  const farmerCrops = listings.filter(
    (l) => l.farmerId === farmer.id && l.status === 'active'
  );

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] px-3.5 rounded-xl border border-[#DCE5D7] bg-white hover:bg-[#EFF4EC] text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.backBtn}</span>
      </button>

      <section className="bg-white rounded-3xl border border-[#DCE5D7] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <SafeImage
            src={farmer.photo}
            alt={farmer.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#DCE5D7] shrink-0"
          />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
                {farmer.name}
              </h1>
              {farmer.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#176B38]">
                  <BadgeCheck className="w-4 h-4" />
                  <span>{t.verifiedFarmer}</span>
                </span>
              )}
            </div>

            <p className="text-sm text-[#252B25]/80 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#176B38]" />
              <span>
                {farmer.village}, {farmer.district}, {farmer.state} · {farmer.distanceKm} km away
              </span>
            </p>

            <p className="text-sm text-[#252B25]/80 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-[#176B38]" />
              <span>Crops: {farmer.cropsGrown.join(', ')}</span>
            </p>

            <p className="text-sm font-mono font-semibold text-[#252B25] flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#176B38]" />
              <span>+91 {farmer.mobile}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <button
            type="button"
            onClick={onChatWhatsApp}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-[#176B38] hover:bg-[#12562C] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.chatWhatsApp}</span>
          </button>
          <a
            href={`tel:+91${farmer.mobile}`}
            className="min-h-[48px] px-5 py-3 rounded-xl border border-[#176B38] text-[#176B38] hover:bg-[#EFF7F1] font-semibold text-sm inline-flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call Farmer</span>
          </a>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-[#252B25]">
          Available Crops from {farmer.name.split(' ')[0]} ({farmerCrops.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {farmerCrops.map((item) => (
            <ProduceCard
              key={item.id}
              listing={item}
              farmer={farmer}
              language={language}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
