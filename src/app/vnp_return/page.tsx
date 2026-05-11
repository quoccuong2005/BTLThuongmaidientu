'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { OrderController } from '@/controllers/OrderController';
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function VNPayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verify = async () => {
      try {
        const queryStr = searchParams.toString();
        const response = await OrderController.verifyPayment(queryStr);
        
        // VNPAY response code '00' usually means success
        if (searchParams.get('vnp_ResponseCode') === '00') {
          setStatus('success');
          setMessage('Thanh toán đơn hàng thành công!');
        } else {
          setStatus('failure');
          setMessage(response.message || 'Thanh toán không thành công');
        }
        
        // Try to get order ID from search params if available, or from response
        const vnpOrderId = searchParams.get('vnp_TxnRef');
        if (vnpOrderId) setOrderId(vnpOrderId);

      } catch (error) {
        setStatus('failure');
        setMessage('Có lỗi xảy ra khi xác thực thanh toán');
      }
    };

    verify();
  }, [searchParams]);

  useEffect(() => {
    if (status === 'loading') return;

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

        <div className="relative h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${(countdown / 5) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mb-8">
          Tự động chuyển hướng sau <span className="font-bold text-gray-700">{countdown}s</span>...
        </p>

        <Link 
          href={orderId ? `/orders/${orderId}` : '/orders'}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95 ${isSuccess ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'}`}
        >
          {isSuccess ? <CheckCircle2 size={18} /> : <RefreshCw size={18} />}
          {isSuccess ? 'Xem chi tiết đơn hàng' : 'Thanh toán lại'}
        </Link>
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
