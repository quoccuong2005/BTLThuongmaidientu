'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus, Edit, X, Ticket, Calendar } from 'lucide-react';

export default function VouchersAdminPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // State cho Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Khởi tạo data mặc định cho Form
  const initialForm = {
    code: '', name: '', type: 'percent', scope: 'all', category_id: '',
    discount_value: '', min_order_amount: '', max_discount_amount: '', 
    quantity: '', start_date: '', end_date: '', is_active: true
  };
  const [formData, setFormData] = useState<any>(initialForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi cả 2 API cùng lúc cho nhanh
      const [vouchersRes, categoriesRes] = await Promise.all([
        adminApi.getVouchers(),
        adminApi.getCategories() // Dùng hàm này đã khai báo trước đó
      ]);
      
      setVouchers(vouchersRes?.data?.data || vouchersRes?.data || vouchersRes || []);
      setCategories(categoriesRes?.data?.items || categoriesRes?.data || categoriesRes || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Xử lý riêng cho checkbox
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Mở Form Thêm Mới
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  // Mở Form Cập Nhật
  const handleOpenEdit = (v: any) => {
    setEditingId(v.id);
    setFormData({
      ...v,
      category_id: v.category_id || '',
      // Convert chuỗi ISO của Backend sang định dạng YYYY-MM-DDThh:mm cho input type="datetime-local"
      start_date: v.start_date ? new Date(v.start_date).toISOString().slice(0, 16) : '',
      end_date: v.end_date ? new Date(v.end_date).toISOString().slice(0, 16) : ''
    });
    setIsModalOpen(true);
  };

  // Lưu Dữ Liệu (POST hoặc PATCH)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Chuẩn bị Payload, ép kiểu dữ liệu cho đúng với Backend
      const payload: any = {
        code: formData.code.toUpperCase(), // Mã thường viết hoa
        name: formData.name,
        type: formData.type,
        scope: formData.scope,
        discount_value: Number(formData.discount_value),
        min_order_amount: Number(formData.min_order_amount),
        quantity: Number(formData.quantity),
        start_date: new Date(formData.start_date).toISOString(), // Trả lại ISO 8601
        end_date: new Date(formData.end_date).toISOString()
      };

      // Các trường không bắt buộc hoặc có điều kiện
      if (formData.max_discount_amount) payload.max_discount_amount = Number(formData.max_discount_amount);
      if (formData.scope === 'category') payload.category_id = Number(formData.category_id);
      if (editingId) payload.is_active = formData.is_active;

      // 2. Gọi API
      if (editingId) {
        await adminApi.updateVoucher(editingId, payload);
        alert('Cập nhật Voucher thành công!');
      } else {
        await adminApi.createVoucher(payload);
        alert('Tạo Voucher thành công!');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra!');
    }
  };

  // Xóa Voucher
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn mã giảm giá này?')) return;
    try {
      await adminApi.deleteVoucher(id);
      fetchData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Ticket className="text-orange-500" /> Quản lý Voucher (Mã giảm giá)
        </h1>
        <button 
          onClick={handleOpenAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} /> Thêm Voucher
        </button>
      </div>

      {/* Bảng Danh sách */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Mã (Code)</th>
              <th className="p-4 font-semibold text-gray-600">Loại giảm</th>
              <th className="p-4 font-semibold text-gray-600">Mức giảm</th>
              <th className="p-4 font-semibold text-gray-600">Đơn tối thiểu</th>
              <th className="p-4 font-semibold text-gray-600">Số lượng (Đã dùng)</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : vouchers.length === 0 ? (
              <tr><td colSpan={7} className="p-12 text-center text-gray-500">Chưa có mã giảm giá nào.</td></tr>
            ) : (
              vouchers.map((v: any) => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <span className="font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-md border border-orange-200">
                      {v.code}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{v.name}</div>
                  </td>
                  <td className="p-4 text-sm">
                    {v.type === 'percent' ? 'Phần trăm (%)' : 'Cố định (VNĐ)'}
                    <br />
                    <span className="text-xs text-gray-400">Áp dụng: {v.scope === 'all' ? 'Tất cả' : 'Theo danh mục'}</span>
                  </td>
                  <td className="p-4 font-medium text-red-600">
                    {v.type === 'percent' ? `${v.discount_value}%` : `${new Intl.NumberFormat('vi-VN').format(v.discount_value)}đ`}
                  </td>
                  <td className="p-4">{new Intl.NumberFormat('vi-VN').format(v.min_order_amount)}đ</td>
                  <td className="p-4">
                    {v.quantity} <span className="text-gray-400">({v.used_quantity || 0})</span>
                  </td>
                  <td className="p-4">
                    {v.is_active ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs border border-green-200">Đang hoạt động</span>
                    ) : (
                      <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-xs border border-gray-300">Đã vô hiệu</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenEdit(v)} className="p-2 text-blue-600 hover:bg-blue-50 rounded mr-1"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(v.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">{editingId ? 'Cập nhật Voucher' : 'Tạo Voucher Mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-1 rounded-lg"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cột 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Mã (Code) *</label>
                    <input type="text" name="code" required placeholder="VD: SUMMER2024" className="w-full border p-2.5 rounded-lg uppercase" value={formData.code} onChange={handleInputChange} disabled={!!editingId} />
                    {editingId && <span className="text-xs text-gray-400">Không thể sửa mã code sau khi tạo</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Tên Voucher *</label>
                    <input type="text" name="name" required placeholder="VD: Siêu Sale Tháng 6" className="w-full border p-2.5 rounded-lg" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Loại giảm *</label>
                      <select name="type" className="w-full border p-2.5 rounded-lg" value={formData.type} onChange={handleInputChange}>
                        <option value="percent">Phần trăm (%)</option>
                        <option value="fixed">Tiền cố định</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Giá trị giảm *</label>
                      <input type="number" name="discount_value" required placeholder={formData.type === 'percent' ? "VD: 15" : "VD: 50000"} className="w-full border p-2.5 rounded-lg" value={formData.discount_value} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Giảm tối đa (VNĐ)</label>
                    <input type="number" name="max_discount_amount" placeholder="Bỏ trống nếu không giới hạn" className="w-full border p-2.5 rounded-lg" value={formData.max_discount_amount} onChange={handleInputChange} disabled={formData.type === 'fixed'} />
                  </div>
                </div>

                {/* Cột 2 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Phạm vi áp dụng *</label>
                      <select name="scope" className="w-full border p-2.5 rounded-lg" value={formData.scope} onChange={handleInputChange}>
                        <option value="all">Tất cả sản phẩm</option>
                        <option value="category">Theo danh mục</option>
                      </select>
                    </div>
                    {formData.scope === 'category' && (
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-orange-600">Chọn danh mục *</label>
                        <select name="category_id" required className="w-full border border-orange-300 p-2.5 rounded-lg outline-none focus:ring-1 focus:ring-orange-500" value={formData.category_id} onChange={handleInputChange}>
                          <option value="" disabled>-- Chọn --</option>
                          {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Đơn hàng tối thiểu (VNĐ) *</label>
                    <input type="number" name="min_order_amount" required placeholder="VD: 200000" className="w-full border p-2.5 rounded-lg" value={formData.min_order_amount} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Tổng số lượng mã *</label>
                    <input type="number" name="quantity" required placeholder="VD: 500" className="w-full border p-2.5 rounded-lg" value={formData.quantity} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1"><Calendar size={14} className="inline mr-1" />Bắt đầu từ *</label>
                      <input type="datetime-local" name="start_date" required className="w-full border p-2.5 rounded-lg text-sm" value={formData.start_date} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1"><Calendar size={14} className="inline mr-1" />Kết thúc vào *</label>
                      <input type="datetime-local" name="end_date" required className="w-full border p-2.5 rounded-lg text-sm" value={formData.end_date} onChange={handleInputChange} />
                    </div>
                  </div>
                  
                  {/* Chỉ hiện Trạng thái khi Edit */}
                  {editingId && (
                    <div className="flex items-center gap-2 pt-2">
                      <input type="checkbox" id="is_active" name="is_active" className="w-5 h-5 accent-orange-500" checked={formData.is_active} onChange={handleInputChange} />
                      <label htmlFor="is_active" className="font-semibold text-gray-700 cursor-pointer">Kích hoạt (Cho phép sử dụng)</label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">Hủy</button>
                <button type="submit" className="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 shadow-sm">
                  {editingId ? 'Lưu cập nhật' : 'Tạo mã mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}