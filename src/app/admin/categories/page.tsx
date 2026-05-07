'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus } from 'lucide-react';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]); // Luôn mặc định là mảng rỗng
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCategories();
      console.log("DỮ LIỆU TỪ BACKEND:", res); // <--- In ra để xem cấu trúc thật
      
      // Tìm và bóc tách đúng mảng dữ liệu từ Backend
      let dataArray = [];
      if (Array.isArray(res)) {
        dataArray = res;
      } else if (res && Array.isArray(res.data)) {
        dataArray = res.data;
      } else if (res && Array.isArray(res.content)) { // Thường gặp ở Java Spring Boot
        dataArray = res.content;
      } else if (res && Array.isArray(res.items)) {
        dataArray = res.items;
      }
      
      setCategories(dataArray);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createCategory({ name });
      setName(''); fetchCategories();
      alert('Thêm thành công!');
    } catch (error: any) { alert(error.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa danh mục này?')) return;
    try {
      await adminApi.deleteCategory(id);
      fetchCategories();
    } catch (error: any) { alert(error.message); }
  };

  // Đảm bảo categories luôn là mảng trước khi render
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Danh mục</h1>
      <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-sm border mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tên danh mục..." 
          required 
          className="border p-2 rounded flex-1 focus:outline-orange-500" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={18}/> Thêm
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Tên danh mục</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="p-4 text-center">Đang tải...</td></tr>
            ) : safeCategories.length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-center text-gray-500">Chưa có dữ liệu</td></tr>
            ) : (
              safeCategories.map((cat: any, index: number) => (
                <tr key={cat.id || index} className="border-b">
                  <td className="p-4">{cat.id}</td>
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}