import { VouchersClient } from '@/components/vouchers/VouchersClient';

export default function VouchersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Kho Voucher</h1>
        <p className="text-slate-500 mb-8">Thu thập các mã giảm giá hấp dẫn để mua sắm tiết kiệm hơn</p>
        <VouchersClient />
      </div>
    </div>
  );
}
