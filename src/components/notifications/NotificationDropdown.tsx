'use client';

import { useEffect, useRef } from 'react';
import { BellOff } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationItem } from './NotificationItem';

interface Props {
  anchorRef: React.RefObject<HTMLElement>;
}

export function NotificationDropdown({ anchorRef }: Props) {
  const { notifications, isLoading, isOpen, closeDropdown } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close khi click ngoài panel + bell button
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        closeDropdown();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdown();
        anchorRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, closeDropdown, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Danh sách thông báo"
      className="absolute right-0 top-full z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-150 sm:w-96"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-bold text-slate-900">Thông báo</h2>
        {notifications.length > 0 && (
          <span className="text-[11px] text-slate-400">
            {notifications.length} gần nhất
          </span>
        )}
      </div>

      <div
        className="max-h-[420px] overflow-y-auto overscroll-contain"
        aria-live="polite"
      >
        {isLoading && notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-slate-500">
            Đang tải…
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <BellOff size={32} className="text-slate-300" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-600">
              Chưa có thông báo nào
            </p>
            <p className="text-xs text-slate-400">
              Thông báo về đơn hàng, voucher, sản phẩm mới sẽ hiện ở đây.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map((noti) => (
              <li key={noti.id}>
                <NotificationItem
                  notification={noti}
                  onClick={closeDropdown}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
