import api from '@/lib/axios';
import type { Notification } from './types';

// no-cache headers để tránh browser cache 304 trả stale count/list
const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
};

// REST wrapper — tận dụng axios interceptor đã inject x-auth-signature
export const NotificationsApi = {
  async list(limit = 20, offset = 0): Promise<Notification[]> {
    const res = await api.get('/notifications', {
      params: { limit, offset },
      headers: NO_CACHE_HEADERS,
    });
    return res.data?.data ?? res.data ?? [];
  },

  async unreadCount(): Promise<number> {
    const res = await api.get('/notifications/unread-count', {
      headers: NO_CACHE_HEADERS,
    });
    const payload = res.data?.data ?? res.data;
    return payload?.count ?? 0;
  },

  async markAllRead(): Promise<void> {
    await api.patch('/notifications/mark-all-read');
  },
};
