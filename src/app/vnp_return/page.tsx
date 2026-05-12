'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { OrderController } from '@/controllers/OrderController';
import { CheckCircle2, XCircle, Clock, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function VNPayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failure' | 'pending'>('loading');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [vnpayUrl, setVnpayUrl] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        // vnp_TxnRef = "{orderId}_{timestamp}" — cần tách lấy orderId
        const txnRef = searchParams.get('vnp_TxnRef');
        if (!txnRef) {
          setStatus('failure');
          setMessage('Không tìm thấy thông tin đơn hàng');
          return;
        }

        const extractedId = txnRef.split('_')[0];
        setOrderId(extractedId);

        // Lấy paymentUrl từ localStorage để cho phép retry
        const stored = localStorage.getItem(`vnpay_url_${extractedId}`);
        if (stored) setVnpayUrl(stored);

        // Theo guide: FE không được trust query params từ VNPay
        // Chỉ tin vào kết quả từ GET /orders/:id
        const order = await OrderController.getOrderDetails(extractedId);

        if (!order) {
          setStatus('failure');
          setMessage('Không tìm thấy đơn hàng');
          return;
        }

        const successStatuses = ['paid', 'confirmed', 'shipping', 'delivered', 'completed'];
        const failStatuses = ['cancelled'];

        if (successStatuses.includes(order.status)) {
          setStatus('success');
          setMessage('Thanh toán đơn hàng thành công!');
          // Xoá paymentUrl khỏi localStorage khi đã thanh toán thành công
          localStorage.removeItem(`vnpay_url_${txnRef}`);
        } else if (failStatuses.includes(order.status)) {
          setStatus('failure');
          setMessage('Thanh toán không thành công. Đơn hàng đã bị hủy.');
        } else {
          // pending_payment — VNPay chưa cập nhật hoặc đang xử lý
          setStatus('pending');
          setMessage('Giao dịch đang được xử lý. Vui lòng kiểm tra lại sau.');
        }
      } catch (error) {
        setStatus('failure');
        setMessage('Có lỗi xảy ra khi xác thực thanh toán');
      }
    };

    verify();
  }, [searchParams]);

  useEffect(() => {
    if (status === 'loading' || status === 'pending') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(orderId ? `/orders/${orderId}` : '/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, orderId, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h1 className="text-xl font-bold text-gray-800">Đang xác thực giao dịch...</h1>
        <p className="text-gray-500 mt-2">Vui lòng không đóng trình duyệt</p>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-amber-50 text-amber-500">
            <Clock size={48} />
          </div>
          <h1 className="text-2xl font-black mb-2 text-amber-600">Đang xử lý</h1>
          <p className="text-gray-500 mb-8 font-medium">{message}</p>
          <Link
            href={orderId ? `/orders/${orderId}` : '/orders'}
            className="w-full py-4 rounded-2xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Xem chi tiết đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const isSuccess = status === 'success';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-500">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
          {isSuccess ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
        </div>

        <h1 className={`text-2xl font-black mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
        </h1>
        <p className="text-gray-500 mb-8 font-medium">{message}</p>

        <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Mã đơn hàng:</span>
            <span className="font-bold text-gray-700">#ORD-{orderId || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Mã giao dịch:</span>
            <span className="font-bold text-gray-700">{searchParams.get('vnp_TransactionNo') || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Số tiền:</span>
            <span className="font-bold text-gray-900">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(searchParams.get('vnp_Amount')) / 100)}
            </span>
          </div>
        </div>

        {!isSuccess && (
          <div className="relative h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className="absolute top-0 left-0 h-full transition-all duration-1000 ease-linear bg-red-500"
              style={{ width: `${(countdown / 5) * 100}%` }}
            ></div>
          </div>
        )}
        {!isSuccess && (
          <p className="text-xs text-gray-400 mb-6">
            Tự động chuyển hướng sau <span className="font-bold text-gray-700">{countdown}s</span>...
          </p>
        )}
        {isSuccess && (
          <>
            <div className="relative h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="absolute top-0 left-0 h-full transition-all duration-1000 ease-linear bg-green-500"
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Tự động chuyển hướng sau <span className="font-bold text-gray-700">{countdown}s</span>...
            </p>
          </>
        )}

        <div className="space-y-3">
          <Link
            href={orderId ? `/orders/${orderId}` : '/orders'}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95 ${isSuccess ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-gray-600 hover:bg-gray-700 shadow-gray-100'}`}
          >
            <ArrowLeft size={18} />
            {isSuccess ? 'Xem chi tiết đơn hàng' : 'Xem đơn hàng'}
          </Link>

          {!isSuccess && vnpayUrl && (
            <button
              onClick={() => { window.location.href = vnpayUrl; }}
              className="w-full py-4 rounded-2xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 transform active:scale-95"
            >
              <RefreshCw size={18} /> Thanh toán lại qua VNPAY
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VNPayReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h1 className="text-xl font-bold text-gray-800">Đang tải...</h1>
      </div>
    }>
      <VNPayReturnContent />
    </Suspense>
  );
}
