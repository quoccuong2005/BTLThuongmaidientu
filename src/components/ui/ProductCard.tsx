'use client';
import Link from 'next/link';
import { MapPin, Eye, Clock, ShoppingCart, CreditCard } from 'lucide-react';
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
  const discount = ProductController.getDiscount(product.price, product.originalPrice);
  const relativeTime = ProductController.getRelativeTime(product.postedAt);
  console.log("aaa", product)
  if (variant === 'horizontal') {
    return (
      <Link href={`/product/${product.id}`} className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
        <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {product.isUrgent && (
            <span className="absolute top-1 left-1 badge-urgent">GẤP</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{product.title}</p>
          <p className="text-orange-500 font-bold text-base mt-1">
            {ProductController.formatPrice(product.price)}
            {product.price < 1000000 && <span className="text-xs font-normal text-gray-400">/tháng</span>}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-0.5"><MapPin size={10} />{product.location.split(',')[0]}</span>
            <span>·</span>
            <span>{relativeTime}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center ml-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
              toast.success('Đã thêm vào giỏ hàng!');
            }}
            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ShoppingCart size={16} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
              window.location.assign('/cart');
            }}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <CreditCard size={16} />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.id}`} className="product-card group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isUrgent && <span className="badge-urgent">GẤP</span>}
          {product.isFeatured && <span className="badge-featured">NỔI BẬT</span>}
          {discount && <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">-{discount}%</span>}
        </div>
        {/* Condition */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${product.condition === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
            {product.condition === 'new' ? 'Mới' : 'Cũ'}
          </span>
        </div>
        {/* Views overlay on hover */}
        {product.views && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye size={10} />{product.views.toLocaleString()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug mb-1.5">{product.title}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-orange-500 font-bold text-base">
            {ProductController.formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">
              {ProductController.formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-0.5 truncate">
            <MapPin size={10} className="flex-shrink-0" />
            <span className="truncate">{product.location.split(',')[0]}</span>
          </span>
          <span className="flex items-center gap-0.5 flex-shrink-0 ml-1">
            <Clock size={10} />
            {relativeTime}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
              toast.success('Đã thêm vào giỏ hàng!');
            }}
            className="flex items-center justify-center gap-1 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-bold hover:bg-orange-100 transition-colors border border-orange-100"
          >
            <ShoppingCart size={12} />
            GIỎ HÀNG
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
              window.location.assign('/cart');
            }}
            className="flex items-center justify-center gap-1 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-bold hover:bg-red-700 transition-colors shadow-sm"
          >
            <CreditCard size={12} />
            MUA NGAY
          </button>
        </div>
      </div>
    </Link>
  );
}
