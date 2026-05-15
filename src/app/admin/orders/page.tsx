'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Search, X, Eye, Edit, Package } from 'lucide-react';

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // State cho Modal Xem chi tiết
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // State cho Modal Cập nhật trạng thái
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders();
      console.log(res);
      let dataArray = [];
      if (res && res.data && Array.isArray(res.data.items)) dataArray = res.data.items;
      else if (res && Array.isArray(res.data)) dataArray = res.data;
      else if (res && Array.isArray(res.items)) dataArray = res.items;
      else if (Array.isArray(res)) dataArray = res;
      setOrders(dataArray);
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

  // Lọc đơn hàng theo ID hoặc Tên khách hàng (Real-time)
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const idMatch = order.id?.toString().includes(searchLower);
    const nameMatch = order.user?.name?.toLowerCase().includes(searchLower) || order.user?.email?.toLowerCase().includes(searchLower);
    return idMatch || nameMatch;
  });

// Helper: Chọn màu sắc cho từng trạng thái
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase(); // Ép về chữ thường để so sánh
    switch (s) {
      case 'pending_payment': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Chờ thanh toán</span>;
      case 'confirmed': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Đã xác nhận</span>;
      case 'processing': return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Đang xử lý</span>;
      case 'shipping': return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Đang giao</span>;
      case 'delivered': 
      case 'completed': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Hoàn thành</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Đã hủy</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status || 'Chưa rõ'}</span>;
    }
  };

  return (
    <div className="relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn Hàng</h1>
        
        {/* TÌM KIẾM */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm theo Mã đơn hoặc Email khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm transition-shadow"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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
                    <p className="font-medium">{order.customer_name || order.user?.name || order.full_name || 'Khách vãng lai'}</p>
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
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Package size={18}/> Thông tin giao hàng</h3>
                <p className="text-sm text-gray-600"><span className="font-medium">Người nhận:</span> {selectedOrder.shippingAddress?.fullName || 'N/A'}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">SĐT:</span> {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Địa chỉ:</span> {selectedOrder.shippingAddress?.address || 'N/A'}</p>
              </div>
            </div>

            <h3 className="font-semibold text-gray-800 mb-3 border-t pt-4">Sản phẩm đã đặt</h3>
            <div className="space-y-3">
              {selectedOrder.orderItems?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {/* Có thể thay bằng ảnh thật nếu backend trả về URL */}
                      <Package size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.productName || 'Tên sản phẩm'}</p>
                      <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-orange-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || 0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
              <div className="text-right">
                <p className="text-gray-500 text-sm">Tổng cộng</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.total_amount || selectedOrder.totalPrice || 0)}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}