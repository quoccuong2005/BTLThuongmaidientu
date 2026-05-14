'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Clock, Eye, MapPin, ShoppingCart } from 'lucide-react';
import { Product } from '@/models/Product';
import { ProductController } from '@/controllers/ProductController';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'horizontal';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const discount = ProductController.getDiscount(product.price, product.originalPrice);
  const relativeTime = ProductController.getRelativeTime(product.postedAt);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(product);
    toast.success('Đã thêm vào giỏ hàng');
    window.setTimeout(() => setIsAdding(false), 280);
  };

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/product/${product.id}`}
        className="group flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
      >
        <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
          {discount && <span className="badge-urgent absolute left-1 top-1">-{discount}%</span>}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{product.title}</p>
          <p className="mt-1 text-base font-extrabold text-orange-600">{ProductController.formatPrice(product.price)}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-0.5">
              <MapPin size={10} />
              {product.location.split(',')[0]}
            </span>
            <span>·</span>
            <span>{relativeTime}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="product-card group relative flex flex-col h-full bg-white transition-all duration-300 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-2 border-transparent hover:border-orange-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 rounded-t-xl">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Glassmorphism Badges — top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {product.isUrgent && (
            <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg border border-white/20 uppercase tracking-wider">
              🔥 Gấp
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg border border-white/20 uppercase tracking-wider">
              ⭐ Nổi bật
            </span>
          )}
          {discount && (
            <span className="bg-green-500/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg border border-white/20">
              -{discount}%
            </span>
          )}
        </div>

        {/* Condition Badge — top right */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`text-[10px] font-black px-2 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-lg ${product.condition === 'new' ? 'bg-blue-500/90 text-white' : 'bg-gray-800/80 text-white'}`}>
            {product.condition === 'new' ? 'MỚI' : 'CŨ'}
          </span>
        </div>

        {/* View Count Overlay */}
        {product.views && (
          <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Eye size={12} />
            <span className="font-bold">{product.views.toLocaleString('vi-VN')}</span>
          </div>
        )}

        {/* Hover Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm text-gray-800 font-semibold line-clamp-2 leading-tight mb-2 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>

        <div className="mt-auto space-y-3">
          {/* Price Section */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-orange-500 font-extrabold text-lg tracking-tight">
                {ProductController.formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 text-xs line-through decoration-gray-300">
                  {ProductController.formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.totalSold != null && (
              <span className="text-xs font-semibold text-slate-500 mt-0.5">Đã bán {product.totalSold}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isAdding
                ? 'bg-green-500 text-white scale-95'
                : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-md hover:shadow-orange-200'
            }`}
          >
            <ShoppingCart size={14} />
            {isAdding ? 'Đã thêm!' : 'Thêm vào giỏ'}
          </button>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-[11px] text-gray-400 font-medium">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin size={12} className="text-gray-300 flex-shrink-0" />
              <span className="truncate">{product.location.split(',')[0]}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock size={12} className="text-gray-300" />
              <span>{relativeTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
