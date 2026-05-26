'use client';

import { useEffect, useState } from 'react';
import { Voucher, MyVoucher } from '@/models/Voucher';
import { VoucherController } from '@/controllers/VoucherController';
import { Ticket, Clock, CheckCircle2, Copy, Wallet, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface VouchersClientProps {
  limit?: number;
  compact?: boolean;
}

export function VouchersClient({ limit, compact = false }: VouchersClientProps = {}) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [myVouchers, setMyVouchers] = useState<MyVoucher[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    const loggedIn = !!sessionId;

    setIsLoggedIn(loggedIn);
    loadVouchers(loggedIn);
  }, []);

  const loadVouchers = async (loggedIn: boolean) => {
    setLoading(true);

    try {
      const availableData = await VoucherController.getVouchers();
      setVouchers(availableData);

      if (loggedIn) {
        const myData = await VoucherController.getMyVouchers();
        // Lọc bỏ record có voucher null (voucher gốc đã bị xóa nhưng user_vouchers còn ref)
        setMyVouchers((myData ?? []).filter((mv) => mv && mv.voucher));
      } else {
        setMyVouchers([]);
      }
    } catch (err) {
      setError('Không thể tải danh sách voucher. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (id: number) => {
    if (!isLoggedIn) {
      toast.info('Vui lòng đăng nhập để nhận voucher');
      window.location.href = '/login';
      return;
    }

    setVouchers(prev =>
      prev.map(v => (v.id === id ? { ...v, is_collected: true } : v)),
    );

    const collectedVoucher = vouchers.find(v => v.id === id);

    if (collectedVoucher) {
      const optimisticMyVoucher: MyVoucher = {
        id: Date.now(),
        user_id: 0,
        voucher_id: id,
        status: 'collected',
        collected_at: new Date().toISOString(),
        used_at: null,
        days_left: 30,
        is_expired: false,
        voucher: collectedVoucher,
      };

      setMyVouchers(prev => [optimisticMyVoucher, ...prev]);
    }

    const result = await VoucherController.collectVoucher(id);

    if (!result.success) {
      if (result.message === 'Bạn đã thu thập voucher này rồi') {
        toast.error('Bạn đã thu thập voucher này rồi!');
      } else {
        setVouchers(prev =>
          prev.map(v => (v.id === id ? { ...v, is_collected: false } : v)),
        );

        setMyVouchers(prev => prev.filter(mv => mv.voucher_id !== id));
        toast.error(result.message || 'Đã xảy ra lỗi khi thu thập mã giảm giá.');
      }
    } else {
      toast.success('Thu thập voucher thành công!');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã copy mã: ${code}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return Number(value).toString().replace(/\.0+$/, '');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (activeTab === 'my' && !isLoggedIn) {
    setActiveTab('available');
  }

  if (vouchers.length === 0 && activeTab === 'available') {
    if (compact) return null;

    return (
      <div className="rounded-3xl border border-slate-100 bg-white py-16 text-center shadow-sm">
        <Ticket className="mx-auto mb-4 h-16 w-16 text-slate-300" />
        <h2 className="mb-2 text-xl font-bold text-slate-700">
          Không có mã giảm giá nào
        </h2>
        <p className="text-slate-500">
          Hiện tại chưa có mã giảm giá mới. Vui lòng quay lại sau!
        </p>
      </div>
    );
  }

  if (myVouchers.length === 0 && activeTab === 'my') {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white py-16 text-center shadow-sm">
        <Wallet className="mx-auto mb-4 h-16 w-16 text-slate-300" />
        <h2 className="mb-2 text-xl font-bold text-slate-700">
          Kho voucher trống
        </h2>
        <p className="text-slate-500">
          Bạn chưa thu thập mã giảm giá nào. Hãy quay lại mục &quot;Thu thập mã&quot; nhé!
        </p>
      </div>
    );
  }

  const displayedVouchers =
    activeTab === 'available'
      ? limit
        ? vouchers.slice(0, limit)
        : vouchers
      : myVouchers;

  return (
    <div>
      {!compact && (
        <div className="mb-6 flex w-fit gap-2 rounded-xl border border-slate-200 bg-white p-1">
          <button
            onClick={() => setActiveTab('available')}
            className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === 'available'
                ? 'bg-orange-50 text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Thu thập mã
          </button>

          {isLoggedIn && (
            <button
              onClick={() => setActiveTab('my')}
              className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === 'my'
                  ? 'bg-orange-50 text-orange-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Mã của tôi ({myVouchers.length})
            </button>
          )}
        </div>
      )}

      {!isLoggedIn && !compact && activeTab === 'available' && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          <Lock size={16} />
          <span>
            Bạn vẫn có thể xem voucher, nhưng cần đăng nhập để nhận mã.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {activeTab === 'available'
          ? displayedVouchers.map((voucher: any) => (
            <div
              key={voucher.id}
              className="group relative flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative flex w-1/3 flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
                <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-slate-50" />
                <div className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-slate-50" />

                <div className="text-center">
                  <span className="mb-1 block text-2xl font-black">
                    {voucher.type === 'percent'
                      ? `${formatPercent(voucher.discount_value)}%`
                      : formatCurrency(voucher.discount_value).replace('₫', '')}
                    {voucher.type === 'fixed' && (
                      <span className="text-sm font-normal">đ</span>
                    )}
                  </span>

                  <span className="text-xs font-medium uppercase tracking-wider text-orange-100">
                    Giảm
                  </span>
                </div>

                <div className="absolute bottom-3 right-0 top-3 w-px border-r-2 border-dashed border-white/40" />
              </div>

              <div className="relative flex w-2/3 flex-col justify-between bg-white p-4">
                <div>
                  <div className="mb-1 flex items-start justify-between">
                    <span className="inline-block rounded-md bg-orange-100 px-2 py-1 text-[10px] font-bold uppercase text-orange-600">
                      {voucher.code}
                    </span>

                    <button
                      onClick={() => handleCopyCode(voucher.code)}
                      className="text-slate-400 transition-colors hover:text-slate-600"
                      title="Copy mã"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  <h3 className="mb-1 text-sm font-bold leading-tight text-slate-800">
                    {voucher.name}
                  </h3>

                  <p className="mb-2 line-clamp-2 text-xs text-slate-500">
                    {voucher.description}
                  </p>
                </div>

                <div className="mt-2 flex items-end justify-between gap-2">
                  <div className="flex flex-col gap-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> HSD: {formatDate(voucher.end_date)}
                    </span>

                    <span>
                      Đơn tối thiểu {formatCurrency(voucher.min_order_amount)}
                    </span>

                    {voucher.max_discount_amount && (
                      <span>
                        Giảm tối đa {formatCurrency(voucher.max_discount_amount)}
                      </span>
                    )}
                  </div>

                  <button
                    disabled={isLoggedIn && voucher.is_collected}
                    onClick={() => handleCollect(voucher.id)}
                    className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${isLoggedIn && voucher.is_collected
                        ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                        : isLoggedIn
                          ? 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                  >
                    {isLoggedIn && voucher.is_collected ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} /> Đã lưu
                      </span>
                    ) : isLoggedIn ? (
                      'Nhận'
                    ) : (
                      'Nhận'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
          : displayedVouchers
              .filter((myVoucher: any) => myVoucher && myVoucher.voucher)
              .map((myVoucher: any) => (
            <div
              key={myVoucher.id}
              className="group relative flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`relative flex w-1/3 flex-col items-center justify-center p-4 text-white ${myVoucher.status === 'used' || myVoucher.is_expired
                    ? 'bg-slate-400'
                    : 'bg-gradient-to-br from-green-500 to-green-600'
                  }`}
              >
                <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-slate-50" />
                <div className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-slate-50" />

                <div className="text-center">
                  <span className="mb-1 block text-2xl font-black">
                    {myVoucher.voucher.type === 'percent'
                      ? `${formatPercent(myVoucher.voucher.discount_value)}%`
                      : formatCurrency(myVoucher.voucher.discount_value).replace('₫', '')}
                    {myVoucher.voucher.type === 'fixed' && (
                      <span className="text-sm font-normal">đ</span>
                    )}
                  </span>

                  <span className="text-xs font-medium uppercase tracking-wider text-white/80">
                    Giảm
                  </span>
                </div>

                <div className="absolute bottom-3 right-0 top-3 w-px border-r-2 border-dashed border-white/40" />
              </div>

              <div className="relative flex w-2/3 flex-col justify-between bg-white p-4">
                <div>
                  <div className="mb-1 flex items-start justify-between">
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-[10px] font-bold uppercase ${myVoucher.status === 'used' || myVoucher.is_expired
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-green-100 text-green-700'
                        }`}
                    >
                      {myVoucher.voucher.code}
                    </span>

                    <button
                      onClick={() => handleCopyCode(myVoucher.voucher.code)}
                      className="text-slate-400 transition-colors hover:text-slate-600"
                      title="Copy mã"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  <h3 className="mb-1 text-sm font-bold leading-tight text-slate-800">
                    {myVoucher.voucher.name}
                  </h3>

                  <p className="mb-2 line-clamp-2 text-xs text-slate-500">
                    Đơn tối thiểu {formatCurrency(myVoucher.voucher.min_order_amount)}
                  </p>
                </div>

                <div className="mt-2 flex items-end justify-between">
                  <div className="flex flex-col gap-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> HSD:{' '}
                      {formatDate(myVoucher.voucher.end_date)}
                    </span>
                  </div>

                  <span
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${myVoucher.status === 'used'
                        ? 'border-slate-200 bg-slate-50 text-slate-500'
                        : myVoucher.is_expired
                          ? 'border-red-200 bg-red-50 text-red-500'
                          : 'border-green-200 bg-green-50 text-green-600'
                      }`}
                  >
                    {myVoucher.status === 'used'
                      ? 'Đã dùng'
                      : myVoucher.is_expired
                        ? 'Hết hạn'
                        : 'Sẵn sàng'}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}