'use client';

import { useEffect, useState } from 'react';
import { Voucher, MyVoucher } from '@/models/Voucher';
import { VoucherController } from '@/controllers/VoucherController';
import { Ticket, Clock, CheckCircle2, Copy, Wallet } from 'lucide-react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    setLoading(true);
    try {
      const [availableData, myData] = await Promise.all([
        VoucherController.getVouchers(),
        VoucherController.getMyVouchers()
      ]);
      setVouchers(availableData);
      setMyVouchers(myData);
    } catch (err) {
      setError('Không thể tải danh sách voucher. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (id: number) => {

    setVouchers(prev =>
      prev.map(v => v.id === id ? { ...v, is_collected: true } : v)
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
        voucher: collectedVoucher
      };
      setMyVouchers(prev => [optimisticMyVoucher, ...prev]);
    }

    const result = await VoucherController.collectVoucher(id);
    if (!result.success) {
      if (result.message === 'Bạn đã thu thập voucher này rồi') {
        toast.error('Bạn đã thu thập voucher này rồi!');
      } else {
        setVouchers(prev =>
          prev.map(v => v.id === id ? { ...v, is_collected: false } : v)
        );
        // Revert myVouchers
        setMyVouchers(prev => prev.filter(mv => mv.voucher_id !== id));
        toast.error(result.message || "Đã xảy ra lỗi khi thu thập mã giảm giá.");
      }
    } else {
      toast.success("Thu thập voucher thành công!");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã copy mã: ${code}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!isLoggedIn) {
    if (compact) {
      return (
        <div className="text-center py-8 bg-orange-50/50 rounded-2xl border border-orange-100">
          <p className="text-sm text-slate-600 mb-3">Đăng nhập để xem mã giảm giá dành cho bạn</p>
          <a href="/login" className="inline-flex items-center justify-center bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg text-sm hover:bg-orange-600 transition-colors">
            Đăng nhập
          </a>
        </div>
      );
    }
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Vui lòng đăng nhập</h2>
        <p className="text-slate-500 mb-6">Bạn cần đăng nhập để xem và thu thập mã giảm giá</p>
        <a href="/login" className="inline-flex items-center justify-center bg-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-colors">
          Đăng nhập ngay
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
        {error}
      </div>
    );
  }

  if (vouchers.length === 0 && activeTab === 'available') {
    if (compact) return null;
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Không có mã giảm giá nào</h2>
        <p className="text-slate-500">Hiện tại chưa có mã giảm giá mới. Vui lòng quay lại sau!</p>
      </div>
    );
  }

  if (myVouchers.length === 0 && activeTab === 'my') {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <Wallet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Kho voucher trống</h2>
        <p className="text-slate-500">Bạn chưa thu thập mã giảm giá nào. Hãy quay lại mục &quot;Thu thập mã&quot; nhé!</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const displayedVouchers = activeTab === 'available'
    ? (limit ? vouchers.slice(0, limit) : vouchers)
    : myVouchers;

  return (
    <div>
      {!compact && (
        <div className="flex gap-2 mb-6 p-1 bg-white border border-slate-200 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'available' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Thu thập mã
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'my' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Mã của tôi ({myVouchers.length})
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTab === 'available' ? displayedVouchers.map((voucher: any) => (
          <div key={voucher.id} className="relative flex bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
            {/* Left part (Ticket stub) */}
            <div className="w-1/3 bg-gradient-to-br from-orange-500 to-orange-600 p-4 flex flex-col items-center justify-center text-white relative">
              {/* Cutout top and bottom */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-slate-50 rounded-full"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 rounded-full"></div>

              <div className="text-center">
                <span className="block text-2xl font-black mb-1">
                  {voucher.type === 'percent' ? `${voucher.discount_value}%` : formatCurrency(voucher.discount_value).replace('₫', '')}
                  {voucher.type === 'fixed' && <span className="text-sm font-normal">đ</span>}
                </span>
                <span className="text-xs font-medium text-orange-100 uppercase tracking-wider">Giảm</span>
              </div>

              {/* Dashed line */}
              <div className="absolute right-0 top-3 bottom-3 w-px border-r-2 border-dashed border-white/40"></div>
            </div>

            {/* Right part (Details) */}
            <div className="w-2/3 p-4 flex flex-col justify-between relative bg-white">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="inline-block px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold uppercase rounded-md">
                    {voucher.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(voucher.code)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    title="Copy mã"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{voucher.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-2">{voucher.description}</p>
              </div>

              <div className="flex items-end justify-between mt-2">
                <div className="text-[10px] text-slate-400 flex flex-col gap-1">
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> HSD: {formatDate(voucher.end_date)}
                  </span>
                  <span>Đơn tối thiểu {formatCurrency(voucher.min_order_amount)}</span>
                  {voucher.max_discount_amount && (
                    <span>Giảm tối đa {formatCurrency(voucher.max_discount_amount)}</span>
                  )}
                </div>

                <button
                  disabled={voucher.is_collected}
                  onClick={() => handleCollect(voucher.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${voucher.is_collected
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white'
                    }`}
                >
                  {voucher.is_collected ? (
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Đã lưu</span>
                  ) : 'Thu thập'}
                </button>
              </div>
            </div>
          </div>
        )) : (
          displayedVouchers.map((myVoucher: any) => (
            <div key={myVoucher.id} className="relative flex bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
              {/* Left part */}
              <div className={`w-1/3 p-4 flex flex-col items-center justify-center text-white relative ${myVoucher.status === 'used' || myVoucher.is_expired ? 'bg-slate-400' : 'bg-gradient-to-br from-green-500 to-green-600'
                }`}>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-slate-50 rounded-full"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 rounded-full"></div>

                <div className="text-center">
                  <span className="block text-2xl font-black mb-1">
                    {myVoucher.voucher.type === 'percent' ? `${myVoucher.voucher.discount_value}%` : formatCurrency(myVoucher.voucher.discount_value).replace('₫', '')}
                    {myVoucher.voucher.type === 'fixed' && <span className="text-sm font-normal">đ</span>}
                  </span>
                  <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Giảm</span>
                </div>
                <div className="absolute right-0 top-3 bottom-3 w-px border-r-2 border-dashed border-white/40"></div>
              </div>

              {/* Right part */}
              <div className="w-2/3 p-4 flex flex-col justify-between relative bg-white">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase rounded-md ${myVoucher.status === 'used' || myVoucher.is_expired ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'
                      }`}>
                      {myVoucher.voucher.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(myVoucher.voucher.code)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title="Copy mã"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{myVoucher.voucher.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">Đơn tối thiểu {formatCurrency(myVoucher.voucher.min_order_amount)}</p>
                </div>

                <div className="flex items-end justify-between mt-2">
                  <div className="text-[10px] text-slate-400 flex flex-col gap-1">
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> HSD: {formatDate(myVoucher.voucher.end_date)}
                    </span>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${myVoucher.status === 'used' ? 'bg-slate-50 border-slate-200 text-slate-500' :
                    myVoucher.is_expired ? 'bg-red-50 border-red-200 text-red-500' :
                      'bg-green-50 border-green-200 text-green-600'
                    }`}>
                    {myVoucher.status === 'used' ? 'Đã dùng' :
                      myVoucher.is_expired ? 'Hết hạn' :
                        `Sẵn sàng`}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
