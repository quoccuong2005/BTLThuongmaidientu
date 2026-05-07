'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus, ListTree } from 'lucide-react';
import Link from 'next/link';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]); // Luôn mặc định là mảng
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProductLines();
      console.log("DỮ LIỆU PRODUCTS TỪ BACKEND:", res); // In ra để kiểm tra
      
      // Tìm mảng dữ liệu thật sự
      let dataArray = [];
      if (Array.isArray(res)) {
        dataArray = res;
      } else if (res && Array.isArray(res.data)) {
        dataArray = res.data;
      } else if (res && Array.isArray(res.content)) {
        dataArray = res.content;
      } else if (res && Array.isArray(res.items)) {
        dataArray = res.items;
      }
      
      setProducts(dataArray);
    } catch (error) { 
      console.error(error); 
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createProductLine({ name });
      setName(''); fetchProducts();
      alert('Thêm thành công!');
    } catch (error: any) { alert(error.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa dòng sản phẩm này?')) return;
    try {
      await adminApi.deleteProductLine(id);
      fetchProducts();
    } catch (error: any) { alert(error.message); }
  };

  // Bảo vệ an toàn: Nếu products không phải là mảng thì cho nó thành mảng rỗng
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Dòng Sản Phẩm</h1>
      <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-sm border mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tên dòng sản phẩm..." 
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
              <th className="p-4">Tên Dòng SP</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={2} className="p-4 text-center">Đang tải...</td></tr>
            ) : safeProducts.length === 0 ? (
              <tr><td colSpan={2} className="p-4 text-center text-gray-500">Chưa có dữ liệu</td></tr>
            ) : (
              safeProducts.map((prod: any, index: number) => (
                <tr key={prod.id || index} className="border-b">
                  <td className="p-4 font-medium">{prod.name}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/products/${prod.id}/variants`} className="inline-flex items-center gap-1 p-2 text-indigo-600 hover:bg-indigo-50 rounded mr-2">
                      <ListTree size={18} /> Biến thể
                    </Link>
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
    </div>
  );
}