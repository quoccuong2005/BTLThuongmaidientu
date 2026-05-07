'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductVariantsPage({ params }: { params: { id: string } }) {
  const productLineId = params.id;
  const [variants, setVariants] = useState<any[]>([]);
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');

  const handleCreate = async () => {
    if (!sku || !price) return;
    try {
      await adminApi.createVariant(productLineId, { sku, price: Number(price) });
      setSku(''); setPrice('');
      alert('Thêm SKU thành công!');
      // Gọi fetchData() nếu có API get Variants
    } catch (error: any) { alert(error.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa SKU này?')) return;
    try {
      await adminApi.deleteVariant(id);
      alert('Xóa thành công!');
    } catch (error: any) { alert(error.message); }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Quản lý SKU (Sản phẩm gốc: #{productLineId})</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
        <input 
          type="text" placeholder="Mã SKU (VD: IPH15-128GB-BLACK)" 
          className="border p-2 rounded flex-1"
          value={sku} onChange={(e) => setSku(e.target.value)}
        />
        <input 
          type="number" placeholder="Giá tiền..." 
          className="border p-2 rounded flex-1"
          value={price} onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={handleCreate} className="bg-orange-500 text-white px-4 py-2 rounded">
          <Plus size={18} className="inline mr-1"/> Thêm
        </button>
      </div>

      {/* Khu vực hiển thị bảng Variants (Tương tự như bảng Products ở trên) */}
      <div className="bg-white p-8 text-center text-gray-500 rounded-xl border">
        Danh sách SKU sẽ hiển thị tại đây khi API GET Variants sẵn sàng.
      </div>
    </div>
  );
}