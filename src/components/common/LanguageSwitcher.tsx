import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../../types';
import { LANGUAGE_OPTIONS } from '../../i18n/translations';

interface LanguageSwitcherProps {
  language: Language;
  onChange: (lang: Language) => void;
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  language,
  onChange,
  compact = false,
}) => {
  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="kisandirect-lang-select" className="sr-only">
        Select language
      </label>
      <Globe
        className="w-4 h-4 text-[#176B38] pointer-events-none absolute left-3"
        aria-hidden="true"
      />
      <select
        id="kisandirect-lang-select"
        value={language}
        onChange={(e) => onChange(e.target.value as Language)}
        className={`appearance-none bg-white border border-[#D8E2D4] text-[#252B25] font-medium rounded-xl cursor-pointer transition-colors hover:border-[#176B38] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176B38] min-h-[40px] ${
          compact ? 'pl-8 pr-7 py-1.5 text-xs' : 'pl-9 pr-8 py-2 text-sm'
        }`}
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.nativeName}
          </option>
        ))}
      </select>
      <svg
        className="w-4 h-4 text-[#252B25]/60 pointer-events-none absolute right-2.5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};
