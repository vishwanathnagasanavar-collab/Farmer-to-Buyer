import React, { useState } from 'react';
import {
  BadgeCheck,
  Check,
  Globe,
  MapPin,
  Phone,
  Repeat,
  Settings,
  Sprout,
} from 'lucide-react';
import { FarmerProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { SafeImage } from '../common/SafeImage';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface FarmerProfileScreenProps {
  farmer: FarmerProfile;
  language: Language;
  setLanguage: (lang: Language) => void;
  onUpdateFarmer: (profile: FarmerProfile) => void;
  onOpenSettings: () => void;
  onSwitchToBuyer: () => void;
}

export const FarmerProfileScreen: React.FC<FarmerProfileScreenProps> = ({
  farmer,
  language,
  setLanguage,
  onUpdateFarmer,
  onOpenSettings,
  onSwitchToBuyer,
}) => {
  const t = TRANSLATIONS[language];
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(farmer.name);
  const [village, setVillage] = useState(farmer.village);
  const [district, setDistrict] = useState(farmer.district);
  const [mobile, setMobile] = useState(farmer.mobile);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFarmer({
      ...farmer,
      name: name.trim() || farmer.name,
      village: village.trim() || farmer.village,
      district: district.trim() || farmer.district,
      mobile: mobile.trim() || farmer.mobile,
    });
    setEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
          {t.navProfile}
        </h1>
        <button
          type="button"
          onClick={onOpenSettings}
          className="min-h-[44px] px-4 rounded-xl border border-[#DCE5D7] bg-white hover:bg-[#EFF4EC] text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>{t.navSettings}</span>
        </button>
      </div>

      {/* Farmer Card */}
      <section className="bg-white rounded-3xl border border-[#DCE5D7] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <SafeImage
            src={farmer.photo}
            alt={farmer.name}
            className="w-24 h-24 rounded-2xl object-cover border border-[#DCE5D7] shrink-0"
          />
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-[#252B25]">
                {farmer.name}
              </h2>
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
                {farmer.village}, {farmer.district}, {farmer.state}
              </span>
            </p>
            <p className="text-sm font-mono text-[#252B25]/80 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#176B38]" />
              <span>+91 {farmer.mobile}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#176B38] text-[#176B38] hover:bg-[#EFF7F1] text-sm font-semibold cursor-pointer self-start"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {savedMsg && (
          <p className="text-sm font-semibold text-[#176B38] flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Profile updated successfully.
          </p>
        )}

        {editing && (
          <form onSubmit={handleSave} className="pt-4 border-t border-[#EEF2EA] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">{t.fullName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">{t.village}</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">{t.district}</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="min-h-[46px] px-6 rounded-xl bg-[#176B38] text-white font-semibold text-sm cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

        {/* Crops Grown */}
        <div className="pt-4 border-t border-[#EEF2EA] space-y-2">
          <p className="text-sm font-semibold text-[#252B25] flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#176B38]" />
            <span>{t.cropsGrown}</span>
          </p>
          <p className="text-sm text-[#252B25]/80">
            {farmer.cropsGrown.join(' · ')}
          </p>
        </div>
      </section>

      {/* Language & Account Settings */}
      <section className="bg-white rounded-2xl border border-[#E2E8DC] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#176B38]" />
            <div>
              <p className="text-sm font-bold text-[#252B25]">{t.languageSetting}</p>
              <p className="text-xs text-[#252B25]/65">
                English, Kannada, Hindi, Marathi
              </p>
            </div>
          </div>
          <LanguageSwitcher language={language} onChange={setLanguage} />
        </div>

        <div className="h-px bg-[#EEF2EA]" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#252B25]">Preview Buyer Experience</p>
            <p className="text-xs text-[#252B25]/65">
              See how local shops and customers see your farm produce.
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToBuyer}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EFF7F1] hover:bg-[#E1F0E5] text-[#176B38] font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Repeat className="w-4 h-4" />
            <span>Switch to Buyer Mode</span>
          </button>
        </div>
      </section>
    </div>
  );
};
