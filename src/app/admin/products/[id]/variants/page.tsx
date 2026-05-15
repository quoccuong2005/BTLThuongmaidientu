'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus, ArrowLeft, Layers, Edit, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function ProductVariantsPage({ params }: { params: { id: string } }) {
  const productLineId = params.id;
  
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  
  // State cho Modal (Dùng chung cho Thêm và Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '0',
    image_url: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchVariants();
  }, [productLineId]);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProductLineDetail(`${productLineId}?t=${Date.now()}`);
      const product = res?.data?.data || res?.data || res || {};
      setProductName(product.name || '');
      const danhSachSKU = product.variants || product.skus || product.product_variants || product.products || [];
      setVariants(danhSachSKU);
    } catch (error) {
      console.error("Lỗi tải biến thể:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await adminApi.uploadImage(file);
      const url = res.data?.url || res.url;
      if (url) {
        setFormData(prev => ({ ...prev, image_url: url }));
        alert('Tải ảnh lên thành công!');
      }
    } catch (error: any) {
      alert('Lỗi tải ảnh: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', stock: '0', image_url: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: any) => {
    setEditingId(v.id);
    setFormData({ 
      name: v.name || '',
      price: v.price?.toString() || '', 
      stock: v.stock?.toString() || '0',
      image_url: v.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Vui lòng điền đầy đủ Tên và Giá!');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image_url: formData.image_url
      };

      if (editingId) {
        // Cập nhật SKU
        await adminApi.updateVariant(editingId, {
          ...payload,
          product_line_id: Number(productLineId)
        });
        alert('Cập nhật thành công!');
      } else {
        // Thêm mới SKU
        await adminApi.createVariant(productLineId, payload);
        alert('Thêm SKU thành công!');
      }
      
      setIsModalOpen(false);
      fetchVariants();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra!');
    }
  };

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý SKU <span className="text-orange-600 font-medium">({productName || `Sản phẩm #${productLineId}`})</span>
          </h1>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <Plus size={20} /> Thêm SKU mới
        </button>
      </div>

      {/* Bảng Danh sách SKU */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600 w-16">ID</th>
              <th className="p-4 font-semibold text-gray-600 w-20 text-center">Ảnh</th>
              <th className="p-4 font-semibold text-gray-600">Tên hiển thị</th>
              <th className="p-4 font-semibold text-gray-600">Giá bán</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Tồn kho</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-12 text-center text-gray-400">Đang tải dữ liệu...</td></tr>
            ) : variants.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-16 text-center text-gray-500">
                  <Layers size={48} className="mx-auto text-gray-200 mb-4" />
                  <p>Sản phẩm này chưa có biến thể nào.</p>
                </td>
              </tr>
            ) : (
              variants.map((v: any) => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400 text-sm">#{v.id}</td>
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 shadow-sm">
                      {v.image_url ? (
                        <img src={v.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={16} /></div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-800">{v.name || '-'}</td>
                  <td className="p-4 text-orange-600 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price || 0)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {v.stock} trong kho
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleOpenEdit(v)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(v.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa SKU */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Cập nhật SKU' : 'Thêm SKU Mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 bg-gray-50 p-2 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tên hiển thị <span className="text-red-500">*</span></label>
                <input 
                  type="text" required 
                  className="w-full border-2 border-gray-100 p-3.5 rounded-2xl outline-none focus:border-orange-500 transition-all bg-gray-50/50" 
                  placeholder="VD: iPhone 15 Pro Max - Xanh Titan"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" required 
                    className="w-full border-2 border-gray-100 p-3.5 rounded-2xl outline-none focus:border-orange-500 transition-all bg-gray-50/50" 
                    placeholder="VD: 25000000"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tồn kho</label>
                  <input 
                    type="number" required 
                    className="w-full border-2 border-gray-100 p-3.5 rounded-2xl outline-none focus:border-orange-500 transition-all bg-gray-50/50" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Hình ảnh sản phẩm</label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 relative group">
                    {formData.image_url ? (
                      <>
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                            className="bg-white p-1.5 rounded-full text-red-500 hover:scale-110 transition-transform shadow-lg"
                           >
                            <Trash2 size={18} />
                           </button>
                        </div>
                      </>
                    ) : (
                      <Plus className="text-gray-300" size={24} />
                    )}
                  </div>
                  {!formData.image_url && (
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden" 
                        id="sku-upload-modal"
                      />
                      <label 
                        htmlFor="sku-upload-modal"
                        className={`inline-flex items-center px-4 py-2.5 rounded-xl border-2 border-gray-100 text-sm font-bold cursor-pointer hover:bg-gray-50 transition-all shadow-sm ${uploading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                      >
                        {uploading ? 'Đang tải lên...' : 'Chọn hình ảnh'}
                      </label>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Dung lượng tối đa 5MB. Định dạng JPG, PNG, WEBP.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
                >
                  {editingId ? 'Cập nhật ngay' : 'Thêm sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}