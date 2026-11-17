import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import {
  FarmerProfile,
  Language,
  OrderItem,
  PaymentMethod,
  ProduceListing,
} from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { SafeImage } from '../common/SafeImage';

interface CheckoutAndPaymentScreenProps {
  listing: ProduceListing;
  farmer: FarmerProfile;
  language: Language;
  onBack: () => void;
  onConfirmOrder: (order: OrderItem) => void;
  onGoToOrders: () => void;
  onBackToMarket: () => void;
}

export const CheckoutAndPaymentScreen: React.FC<CheckoutAndPaymentScreenProps> = ({
  listing,
  farmer,
  language,
  onBack,
  onConfirmOrder,
  onGoToOrders,
  onBackToMarket,
}) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState<'summary' | 'payment' | 'confirmed'>('summary');
  const [quantityKg, setQuantityKg] = useState(Math.min(25, listing.quantityKg));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('buyer@okaxis');
  const [createdOrder, setCreatedOrder] = useState<OrderItem | null>(null);

  const totalAmount = quantityKg * listing.pricePerKg;

  const adjustQty = (delta: number) => {
    setQuantityKg((prev) =>
      Math.max(1, Math.min(listing.quantityKg, prev + delta))
    );
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: OrderItem = {
      id: `KD-${Math.floor(4100 + Math.random() * 899)}`,
      listingId: listing.id,
      cropName: listing.cropName,
      cropImage: listing.image,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmerMobile: farmer.mobile,
      farmerVillage: `${farmer.village}, ${farmer.district}`,
      quantityKg,
      pricePerKg: listing.pricePerKg,
      totalAmount,
      paymentMethod,
      status: 'Confirmed',
      createdAt: 'Just now',
    };
    setCreatedOrder(newOrder);
    onConfirmOrder(newOrder);
    setStep('confirmed');
  };

  if (step === 'confirmed' && createdOrder) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-[#DCE5D7] p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#EAF5ED] text-[#176B38] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-mono font-semibold text-[#176B38]">
            Order #{createdOrder.id} · {createdOrder.paymentMethod} Demo
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
            {t.paymentSuccessTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#252B25]/75">
            {t.paymentSuccessSub}
          </p>
        </div>

        <div className="bg-[#F8FAF5] rounded-2xl border border-[#E2E8DC] p-4 sm:p-5 text-left space-y-3">
          <div className="flex items-center gap-3.5">
            <SafeImage
              src={createdOrder.cropImage}
              alt={createdOrder.cropName}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-base text-[#252B25]">
                {createdOrder.cropName}
              </p>
              <p className="text-sm text-[#252B25]/75 tabular-nums">
                {createdOrder.quantityKg} kg × ₹{createdOrder.pricePerKg}/kg
              </p>
            </div>
            <span className="font-mono text-lg font-bold text-[#176B38] tabular-nums">
              ₹{createdOrder.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="h-px bg-[#E5ECE0]" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
            <div>
              <p className="font-semibold text-[#252B25]">{createdOrder.farmerName}</p>
              <p className="text-xs text-[#252B25]/70">{createdOrder.farmerVillage}</p>
            </div>
            <a
              href={`tel:+91${createdOrder.farmerMobile}`}
              className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#176B38]"
            >
              <Phone className="w-4 h-4" />
              <span>+91 {createdOrder.farmerMobile}</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onGoToOrders}
            className="min-h-[50px] px-5 rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-semibold text-sm cursor-pointer"
          >
            {t.viewOrdersBtn}
          </button>
          <button
            type="button"
            onClick={onBackToMarket}
            className="min-h-[50px] px-5 rounded-2xl border border-[#176B38] text-[#176B38] hover:bg-[#EFF7F1] font-semibold text-sm cursor-pointer"
          >
            {t.backToMarketBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => (step === 'payment' ? setStep('summary') : onBack())}
        className="min-h-[44px] px-3.5 rounded-xl border border-[#DCE5D7] bg-white hover:bg-[#EFF4EC] text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.backBtn}</span>
      </button>

      {step === 'summary' && (
        <div className="bg-white rounded-3xl border border-[#DCE5D7] p-6 sm:p-8 space-y-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
            {t.orderSummaryTitle}
          </h1>

          {/* Crop Row */}
          <div className="flex items-center gap-4 pb-5 border-b border-[#EEF2EA]">
            <SafeImage
              src={listing.image}
              alt={listing.cropName}
              className="w-20 h-20 rounded-2xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl font-bold text-[#252B25]">
                {listing.cropName}
              </h2>
              <p className="text-sm text-[#252B25]/70">
                {farmer.name} · {listing.location}
              </p>
              <p className="text-sm font-mono font-bold text-[#176B38] mt-1 tabular-nums">
                ₹{listing.pricePerKg}/kg · {listing.quantityKg} kg available
              </p>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-[#252B25]">
              {t.selectQtyKg}
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center rounded-2xl border border-[#D4DFCE] bg-[#F8FAF5] p-1">
                <button
                  type="button"
                  onClick={() => adjustQty(-5)}
                  className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center hover:bg-white cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={listing.quantityKg}
                  value={quantityKg}
                  onChange={(e) => {
                    const val = Math.max(
                      1,
                      Math.min(listing.quantityKg, Number(e.target.value) || 1)
                    );
                    setQuantityKg(val);
                  }}
                  className="w-20 text-center font-mono text-lg font-bold bg-transparent focus:outline-none tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => adjustQty(5)}
                  className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center hover:bg-white cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[10, 25, 50, 100]
                  .filter((q) => q <= listing.quantityKg)
                  .map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuantityKg(preset)}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold border cursor-pointer tabular-nums ${
                        quantityKg === preset
                          ? 'bg-[#176B38] text-white border-[#176B38]'
                          : 'bg-white text-[#252B25] border-[#D4DFCE]'
                      }`}
                    >
                      {preset} kg
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Farmer Contact Info */}
          <div className="bg-[#F8FAF5] rounded-2xl border border-[#E5ECE0] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-[#252B25]/65">Farmer Contact</p>
              <p className="text-sm font-bold text-[#252B25]">
                {farmer.name} · {farmer.village}, {farmer.district}
              </p>
            </div>
            <span className="font-mono text-sm font-semibold text-[#176B38]">
              +91 {farmer.mobile}
            </span>
          </div>

          {/* Total Breakdown */}
          <div className="pt-4 border-t border-[#EEF2EA] space-y-2">
            <div className="flex items-center justify-between text-sm text-[#252B25]/80">
              <span>
                Produce Cost ({quantityKg} kg × ₹{listing.pricePerKg})
              </span>
              <span className="font-mono font-semibold tabular-nums">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-[#176B38] font-medium">
              <span>Middleman / Platform Fee</span>
              <span className="font-mono tabular-nums">₹0</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#EEF2EA]">
              <span className="font-display text-lg font-bold text-[#252B25]">
                {t.totalAmount}
              </span>
              <span className="font-mono text-2xl font-bold text-[#176B38] tabular-nums">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep('payment')}
            className="w-full min-h-[54px] rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-display font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CreditCard className="w-5 h-5" />
            <span>Proceed to Payment · ₹{totalAmount.toLocaleString('en-IN')}</span>
          </button>
        </div>
      )}

      {step === 'payment' && (
        <form
          onSubmit={handleConfirmPayment}
          className="bg-white rounded-3xl border border-[#DCE5D7] p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
                {t.paymentOptionsTitle}
              </h1>
              <p className="text-sm text-[#252B25]/70 mt-1">
                Paying directly to {farmer.name} ({farmer.village})
              </p>
            </div>
            <span className="font-mono text-2xl font-bold text-[#176B38] tabular-nums">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#7D5802] bg-[#FEF8E2] border border-[#F4C542]/50 px-4 py-3 rounded-xl">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{t.demoPaymentNote}</span>
          </div>

          <div className="space-y-3">
            {(['UPI', 'PhonePe', 'Google Pay'] as PaymentMethod[]).map((method) => {
              const selected = paymentMethod === method;
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`w-full min-h-[60px] p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                    selected
                      ? 'border-[#176B38] bg-[#EFF7F1]'
                      : 'border-[#E2E8DC] bg-white hover:border-[#4CAF50]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selected
                          ? 'bg-[#176B38] text-white'
                          : 'bg-[#F1F5EE] text-[#176B38]'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="block font-display font-bold text-base text-[#252B25]">
                        {method}
                      </span>
                      <span className="block text-xs text-[#252B25]/65">
                        Instant direct transfer (Demo)
                      </span>
                    </div>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selected ? 'border-[#176B38] bg-[#176B38]' : 'border-[#B6C4B0]'
                    }`}
                  >
                    {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>

          {paymentMethod === 'UPI' && (
            <div>
              <label htmlFor="upi-input" className="block text-sm font-semibold mb-1.5">
                Demo UPI ID
              </label>
              <input
                id="upi-input"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full min-h-[48px] px-4 rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] font-mono text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[54px] rounded-2xl bg-[#176B38] hover:bg-[#12562C] text-white font-display font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {t.confirmPayBtn} (₹{totalAmount.toLocaleString('en-IN')})
            </span>
          </button>
        </form>
      )}
    </div>
  );
};
