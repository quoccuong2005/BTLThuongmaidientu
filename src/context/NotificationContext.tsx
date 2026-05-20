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
      return;
    }

    refresh();

    const abort = startNotificationStream({
      onMessage: (noti) => {
        setNotifications((prev) => [noti, ...prev].slice(0, 50));
        setUnreadCount((c) => c + 1);
        toast(noti.title, {
          description: noti.message,
          duration: 4000,
        });
      },
      onError: () => {
        // fetch-event-source tự retry; không cần toast user
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
        setUnreadCount(0);
        // Cập nhật isNew local cho list
        setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
      } catch {
        // Silent
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
