'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OrderController, Order } from '@/controllers/OrderController';
import { ProductController } from '@/controllers/ProductController';
import { Package, Calendar, MapPin, CreditCard, ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { OrderItemReviewAction } from '@/components/review/OrderItemReviewAction';
import type { OrderItem } from '@/controllers/OrderController';

// Lấy URL ảnh: ưu tiên product_line.images[0] (gallery), fallback product.image_url,
// cuối cùng null để render placeholder icon.
function getItemImageUrl(item: OrderItem): string | null {
  const images = item.product?.product_line?.images;
  if (images && images.length > 0) {
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    return sorted[0].url;
  }
  return item.product?.image_url ?? null;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [vnpayUrl, setVnpayUrl] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await OrderController.getOrderDetails(id as string);
      setOrder(data);
      const stored = localStorage.getItem(`vnpay_url_${id}`);
      if (stored) setVnpayUrl(stored);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleCancel = async () => {
    if (!order || !cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }
    setShowConfirmModal(false);

    try {
      setIsCancelling(true);
      const success = await OrderController.cancelOrder(order.id, cancelReason);
      if (success) {
        toast.success('Đã hủy đơn hàng thành công');
        setCancelReason('');
        fetchDetail(); // Refresh order info
      } else {
        toast.error('Hủy đơn hàng thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleComplete = async () => {
    if (!order) return;

    try {
      setIsCompleting(true);
      const success = await OrderController.completeOrder(order.id);
      if (success) {
        toast.success('Đã xác nhận nhận hàng thành công');
        fetchDetail(); // Refresh order info
      } else {
        toast.error('Xác nhận thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xác nhận');
    } finally {
      setIsCompleting(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return { label: 'Chờ thanh toán', icon: <Clock size={16} />, color: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 'paid':
        return { label: 'Đã thanh toán', icon: <CreditCard size={16} />, color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 'confirmed':
        return { label: 'Đã xác nhận', icon: <Package size={16} />, color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 'shipping':
        return { label: 'Đang giao hàng', icon: <Truck size={16} />, color: 'text-purple-600 bg-purple-50 border-purple-100' };
      case 'delivered':
        return { label: 'Đã giao hàng', icon: <CheckCircle2 size={16} />, color: 'text-teal-600 bg-teal-50 border-teal-100' };
      case 'completed':
        return { label: 'Hoàn thành', icon: <CheckCircle2 size={16} />, color: 'text-green-600 bg-green-50 border-green-100' };
      case 'cancelled':
        return { label: 'Đã hủy', icon: <XCircle size={16} />, color: 'text-red-600 bg-red-50 border-red-100' };
      case 'return_requested':
        return { label: 'Yêu cầu trả hàng', icon: <AlertCircle size={16} />, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' };
      case 'returned':
        return { label: 'Đã trả hàng', icon: <AlertCircle size={16} />, color: 'text-gray-600 bg-gray-50 border-gray-100' };
      case 'refunded':
        return { label: 'Đã hoàn tiền', icon: <CheckCircle2 size={16} />, color: 'text-green-600 bg-green-50 border-green-100' };
      default:
        return { label: status, icon: <AlertCircle size={16} />, color: 'text-gray-600 bg-gray-50 border-gray-100' };
    }
  };

  const getOrderStatusInfo = (order: Order) => {
    if (order.status === 'pending_payment' && order.payment_method?.toLowerCase() === 'cod') {
      return { label: 'Chờ xác nhận', icon: <Clock size={16} />, color: 'text-amber-600 bg-amber-50 border-amber-100' };
    }
    return getStatusInfo(order.status);
  };

  const getTimelineSteps = (order: Order) => {
    const steps = [
      { status: 'pending_payment', label: 'Đặt hàng thành công', time: order.created_at, isCompleted: true },
      { status: 'paid', label: 'Thanh toán thành công', time: order.paid_at, isCompleted: !!order.paid_at || ['paid', 'confirmed', 'shipping', 'delivered', 'completed'].includes(order.status) },
      { status: 'confirmed', label: 'Đã xác nhận & Chuẩn bị hàng', time: null, isCompleted: ['confirmed', 'shipping', 'delivered', 'completed'].includes(order.status) },
      { status: 'shipping', label: 'Đang giao hàng', time: null, isCompleted: ['shipping', 'delivered', 'completed'].includes(order.status) },
      { status: 'delivered', label: 'Giao hàng thành công', time: order.delivered_at, isCompleted: ['delivered', 'completed'].includes(order.status) },
      { status: 'completed', label: 'Hoàn thành', time: order.completed_at, isCompleted: order.status === 'completed' }
    ];

    if (order.status === 'cancelled') {
      steps.push({ status: 'cancelled', label: 'Đã hủy đơn hàng', time: order.updated_at, isCompleted: true });
    } else if (['return_requested', 'returned', 'refunded'].includes(order.status)) {
      steps.push({ status: order.status, label: getStatusInfo(order.status).label, time: order.updated_at, isCompleted: true });
    }

    return steps.filter(step => {
      if (step.status === 'paid' && order.payment_method === 'cod' && !order.paid_at) return false;
      return true;
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={48} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h1>
        <p className="text-gray-500 mb-8">Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/orders" className="btn-brand px-8 py-3 inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const status = getOrderStatusInfo(order);
  const createdAt = new Date(order.created_at).toLocaleString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Chi tiết đơn hàng #ORD-{order.id}</h1>
            <p className="text-gray-500 text-sm">Đặt lúc {createdAt}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${status.color}`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items and Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-2">
              <ShoppingBag size={20} className="text-orange-500" />
              <h2 className="font-bold text-lg">Sản phẩm đã chọn</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items?.map((item) => {
                const imageUrl = getItemImageUrl(item);
                return (
                  <div key={item.id} className="p-6">
                    <div className="flex gap-4">
                      <Link
                        href={item.product_id ? `/product/${item.product_id}` : '#'}
                        className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden flex-shrink-0 hover:border-orange-200 transition-colors"
                      >
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <Package size={32} className="text-gray-200" aria-hidden="true" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{item.product_name}</h3>
                        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">SKU: {item.sku}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            {ProductController.formatPrice(parseFloat(item.unit_price))} x {item.quantity}
                          </p>
                          <p className="font-bold text-gray-900">
                            {ProductController.formatPrice(parseFloat(item.subtotal))}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Review Action */}
                    <OrderItemReviewAction
                      orderItemId={item.id}
                      productName={item.product_name}
                      orderStatus={order.status}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Truck size={20} className="text-orange-500" /> Hành trình đơn hàng
            </h2>
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {getTimelineSteps(order).map((step, idx) => {
                const stepTime = step.time ? new Date(step.time).toLocaleString('vi-VN', {
                  hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'numeric', year: 'numeric'
                }) : null;

                return (
                  <div key={idx} className="relative pl-8">
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                      {step.isCompleted && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                    </div>
                    <p className={`text-sm font-bold ${step.isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {stepTime && <p className="text-[10px] text-gray-400 mt-0.5">{stepTime}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Payment */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-orange-500" /> Thông tin nhận hàng
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Người nhận</p>
                <p className="text-sm font-bold text-gray-800">{order.recipient_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Số điện thoại</p>
                <p className="text-sm font-bold text-gray-800">{order.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Địa chỉ</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {order.street}, {order.ward}, {order.district}, {order.province}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-orange-500" /> Thanh toán
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Phương thức:</span>
                <span className="text-sm font-bold text-gray-700 uppercase">{order.payment_method}</span>
              </div>
              {(order.voucher_code || order.coupon_code || order.promotion_name) && (
                <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
                  <span>Khuyến mãi áp dụng:</span> <span className="font-bold text-orange-800">{order.voucher_code || order.coupon_code || order.promotion_name}</span>
                </div>
              )}
              <div className="pt-4 border-t border-gray-50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính:</span>
                  <span className="font-semibold text-gray-700">{ProductController.formatPrice(parseFloat(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giảm giá:</span>
                  <span className="text-green-600 font-semibold">-
                    {ProductController.formatPrice(
                      order.discount_amount !== undefined && order.discount_amount !== null
                        ? Number(order.discount_amount)
                        : Math.max(0, parseFloat(order.subtotal || '0') + parseFloat(order.shipping_fee || '0') - parseFloat(order.total_amount || '0'))
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển:</span>
                  <span className="text-green-600 font-semibold">Miễn phí</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between font-black text-xl text-gray-900">
                  <span>Tổng tiền</span>
                  <span className="text-orange-500">{ProductController.formatPrice(parseFloat(order.total_amount))}</span>
                </div>
              </div>
            </div>
          </div>

          {order.status === 'pending_payment' && order.payment_method === 'vnpay' && vnpayUrl && (
            <button
              onClick={() => { window.location.href = vnpayUrl; }}
              className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 transform active:scale-95"
            >
              <CreditCard size={18} /> Thanh toán ngay qua VNPAY
            </button>
          )}

          {order.status === 'pending_payment' && (
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isCancelling}
              className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <XCircle size={18} /> {isCancelling ? 'Đang xử lý...' : 'Hủy đơn hàng'}
            </button>
          )}

          {order.status === 'delivered' && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-full py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 size={18} /> {isCompleting ? 'Đang xử lý...' : 'Đã nhận được hàng'}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Xác nhận hủy đơn</h3>
            <p className="text-gray-500 text-center mb-6">
              Bạn có chắc chắn muốn hủy đơn hàng <span className="font-bold text-gray-900">#ORD-{order.id}</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Lý do hủy đơn</label>
              <textarea
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-200 outline-none transition-all resize-none"
                placeholder="Nhập lý do hủy (ví dụ: Thay đổi địa chỉ, Đặt nhầm sản phẩm...)"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-3.5 px-4 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleCancel}
                className="py-3.5 px-4 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-100 transform active:scale-95"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
