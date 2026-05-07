'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus, ListTree, X } from 'lucide-react';
import Link from 'next/link';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State dùng để đóng/mở cái bảng Popup (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Tạm thời hiển thị dữ liệu mẫu. Sau này bạn thay bằng API lấy danh sách.
      setProducts([{ id: '1', name: 'Điện thoại iPhone 15', status: 'Active' }]); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt tự tải lại trang
    if (!newProductName) return;
    
    try {
      // Gọi API tạo mới
      await adminApi.createProductLine({ name: newProductName });
      
      // Thành công thì reset form, đóng Modal và tải lại bảng
      setNewProductName('');
      setIsModalOpen(false); 
      fetchData();
      alert('Tạo dòng sản phẩm thành công!');
    } catch (error: any) { 
      alert(error.message); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dòng sản phẩm này?')) return;
    try {
      await adminApi.deleteProductLine(id);
      fetchData();
    } catch (error: any) { alert(error.message); }
  };

  return (
    <div className="relative">
      {/* Tiêu đề và Nút bấm mở Popup */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Dòng Sản Phẩm</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus size={18}/> Thêm Dòng SP
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-gray-600 font-semibold">ID</th>
              <th className="p-4 text-gray-600 font-semibold">Tên dòng sản phẩm</th>
              <th className="p-4 text-gray-600 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, index) => (
              <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-500">#{prod.id}</td>
                <td className="p-4 font-medium text-gray-800">{prod.name}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/products/${prod.id}/variants`} className="inline-flex items-center gap-1 p-2 text-indigo-600 hover:bg-indigo-50 rounded mr-2 transition-colors">
                    <ListTree size={18} /> <span className="text-sm">Biến thể (SKU)</span>
                  </Link>
                  <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP MODAL: Chỉ hiển thị khi isModalOpen === true */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Thêm Dòng Sản Phẩm Mới</h2>
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
                  Tên dòng sản phẩm <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Nhập tên dòng sản phẩm (VD: Tủ lạnh LG...)" 
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
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