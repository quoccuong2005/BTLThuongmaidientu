'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus, ArrowLeft, Layers, Edit, X } from 'lucide-react';
import Link from 'next/link';

export default function ProductVariantsPage({ params }: { params: { id: string } }) {
  const productLineId = params.id;
  
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');

  // State cho Form Thêm
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');

  // State cho Modal Sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ sku: '', price: '', stock: '' });

  useEffect(() => {
    fetchVariants();
  }, [productLineId]);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      // Ép tải lại dữ liệu mới nhất
      const res = await adminApi.getProductLineDetail(`${productLineId}?t=${Date.now()}`);
      
      // BỘ QUÉT SIÊU CẤP: Tìm dữ liệu dù Backend có giấu sâu đến mấy
      const product = res?.data?.data || res?.data || res || {};
      
      console.log("🔍 DỮ LIỆU SẢN PHẨM GỐC:", product);

      setProductName(product.name || '');
      
      // Quét tất cả các tên biến thể Backend có thể đặt
// Thêm 'product.products' vào bộ quét nhé!
      const danhSachSKU = product.variants || product.skus || product.product_variants || product.products || [];
      
      setVariants(danhSachSKU);
    } catch (error) {
      console.error("Lỗi tải biến thể:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ THÊM MỚI (POST) ---
  const handleCreate = async () => {
    if (!sku || !price || !stock) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    try {
      await adminApi.createVariant(productLineId, { 
        name: `${productName || 'Phiên bản'} - ${sku}`, // Tài liệu yêu cầu có name
        sku: sku, 
        price: Number(price),
        stock: Number(stock),
        image_url: "" // Tài liệu yêu cầu có image_url
      });
      
      setSku(''); setPrice(''); setStock('0');
      alert('Thêm SKU thành công!');
      fetchVariants(); 
    } catch (error: any) { 
      alert(error.message || 'Lỗi khi thêm biến thể'); 
    }
  };

  // --- XỬ LÝ SỬA (PATCH) ---
  const handleOpenEdit = (v: any) => {
    setEditingId(v.id);
    setEditForm({ sku: v.sku, price: v.price?.toString(), stock: v.stock?.toString() });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Tài liệu yêu cầu khi PATCH phải có product_line_id
      await adminApi.updateVariant(editingId!, {
        product_line_id: Number(productLineId),
        sku: editForm.sku,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        image_url: "" // Tạm để rỗng nếu chưa có form up ảnh cho SKU
      });
      
      alert('Cập nhật thành công!');
      setIsEditModalOpen(false);
      fetchVariants();
    } catch (error: any) {
      alert(error.message || 'Lỗi khi cập nhật!');
    }
  };

  // --- XỬ LÝ XÓA (DELETE) ---
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa SKU này?')) return;
    try {
      await adminApi.deleteVariant(id);
      fetchVariants();
    } catch (error: any) { 
      alert(error.message || 'Lỗi khi xóa biến thể'); 
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý SKU <span className="text-orange-600 font-medium">({productName || `Sản phẩm #${productLineId}`})</span>
        </h1>
      </div>

      {/* Form Thêm nhanh SKU */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mã SKU / Phân loại</label>
          <input 
            type="text" placeholder="VD: Màu Đen - 256GB" 
            className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-1 focus:ring-orange-500 outline-none"
            value={sku} onChange={(e) => setSku(e.target.value)}
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán riêng (VNĐ)</label>
          <input 
            type="number" placeholder="VD: 15000000" 
            className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-1 focus:ring-orange-500 outline-none"
            value={price} onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
          <input 
            type="number" 
            className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-1 focus:ring-orange-500 outline-none"
            value={stock} onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <button 
          onClick={handleCreate} 
          className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-6 py-2.5 rounded-lg font-medium whitespace-nowrap flex items-center h-[46px]"
        >
          <Plus size={18} className="mr-2"/> Thêm mới
        </button>
      </div>

      {/* Bảng Danh sách SKU */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Tên phân loại (SKU)</th>
              <th className="p-4 font-semibold text-gray-600">Giá bán</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Tồn kho</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
              </tr>
            ) : variants.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">
                  <Layers size={48} className="mx-auto text-gray-300 mb-3" />
                  Sản phẩm này chưa có biến thể nào.
                </td>
              </tr>
            ) : (
              variants.map((v: any) => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500">{v.id}</td>
                  <td className="p-4 font-medium text-gray-800">{v.sku}</td>
                  <td className="p-4 text-orange-600 font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price || 0)}
                  </td>
                  <td className="p-4 text-center">{v.stock}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleOpenEdit(v)} 
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-2"
                      title="Sửa biến thể"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(v.id)} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa biến thể"
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

      {/* Modal Sửa SKU */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Cập nhật SKU</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-800"><X size={24} /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Mã SKU</label>
                <input type="text" required className="w-full border p-2.5 rounded-xl" value={editForm.sku} onChange={e => setEditForm({...editForm, sku: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Giá bán</label>
                <input type="number" required className="w-full border p-2.5 rounded-xl" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tồn kho</label>
                <input type="number" required className="w-full border p-2.5 rounded-xl" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 bg-gray-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}