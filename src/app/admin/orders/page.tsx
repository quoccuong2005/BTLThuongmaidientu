'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Search, X, Eye, Edit, Package } from 'lucide-react';

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Phân trang & Lọc
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('created_at');
  const [orderSort, setOrderSort] = useState('DESC');
  const [pagination, setPagination] = useState<any>(null);


  // State cho Modal Xem chi tiết
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // State cho Modal Cập nhật trạng thái
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, limit, status, sort, orderSort]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        sort,
        order: orderSort
      };
      if (status) params.status = status;
      
      const res = await adminApi.getOrders(params);
      console.log("Orders data:", res);
      
      // Backend trả về: { items: [], pagination: { total_pages, ... } }
      if (res && res.data) {
        setOrders(res.data.items || []);
        setPagination(res.data.pagination || null);
      } else if (res && res.items) {
        setOrders(res.items);
        setPagination(res.pagination || null);
      } else {
        setOrders(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mở Popup xem chi tiết đơn hàng
  const handleViewDetails = async (id: string | number) => {
    try {
      const res = await adminApi.getOrderDetail(id);
      const data = res.data || res; // Tùy cấu trúc backend
      console.log("Detail:", data)
      setSelectedOrder(data);
      setViewModalOpen(true);
    } catch (error) {
      alert('Không thể lấy chi tiết đơn hàng!');
    }
  };

  // Mở Popup cập nhật trạng thái
  const handleOpenStatusModal = (order: any) => {
    setUpdatingId(order.id);
    setNewStatus(order.status || 'PENDING_PAYMENT');
    setStatusModalOpen(true);
  };

  // Xử lý gửi API cập nhật trạng thái
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingId) return;
    try {
      await adminApi.updateOrderStatus(updatingId, newStatus);
      alert('Cập nhật trạng thái thành công!');
      setStatusModalOpen(false);
      fetchOrders(); // Load lại danh sách
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi cập nhật!');
    }
  };

  // Lọc đơn hàng client-side cho searchTerm (chỉ lọc được trên trang hiện tại)
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const idMatch = order.id?.toString().includes(searchLower);
    const nameMatch = 
      order.user?.name?.toLowerCase().includes(searchLower) || 
      order.user?.email?.toLowerCase().includes(searchLower) ||
      order.recipient_name?.toLowerCase().includes(searchLower);
    return idMatch || nameMatch;
  });

