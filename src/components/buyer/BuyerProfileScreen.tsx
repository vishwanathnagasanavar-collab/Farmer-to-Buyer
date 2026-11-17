import React, { useState } from 'react';
import { Check, Globe, MapPin, Phone, Repeat, Settings, Store } from 'lucide-react';
import { BuyerProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface BuyerProfileScreenProps {
  buyer: BuyerProfile;
  language: Language;
  setLanguage: (lang: Language) => void;
  onUpdateBuyer: (profile: BuyerProfile) => void;
  onOpenSettings: () => void;
  onSwitchToFarmer: () => void;
}

export const BuyerProfileScreen: React.FC<BuyerProfileScreenProps> = ({
  buyer,
  language,
  setLanguage,
  onUpdateBuyer,
  onOpenSettings,
  onSwitchToFarmer,
}) => {
  const t = TRANSLATIONS[language];
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(buyer.name);
  const [location, setLocation] = useState(buyer.location);
  const [district, setDistrict] = useState(buyer.district);
  const [mobile, setMobile] = useState(buyer.mobile);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBuyer({
      ...buyer,
      name: name.trim() || buyer.name,
      location: location.trim() || buyer.location,
      district: district.trim() || buyer.district,
      mobile: mobile.trim() || buyer.mobile,
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

      <section className="bg-white rounded-3xl border border-[#DCE5D7] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#176B38] text-white flex items-center justify-center shrink-0">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#252B25]">
                {buyer.name}
              </h2>
              <p className="text-xs font-semibold text-[#176B38]">{buyer.businessType}</p>
              <p className="text-sm text-[#252B25]/80 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-[#176B38]" />
                <span>
                  {buyer.location}, {buyer.district}
                </span>
              </p>
              <p className="text-sm font-mono text-[#252B25]/80 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#176B38]" />
                <span>+91 {buyer.mobile}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#176B38] text-[#176B38] hover:bg-[#EFF7F1] text-sm font-semibold cursor-pointer self-start"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {saved && (
          <p className="text-sm font-semibold text-[#176B38] flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Buyer details saved.
          </p>
        )}

        {editing && (
          <form
            onSubmit={handleSave}
            className="pt-4 border-t border-[#EEF2EA] grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-xs font-semibold mb-1">Name / Business</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Mobile</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Area / Locality</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
                Save Changes
              </button>
            </div>
          </form>
        )}
      </section>

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
            <p className="text-sm font-bold text-[#252B25]">Switch to Farmer Account</p>
            <p className="text-xs text-[#252B25]/65">
              List your own crops and manage incoming buyer enquiries.
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToFarmer}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EFF7F1] hover:bg-[#E1F0E5] text-[#176B38] font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Repeat className="w-4 h-4" />
            <span>Switch to Farmer Mode</span>
          </button>
        </div>
      </section>
    </div>
  );
};
