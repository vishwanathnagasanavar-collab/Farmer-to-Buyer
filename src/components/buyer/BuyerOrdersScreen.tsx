import React from 'react';
import { CheckCircle2, Phone, ShoppingBag } from 'lucide-react';
import { Language, OrderItem } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { SafeImage } from '../common/SafeImage';

interface BuyerOrdersScreenProps {
  orders: OrderItem[];
  language: Language;
  onExplore: () => void;
}

export const BuyerOrdersScreen: React.FC<BuyerOrdersScreenProps> = ({
  orders,
  language,
  onExplore,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
            {t.navOrders}
          </h1>
          <p className="text-sm text-[#252B25]/70">
            Track your direct orders and contact farmers for pickup or dispatch.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCE5D7] p-10 text-center space-y-4">
          <ShoppingBag className="w-10 h-10 text-[#176B38] mx-auto" />
          <p className="font-display text-lg font-bold text-[#252B25]">
            No orders yet
          </p>
          <p className="text-sm text-[#252B25]/70">
            Browse nearby farms to buy fresh produce at transparent prices.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="min-h-[46px] px-6 rounded-xl bg-[#176B38] text-white font-semibold text-sm cursor-pointer"
          >
            {t.browseMarketplace}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="bg-white rounded-2xl border border-[#E2E8DC] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <SafeImage
                  src={order.cropImage}
                  alt={order.cropName}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <p className="text-xs font-mono font-semibold text-[#176B38]">
                    Order #{order.id} · {order.createdAt}
                  </p>
                  <h2 className="font-display text-lg font-bold text-[#252B25]">
                    {order.cropName} ({order.quantityKg} kg)
                  </h2>
                  <p className="text-sm text-[#252B25]/75">
                    {order.farmerName} · {order.farmerVillage}
                  </p>
                  <p className="text-xs font-semibold text-[#176B38] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {order.status} · Paid via {order.paymentMethod}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EEF2EA]">
                <span className="font-mono text-xl font-bold text-[#252B25] tabular-nums">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
                <a
                  href={`tel:+91${order.farmerMobile}`}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#EFF7F1] hover:bg-[#E1F0E5] text-[#176B38] text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Farmer</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
