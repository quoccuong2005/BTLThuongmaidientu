'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus, X, Edit, Search, ImageIcon, Layers, Star } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

export default function ProductsAdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    display_price: '',
    default_price: '',
    is_featured: false
  });

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getProductLines()
      ]);

      let catArray = catRes.data?.items || catRes.data || catRes.items || catRes || [];
      setCategories(Array.isArray(catArray) ? catArray : []);

      let prodArray = prodRes.data?.items || prodRes.data || prodRes.items || prodRes || [];
      setProducts(Array.isArray(prodArray) ? prodArray : []);
    } catch (error) { 
      console.error("Lỗi tải dữ liệu:", error); 
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ 
      name: '', category_id: '', description: '', 
      display_price: '', default_price: '', is_featured: false 
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: any) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name || '',
      category_id: prod.category_id || (prod.category ? prod.category.id : ''), 
      description: prod.description || '',
      display_price: prod.display_price?.toString() || '',
      default_price: prod.default_price?.toString() || '',
      is_featured: !!prod.is_featured
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category_id: Number(formData.category_id),
        description: formData.description,
        display_price: formData.display_price ? Number(formData.display_price) : 0,
        default_price: formData.default_price ? Number(formData.default_price) : 0,
        is_featured: formData.is_featured
      };

      if (editingId) {
        await adminApi.updateProductLine(editingId, payload);
        alert('Cập nhật thành công!');
      } else {
        await adminApi.createProductLine(payload);
        alert('Thêm mới thành công!');
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

  const filteredProducts = products.filter((prod) => 
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) || 0);
  };

  return (
    <div className="p-4 md:p-0">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản Phẩm</h1>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text" placeholder="Tìm tên sản phẩm..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button onClick={handleOpenAdd} className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors whitespace-nowrap">
            <Plus size={18}/> <span>Thêm Mới</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm">Ảnh</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Tên sản phẩm</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Giá gốc</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Giá bán</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-center">Nổi bật</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-gray-400">Đang tải...</td></tr>
              ) : filteredProducts.map((prod: any) => (
                <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                      {prod.images?.[0] ? (
                        <img src={prod.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={18} /></div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{prod.name}</div>
                    <div className="text-xs text-gray-400">{prod.category?.name}</div>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{formatCurrency(prod.default_price)}</td>
                  <td className="p-4 text-orange-600 font-bold">{formatCurrency(prod.display_price)}</td>
                  <td className="p-4 text-center">
                    {prod.is_featured && <Star size={16} className="fill-amber-400 text-amber-400 mx-auto" />}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => router.push(`/admin/products/${prod.id}/images`)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="Ảnh"><ImageIcon size={18} /></button>
                      <button onClick={() => router.push(`/admin/products/${prod.id}/variants`)} className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg" title="SKU"><Layers size={18} /></button>
                      <button onClick={() => handleOpenEdit(prod)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
                  <input type="text" name="name" required className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-orange-500" value={formData.name} onChange={handleInputChange} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                  <select name="category_id" required className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-orange-500 bg-white" value={formData.category_id} onChange={handleInputChange}>
                    <option value="">-- Chọn --</option>
                    {categories.map((cat: any) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" name="is_featured" id="is_featured" className="w-5 h-5 accent-orange-500" checked={formData.is_featured} onChange={handleInputChange} />
                  <label htmlFor="is_featured" className="text-sm font-semibold text-gray-700 cursor-pointer">Sản phẩm nổi bật (HOT)</label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Giá gốc (VNĐ)</label>
                  <input type="number" name="default_price" className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-orange-500" value={formData.default_price} onChange={handleInputChange} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Giá bán (VNĐ)</label>
                  <input type="number" name="display_price" className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-orange-500" value={formData.display_price} onChange={handleInputChange} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
                  <textarea name="description" rows={3} className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-orange-500 resize-none" value={formData.description} onChange={handleInputChange} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
                <button type="submit" className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}