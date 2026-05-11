'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus, X } from 'lucide-react';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    display_price: ''
  });

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // SỬ DỤNG ĐÚNG TÊN HÀM getProductLines() TỪ FILE adminApi.ts CỦA BẠN
      const [prodRes, catRes] = await Promise.all([
        adminApi.getProductLines(),
        adminApi.getCategories()
      ]);

      // Bóc tách mảng Dòng Sản phẩm (Giống cách xử lý Categories)
      if (prodRes && prodRes.data && Array.isArray(prodRes.data.items)) setProducts(prodRes.data.items);
      else if (prodRes && Array.isArray(prodRes.items)) setProducts(prodRes.items);
      else if (Array.isArray(prodRes)) setProducts(prodRes);

      // Bóc tách mảng Danh mục
      if (catRes && catRes.data && Array.isArray(catRes.data.items)) setCategories(catRes.data.items);
      else if (catRes && Array.isArray(catRes.items)) setCategories(catRes.items);
      else if (Array.isArray(catRes)) setCategories(catRes);

    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category_id) {
      alert("Vui lòng điền tên và chọn danh mục!");
      return;
    }
    
    try {
      const payload = {
        name: formData.name,
        category_id: Number(formData.category_id), // Backend yêu cầu số
        description: formData.description,
        display_price: Number(formData.display_price) || 0 // Backend yêu cầu số
      };

      // GỌI ĐÚNG HÀM createProductLine()
      await adminApi.createProductLine(payload);
      alert('Thêm Dòng sản phẩm thành công!');
      
      setFormData({ name: '', category_id: '', description: '', display_price: '' });
      setIsModalOpen(false); 
      fetchData(); 
    } catch (error: any) { 
      alert(error.message || 'Lỗi khi thêm sản phẩm'); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      // GỌI ĐÚNG HÀM deleteProductLine()
      await adminApi.deleteProductLine(id);
      fetchData();
    } catch (error: any) { alert(error.message); }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Dòng Sản Phẩm</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 shadow-sm"
        >
          <Plus size={18}/> Thêm Sản Phẩm
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Tên Sản Phẩm</th>
              <th className="p-4 font-semibold text-gray-600">Giá hiển thị</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">Chưa có dữ liệu</td></tr>
            ) : (
              products.map((prod: any) => (
                <tr key={prod.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{prod.id}</td>
                  <td className="p-4 font-medium text-gray-800">{prod.name}</td>
                  <td className="p-4 text-orange-600 font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.display_price)}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Thêm Dòng Sản Phẩm</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800"><X size={24} /></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên dòng sản phẩm <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="name" required
                  placeholder="VD: iPhone 15, Son 3CE..." 
                  className="w-full border border-gray-300 p-2.5 rounded-xl outline-none focus:border-orange-500"
                  value={formData.name} onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                  <select 
                    name="category_id" required
                    className="w-full border border-gray-300 p-2.5 rounded-xl outline-none focus:border-orange-500 bg-white"
                    value={formData.category_id} onChange={handleInputChange}
                  >
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Giá hiển thị (VNĐ)</label>
                  <input 
                    type="number" name="display_price" required min="0"
                    placeholder="VD: 19990000" 
                    className="w-full border border-gray-300 p-2.5 rounded-xl outline-none focus:border-orange-500"
                    value={formData.display_price} onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả sản phẩm</label>
                <textarea 
                  name="description" rows={3}
                  placeholder="Nhập mô tả..." 
                  className="w-full border border-gray-300 p-2.5 rounded-xl outline-none focus:border-orange-500 resize-none"
                  value={formData.description} onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 rounded-xl hover:bg-gray-100">Hủy bỏ</button>
                <button type="submit" className="px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}