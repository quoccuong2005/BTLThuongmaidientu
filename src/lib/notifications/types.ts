// Mirror với BE constants. Phải đồng bộ tay nếu BE thay đổi.

export const NOTIFICATION_TYPE = {
  ORDER_PLACED: 'ORDER_PLACED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  VOUCHER_NEW: 'VOUCHER_NEW',
  PRODUCT_NEW: 'PRODUCT_NEW',
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export const NOTIFICATION_AUDIENCE = {
  USER: 'USER',
  BROADCAST: 'BROADCAST',
} as const;

export type NotificationAudience =
  (typeof NOTIFICATION_AUDIENCE)[keyof typeof NOTIFICATION_AUDIENCE];

// Khớp NotificationResponseDto của BE
export interface Notification {
  id: number;
  type: NotificationType;
  audience: NotificationAudience;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  isNew: boolean;
  created_at: string; // ISO string từ JSON
}

// Frame SSE từ BE: data có thể là Notification hoặc heartbeat
export type SsePayload =
  | Notification
  | { type: 'heartbeat' };

export function isHeartbeat(p: unknown): p is { type: 'heartbeat' } {
  return (
    typeof p === 'object' &&
    p !== null &&
    'type' in p &&
    (p as { type: string }).type === 'heartbeat'
  );
}
