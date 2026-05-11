'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus, X } from 'lucide-react';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State dùng để đóng/mở cái bảng Popup (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => { fetchCategories(); }, []);

const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCategories();
      
      let dataArray = [];
      // KIỂM TRA ĐÚNG CHỖ BACKEND GIẤU DATA: res.data.items
      if (res && res.data && Array.isArray(res.data.items)) {
          dataArray = res.data.items;
      } 
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      // Gọi API tạo mới danh mục
      await adminApi.createCategory({ name });
      
      alert('Thêm danh mục thành công!');
      
      // Thành công thì reset form, đóng Modal và tải lại bảng
      setName('');
      setIsModalOpen(false); 
      fetchCategories();
    } catch (error: any) { 
      alert(error.message); 
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

  // Đảm bảo categories luôn là mảng trước khi render
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="relative">
      {/* Tiêu đề & Nút mở Popup */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus size={18}/> Thêm Danh mục
        </button>
      </div>

      {/* Bảng Dữ liệu */}
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
            ) : safeCategories.length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-center text-gray-500">Chưa có dữ liệu</td></tr>
            ) : (
              safeCategories.map((cat: any, index: number) => (
                <tr key={cat.id || index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500">{cat.id}</td>
                  <td className="p-4 font-medium text-gray-800">{cat.name}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================================== */}
      {/* POPUP MODAL: Chỉ hiển thị khi isModalOpen === true */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Thêm Danh Mục Mới</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form nhập liệu */}
            <form onSubmit={handleCreate}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: Đồ điện tử, Bất động sản..." 
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Nhóm nút bấm */}
              <div className="flex justify-end gap-3">
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
                  Lưu thông tin
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
}