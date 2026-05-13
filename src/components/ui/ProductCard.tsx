'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Clock, MapPin, ShoppingCart, Star } from 'lucide-react';
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

  const handleAddToCart = () => {
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
    <div className="product-card tech-card group">
      <Link href={`/product/${product.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {discount && <span className="badge-urgent">-{discount}%</span>}
            {product.isFeatured && <span className="badge-featured">HOT</span>}
          </div>
        </div>

        <div className="space-y-1.5 p-3">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{product.title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-orange-600">{ProductController.formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-500 line-through">{ProductController.formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
              <Star size={12} className="fill-current" />
              {(product.rating || 5).toFixed(1)}
            </span>
            <span className="font-semibold text-slate-600">Đã bán {product.totalSold || 0}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="inline-flex max-w-[58%] items-center gap-0.5 truncate">
              <MapPin size={10} className="flex-shrink-0" />
              <span className="truncate">{product.location.split(',')[0]}</span>
            </span>
            <span className="inline-flex items-center gap-0.5">
              <Clock size={10} />
              {relativeTime}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-3 pt-0">
        <button
          onClick={handleAddToCart}
          className={`tap-bounce inline-flex min-h-11 w-full items-center justify-center gap-1 rounded-lg bg-orange-500 px-3 py-2 text-sm font-bold text-white shadow-sm shadow-orange-200 transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
            isAdding ? 'add-cart-pulse' : ''
          }`}
          aria-label={`Thêm ${product.title} vào giỏ`}
        >
          <ShoppingCart size={16} />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
