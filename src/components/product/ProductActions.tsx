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
      <div className="space-y-3">
        <button 
          onClick={handleBuyNow}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-red-200 active:scale-[0.98]"
        >
          <CreditCard size={16} /> Mua hàng ngay
        </button>
        <button 
          onClick={handleAddToCart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-orange-200 active:scale-[0.98]"
        >
          <ShoppingCart size={16} /> Thêm vào giỏ hàng
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs">
            <Phone size={14} /> Gọi điện
          </button>
          <button className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs">
            <MessageCircle size={14} /> Nhắn tin
          </button>
        </div>
        <button className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
          <Heart size={15} /> Lưu tin
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button 
        onClick={handleBuyNow}
        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100 transform active:scale-95"
      >
        <CreditCard size={20} />
        <span>MUA NGAY</span>
      </button>
      <button 
        onClick={handleAddToCart}
        className="flex-1 bg-orange-100 text-orange-600 hover:bg-orange-200 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 border border-orange-200"
      >
        <ShoppingCart size={20} />
        <span>THÊM VÀO GIỎ</span>
      </button>
    </div>
  );
}
