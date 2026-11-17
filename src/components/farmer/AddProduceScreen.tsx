import React, { useState } from 'react';
import {
  Apple,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Leaf,
  Package,
  Sprout,
  Wheat,
} from 'lucide-react';
import { FarmerProfile, Language, ProduceCategory, ProduceListing } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { CROP_PRESET_IMAGES, IMAGES } from '../../data/mockData';
import { SafeImage } from '../common/SafeImage';

interface AddProduceScreenProps {
  farmer: FarmerProfile;
  language: Language;
  editingListing?: ProduceListing | null;
  onPublish: (listing: Omit<ProduceListing, 'id' | 'createdAt' | 'enquiriesCount'>) => void;
  onUpdate: (listing: ProduceListing) => void;
  onDone: () => void;
  onCancel: () => void;
}

const CATEGORIES: { value: ProduceCategory; labelKey: string; icon: React.ReactNode }[] = [
  { value: 'Vegetables', labelKey: 'catVegetables', icon: <Leaf className="w-5 h-5" /> },
  { value: 'Fruits', labelKey: 'catFruits', icon: <Apple className="w-5 h-5" /> },
  { value: 'Grains', labelKey: 'catGrains', icon: <Wheat className="w-5 h-5" /> },
  { value: 'Pulses', labelKey: 'catPulses', icon: <Sprout className="w-5 h-5" /> },
  { value: 'Other crops', labelKey: 'catOther', icon: <Package className="w-5 h-5" /> },
];

const QUICK_CROPS = ['Tomatoes', 'Onions', 'Potatoes', 'Fresh Green Chilli', 'Bananas', 'Wheat'];

