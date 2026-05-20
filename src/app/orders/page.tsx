'use client';
import { useEffect, useState } from 'react';
import { OrderController, Order, type OrderItem } from '@/controllers/OrderController';
import { ProductController } from '@/controllers/ProductController';
import { Package, Calendar, MapPin, CreditCard, ChevronRight, ArrowLeft, ShoppingBag, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Lấy URL ảnh: ưu tiên gallery product_line.images[0], fallback product.image_url
function getItemImageUrl(item: OrderItem): string | null {
  const images = item.product?.product_line?.images;
  if (images && images.length > 0) {
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    return sorted[0].url;
  }
  return item.product?.image_url ?? null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderController.getOrders();
        setOrders(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return { label: 'Chờ thanh toán', icon: <Clock size={14} />, color: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 'processing':
        return { label: 'Đang xử lý', icon: <Package size={14} />, color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 'shipped':
        return { label: 'Đang giao hàng', icon: <Package size={14} />, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
      case 'delivered':
        return { label: 'Đã giao hàng', icon: <CheckCircle2 size={14} />, color: 'text-green-600 bg-green-50 border-green-100' };
      case 'completed':
        return { label: 'Hoàn thành', icon: <CheckCircle2 size={14} />, color: 'text-green-600 bg-green-50 border-green-100' };
      case 'cancelled':
        return { label: 'Đã hủy', icon: <XCircle size={14} />, color: 'text-red-600 bg-red-50 border-red-100' };
      default:
        return { label: status, icon: <AlertCircle size={14} />, color: 'text-gray-600 bg-gray-50 border-gray-100' };
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bạn chưa có đơn hàng nào</h1>
        <p className="text-gray-500 mb-8">Hãy khám phá thêm hàng ngàn sản phẩm hấp dẫn tại Chợ Việt.</p>
        <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-orange-100">
          <ArrowLeft size={18} />
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-500 mt-1">Quản lý và theo dõi các đơn hàng đã đặt</p>
        </div>
        <Link href="/" className="text-orange-500 font-bold flex items-center gap-1 hover:underline">
          <ArrowLeft size={16} /> Quay lại trang chủ
        </Link>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const status = getStatusInfo(order.status);
          const date = new Date(order.created_at).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={order.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="p-5 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Mã đơn hàng</p>
                    <p className="font-bold text-gray-900">#ORD-{order.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </div>
                </div>
              </div>

              {/* Product thumbnails */}
              {order.items && order.items.length > 0 && (
                <div className="px-5 pt-5 pb-2 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 4).map((item) => {
                      const imageUrl = getItemImageUrl(item);
                      return (
                        <div
                          key={item.id}
                          className="w-12 h-12 rounded-xl bg-gray-50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center"
                          title={item.product_name}
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
                            <Package size={20} className="text-gray-300" aria-hidden="true" />
                          )}
                        </div>
                      );
                    })}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-600">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="ml-2 text-sm">
                    <p className="font-semibold text-gray-700 line-clamp-1">
                      {order.items[0].product_name}
                      {order.items.length > 1 && (
                        <span className="text-gray-400 font-normal"> và {order.items.length - 1} sản phẩm khác</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{order.items.length} sản phẩm</p>
                  </div>
                </div>
              )}

              {/* Order Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Ngày đặt hàng</p>
                      <p className="text-sm font-semibold text-gray-700">{date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Địa chỉ nhận hàng</p>
                      <p className="text-sm font-bold text-gray-800">{order.recipient_name} | {order.phone}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {order.street}, {order.ward}, {order.district}, {order.province}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Payment & Total */}
                <div className="space-y-4 bg-orange-50/30 p-5 rounded-2xl border border-orange-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <CreditCard size={16} />
                      Thanh toán:
                    </div>
                    <span className="text-sm font-bold text-gray-700 uppercase">{order.payment_method}</span>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-orange-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tạm tính:</span>
                      <span className="font-semibold text-gray-700">{ProductController.formatPrice(parseFloat(order.subtotal))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phí vận chuyển:</span>
                      <span className="text-green-600 font-semibold">Miễn phí</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-gray-900 font-bold">Tổng cộng:</span>
                      <span className="text-xl font-black text-orange-500">
                        {ProductController.formatPrice(parseFloat(order.total_amount))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Footer Actions */}
              <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-50 flex justify-end">
                <Link href={`/orders/${order.id}`} className="text-sm font-bold text-gray-600 hover:text-orange-500 flex items-center gap-1 group transition-colors">
                  Xem chi tiết đơn hàng
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
