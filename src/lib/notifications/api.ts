import api from '@/lib/axios';
import type { Notification } from './types';

// REST wrapper — tận dụng axios interceptor đã inject x-auth-signature
export const NotificationsApi = {
  async list(limit = 20, offset = 0): Promise<Notification[]> {
    const res = await api.get('/notifications', { params: { limit, offset } });
    // Response format dự án: { statusCode, message, data }
    return res.data?.data ?? res.data ?? [];
  },

  async unreadCount(): Promise<number> {
    const res = await api.get('/notifications/unread-count');
    const payload = res.data?.data ?? res.data;
    return payload?.count ?? 0;
  },

  async markAllRead(): Promise<void> {
    await api.patch('/notifications/mark-all-read');
  },
};
