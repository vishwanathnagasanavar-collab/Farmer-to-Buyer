import React from 'react';
import { Sprout } from 'lucide-react';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ size = 'md', light = false }) => {
  const iconBox =
    size === 'lg' ? 'w-12 h-12 rounded-2xl' : size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-9 h-9 rounded-xl';
  const iconSize = size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <span
        className={`${iconBox} ${
          light ? 'bg-white text-[#176B38]' : 'bg-[#176B38] text-white'
        } flex items-center justify-center shrink-0`}
        aria-hidden="true"
      >
        <Sprout className={iconSize} />
      </span>
      <span
        className={`font-display font-bold tracking-tight ${textSize} ${
          light ? 'text-white' : 'text-[#252B25]'
        }`}
      >
        KisanDirect
      </span>
    </span>
  );
};
