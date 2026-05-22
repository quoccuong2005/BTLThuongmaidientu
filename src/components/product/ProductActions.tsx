'use client';
import { ShoppingCart, CreditCard, Phone, MessageCircle, Heart, Zap } from 'lucide-react';
import { Product } from '@/models/Product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
  product: Product;
  variant?: 'main' | 'sidebar' | 'premium';
  quantity?: number;
  requiresVariantSelection?: boolean;
  isVariantSelected?: boolean;
  wishlistTargetId?: number;
}

export function ProductActions({ product, variant = 'main', quantity = 1, requiresVariantSelection = false, isVariantSelected = true, wishlistTargetId }: ProductActionsProps) {
  const { addToCart } = useCart();
  const { wishlistedProductIds, handleWishlistClick } = useWishlist();
  const router = useRouter();

  const checkLogin = () => {
    const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;
    if (!sessionId) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      router.push('/login');
      return false;
    }
    return true;
  };

  const isWishlisted = wishlistTargetId ? wishlistedProductIds.has(wishlistTargetId) : false;
  const canWishlist = !!wishlistTargetId;

  const handleAddToCart = () => {
    if (!checkLogin()) return;
    if (requiresVariantSelection && !isVariantSelected) {
      toast.error('Vui lòng chọn phân loại sản phẩm trước khi thêm vào giỏ hàng');
      return;
    }
    addToCart(product, quantity);
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!checkLogin()) return;
    if (requiresVariantSelection && !isVariantSelected) {
      toast.error('Vui lòng chọn phân loại sản phẩm trước khi mua hàng');
      return;
    }
    addToCart(product, quantity);
    router.push('/cart');
  };

  const handleWishlistButtonClick = () => {
    if (!checkLogin()) return;
    if (!canWishlist) {
      toast.info('Vui lòng chọn phân loại sản phẩm trước');
      return;
    }
    handleWishlistClick(wishlistTargetId!);
  };

  if (variant === 'premium') {
    return (
      <div className="space-y-3">
        <button
          onClick={handleBuyNow}
          disabled={requiresVariantSelection && !isVariantSelected}
          className={`w-full ${requiresVariantSelection && !isVariantSelected ? 'bg-red-200 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white p-4 rounded-xl flex flex-col items-center justify-center transition-all active:scale-[0.98] shadow-lg shadow-red-100`}
        >
          <span className="font-bold text-base uppercase">MUA NGAY</span>
          <span className="text-[10px] opacity-90">Giao tận nhà hoặc nhận tại cửa hàng</span>
        </button>
        <button
          onClick={handleAddToCart}
          disabled={requiresVariantSelection && !isVariantSelected}
          className={`w-full py-4 ${requiresVariantSelection && !isVariantSelected ? 'bg-orange-200 cursor-not-allowed text-orange-400' : 'bg-orange-500 hover:bg-orange-600 text-white'} font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-orange-100`}
        >
          <ShoppingCart size={20} />
          <span>THÊM VÀO GIỎ HÀNG</span>
        </button>
        <button
          onClick={handleWishlistButtonClick}
          disabled={!canWishlist}
          className={`w-full py-3 border-2 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${!canWishlist
              ? 'border-gray-100 text-gray-300 cursor-not-allowed'
              : isWishlisted
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
        >
          <Heart size={18} className={isWishlisted && canWishlist ? 'fill-red-600 text-red-600' : ''} />
          {isWishlisted && canWishlist ? 'ĐÃ LƯU YÊU THÍCH' : 'THÊM VÀO YÊU THÍCH'}
        </button>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="space-y-3">
        <button
          onClick={handleBuyNow}
          disabled={requiresVariantSelection && !isVariantSelected}
          className={`w-full ${requiresVariantSelection && !isVariantSelected ? 'bg-red-200 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-red-200 active:scale-[0.98]`}
        >
          <CreditCard size={16} /> Mua hàng ngay
        </button>
        <button
          onClick={handleAddToCart}
          disabled={requiresVariantSelection && !isVariantSelected}
          className={`w-full ${requiresVariantSelection && !isVariantSelected ? 'bg-orange-200 cursor-not-allowed text-orange-400' : 'bg-orange-500 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-orange-200 active:scale-[0.98]`}
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
        <button
          onClick={handleWishlistButtonClick}
          disabled={!canWishlist}
          title={!canWishlist ? 'Chọn phân loại để lưu yêu thích' : (isWishlisted ? 'Bỏ yêu thích' : 'Lưu yêu thích')}
          className={`w-full border py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-medium ${!canWishlist
            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
            : isWishlisted
              ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
        >
          <Heart size={15} className={isWishlisted && canWishlist ? 'fill-red-600 text-red-600' : ''} />
          {isWishlisted && canWishlist ? 'Đã lưu yêu thích' : 'Lưu yêu thích'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={handleBuyNow}
        disabled={requiresVariantSelection && !isVariantSelected}
        className={`flex-1 ${requiresVariantSelection && !isVariantSelected ? 'bg-red-200 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100 transform active:scale-95`}
      >
        <CreditCard size={20} />
        <span>MUA NGAY</span>
      </button>
      <button
        onClick={handleAddToCart}
        disabled={requiresVariantSelection && !isVariantSelected}
        className={`flex-1 ${requiresVariantSelection && !isVariantSelected ? 'bg-orange-200 cursor-not-allowed text-orange-400 border-orange-200' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'} font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 border border-orange-200 min-w-[180px]`}
      >
        <ShoppingCart size={20} />
        <span>THÊM VÀO GIỎ</span>
      </button>
      <button
        onClick={handleWishlistButtonClick}
        disabled={!canWishlist}
        className={`px-6 rounded-xl border-2 transition-all flex items-center justify-center transform min-h-[56px] ${!canWishlist
          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
          : isWishlisted
            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:scale-95'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 active:scale-95'
          }`}
        title={!canWishlist ? 'Chọn phân loại để lưu yêu thích' : (isWishlisted ? 'Bỏ yêu thích' : 'Lưu yêu thích')}
      >
        <Heart size={24} className={isWishlisted && canWishlist ? 'fill-red-600 text-red-600' : ''} />
      </button>
    </div>
  );
}
