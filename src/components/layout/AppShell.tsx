import React from 'react';
import {
  Bell,
  Compass,
  Home,
  Package,
  PlusCircle,
  Repeat,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-react';
import { BuyerTab, FarmerTab, Language, UserRole } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { BrandMark } from '../common/BrandMark';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface AppShellProps {
  role: UserRole;
  language: Language;
  setLanguage: (lang: Language) => void;
  farmerTab: FarmerTab;
  setFarmerTab: (tab: FarmerTab) => void;
  buyerTab: BuyerTab;
  setBuyerTab: (tab: BuyerTab) => void;
  unreadNotifications: number;
  locationLabel: string;
  onSwitchRole: (nextRole: UserRole) => void;
  onOpenSettings: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  role,
  language,
  setLanguage,
  farmerTab,
  setFarmerTab,
  buyerTab,
  setBuyerTab,
  unreadNotifications,
  locationLabel,
  onSwitchRole,
  onOpenSettings,
  children,
}) => {
  const t = TRANSLATIONS[language];

  const farmerNavItems: { id: FarmerTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.navHome, icon: <Home className="w-5 h-5" /> },
    { id: 'listings', label: t.navMyListings, icon: <Package className="w-5 h-5" /> },
    { id: 'add', label: t.navAddProduce, icon: <PlusCircle className="w-5 h-5" /> },
    { id: 'notifications', label: t.navNotifications, icon: <Bell className="w-5 h-5" /> },
    { id: 'profile', label: t.navProfile, icon: <User className="w-5 h-5" /> },
  ];

  const buyerNavItems: { id: BuyerTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.navHome, icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: t.navExplore, icon: <Compass className="w-5 h-5" /> },
    { id: 'orders', label: t.navOrders, icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'notifications', label: t.navNotifications, icon: <Bell className="w-5 h-5" /> },
    { id: 'profile', label: t.navProfile, icon: <User className="w-5 h-5" /> },
  ];

  const navItems = role === 'farmer' ? farmerNavItems : buyerNavItems;
  const activeTab = role === 'farmer' ? farmerTab : buyerTab;

  const handleSelectTab = (id: string) => {
    if (role === 'farmer') setFarmerTab(id as FarmerTab);
    else setBuyerTab(id as BuyerTab);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] text-[#252B25] flex flex-col">
      {/* Top Bar: Compact on mobile (52px), clean 3-zone header on desktop */}
      <header className="sticky top-0 z-30 h-14 lg:h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8DC]">
        <div className="max-w-7xl mx-auto h-full px-4 lg:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleSelectTab('home')}
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176B38] rounded-xl"
          >
            <BrandMark size="sm" />
          </button>

          {/* Zone 2: Desktop Single-line Text Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Primary navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#176B38] font-semibold'
                      : 'text-[#252B25]/75 hover:text-[#176B38]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'notifications' && unreadNotifications > 0 && (
                    <span className="ml-1.5 text-xs font-mono font-semibold text-[#176B38] tabular-nums">
                      ({unreadNotifications})
                    </span>
                  )}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#176B38] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher (and mobile notification trigger) */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher language={language} onChange={setLanguage} compact />
            <button
              type="button"
              onClick={() => handleSelectTab('notifications')}
              className="lg:hidden relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#252B25] hover:bg-[#EFF4EC] transition-colors cursor-pointer"
              aria-label={t.navNotifications}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#176B38] text-white text-[10px] font-mono font-bold flex items-center justify-center tabular-nums">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area with Desktop Sidebar + Responsive Canvas */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-5 lg:py-8 pb-24 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E2E8DC] p-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-[#252B25]/60">
                  {role === 'farmer' ? 'Farmer Workspace' : 'Buyer Marketplace'}
                </p>
                <p className="text-sm font-semibold text-[#252B25] mt-0.5 truncate">
                  {locationLabel}
                </p>
              </div>

              <div className="h-px bg-[#EEF2EA]" />

              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#176B38] text-white'
                          : 'text-[#252B25] hover:bg-[#F1F6EE]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </span>
                      {item.id === 'notifications' && unreadNotifications > 0 && (
                        <span
                          className={`text-xs font-mono font-semibold tabular-nums ${
                            isActive ? 'text-[#F4C542]' : 'text-[#176B38]'
                          }`}
                        >
                          {unreadNotifications}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="h-px bg-[#EEF2EA]" />

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium text-[#252B25]/85 hover:bg-[#F1F6EE] transition-colors cursor-pointer"
                >
                  <Settings className="w-5 h-5" />
                  <span>{t.navSettings}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchRole(role === 'farmer' ? 'buyer' : 'farmer')}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold text-[#176B38] bg-[#EFF7F1] hover:bg-[#E1F0E5] transition-colors cursor-pointer"
                >
                  <Repeat className="w-5 h-5" />
                  <span>
                    {role === 'farmer' ? 'Switch to Buyer View' : 'Switch to Farmer View'}
                  </span>
                </button>
              </div>
            </div>
          </aside>

          {/* Primary Workspace Column */}
          <main className="lg:col-span-9 min-w-0">{children}</main>
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (5 tabs, <= 64px height) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DCE5D7]"
        aria-label="Mobile bottom navigation"
      >
        <div className="grid grid-cols-5 h-16 items-center">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isAdd = role === 'farmer' && item.id === 'add';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`relative h-full min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 transition-colors cursor-pointer ${
                  isAdd
                    ? 'text-[#176B38] font-bold'
                    : isActive
                    ? 'text-[#176B38] font-semibold'
                    : 'text-[#252B25]/65 hover:text-[#176B38]'
                }`}
              >
                <span className="relative">
                  {item.icon}
                  {item.id === 'notifications' && unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-[#F4C542] text-[#252B25] text-[9px] font-mono font-bold flex items-center justify-center tabular-nums">
                      {unreadNotifications}
                    </span>
                  )}
                </span>
                <span className="text-[11px] leading-tight truncate max-w-full">
                  {item.label}
                </span>
                {isActive && (
                  <span
                    className="absolute top-0 left-3 right-3 h-0.5 bg-[#176B38] rounded-b-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