// Helper: Chọn màu sắc cho từng trạng thái
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'pending_payment': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Chờ thanh toán</span>;
      case 'paid': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Đã thanh toán</span>;
      case 'confirmed': return <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">Đã xác nhận</span>;
      case 'shipping': return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Đang giao</span>;
      case 'delivered': return <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">Đã giao hàng</span>;
      case 'completed': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Hoàn thành</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Đã hủy</span>;
      case 'return_requested': return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Yêu cầu trả hàng</span>;
      case 'returned': return <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">Đã trả hàng</span>;
      case 'refunded': return <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">Đã hoàn tiền</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status || 'Chưa rõ'}</span>;
    }
  };

  return (
    <div className="relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn Hàng</h1>
        
        {/* BỘ LỌC */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Trạng thái */}
          <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending_payment">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao hàng</option>
            <option value="delivered">Đã giao hàng</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
            <option value="return_requested">Yêu cầu trả hàng</option>
            <option value="returned">Đã trả hàng</option>
            <option value="refunded">Đã hoàn tiền</option>
          </select>

          {/* Sắp xếp theo */}
          <select 
            value={sort} 
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm bg-white"
          >
            <option value="created_at">Mới nhất</option>
            <option value="total_amount">Tổng tiền</option>
            <option value="id">Mã đơn hàng</option>
          </select>

          {/* Thứ tự */}
          <select 
            value={orderSort} 
            onChange={(e) => { setOrderSort(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm bg-white"
          >
            <option value="DESC">Giảm dần</option>
            <option value="ASC">Tăng dần</option>
          </select>

          {/* Tìm kiếm */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm nhanh trên trang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm transition-shadow w-full md:w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* BẢNG DANH SÁCH ĐƠN HÀNG */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Mã ĐH</th>
              <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
              <th className="p-4 font-semibold text-gray-600">Tổng tiền</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500 py-8">Không có đơn hàng nào</td></tr>
            ) : (
              filteredOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">#{order.id}</td>
<td className="p-4 text-gray-600">
                    {/* Bắt thêm trường customer_name hoặc full_name của Backend */}
                    <p className="font-medium">{order.recipient_name || order.user?.name || order.customer_name || order.full_name || 'Khách vãng lai'}</p>
                    <p className="text-xs text-gray-400">{order.email || order.user?.email}</p>
                  </td>
                  <td className="p-4 text-orange-600 font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount || order.totalPrice || 0)}
                  </td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                  <td className="p-4 text-right">
                    {/* Nút Xem chi tiết */}
                    <button onClick={() => handleViewDetails(order.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded mr-2" title="Xem chi tiết">
                      <Eye size={18} />
                    </button>
                    {/* Nút Cập nhật trạng thái */}
                    <button onClick={() => handleOpenStatusModal(order)} className="p-2 text-orange-600 hover:bg-orange-50 rounded" title="Cập nhật trạng thái">
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {pagination && pagination.total_pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-500">
              Trang {pagination.page} / {pagination.total_pages} ({pagination.count} đơn hàng)
            </p>
            <div className="flex gap-2">
              <button
                disabled={!pagination.has_prev}
                onClick={() => setPage(prev => prev - 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !pagination.has_prev 
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Trước
              </button>
              
              {/* Hiển thị số trang (rút gọn nếu cần) */}
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((p) => {
                // Chỉ hiển thị trang hiện tại, trang đầu, trang cuối và 1 trang lân cận
                if (
                  p === 1 || 
                  p === pagination.total_pages || 
                  (p >= pagination.page - 1 && p <= pagination.page + 1)
                ) {
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        pagination.page === p
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                } else if (
                  p === pagination.page - 2 || 
                  p === pagination.page + 2
                ) {
                  return <span key={p} className="flex items-center justify-center w-10 h-10 text-gray-400">...</span>;
                }
                return null;
              })}

              <button
                disabled={!pagination.has_next}
                onClick={() => setPage(prev => prev + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !pagination.has_next 
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POPUP: CẬP NHẬT TRẠNG THÁI */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cập nhật Trạng thái</h2>
            <form onSubmit={handleUpdateStatus}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn trạng thái mới</label>
<select 
                  className="w-full border border-gray-300 p-2.5 rounded-xl outline-none focus:border-orange-500 bg-white"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending_payment">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                  <option value="return_requested">Yêu cầu trả hàng</option>
                  <option value="returned">Đã trả hàng</option>
                  <option value="refunded">Đã hoàn tiền</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setStatusModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP: XEM CHI TIẾT ĐƠN HÀNG */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Chi tiết Đơn hàng #{selectedOrder.id}</h2>
                <div className="mt-2">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <button onClick={() => setViewModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full"><X size={24}/></button>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* Thông tin giao hàng */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                  <Package size={20}/> Thông tin nhận hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">Người nhận:</span> {selectedOrder.recipient_name}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">SĐT nhận:</span> {selectedOrder.phone}</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Địa chỉ:</span> {selectedOrder.street}, {selectedOrder.ward}, {selectedOrder.district}, {selectedOrder.province}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Phương thức thanh toán:</span> <span className="uppercase font-semibold text-blue-600">{selectedOrder.payment_method}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Thời gian đặt:</span> {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-800 mb-3 border-t pt-4">Danh sách sản phẩm</h3>
            <div className="space-y-3">
              {selectedOrder.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white border rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.product?.image_url || item.product_variant?.image_url ? (
                        <img 
                          src={item.product?.image_url || item.product_variant?.image_url} 
                          alt="product" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={24} className="text-gray-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {item.product?.product_line?.name || 'Sản phẩm'} ({item.product_name || item.product?.name})
                      </p>
                      <p className="text-xs text-gray-500">
                        SKU: {item.sku || 'N/A'} | Số lượng: {item.quantity} x {new Intl.NumberFormat('vi-VN').format(item.unit_price || item.price)}đ
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((item.unit_price || item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính:</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Giảm giá:</span>
                <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.discount_amount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.shipping_fee)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-bold text-gray-800">Tổng thanh toán:</span>
                <span className="text-2xl font-bold text-orange-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.total_amount)}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}