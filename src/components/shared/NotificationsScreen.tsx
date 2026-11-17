import React from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  CreditCard,
  Eye,
  MessageSquare,
  PackageCheck,
} from 'lucide-react';
import { Language, NotificationCategory, NotificationItem, UserRole } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface NotificationsScreenProps {
  role: UserRole;
  notifications: NotificationItem[];
  language: Language;
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
}

const CATEGORY_ICON: Record<NotificationCategory, React.ReactNode> = {
  enquiry: <MessageSquare className="w-5 h-5" />,
  interest: <Eye className="w-5 h-5" />,
  order: <PackageCheck className="w-5 h-5" />,
  payment: <CreditCard className="w-5 h-5" />,
  expiry: <Clock className="w-5 h-5" />,
};

const CATEGORY_LABEL: Record<NotificationCategory, string> = {
  enquiry: 'New Buyer Enquiry',
  interest: 'Listing Interest',
  order: 'Order Update',
  payment: 'Payment Update',
  expiry: 'Listing Expiry Reminder',
};

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  role,
  notifications,
  language,
  onMarkAllRead,
  onMarkRead,
}) => {
  const t = TRANSLATIONS[language];
  const visible = notifications.filter((n) => n.role === role || n.role === 'both');

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#252B25]">
            {t.notificationsTitle}
          </h1>
          <p className="text-sm text-[#252B25]/70">
            Enquiries, order milestones, payments, and crop reminders.
          </p>
        </div>

        <button
          type="button"
          onClick={onMarkAllRead}
          className="min-h-[44px] px-4 py-2 rounded-xl border border-[#DCE5D7] bg-white hover:bg-[#EFF4EC] text-sm font-semibold text-[#176B38] inline-flex items-center gap-2 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          <span>{t.markAllRead}</span>
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCE5D7] p-10 text-center space-y-2">
          <Bell className="w-8 h-8 text-[#176B38] mx-auto" />
          <p className="font-bold text-[#252B25]">No notifications right now</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onMarkRead(item.id)}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-colors flex items-start gap-4 cursor-pointer ${
                item.read
                  ? 'bg-white border-[#E2E8DC]'
                  : 'bg-[#F2F8F3] border-[#B6D8BE]'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  item.read
                    ? 'bg-[#F1F5EE] text-[#176B38]'
                    : 'bg-[#176B38] text-white'
                }`}
              >
                {CATEGORY_ICON[item.category]}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#176B38]">
                    {CATEGORY_LABEL[item.category]}
                  </span>
                  <span className="text-xs text-[#252B25]/60">{item.timestamp}</span>
                </div>
                <h2 className="font-display text-base font-bold text-[#252B25]">
                  {item.title}
                </h2>
                <p className="text-sm text-[#252B25]/80 leading-snug">{item.message}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
