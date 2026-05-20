'use client';

import { useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';

export function BellIcon() {
  const { unreadCount, isOpen, openDropdown, closeDropdown } = useNotifications();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const badgeLabel =
    unreadCount > 99 ? '99+' : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label={
          unreadCount > 0
            ? `Thông báo (${unreadCount} chưa đọc)`
            : 'Thông báo'
        }
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title="Thông báo"
        className="tap-bounce relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-transparent text-slate-600 transition-colors hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 aria-expanded:bg-orange-50 aria-expanded:text-orange-600"
      >
        <Bell size={20} aria-hidden="true" />
        {badgeLabel !== null && (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-orange-500 px-1 text-center text-[10px] font-bold leading-4 text-white"
          >
            {badgeLabel}
          </span>
        )}
      </button>

      <NotificationDropdown anchorRef={buttonRef} />
    </div>
  );
}
