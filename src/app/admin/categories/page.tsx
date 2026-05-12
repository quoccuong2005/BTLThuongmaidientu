'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
// Thêm icon Search
import { Trash2, Plus, X, Edit, Search } from 'lucide-react'; 

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State lưu trữ từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingId, setEditingId] = useState<string | number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
    iconUrl: ''
  });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCategories();
      let dataArray = [];
      if (res && res.data && Array.isArray(res.data.items)) dataArray = res.data.items;
      else if (Array.isArray(res)) dataArray = res;
      else if (res && Array.isArray(res.data)) dataArray = res.data;
      else if (res && Array.isArray(res.items)) dataArray = res.items;
      
      setCategories(dataArray);
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

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', status: 'ACTIVE', iconUrl: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({ 
      name: category.name, 
      description: category.description || '', 
      status: category.status || 'ACTIVE', 
      iconUrl: category.iconUrl || '' 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    try {
      const payload = { name: formData.name };

      if (editingId) {
        await adminApi.updateCategory(editingId, payload);
        alert('Cập nhật danh mục thành công!');
      } else {
        await adminApi.createCategory(payload);
        alert('Thêm danh mục thành công!');
      }
      
      setIsModalOpen(false); 
      fetchCategories();
    } catch (error: any) { 
      alert(error.message || 'Có lỗi xảy ra'); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    try {
      await adminApi.deleteCategory(id);
      fetchCategories();
    } catch (error: any) { 
      alert(error.message); 
    }
  };

  // Đảm bảo dữ liệu là mảng
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  // LOGIC LỌC TÌM KIẾM: Lọc mảng safeCategories theo từ khóa
  const filteredCategories = safeCategories.filter((cat: any) =>
    cat.name && cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      
      {/* HEADER CÓ THANH TÌM KIẾM */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
        
        <div className="flex w-full md:w-auto items-center gap-3">
          {/* Ô Tìm kiếm */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm tên danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm transition-shadow"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <button 
            onClick={handleOpenAdd} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={18}/> <span className="hidden sm:inline">Thêm Danh mục</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Tên danh mục</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="p-4 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500 py-8">
                   {searchTerm ? `Không tìm thấy danh mục nào chứa từ khóa "${searchTerm}"` : 'Chưa có dữ liệu'}
                </td>
              </tr>
            ) : (
              // Dùng mảng đã lọc để in ra bảng
              filteredCategories.map((cat: any, index: number) => (
                <tr key={cat.id || index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500">{cat.id}</td>
                  <td className="p-4 font-medium text-gray-800">{cat.name}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors mr-2" title="Sửa danh mục">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa danh mục">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* POPUP MODAL THÊM / SỬA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="VD: Đồ điện tử, Bất động sản..." 
                  className="w-full border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
                >
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