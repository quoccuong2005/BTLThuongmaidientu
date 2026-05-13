'use client';
import { ShoppingCart, CreditCard, Phone, MessageCircle, Heart } from 'lucide-react';
import { Product } from '@/models/Product';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
  product: Product;
  variant?: 'main' | 'sidebar';
  quantity?: number;
}

export function ProductActions({ product, variant = 'main', quantity = 1 }: ProductActionsProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/cart');
  };

  if (variant === 'sidebar') {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBuyNow}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-xl shadow-red-200 active:scale-[0.98] uppercase tracking-wider"
        >
          <CreditCard size={18} /> Mua hàng ngay
        </button>
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-xl shadow-orange-200 active:scale-[0.98] uppercase tracking-wider"
        >
          <ShoppingCart size={18} /> Thêm vào giỏ hàng
        </button>
        {/* <div className="grid grid-cols-2 gap-3">
          <button className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-black py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-[11px] uppercase tracking-tighter">
            <Phone size={14} /> Gọi điện
          </button>
          <button className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-black py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-[11px] uppercase tracking-tighter">
            <MessageCircle size={14} /> Nhắn tin
          </button>
        </div> */}
        <button className="w-full bg-gray-50 text-gray-500 hover:bg-gray-100 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs border border-gray-100">
          <Heart size={16} /> Lưu tin này
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={handleBuyNow}
        className="flex-[1.5] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-red-200 transform active:scale-95 uppercase tracking-widest text-base"
      >
        <CreditCard size={24} />
        <span>Mua ngay</span>
      </button>
      <button
        onClick={handleAddToCart}
        className="flex-1 bg-orange-50 text-orange-600 hover:bg-orange-100 font-black py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 transform active:scale-95 border-2 border-orange-200 shadow-xl shadow-orange-50 uppercase tracking-widest text-sm"
      >
        <ShoppingCart size={22} />
        <span>Thêm giỏ</span>
      </button>
    </div>
  );
}
