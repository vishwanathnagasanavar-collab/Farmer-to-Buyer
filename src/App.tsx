import { useEffect, useState } from 'react';
import {
  AuthStep,
  BuyerProfile,
  BuyerTab,
  FarmerProfile,
  FarmerTab,
  FilterState,
  Language,
  NotificationItem,
  OrderItem,
  ProduceCategory,
  ProduceListing,
  SubView,
  UserRole,
} from './types';
import {
  INITIAL_BUYER,
  INITIAL_FARMERS,
  INITIAL_LISTINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
} from './data/mockData';
import { OnboardingFlow } from './components/auth/OnboardingFlow';
import { AppShell } from './components/layout/AppShell';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { FarmerListingsView } from './components/farmer/FarmerListingsView';
import { AddProduceScreen } from './components/farmer/AddProduceScreen';
import { FarmerProfileScreen } from './components/farmer/FarmerProfileScreen';
import { BuyerHomeScreen } from './components/buyer/BuyerHomeScreen';
import { SearchAndFilterScreen } from './components/buyer/SearchAndFilterScreen';
import { ProductDetailsScreen } from './components/buyer/ProductDetailsScreen';
import { FarmerDetailsScreen } from './components/buyer/FarmerDetailsScreen';
import { CheckoutAndPaymentScreen } from './components/buyer/CheckoutAndPaymentScreen';
import { BuyerOrdersScreen } from './components/buyer/BuyerOrdersScreen';
import { BuyerProfileScreen } from './components/buyer/BuyerProfileScreen';
import { NotificationsScreen } from './components/shared/NotificationsScreen';
import { SettingsScreen } from './components/shared/SettingsScreen';
import { WhatsAppDrawer } from './components/common/WhatsAppDrawer';

const STORAGE_KEY = 'kisandirect_prototype_v1';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: 'All',
  maxDistanceKm: 30,
  minPrice: '',
  maxPrice: '',
  minQuantityKg: '',
  harvestWindow: 'all',
  sortBy: 'nearest',
};

