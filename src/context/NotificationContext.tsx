'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { NotificationsApi } from '@/lib/notifications/api';
import { startNotificationStream } from '@/lib/notifications/sse-client';
import type { Notification } from '@/lib/notifications/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isOpen: boolean;
  openDropdown: () => void;
  closeDropdown: () => void;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);
  // Track seen noti IDs để dedup SSE duplicate (hot-reload, multi-Subject same user...)
  const seenIdsRef = useRef<Set<number>>(new Set());

  // Detect login state qua localStorage. Re-check khi storage thay đổi (tab khác login).
  useEffect(() => {
    const check = () => {
      const sid =
        typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;
      setIsAuthenticated(!!sid);
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [list, count] = await Promise.all([
        NotificationsApi.list(20, 0),
        NotificationsApi.unreadCount(),
      ]);
      setNotifications(list);
      // Seed seenIds với noti đã load → SSE redeliver các id này sẽ bị skip
      seenIdsRef.current = new Set(list.map((n) => n.id));
      setUnreadCount(count);
    } catch {
      // Silent fail — không spam toast khi user mới load page mà chưa login
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initial load + start SSE khi authenticated; abort khi logout
  useEffect(() => {
    if (!isAuthenticated) {
      abortRef.current?.();
      abortRef.current = null;
      setNotifications([]);
      setUnreadCount(0);
      seenIdsRef.current.clear();
      return;
    }

    refresh();

    const abort = startNotificationStream({
      onOpen: () => {
        console.log('[Notifications] SSE stream connected');
      },
      onMessage: (noti) => {
        // Dedup theo id — SSE có thể deliver cùng 1 noti nhiều lần
        // (hot-reload BE đăng ký listener lặp, multi-Subject same user, ...).
        // Chỉ tăng badge + toast + push list 1 lần / noti.id.
        if (seenIdsRef.current.has(noti.id)) return;
        seenIdsRef.current.add(noti.id);

        console.log('[Notifications] SSE noti received:', noti);
        setNotifications((prev) => [noti, ...prev.filter((n) => n.id !== noti.id)].slice(0, 50));
        setUnreadCount((c) => c + 1);
        toast(noti.title, {
          description: noti.message,
          duration: 4000,
        });
      },
      onError: (err) => {
        console.warn('[Notifications] SSE error (auto-retry):', err);
      },
    });
    abortRef.current = abort;

    return () => {
      abort();
      abortRef.current = null;
    };
  }, [isAuthenticated, refresh]);

  const openDropdown = useCallback(async () => {
    setIsOpen(true);
    // Mark all as read khi user mở bell (cursor pattern)
    if (unreadCount > 0) {
      try {
        await NotificationsApi.markAllRead();
        // Optimistic UI — trust BE markAllRead success.
        // KHÔNG refetch unread-count vì browser cache 304 sẽ trả về count cũ stale.
        // Nếu SSE deliver noti mới sau đây → onMessage tự tăng badge đúng.
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
      } catch (err) {
        console.error('[Notifications] markAllRead failed:', err);
      }
    }
  }, [unreadCount]);

  const closeDropdown = useCallback(() => setIsOpen(false), []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        isOpen,
        openDropdown,
        closeDropdown,
        refresh,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return ctx;
}
