import { VoucherController } from '@/controllers/VoucherController';
import { Voucher } from '@/models/Voucher';
import { TicketPercent } from 'lucide-react';

function formatDiscount(voucher: Voucher): string {
  if (voucher.type === 'percent') return `${voucher.discount_value}%`;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(voucher.discount_value);
}

export async function FeaturedVoucherCard() {
  const vouchers = await VoucherController.getVouchers();
  const voucher = vouchers[0] ?? null;

  if (!voucher) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-4 text-center">
        <TicketPercent className="mx-auto mb-2 h-6 w-6 text-orange-300" />
        <p className="text-xs text-slate-400">Chưa có voucher nổi bật.</p>
      </div>
    );
  }

  return (
    <a
      href="/vouchers"
      className="group mt-4 block rounded-2xl border border-dashed border-orange-300 bg-orange-50 p-4 transition hover:border-orange-400 hover:bg-orange-100"
    >
      <p className="text-sm font-bold text-slate-500">Voucher</p>
      <p className="mt-1 truncate text-3xl font-black tracking-wider text-slate-900">
        {voucher.code}
      </p>
      <p className="mt-1 text-lg font-black text-orange-600">
        Giảm {formatDiscount(voucher)}
      </p>
      {voucher.min_order_amount > 0 && (
        <p className="mt-1 text-xs text-slate-500">
          Đơn tối thiểu{' '}
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
          }).format(voucher.min_order_amount)}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-400 line-clamp-2">
        {voucher.description || 'Giảm giá cho đơn hàng đủ điều kiện.'}
      </p>
      <span className="mt-3 inline-block text-xs font-bold text-orange-600 underline underline-offset-2 group-hover:text-orange-700">
        Xem tất cả →
      </span>
    </a>
  );
}
