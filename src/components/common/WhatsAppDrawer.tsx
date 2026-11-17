import React, { useState } from 'react';
import { Check, Copy, ExternalLink, MessageCircle, Phone, X } from 'lucide-react';
import { FarmerProfile, ProduceListing } from '../../types';
import { SafeImage } from './SafeImage';

interface WhatsAppDrawerProps {
  farmer: FarmerProfile;
  listing?: ProduceListing;
  onClose: () => void;
  onSent?: (message: string) => void;
}

export const WhatsAppDrawer: React.FC<WhatsAppDrawerProps> = ({
  farmer,
  listing,
  onClose,
  onSent,
}) => {
  const defaultMsg = listing
    ? `Namaste ${farmer.name}, I saw your ${listing.cropName} (₹${listing.pricePerKg}/kg, ${listing.quantityKg} kg available) on KisanDirect. I would like to buy directly from your farm.`
    : `Namaste ${farmer.name}, I found your farm profile on KisanDirect and would like to enquire about fresh produce.`;

  const [message, setMessage] = useState(defaultMsg);
  const [copied, setCopied] = useState(false);
  const [sentLocal, setSentLocal] = useState(false);

  const waUrl = `https://wa.me/91${farmer.mobile}?text=${encodeURIComponent(message)}`;

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(`+91 ${farmer.mobile}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
    }
  };

  const handleSendInPrototype = () => {
    setSentLocal(true);
    onSent?.(message);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-modal-title"
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-[#E2E8DC] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EEE4] bg-[#F8FAF5]">
          <div className="flex items-center gap-3">
            <SafeImage
              src={farmer.photo}
              alt={farmer.name}
              className="w-11 h-11 rounded-full object-cover border border-[#D8E2D4]"
            />
            <div>
              <h3 id="wa-modal-title" className="text-base font-bold text-[#252B25]">
                {farmer.name}
              </h3>
              <p className="text-xs text-[#252B25]/70">
                {farmer.village}, {farmer.district} · +91 {farmer.mobile}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#252B25]/70 hover:bg-[#E8EEE4] transition-colors"
            aria-label="Close WhatsApp chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {sentLocal ? (
            <div className="bg-[#EAF5ED] border border-[#C3E2CB] rounded-2xl p-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#176B38] text-white flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-base font-bold text-[#176B38]">
                Enquiry Sent to {farmer.name}
              </p>
              <p className="text-sm text-[#252B25]/80">
                Your direct message has been logged and the farmer has been notified.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="wa-message-box"
                  className="block text-sm font-semibold text-[#252B25] mb-1.5"
                >
                  Message for Farmer
                </label>
                <textarea
                  id="wa-message-box"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-[#D4DFCE] bg-[#F8FAF5] p-3 text-sm text-[#252B25] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176B38]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSendInPrototype}
                  className="min-h-[48px] px-4 py-3 rounded-xl bg-[#176B38] hover:bg-[#12562C] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Direct Enquiry</span>
                </button>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-4 py-3 rounded-xl border border-[#176B38] text-[#176B38] hover:bg-[#EAF5ED] font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open WhatsApp App</span>
                </a>
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#EEF2EA] text-sm">
            <a
              href={`tel:+91${farmer.mobile}`}
              className="inline-flex items-center gap-2 text-[#176B38] font-semibold min-h-[44px] px-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 {farmer.mobile}</span>
            </a>
            <button
              type="button"
              onClick={handleCopyPhone}
              className="inline-flex items-center gap-1.5 text-[#252B25]/75 hover:text-[#252B25] font-medium min-h-[44px] px-3 rounded-lg hover:bg-[#F1F5EE] cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#176B38]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Number'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
