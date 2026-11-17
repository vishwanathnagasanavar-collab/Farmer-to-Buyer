import React, { useState } from 'react';
import { ArrowLeft, Bell, Globe, LogOut, Repeat, RotateCcw } from 'lucide-react';
import { Language, UserRole } from '../../types';
import { LANGUAGE_OPTIONS, TRANSLATIONS } from '../../i18n/translations';

interface SettingsScreenProps {
  role: UserRole;
  language: Language;
  setLanguage: (lang: Language) => void;
  onBack: () => void;
  onSwitchRole: (role: UserRole) => void;
  onRestartOnboarding: () => void;
  onResetDemo: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  role,
  language,
  setLanguage,
  onBack,
  onSwitchRole,
  onRestartOnboarding,
  onResetDemo,
}) => {
  const t = TRANSLATIONS[language];
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-w-[44px] min-h-[44px] rounded-xl border border-[#DCE5D7] bg-white hover:bg-[#EFF4EC] flex items-center justify-center cursor-pointer"
          aria-label={t.backBtn}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
          {t.settingsTitle}
        </h1>
      </div>

      {/* Language Selection */}
      <section className="bg-white rounded-2xl border border-[#E2E8DC] p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#176B38]" />
          <h2 className="font-display text-lg font-bold text-[#252B25]">
            {t.languageSetting}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLanguage(opt.code)}
              className={`min-h-[52px] px-4 py-2.5 rounded-xl border-2 text-left transition-colors cursor-pointer ${
                language === opt.code
                  ? 'border-[#176B38] bg-[#EFF7F1] text-[#176B38]'
                  : 'border-[#E2E8DC] bg-[#F8FAF5] text-[#252B25]'
              }`}
            >
              <span className="block font-bold text-sm">{opt.nativeName}</span>
              <span className="block text-xs opacity-70">{opt.englishName}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="bg-white rounded-2xl border border-[#E2E8DC] p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-[#176B38]" />
          <h2 className="font-display text-lg font-bold text-[#252B25]">
            Alert Preferences
          </h2>
        </div>

        <label className="flex items-center justify-between gap-4 min-h-[44px] cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-[#252B25]">WhatsApp Enquiry Alerts</p>
            <p className="text-xs text-[#252B25]/65">Instant alert when a buyer messages you</p>
          </div>
          <input
            type="checkbox"
            checked={whatsappAlerts}
            onChange={(e) => setWhatsappAlerts(e.target.checked)}
            className="w-5 h-5 accent-[#176B38]"
          />
        </label>

        <div className="h-px bg-[#EEF2EA]" />

        <label className="flex items-center justify-between gap-4 min-h-[44px] cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-[#252B25]">SMS Order Updates</p>
            <p className="text-xs text-[#252B25]/65">Receive SMS for confirmed orders and UPI payments</p>
          </div>
          <input
            type="checkbox"
            checked={smsAlerts}
            onChange={(e) => setSmsAlerts(e.target.checked)}
            className="w-5 h-5 accent-[#176B38]"
          />
        </label>
      </section>

      {/* Role & Account Actions */}
      <section className="bg-white rounded-2xl border border-[#E2E8DC] p-6 space-y-3">
        <button
          type="button"
          onClick={() => {
            onSwitchRole(role === 'farmer' ? 'buyer' : 'farmer');
            onBack();
          }}
          className="w-full min-h-[48px] px-4 rounded-xl bg-[#EFF7F1] hover:bg-[#E1F0E5] text-[#176B38] font-semibold text-sm flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <Repeat className="w-4 h-4" />
            <span>
              {role === 'farmer' ? 'Switch to Buyer View' : 'Switch to Farmer View'}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onRestartOnboarding}
          className="w-full min-h-[48px] px-4 rounded-xl border border-[#DCE5D7] hover:bg-[#F8FAF5] text-[#252B25] font-semibold text-sm flex items-center gap-2.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Open Onboarding / Login Flow</span>
        </button>

        <button
          type="button"
          onClick={onResetDemo}
          className="w-full min-h-[48px] px-4 rounded-xl border border-[#DCE5D7] hover:bg-[#F8FAF5] text-[#252B25]/80 font-semibold text-sm flex items-center gap-2.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Listings & Orders</span>
        </button>
      </section>
    </div>
  );
};
