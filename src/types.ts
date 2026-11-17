export type Language = 'en' | 'kn' | 'hi' | 'mr';

export type UserRole = 'farmer' | 'buyer';

export type ProduceCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Other crops';

export type ListingStatus = 'active' | 'sold';

export type PaymentMethod = 'UPI' | 'PhonePe' | 'Google Pay';

export type AuthStep =
  | 'splash'
  | 'role'
  | 'language'
  | 'phone'
  | 'otp'
  | 'farmer-setup'
  | 'buyer-setup'
  | 'app';

export type FarmerTab =
  | 'home'
  | 'listings'
  | 'add'
  | 'notifications'
  | 'profile';

export type BuyerTab =
  | 'home'
  | 'explore'
  | 'orders'
  | 'notifications'
  | 'profile';

export type SubView =
  | { type: 'none' }
  | { type: 'product-details'; listingId: string }
  | { type: 'farmer-details'; farmerId: string }
  | { type: 'checkout'; listingId: string }
  | { type: 'edit-listing'; listingId: string }
  | { type: 'settings' };

export interface FarmerProfile {
  id: string;
  name: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  cropsGrown: string[];
  photo: string;
  verified: boolean;
  distanceKm: number;
  memberSince: string;
}

export interface BuyerProfile {
  id: string;
  name: string;
  businessType: 'Household' | 'Local Retailer' | 'Restaurant / Hotel' | 'Catering';
  mobile: string;
  location: string;
  district: string;
  photo?: string;
}

export interface ProduceListing {
  id: string;
  farmerId: string;
  cropName: string;
  category: ProduceCategory;
  quantityKg: number;
  pricePerKg: number;
  marketRatePerKg?: number;
  harvestDate: string;
  location: string;
  village: string;
  district: string;
  distanceKm: number;
  description: string;
  image: string;
  status: ListingStatus;
  createdAt: string;
  enquiriesCount: number;
}

export interface OrderItem {
  id: string;
  listingId: string;
  cropName: string;
  cropImage: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  farmerVillage: string;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: 'Confirmed' | 'Ready for Pickup' | 'Delivered';
  createdAt: string;
}

export type NotificationCategory =
  | 'enquiry'
  | 'interest'
  | 'order'
  | 'payment'
  | 'expiry';

export interface NotificationItem {
  id: string;
  role: UserRole | 'both';
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedListingId?: string;
}

export interface FilterState {
  search: string;
  category: ProduceCategory | 'All';
  maxDistanceKm: number;
  minPrice: string;
  maxPrice: string;
  minQuantityKg: string;
  harvestWindow: 'all' | 'today' | 'last3days';
  sortBy: 'lowest-price' | 'nearest' | 'recent';
}
