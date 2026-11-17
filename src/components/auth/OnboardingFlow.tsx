import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBasket,
  Sprout,
  Tractor,
} from 'lucide-react';
import { AuthStep, BuyerProfile, FarmerProfile, Language, UserRole } from '../../types';
import { LANGUAGE_OPTIONS, TRANSLATIONS } from '../../i18n/translations';
import { IMAGES } from '../../data/mockData';
import { BrandMark } from '../common/BrandMark';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { SafeImage } from '../common/SafeImage';

interface OnboardingFlowProps {
  step: AuthStep;
  setStep: (step: AuthStep) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  farmerProfile: FarmerProfile;
  onSaveFarmerProfile: (profile: FarmerProfile) => void;
  buyerProfile: BuyerProfile;
  onSaveBuyerProfile: (profile: BuyerProfile) => void;
  onEnterApp: (role: UserRole) => void;
}

const COMMON_CROPS = [
  'Tomatoes',
  'Onions',
  'Potatoes',
  'Green Chilli',
  'Bananas',
  'Wheat',
  'Tur Dal',
  'Leafy Greens',
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  step,
  setStep,
  language,
  setLanguage,
  role,
  setRole,
  farmerProfile,
  onSaveFarmerProfile,
  buyerProfile,
  onSaveBuyerProfile,
  onEnterApp,
}) => {
  const t = TRANSLATIONS[language];

  const [mobileInput, setMobileInput] = useState(
    role === 'farmer' ? farmerProfile.mobile : buyerProfile.mobile
  );
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4']);
  const [otpError, setOtpError] = useState('');

  // Farmer setup state
  const [fName, setFName] = useState(farmerProfile.name);
  const [fVillage, setFVillage] = useState(farmerProfile.village);
  const [fDistrict, setFDistrict] = useState(farmerProfile.district);
  const [fState, setFState] = useState(farmerProfile.state);
  const [fCrops, setFCrops] = useState<string[]>(farmerProfile.cropsGrown);
  const [fPhoto, setFPhoto] = useState(farmerProfile.photo);

  // Buyer setup state
  const [bName, setBName] = useState(buyerProfile.name);
  const [bType, setBType] = useState<BuyerProfile['businessType']>(buyerProfile.businessType);
  const [bLocation, setBLocation] = useState(buyerProfile.location);
  const [bDistrict, setBDistrict] = useState(buyerProfile.district);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleCrop = (crop: string) => {
    setFCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = clean;
    setOtpDigits(next);
    setOtpError('');
    if (clean && index < 3) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const joined = otpDigits.join('');
    if (joined.length < 4) {
      setOtpError('Please enter all 4 digits (Demo OTP: 1234)');
      return;
    }
    setStep(role === 'farmer' ? 'farmer-setup' : 'buyer-setup');
  };

  const handleCompleteFarmerSetup = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveFarmerProfile({
      ...farmerProfile,
      name: fName.trim() || 'Ramesh Gowda',
      mobile: mobileInput.trim() || farmerProfile.mobile,
      village: fVillage.trim() || 'Maddur',
      district: fDistrict.trim() || 'Mandya',
      state: fState.trim() || 'Karnataka',
      cropsGrown: fCrops.length > 0 ? fCrops : ['Tomatoes'],
      photo: fPhoto,
    });
    onEnterApp('farmer');
  };

  const handleCompleteBuyerSetup = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBuyerProfile({
      ...buyerProfile,
      name: bName.trim() || 'Anand Fresh Mart',
      businessType: bType,
      mobile: mobileInput.trim() || buyerProfile.mobile,
      location: bLocation.trim() || 'Indiranagar',
      district: bDistrict.trim() || 'Bengaluru Urban',
    });
    onEnterApp('buyer');
  };

  if (step === 'splash') {
    return (
      <div className="min-h-screen bg-[#F8FAF5] flex flex-col">
        {/* Clean Minimal Top Bar */}
        <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <BrandMark size="md" />
          <div className="flex items-center gap-3">
            <LanguageSwitcher language={language} onChange={setLanguage} compact />
          </div>
        </header>

        {/* Main Hero Split */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch w-full">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#176B38]">
                  Direct AgriTech Marketplace
                </p>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#252B25] leading-tight text-balance">
                  {t.tagline}
                </h1>
                <p className="text-base sm:text-lg text-[#252B25]/80 max-w-xl leading-relaxed">
                  Connecting smallholder farmers directly with local vegetable shops,
                  restaurants, hotels, and households across India — simple, transparent,
                  and in your regional language.
                </p>
              </div>

              {/* Primary Choice Buttons directly accessible */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('farmer');
                    setStep('language');
                  }}
                  className="min-h-[68px] p-4 rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white text-left flex items-center gap-3.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#176B38] focus-visible:ring-offset-2"
                >
                  <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <Tractor className="w-6 h-6 text-[#F4C542]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold text-base">
                      {t.iAmFarmer}
                    </span>
                    <span className="block text-xs text-white/85 truncate">
                      List & sell farm produce
                    </span>
                  </span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('buyer');
                    setStep('language');
                  }}
                  className="min-h-[68px] p-4 rounded-2xl bg-white hover:bg-[#EFF5EB] border-2 border-[#176B38] text-[#176B38] text-left flex items-center gap-3.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#176B38] focus-visible:ring-offset-2"
                >
                  <span className="w-11 h-11 rounded-xl bg-[#EAF5ED] flex items-center justify-center shrink-0">
                    <ShoppingBasket className="w-6 h-6 text-[#176B38]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold text-base text-[#252B25]">
                      {t.iAmBuyer}
                    </span>
                    <span className="block text-xs text-[#252B25]/70 truncate">
                      Buy fresh from nearby farms
                    </span>
                  </span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
              </div>

              {/* Instant Preview Links */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm">
                <button
                  type="button"
                  onClick={() => onEnterApp('buyer')}
                  className="font-semibold text-[#176B38] hover:underline min-h-[44px] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Browse Marketplace Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[#252B25]/30" aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onEnterApp('farmer')}
                  className="font-semibold text-[#252B25]/80 hover:text-[#176B38] hover:underline min-h-[44px] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Preview Farmer Dashboard</span>
                </button>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-6">
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[340px] rounded-3xl overflow-hidden border border-[#DCE5D7] bg-white">
                <SafeImage
                  src={IMAGES.heroFarm}
                  alt="Indian farmers harvesting fresh tomatoes, onions, and greens"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                  <p className="text-xs font-medium text-[#F4C542] mb-1">
                    Mandya · Kolar · Nashik
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold leading-snug">
                    100% direct farm price. Zero mandi middlemen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Step wrapper for Role / Language / Phone / OTP / Profile Setup
  return (
    <div className="min-h-screen bg-[#F8FAF5] flex flex-col">
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            if (step === 'role') setStep('splash');
            else if (step === 'language') setStep('role');
            else if (step === 'phone') setStep('language');
            else if (step === 'otp') setStep('phone');
            else setStep('otp');
          }}
          className="min-h-[44px] px-3 rounded-xl inline-flex items-center gap-2 text-sm font-semibold text-[#252B25] hover:bg-[#EAF0E6] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>
        <BrandMark size="sm" />
        <LanguageSwitcher language={language} onChange={setLanguage} compact />
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-white rounded-3xl border border-[#DCE5D7] p-6 sm:p-8 shadow-xs">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            {(['role', 'language', 'phone', 'otp', 'setup'] as const).map((s, idx) => {
              const currentIdx =
                step === 'role'
                  ? 0
                  : step === 'language'
                  ? 1
                  : step === 'phone'
                  ? 2
                  : step === 'otp'
                  ? 3
                  : 4;
              const active = idx <= currentIdx;
              return (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    active ? 'bg-[#176B38]' : 'bg-[#E5ECE0]'
                  }`}
                />
              );
            })}
          </div>

          {step === 'role' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
                  {t.chooseRoleTitle}
                </h1>
                <p className="text-base text-[#252B25]/75 mt-1">{t.chooseRoleSub}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setRole('farmer');
                    setStep('language');
                  }}
                  className={`p-6 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-[160px] flex flex-col justify-between ${
                    role === 'farmer'
                      ? 'border-[#176B38] bg-[#F2F8F3]'
                      : 'border-[#DCE5D7] bg-white hover:border-[#4CAF50]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#176B38] text-white flex items-center justify-center">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div className="mt-4">
                    <span className="block font-display text-xl font-bold text-[#252B25]">
                      {t.iAmFarmer}
                    </span>
                    <span className="block text-sm text-[#252B25]/75 mt-1 leading-snug">
                      {t.farmerRoleDesc}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('buyer');
                    setStep('language');
                  }}
                  className={`p-6 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-[160px] flex flex-col justify-between ${
                    role === 'buyer'
                      ? 'border-[#176B38] bg-[#F2F8F3]'
                      : 'border-[#DCE5D7] bg-white hover:border-[#4CAF50]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F4C542] text-[#252B25] flex items-center justify-center">
                    <ShoppingBasket className="w-6 h-6" />
                  </div>
                  <div className="mt-4">
                    <span className="block font-display text-xl font-bold text-[#252B25]">
                      {t.iAmBuyer}
                    </span>
                    <span className="block text-sm text-[#252B25]/75 mt-1 leading-snug">
                      {t.buyerRoleDesc}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'language' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
                  {t.selectLanguageTitle}
                </h1>
                <p className="text-base text-[#252B25]/75 mt-1">{t.selectLanguageSub}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {LANGUAGE_OPTIONS.map((opt) => {
                  const selected = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => setLanguage(opt.code)}
                      className={`min-h-[76px] p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#176B38] bg-[#EFF7F1]'
                          : 'border-[#DCE5D7] bg-white hover:border-[#4CAF50]'
                      }`}
                    >
                      <div>
                        <span className="block font-display text-lg font-bold text-[#252B25]">
                          {opt.nativeName}
                        </span>
                        <span className="block text-xs text-[#252B25]/70">
                          {opt.englishName} · {opt.regionHint}
                        </span>
                      </div>
                      {selected && (
                        <span className="w-7 h-7 rounded-full bg-[#176B38] text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full min-h-[52px] rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'phone' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('otp');
              }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
                  {t.enterMobileTitle}
                </h1>
                <p className="text-base text-[#252B25]/75 mt-1">{t.enterMobileSub}</p>
              </div>

              <div>
                <label
                  htmlFor="mobile-number-input"
                  className="block text-sm font-semibold text-[#252B25] mb-2"
                >
                  {t.mobileLabel}
                </label>
                <div className="flex items-center rounded-2xl border-2 border-[#D4DFCE] focus-within:border-[#176B38] bg-[#F8FAF5] overflow-hidden">
                  <span className="px-4 py-3.5 text-base font-bold text-[#252B25] border-r border-[#D4DFCE] bg-[#EFF4EC]">
                    +91
                  </span>
                  <input
                    id="mobile-number-input"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    value={mobileInput}
                    onChange={(e) =>
                      setMobileInput(e.target.value.replace(/\D/g, '').slice(0, 10))
                    }
                    placeholder="98452 10345"
                    className="flex-1 bg-transparent px-4 py-3.5 text-lg font-mono tabular-nums text-[#252B25] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[52px] rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-5 h-5" />
                <span>{t.sendOtpBtn}</span>
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
                  {t.otpTitle}
                </h1>
                <p className="text-base text-[#252B25]/75 mt-1">
                  {t.otpSub} <span className="font-mono font-semibold">+91 {mobileInput}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 justify-center py-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-box-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    aria-label={`OTP digit ${idx + 1}`}
                    className="w-14 h-16 sm:w-16 sm:h-16 text-center text-2xl font-mono font-bold rounded-2xl border-2 border-[#D4DFCE] bg-[#F8FAF5] focus:border-[#176B38] focus:outline-none tabular-nums"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-sm font-medium text-red-700 text-center">{otpError}</p>
              )}

              <p className="text-sm text-center text-[#176B38] font-medium bg-[#EFF7F1] py-2 px-3 rounded-xl">
                {t.otpHint}
              </p>

              <button
                type="submit"
                className="w-full min-h-[52px] rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{t.verifyBtn}</span>
              </button>
            </form>
          )}

          {step === 'farmer-setup' && (
            <form onSubmit={handleCompleteFarmerSetup} className="space-y-5">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
                  {t.farmerSetupTitle}
                </h1>
                <p className="text-base text-[#252B25]/75 mt-1">{t.farmerSetupSub}</p>
              </div>

              {/* Photo uploader */}
              <div className="flex items-center gap-4">
                <SafeImage
                  src={fPhoto}
                  alt={fName || 'Farmer portrait'}
                  className="w-20 h-20 rounded-2xl object-cover border border-[#DCE5D7] shrink-0"
                />
                <label className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[#176B38] text-[#176B38] hover:bg-[#EFF7F1] font-semibold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
                  <span>Upload {t.profilePhoto}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="f-name" className="block text-sm font-semibold mb-1.5">
                    {t.fullName}
                  </label>
                  <input
                    id="f-name"
                    type="text"
                    required
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base focus:border-[#176B38] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="f-mobile" className="block text-sm font-semibold mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    id="f-mobile"
                    type="tel"
                    required
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base font-mono focus:border-[#176B38] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="f-village" className="block text-sm font-semibold mb-1.5">
                    {t.village}
                  </label>
                  <input
                    id="f-village"
                    type="text"
                    required
                    value={fVillage}
                    onChange={(e) => setFVillage(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base focus:border-[#176B38] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="f-district" className="block text-sm font-semibold mb-1.5">
                    {t.district}
                  </label>
                  <input
                    id="f-district"
                    type="text"
                    required
                    value={fDistrict}
                    onChange={(e) => setFDistrict(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base focus:border-[#176B38] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="f-state" className="block text-sm font-semibold mb-1.5">
                    {t.state}
                  </label>
                  <input
                    id="f-state"
                    type="text"
                    required
                    value={fState}
                    onChange={(e) => setFState(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base focus:border-[#176B38] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">{t.cropsGrown}</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_CROPS.map((crop) => {
                    const active = fCrops.includes(crop);
                    return (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => toggleCrop(crop)}
                        className={`min-h-[40px] px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#176B38] text-white border-[#176B38]'
                            : 'bg-[#F8FAF5] text-[#252B25] border-[#D4DFCE] hover:border-[#4CAF50]'
                        }`}
                      >
                        {crop}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[54px] rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sprout className="w-5 h-5" />
                <span>{t.completeSetupBtn}</span>
              </button>
            </form>
          )}

          {step === 'buyer-setup' && (
            <form onSubmit={handleCompleteBuyerSetup} className="space-y-5">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
                  {t.buyerSetupTitle}
                </h1>
                <p className="text-base text-[#252B25]/75 mt-1">{t.buyerSetupSub}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="b-name" className="block text-sm font-semibold mb-1.5">
                    {t.fullName} / Shop or Hotel Name
                  </label>
                  <input
                    id="b-name"
                    type="text"
                    required
                    value={bName}
                    onChange={(e) => setBName(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base focus:border-[#176B38] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <p className="text-sm font-semibold mb-2">Buyer Category</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(
                      ['Household', 'Local Retailer', 'Restaurant / Hotel', 'Catering'] as const
                    ).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setBType(type)}
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-sm font-medium border text-left transition-colors cursor-pointer ${
                          bType === type
                            ? 'bg-[#176B38] text-white border-[#176B38]'
                            : 'bg-[#F8FAF5] text-[#252B25] border-[#D4DFCE] hover:border-[#4CAF50]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="b-loc" className="block text-sm font-semibold mb-1.5">
                    Delivery Area / Locality
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#176B38] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="b-loc"
                      type="text"
                      required
                      value={bLocation}
                      onChange={(e) => setBLocation(e.target.value)}
                      className="w-full min-h-[48px] pl-9 pr-3.5 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base focus:border-[#176B38] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="b-dist" className="block text-sm font-semibold mb-1.5">
                    {t.district}
                  </label>
                  <input
                    id="b-dist"
                    type="text"
                    required
                    value={bDistrict}
                    onChange={(e) => setBDistrict(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-base focus:border-[#176B38] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[54px] rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBasket className="w-5 h-5" />
                <span>{t.completeSetupBtn}</span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
