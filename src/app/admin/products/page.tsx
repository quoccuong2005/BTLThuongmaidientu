'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
// 1. Thêm icon Search vào đây
import { Trash2, Plus, X, Edit, Search, ImageIcon, Layers } from 'lucide-react'; 
// (Thêm useRouter nếu bạn muốn chuyển trang)
import { useRouter } from 'next/navigation';

export default function ProductsAdminPage() {
  const router = useRouter(); // Thêm dòng này để lát nữa chuyển trang
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 2. State lưu trữ từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingId, setEditingId] = useState<string | number | null>(null);
  
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
      const catRes = await adminApi.getCategories();
      let catArray = [];
      if (catRes && catRes.data && Array.isArray(catRes.data.items)) catArray = catRes.data.items;
      else if (catRes && Array.isArray(catRes.data)) catArray = catRes.data;
      else if (catRes && Array.isArray(catRes.items)) catArray = catRes.items;
      else if (Array.isArray(catRes)) catArray = catRes;
      setCategories(catArray);
    } catch (error) { console.error("Lỗi tải danh mục:", error); }

    try {
      const prodRes = await adminApi.getProductLines();
      let prodArray = [];
      if (prodRes && prodRes.data && Array.isArray(prodRes.data.items)) prodArray = prodRes.data.items;
      else if (prodRes && Array.isArray(prodRes.data)) prodArray = prodRes.data;
      else if (prodRes && Array.isArray(prodRes.items)) prodArray = prodRes.items;
      else if (Array.isArray(prodRes)) prodArray = prodRes;
      setProducts(prodArray);
    } catch (error) { console.error("Lỗi tải sản phẩm:", error); }
    setLoading(false); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', category_id: '', description: '', display_price: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: any) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name || '',
      category_id: prod.category_id || (prod.category ? prod.category.id : ''), 
      description: prod.description || '',
      display_price: prod.display_price?.toString() || '0'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category_id) {
      alert("Vui lòng điền tên và chọn danh mục!");
      return;
    }
    
    try {
      const payload = {
        name: formData.name,
        category_id: Number(formData.category_id),
        description: formData.description,
        display_price: Number(formData.display_price) || 0
      };

      if (editingId) {
        await adminApi.updateProductLine(editingId, payload);
        alert('Cập nhật Dòng sản phẩm thành công!');
      } else {
        await adminApi.createProductLine(payload);
        alert('Thêm Dòng sản phẩm thành công!');
      }
      
      setIsModalOpen(false); 
      fetchData(); 
    } catch (error: any) { 
      alert(error.message || 'Lỗi khi xử lý sản phẩm'); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await adminApi.deleteProductLine(id);
      fetchData();
    } catch (error: any) { alert(error.message); }
  };

  // 3. LOGIC LỌC SẢN PHẨM: Tự động lọc danh sách dựa trên từ khóa tìm kiếm
  const filteredProducts = products.filter((prod) => 
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Dòng Sản Phẩm</h1>
        
        {/* KHU VỰC TÌM KIẾM VÀ NÚT THÊM */}
        <div className="flex w-full md:w-auto items-center gap-3">
          {/* Ô Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm transition-shadow"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <button 
            onClick={handleOpenAdd} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus size={18}/> <span className="hidden sm:inline">Thêm Sản Phẩm</span>
          </button>
        </div>
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
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500 py-8">
                  {searchTerm ? `Không tìm thấy sản phẩm nào chứa từ khóa "${searchTerm}"` : 'Chưa có dữ liệu'}
                </td>
              </tr>
            ) : (
              /* Dùng filteredProducts thay vì products để hiển thị bảng */
              filteredProducts.map((prod: any) => (
                <tr key={prod.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500">{prod.id}</td>
                  <td className="p-4 font-medium text-gray-800">{prod.name}</td>
                  <td className="p-4 text-orange-600 font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.display_price || 0)}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-1">
  {/* Nút Quản lý Ảnh */}
  <button 
    onClick={() => router.push(`/admin/products/${prod.id}/images`)} 
    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" 
    title="Quản lý Ảnh sản phẩm"
  >
    <ImageIcon size={18} />
  </button>

  {/* Nút Quản lý Biến thể (Màu sắc, Dung lượng, Giá riêng) */}
  <button 
    onClick={() => router.push(`/admin/products/${prod.id}/variants`)} 
    className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors" 
    title="Quản lý Biến thể (SKU)"
  >
    <Layers size={18} />
  </button>

  {/* Nút Sửa (Cũ) */}
  <button 
    onClick={() => handleOpenEdit(prod)} 
    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
    title="Sửa thông tin chung"
  >
    <Edit size={18} />
  </button>

  {/* Nút Xóa (Cũ) */}
  <button 
    onClick={() => handleDelete(prod.id)} 
    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" 
    title="Xóa sản phẩm"
  >
    <Trash2 size={18} />
  </button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM / SỬA (Giữ nguyên như cũ) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Dòng Sản Phẩm'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-lg transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên dòng sản phẩm <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="name" required
                  placeholder="VD: iPhone 15, Son 3CE..." 
                  className="w-full border border-gray-300 p-2.5 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={formData.name} onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                  <select 
                    name="category_id" required
                    className="w-full border border-gray-300 p-2.5 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
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
                    type="number" name="display_price" required min="0" max="2000000000"
                    placeholder="VD: 19990000" 
                    className="w-full border border-gray-300 p-2.5 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    value={formData.display_price} onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả sản phẩm</label>
                <textarea 
                  name="description" rows={3}
                  placeholder="Nhập mô tả..." 
                  className="w-full border border-gray-300 p-2.5 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                  value={formData.description} onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors">Hủy bỏ</button>
                <button type="submit" className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-sm">
                  {editingId ? 'Cập nhật' : 'Lưu thông tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}