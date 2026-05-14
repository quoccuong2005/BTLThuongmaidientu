'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/services/adminApi';
import { ArrowLeft, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

export default function ProductImagesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const productId = params.id;
  
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [productId]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProductImages(productId);
      setImages(res.data || res.items || res || []);
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi chọn file ảnh để tải lên
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Up ảnh lên server lấy URL
      const uploadRes = await adminApi.uploadImage(file);
      const imageUrl = uploadRes.data?.url || uploadRes.url;

      if (!imageUrl) throw new Error('Không lấy được đường dẫn ảnh từ Server');

      // 2. Gắn URL ảnh vào sản phẩm
      await adminApi.createProductImage({
        product_line_id: Number(productId),
        url: imageUrl,
        sort_order: images.length // Tự động xếp xuống cuối
      });

      alert('Tải ảnh lên thành công!');
      fetchImages(); // Tải lại danh sách ảnh
    } catch (error: any) {
      alert(error.message || 'Lỗi khi tải ảnh lên!');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    try {
      await adminApi.deleteProductImage(imageId);
      fetchImages();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Ảnh (Sản phẩm #{productId})</h1>
      </div>

      {/* Khu vực Upload */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col items-center justify-center border-dashed border-2 border-orange-200 bg-orange-50/30">
        <ImageIcon size={48} className="text-orange-300 mb-4" />
        <p className="text-gray-600 mb-4">Chọn ảnh từ máy tính để tải lên</p>
        
        <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors">
          <Upload size={18} />
          {uploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload} 
            disabled={uploading}
          />
        </label>
      </div>

      {/* Lưới hiển thị ảnh */}
      {loading ? (
        <p className="text-center text-gray-500">Đang tải danh sách ảnh...</p>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-100">Chưa có hình ảnh nào cho sản phẩm này.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((img: any) => (
            <div key={img.id} className="relative group bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
              <img src={img.url} alt="Product" className="w-full h-48 object-contain rounded-lg bg-gray-50" />
              
              <button 
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                title="Xóa ảnh"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}