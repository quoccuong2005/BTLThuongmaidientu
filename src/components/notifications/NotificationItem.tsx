"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Ticket,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";
import {
  NOTIFICATION_TYPE,
  type Notification,
  type NotificationType,
} from "@/lib/notifications/types";

const ICON_BY_TYPE: Record<NotificationType, LucideIcon> = {
  [NOTIFICATION_TYPE.ORDER_PLACED]: ShoppingBag,
  [NOTIFICATION_TYPE.ORDER_STATUS_CHANGED]: Truck,
  [NOTIFICATION_TYPE.VOUCHER_NEW]: Ticket,
  [NOTIFICATION_TYPE.PRODUCT_NEW]: Package,
};

const COLOR_BY_TYPE: Record<NotificationType, string> = {
  [NOTIFICATION_TYPE.ORDER_PLACED]: "text-emerald-600 bg-emerald-50",
  [NOTIFICATION_TYPE.ORDER_STATUS_CHANGED]: "text-indigo-600 bg-indigo-50",
  [NOTIFICATION_TYPE.VOUCHER_NEW]: "text-orange-600 bg-orange-50",
  [NOTIFICATION_TYPE.PRODUCT_NEW]: "text-sky-600 bg-sky-50",
};

function getHref(noti: Notification): string {
  const data = (noti.data ?? {}) as Record<string, unknown>;
  switch (noti.type) {
    case NOTIFICATION_TYPE.ORDER_PLACED:
    case NOTIFICATION_TYPE.ORDER_STATUS_CHANGED:
      return data.orderId ? `/orders/${data.orderId}` : "/orders";
    case NOTIFICATION_TYPE.VOUCHER_NEW:
      return "/vouchers";
    case NOTIFICATION_TYPE.PRODUCT_NEW:
      return data.productId ? `/product/${data.productId}` : "/";
    default:
      return "/";
  }
}

// Time format: tương đối ngắn (vd "5 phút trước"); dùng Intl.DateTimeFormat làm fallback
function formatTime(iso: string | Date | null | undefined): string {
  if (!iso) return "";
  const date = iso instanceof Date ? iso : new Date(iso);
  // Guard Invalid Date (vd ISO sai, MySQL zero datetime, null)
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} giờ trước`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

interface Props {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationItem({ notification, onClick }: Props) {
  const Icon = ICON_BY_TYPE[notification.type] ?? Package;
  const colorClass =
    COLOR_BY_TYPE[notification.type] ?? "text-slate-600 bg-slate-50";

  return (
    <Link
      href={getHref(notification)}
      onClick={onClick}
      className="flex items-start gap-3 px-3 py-3 transition-colors hover:bg-orange-50 focus-visible:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400"
    >
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${colorClass}`}
      >
        <Icon size={16} />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm ${notification.isNew ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}
        >
          {notification.title}
        </p>
        <p className="line-clamp-2 text-xs leading-snug text-slate-500">
          {notification.message}
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          {formatTime(notification.created_at)}
        </p>
      </div>

      {notification.isNew && (
        <span
          aria-label="Chưa đọc"
          className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500"
        />
      )}
    </Link>
  );
}