export default function App() {
  const [authStep, setAuthStep] = useState<AuthStep>('splash');
  const [role, setRole] = useState<UserRole>('buyer');
  const [language, setLanguage] = useState<Language>('en');

  const [farmers, setFarmers] = useState<FarmerProfile[]>(INITIAL_FARMERS);
  const [buyer, setBuyer] = useState<BuyerProfile>(INITIAL_BUYER);
  const [listings, setListings] = useState<ProduceListing[]>(INITIAL_LISTINGS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [farmerTab, setFarmerTab] = useState<FarmerTab>('home');
  const [buyerTab, setBuyerTab] = useState<BuyerTab>('home');
  const [subView, setSubView] = useState<SubView>({ type: 'none' });

  const [homeCategory, setHomeCategory] = useState<ProduceCategory | 'All'>('All');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const [whatsAppContext, setWhatsAppContext] = useState<{
    farmer: FarmerProfile;
    listing?: ProduceListing;
  } | null>(null);

  // Hydrate persisted state if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.farmers) setFarmers(parsed.farmers);
        if (parsed.buyer) setBuyer(parsed.buyer);
        if (parsed.listings) setListings(parsed.listings);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch {
      // ignore invalid cache
    }
  }, []);

  // Persist updates
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          language,
          farmers,
          buyer,
          listings,
          orders,
          notifications,
        })
      );
    } catch {
      // ignore storage quota
    }
  }, [language, farmers, buyer, listings, orders, notifications]);

  const currentFarmer = farmers[0];

  const unreadNotifications = notifications.filter(
    (n) => !n.read && (n.role === role || n.role === 'both')
  ).length;

  const handleSaveFarmerProfile = (updated: FarmerProfile) => {
    setFarmers((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleEnterApp = (chosenRole: UserRole) => {
    setRole(chosenRole);
    setSubView({ type: 'none' });
    setAuthStep('app');
  };

  const handleSwitchRole = (nextRole: UserRole) => {
    setRole(nextRole);
    setSubView({ type: 'none' });
    if (nextRole === 'farmer') setFarmerTab('home');
    else setBuyerTab('home');
  };

  const handlePublishListing = (
    draft: Omit<ProduceListing, 'id' | 'createdAt' | 'enquiriesCount'>
  ) => {
    const newListing: ProduceListing = {
      ...draft,
      id: `prod-${Date.now()}`,
      createdAt: 'Just now',
      enquiriesCount: 0,
    };
    setListings((prev) => [newListing, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        role: 'buyer',
        category: 'interest',
        title: `New ${newListing.cropName} Listed Nearby`,
        message: `${currentFarmer.name} listed ${newListing.quantityKg} kg at ₹${newListing.pricePerKg}/kg in ${newListing.location}.`,
        timestamp: 'Just now',
        read: false,
        relatedListingId: newListing.id,
      },
      ...prev,
    ]);
  };

  const handleUpdateListing = (updated: ProduceListing) => {
    setListings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleToggleSold = (listingId: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? { ...item, status: item.status === 'active' ? 'sold' : 'active' }
          : item
      )
    );
  };

  const handleConfirmOrder = (order: OrderItem) => {
    setOrders((prev) => [order, ...prev]);
    // Deduct ordered stock
    setListings((prev) =>
      prev.map((item) => {
        if (item.id !== order.listingId) return item;
        const remaining = Math.max(0, item.quantityKg - order.quantityKg);
        return {
          ...item,
          quantityKg: remaining,
          status: remaining === 0 ? 'sold' : item.status,
        };
      })
    );
    // Notify both farmer & buyer
    setNotifications((prev) => [
      {
        id: `notif-f-${Date.now()}`,
        role: 'farmer',
        category: 'payment',
        title: `New Order #${order.id} — ₹${order.totalAmount}`,
        message: `${buyer.name} ordered ${order.quantityKg} kg of ${order.cropName} via ${order.paymentMethod}.`,
        timestamp: 'Just now',
        read: false,
        relatedListingId: order.listingId,
      },
      {
        id: `notif-b-${Date.now() + 1}`,
        role: 'buyer',
        category: 'order',
        title: `Order #${order.id} Confirmed`,
        message: `Your direct order for ${order.quantityKg} kg ${order.cropName} from ${order.farmerName} is confirmed.`,
        timestamp: 'Just now',
        read: false,
        relatedListingId: order.listingId,
      },
      ...prev,
    ]);
  };

  const handleWhatsAppSent = (listing?: ProduceListing) => {
    if (!listing) return;
    setListings((prev) =>
      prev.map((l) =>
        l.id === listing.id ? { ...l, enquiriesCount: l.enquiriesCount + 1 } : l
      )
    );
    setNotifications((prev) => [
      {
        id: `notif-wa-${Date.now()}`,
        role: 'farmer',
        category: 'enquiry',
        title: `WhatsApp Enquiry for ${listing.cropName}`,
        message: `${buyer.name} sent a direct enquiry about your ${listing.cropName} listing.`,
        timestamp: 'Just now',
        read: false,
        relatedListingId: listing.id,
      },
      ...prev,
    ]);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.role === role || n.role === 'both' ? { ...n, read: true } : n))
    );
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFarmers(INITIAL_FARMERS);
    setBuyer(INITIAL_BUYER);
    setListings(INITIAL_LISTINGS);
    setOrders(INITIAL_ORDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFilters(DEFAULT_FILTERS);
    setHomeCategory('All');
    setSubView({ type: 'none' });
  };

  if (authStep !== 'app') {
    return (
      <OnboardingFlow
        step={authStep}
        setStep={setAuthStep}
        language={language}
        setLanguage={setLanguage}
        role={role}
        setRole={setRole}
        farmerProfile={currentFarmer}
        onSaveFarmerProfile={handleSaveFarmerProfile}
        buyerProfile={buyer}
        onSaveBuyerProfile={setBuyer}
        onEnterApp={handleEnterApp}
      />
    );
  }

  // Render active main content inside AppShell
  const renderMainContent = () => {
    if (subView.type === 'settings') {
      return (
        <SettingsScreen
          role={role}
          language={language}
          setLanguage={setLanguage}
          onBack={() => setSubView({ type: 'none' })}
          onSwitchRole={handleSwitchRole}
          onRestartOnboarding={() => setAuthStep('splash')}
          onResetDemo={handleResetDemo}
        />
      );
    }

    if (role === 'farmer') {
      if (subView.type === 'edit-listing') {
        const target = listings.find((l) => l.id === subView.listingId) || null;
        return (
          <AddProduceScreen
            farmer={currentFarmer}
            language={language}
            editingListing={target}
            onPublish={handlePublishListing}
            onUpdate={handleUpdateListing}
            onDone={() => {
              setSubView({ type: 'none' });
              setFarmerTab('listings');
            }}
            onCancel={() => setSubView({ type: 'none' })}
          />
        );
      }

      if (farmerTab === 'home') {
        return (
          <FarmerDashboard
            farmer={currentFarmer}
            listings={listings}
            language={language}
            onAddProduce={() => setFarmerTab('add')}
            onEditListing={(id) => setSubView({ type: 'edit-listing', listingId: id })}
            onToggleSold={handleToggleSold}
            onViewAllListings={() => setFarmerTab('listings')}
          />
        );
      }

      if (farmerTab === 'listings') {
        return (
          <FarmerListingsView
            farmer={currentFarmer}
            listings={listings}
            language={language}
            onAddProduce={() => setFarmerTab('add')}
            onEditListing={(id) => setSubView({ type: 'edit-listing', listingId: id })}
            onToggleSold={handleToggleSold}
          />
        );
      }

      if (farmerTab === 'add') {
        return (
          <AddProduceScreen
            farmer={currentFarmer}
            language={language}
            onPublish={handlePublishListing}
            onUpdate={handleUpdateListing}
            onDone={() => setFarmerTab('home')}
            onCancel={() => setFarmerTab('home')}
          />
        );
      }

      if (farmerTab === 'notifications') {
        return (
          <NotificationsScreen
            role="farmer"
            notifications={notifications}
            language={language}
            onMarkAllRead={handleMarkAllRead}
            onMarkRead={handleMarkRead}
          />
        );
      }

      return (
        <FarmerProfileScreen
          farmer={currentFarmer}
          language={language}
          setLanguage={setLanguage}
          onUpdateFarmer={handleSaveFarmerProfile}
          onOpenSettings={() => setSubView({ type: 'settings' })}
          onSwitchToBuyer={() => handleSwitchRole('buyer')}
        />
      );
    }

    // BUYER ROLE VIEWS
    if (subView.type === 'product-details') {
      const listing = listings.find((l) => l.id === subView.listingId);
      if (listing) {
        const farmer = farmers.find((f) => f.id === listing.farmerId) || currentFarmer;
        const similar = listings.filter(
          (l) => l.id !== listing.id && l.status === 'active'
        );
        return (
          <ProductDetailsScreen
            listing={listing}
            farmer={farmer}
            similarListings={similar}
            allFarmers={farmers}
            language={language}
            onBack={() => setSubView({ type: 'none' })}
            onChatWhatsApp={() => setWhatsAppContext({ farmer, listing })}
            onPayNow={() => setSubView({ type: 'checkout', listingId: listing.id })}
            onOpenFarmerDetails={(fId) =>
              setSubView({ type: 'farmer-details', farmerId: fId })
            }
            onViewDetails={(id) => setSubView({ type: 'product-details', listingId: id })}
          />
        );
      }
    }

    if (subView.type === 'farmer-details') {
      const farmer = farmers.find((f) => f.id === subView.farmerId) || currentFarmer;
      return (
        <FarmerDetailsScreen
          farmer={farmer}
          listings={listings}
          language={language}
          onBack={() => setSubView({ type: 'none' })}
          onChatWhatsApp={() => setWhatsAppContext({ farmer })}
          onViewDetails={(id) => setSubView({ type: 'product-details', listingId: id })}
        />
      );
    }

    if (subView.type === 'checkout') {
      const listing = listings.find((l) => l.id === subView.listingId);
      if (listing) {
        const farmer = farmers.find((f) => f.id === listing.farmerId) || currentFarmer;
        return (
          <CheckoutAndPaymentScreen
            listing={listing}
            farmer={farmer}
            language={language}
            onBack={() => setSubView({ type: 'product-details', listingId: listing.id })}
            onConfirmOrder={handleConfirmOrder}
            onGoToOrders={() => {
              setSubView({ type: 'none' });
              setBuyerTab('orders');
            }}
            onBackToMarket={() => {
              setSubView({ type: 'none' });
              setBuyerTab('home');
            }}
          />
        );
      }
    }

    if (buyerTab === 'home') {
      return (
        <BuyerHomeScreen
          buyer={buyer}
          listings={listings}
          farmers={farmers}
          language={language}
          searchQuery={filters.search}
          selectedCategory={homeCategory}
          onSearchChange={(q) => setFilters((prev) => ({ ...prev, search: q }))}
          onSearchSubmit={() => setBuyerTab('explore')}
          onSelectCategory={(cat) => setHomeCategory(cat)}
          onViewDetails={(id) => setSubView({ type: 'product-details', listingId: id })}
          onOpenExplore={() => setBuyerTab('explore')}
        />
      );
    }

    if (buyerTab === 'explore') {
      return (
        <SearchAndFilterScreen
          listings={listings}
          farmers={farmers}
          language={language}
          filters={filters}
          setFilters={setFilters}
          onResetFilters={() => setFilters(DEFAULT_FILTERS)}
          onViewDetails={(id) => setSubView({ type: 'product-details', listingId: id })}
        />
      );
    }

    if (buyerTab === 'orders') {
      return (
        <BuyerOrdersScreen
          orders={orders}
          language={language}
          onExplore={() => setBuyerTab('explore')}
        />
      );
    }

    if (buyerTab === 'notifications') {
      return (
        <NotificationsScreen
          role="buyer"
          notifications={notifications}
          language={language}
          onMarkAllRead={handleMarkAllRead}
          onMarkRead={handleMarkRead}
        />
      );
    }

    return (
      <BuyerProfileScreen
        buyer={buyer}
        language={language}
        setLanguage={setLanguage}
        onUpdateBuyer={setBuyer}
        onOpenSettings={() => setSubView({ type: 'settings' })}
        onSwitchToFarmer={() => handleSwitchRole('farmer')}
      />
    );
  };

  return (
    <>
      <AppShell
        role={role}
        language={language}
        setLanguage={setLanguage}
        farmerTab={farmerTab}
        setFarmerTab={(tab) => {
          setSubView({ type: 'none' });
          setFarmerTab(tab);
        }}
        buyerTab={buyerTab}
        setBuyerTab={(tab) => {
          setSubView({ type: 'none' });
          setBuyerTab(tab);
        }}
        unreadNotifications={unreadNotifications}
        locationLabel={
          role === 'farmer'
            ? `${currentFarmer.village}, ${currentFarmer.district}`
            : `${buyer.location}, ${buyer.district}`
        }
        onSwitchRole={handleSwitchRole}
        onOpenSettings={() => setSubView({ type: 'settings' })}
      >
        {renderMainContent()}
      </AppShell>

      {whatsAppContext && (
        <WhatsAppDrawer
          farmer={whatsAppContext.farmer}
          listing={whatsAppContext.listing}
          onClose={() => setWhatsAppContext(null)}
          onSent={() => handleWhatsAppSent(whatsAppContext.listing)}
        />
      )}
    </>
  );
}
