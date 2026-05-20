import { fetchEventSource } from '@microsoft/fetch-event-source';
import { isHeartbeat, type Notification, type SsePayload } from './types';

/**
 * Mở SSE stream tới BE /notifications/stream.
 *
 * EventSource native không gửi được x-auth-signature header → dùng
 * @microsoft/fetch-event-source (fetch-based, hỗ trợ headers).
 *
 * Trả về abort function — gọi để đóng stream (vd khi logout / unmount).
 */
export function startNotificationStream(opts: {
  onMessage: (n: Notification) => void;
  onError?: (err: unknown) => void;
  onOpen?: () => void;
}): () => void {
  const controller = new AbortController();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const sessionId =
    typeof window !== 'undefined'
      ? localStorage.getItem('sessionId') ?? ''
      : '';

  // KHÔNG await — để hàm trả về sync. fetchEventSource chạy nền.
  void fetchEventSource(`${baseUrl}/notifications/stream`, {
    headers: { 'x-auth-signature': sessionId },
    signal: controller.signal,
    openWhenHidden: true, // giữ stream khi tab nền (default fetch-event-source pauses)
    async onopen(response) {
      if (response.ok) {
        opts.onOpen?.();
        return;
      }
      // 401/403 → không retry vô hạn, throw để break loop
      if (response.status === 401 || response.status === 403) {
        throw new Error(`auth-failed-${response.status}`);
      }
      // 5xx hoặc lỗi khác → để default retry
    },
    onmessage(ev) {
      if (!ev.data) return;
      let payload: SsePayload;
      try {
        payload = JSON.parse(ev.data);
      } catch {
        return; // ignore frame không parse được
      }
      if (isHeartbeat(payload)) return;
      opts.onMessage(payload as Notification);
    },
    onerror(err) {
      opts.onError?.(err);
      // Trả số ms để retry. Throw nếu là fatal (auth) — fetch-event-source sẽ stop.
      if (err instanceof Error && err.message.startsWith('auth-failed-')) {
        throw err;
      }
      return 3000;
    },
  });

  return () => controller.abort();
}
