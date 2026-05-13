'use client';

import React, { useEffect, useState } from 'react';
import { WishlistController, PublicWishlistResponse, WishlistItem } from '@/controllers/WishlistController';
import { ProductController } from '@/controllers/ProductController';
import Link from 'next/link';
import { Loader2, Heart, ExternalLink } from 'lucide-react';

export default function PublicWishlistPage({ params }: { params: { token: string } }) {
  const [data, setData] = useState<PublicWishlistResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicList = async () => {
      try {
        const result = await WishlistController.getPublicWishlist(params.token, { limit: 50 });
        if (result) {
          setData(result);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicList();
  }, [params.token]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10 mb-4" />
        <p className="text-gray-500">Đang tải danh sách...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Heart className="text-red-300 w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Liên kết không hợp lệ</h1>
        <p className="text-gray-500 max-w-md">
          Danh sách này có thể đã bị xóa hoặc liên kết chia sẻ đã hết hạn.
        </p>
        <Link href="/" className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          Trở về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border rounded-2xl p-8 mb-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.wishlist_name}</h1>
        <p className="text-gray-600">
          Danh sách yêu thích được chia sẻ • {data.total} sản phẩm
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.items.map((item: WishlistItem) => (
          <Link 
            href={`/product/${item.product.id}`} 
            key={item.id} 
            className="group bg-white rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              <img 
                src={item.product.image_url || ''} 
                alt={item.product.name} 
                className={`w-full h-full object-cover group-hover:scale-105 transition duration-300 ${item.product.is_out_of_stock ? 'opacity-50 grayscale' : ''}`} 
              />
              {item.product.is_out_of_stock && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  HẾT HÀNG
                </div>
              )}
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug flex-1 mb-2">
                {item.product.name}
              </h3>
              
              <div className="flex items-end justify-between mt-auto">
                <span className="text-orange-500 font-bold">
                  {ProductController.formatPrice(item.product.price)}
                </span>
                
                <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Xem ngay <ExternalLink size={12} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