export const AddProduceScreen: React.FC<AddProduceScreenProps> = ({
  farmer,
  language,
  editingListing,
  onPublish,
  onUpdate,
  onDone,
  onCancel,
}) => {
  const t = TRANSLATIONS[language];
  const isEdit = Boolean(editingListing);

  const [image, setImage] = useState(editingListing?.image || IMAGES.tomatoes);
  const [category, setCategory] = useState<ProduceCategory>(
    editingListing?.category || 'Vegetables'
  );
  const [cropName, setCropName] = useState(editingListing?.cropName || '');
  const [quantityKg, setQuantityKg] = useState(
    editingListing ? String(editingListing.quantityKg) : '100'
  );
  const [pricePerKg, setPricePerKg] = useState(
    editingListing ? String(editingListing.pricePerKg) : '20'
  );
  const [harvestDate, setHarvestDate] = useState(
    editingListing?.harvestDate || '2026-11-17'
  );
  const [location, setLocation] = useState(
    editingListing?.location || `${farmer.village}, ${farmer.district}`
  );
  const [description, setDescription] = useState(editingListing?.description || '');
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Math.max(1, Number(quantityKg) || 50);
    const price = Math.max(1, Number(pricePerKg) || 20);
    const finalName = cropName.trim() || 'Fresh Farm Produce';

    if (editingListing) {
      onUpdate({
        ...editingListing,
        cropName: finalName,
        category,
        quantityKg: qty,
        pricePerKg: price,
        harvestDate,
        location: location.trim() || `${farmer.village}, ${farmer.district}`,
        description:
          description.trim() ||
          `Freshly harvested ${finalName} directly from ${farmer.name}'s farm in ${farmer.village}.`,
        image,
      });
      setPublishedSuccess(true);
    } else {
      onPublish({
        farmerId: farmer.id,
        cropName: finalName,
        category,
        quantityKg: qty,
        pricePerKg: price,
        marketRatePerKg: Math.round(price * 1.4),
        harvestDate,
        location: location.trim() || `${farmer.village}, ${farmer.district}`,
        village: farmer.village,
        district: farmer.district,
        distanceKm: farmer.distanceKm,
        description:
          description.trim() ||
          `Freshly harvested ${finalName} directly from ${farmer.name}'s farm in ${farmer.village}.`,
        image,
        status: 'active',
      });
      setPublishedSuccess(true);
    }
  };

  if (publishedSuccess) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-[#DCE5D7] p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#EAF5ED] text-[#176B38] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
            {isEdit ? 'Listing Updated!' : t.publishSuccessTitle}
          </h1>
          <p className="text-base text-[#252B25]/75">{t.publishSuccessSub}</p>
        </div>

        <div className="bg-[#F8FAF5] rounded-2xl border border-[#E2E8DC] p-4 flex items-center gap-4 text-left">
          <SafeImage
            src={image}
            alt={cropName || 'Produce'}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-base text-[#252B25] truncate">
              {cropName || 'Fresh Farm Produce'}
            </p>
            <p className="text-sm font-mono font-semibold text-[#176B38] tabular-nums">
              ₹{pricePerKg}/kg · {quantityKg} kg available
            </p>
            <p className="text-xs text-[#252B25]/65 truncate">{location}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onDone}
            className="min-h-[52px] px-5 py-3 rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-semibold text-base transition-colors cursor-pointer"
          >
            {t.goToDashboardBtn}
          </button>
          {!isEdit && (
            <button
              type="button"
              onClick={() => {
                setCropName('');
                setDescription('');
                setPublishedSuccess(false);
              }}
              className="min-h-[52px] px-5 py-3 rounded-2xl border border-[#176B38] text-[#176B38] hover:bg-[#EFF7F1] font-semibold text-base transition-colors cursor-pointer"
            >
              {t.listAnotherBtn}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="min-w-[44px] min-h-[44px] rounded-xl border border-[#DCE5D7] bg-white hover:bg-[#EFF4EC] flex items-center justify-center text-[#252B25] cursor-pointer"
          aria-label={t.backBtn}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
            {isEdit ? 'Edit Produce Listing' : t.addProduceTitle}
          </h1>
          <p className="text-sm text-[#252B25]/75">{t.addProduceSub}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-[#DCE5D7] p-5 sm:p-8 space-y-6"
      >
        {/* 1. Upload or pick crop photograph */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-[#252B25]">
            1. {t.uploadCropPhoto}
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SafeImage
              src={image}
              alt={cropName || 'Crop preview'}
              className="w-32 h-24 rounded-2xl object-cover border border-[#DCE5D7] shrink-0"
            />
            <div className="space-y-2.5 flex-1">
              <label className="min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-dashed border-[#176B38] bg-[#F4FAF5] hover:bg-[#EAF5ED] text-[#176B38] font-semibold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors">
                <Camera className="w-5 h-5" />
                <span>Upload Photo from Phone</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>
              <p className="text-xs text-[#252B25]/65">{t.choosePhotoHint}</p>
              <div className="flex flex-wrap gap-2">
                {CROP_PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setImage(preset.image);
                      setCategory(preset.category);
                      if (!cropName) setCropName(preset.label);
                    }}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      image === preset.image
                        ? 'border-[#176B38] bg-[#176B38] text-white'
                        : 'border-[#DCE5D7] bg-[#F8FAF5] text-[#252B25] hover:border-[#4CAF50]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Crop Category */}
        <div className="space-y-2.5">
          <span className="block text-sm font-bold text-[#252B25]">
            2. {t.selectCategory}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {CATEGORIES.map((cat) => {
              const selected = category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`min-h-[60px] p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    selected
                      ? 'border-[#176B38] bg-[#EFF7F1] text-[#176B38]'
                      : 'border-[#E2E8DC] bg-[#F8FAF5] text-[#252B25] hover:border-[#4CAF50]'
                  }`}
                >
                  {cat.icon}
                  <span className="whitespace-nowrap">{t[cat.labelKey]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Crop Name */}
        <div className="space-y-2">
          <label htmlFor="crop-name-input" className="block text-sm font-bold text-[#252B25]">
            3. {t.cropNameLabel}
          </label>
          <input
            id="crop-name-input"
            type="text"
            required
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            placeholder="e.g. Tomatoes, Onions, Bananas"
            className="w-full min-h-[50px] px-4 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base font-medium focus:border-[#176B38] focus:outline-none"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK_CROPS.map((qc) => (
              <button
                key={qc}
                type="button"
                onClick={() => setCropName(qc)}
                className="min-h-[36px] px-3 py-1 rounded-lg bg-[#EFF4EC] hover:bg-[#E1ECE0] text-xs font-medium text-[#252B25] cursor-pointer"
              >
                + {qc}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Quantity & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="qty-kg-input" className="block text-sm font-bold text-[#252B25]">
              4. {t.quantityKgLabel}
            </label>
            <input
              id="qty-kg-input"
              type="number"
              min={1}
              required
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              className="w-full min-h-[50px] px-4 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-lg font-mono font-bold tabular-nums focus:border-[#176B38] focus:outline-none"
            />
            <div className="flex gap-2">
              {[50, 100, 250, 500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuantityKg(String(preset))}
                  className="min-h-[36px] px-2.5 py-1 rounded-lg border border-[#D4DFCE] bg-white hover:bg-[#EFF7F1] text-xs font-mono font-semibold text-[#176B38] cursor-pointer tabular-nums"
                >
                  {preset} kg
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="price-kg-input" className="block text-sm font-bold text-[#252B25]">
              5. {t.pricePerKgLabel}
            </label>
            <input
              id="price-kg-input"
              type="number"
              min={1}
              required
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              className="w-full min-h-[50px] px-4 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-lg font-mono font-bold tabular-nums focus:border-[#176B38] focus:outline-none"
            />
            <p className="text-xs text-[#176B38] font-medium">
              Direct farm rate — 0% middleman fee
            </p>
          </div>
        </div>

        {/* 5. Harvest Date & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="harvest-date-input" className="block text-sm font-bold text-[#252B25] mb-1.5">
              6. {t.harvestDateLabel}
            </label>
            <input
              id="harvest-date-input"
              type="date"
              required
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full min-h-[50px] px-4 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base font-medium focus:border-[#176B38] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="location-input" className="block text-sm font-bold text-[#252B25] mb-1.5">
              7. {t.locationLabel}
            </label>
            <input
              id="location-input"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full min-h-[50px] px-4 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base font-medium focus:border-[#176B38] focus:outline-none"
            />
          </div>
        </div>

        {/* 6. Description */}
        <div>
          <label htmlFor="desc-input" className="block text-sm font-bold text-[#252B25] mb-1.5">
            8. {t.descriptionLabel}
          </label>
          <textarea
            id="desc-input"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Grade, packing (crates / sacks), or pickup timing..."
            className="w-full p-3.5 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-sm focus:border-[#176B38] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full min-h-[56px] rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-display font-bold text-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>{isEdit ? t.updateListingBtn : t.publishListingBtn}</span>
        </button>
      </form>
    </div>
  );
};
