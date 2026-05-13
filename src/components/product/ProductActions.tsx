'use client';
import { ShoppingCart, CreditCard, Phone, MessageCircle, Heart } from 'lucide-react';
import { Product } from '@/models/Product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
  product: Product;
  variant?: 'main' | 'sidebar';
  quantity?: number;
  /**
   * ID hợp lệ của Product (variant) để lưu Wishlist.
   * - Nếu sản phẩm CÓ variants: truyền vào selectedVariant.id
   * - Nếu sản phẩm KHÔNG có variants: bỏ qua, nút Yêu thích sẽ bị disable
   */
  wishlistTargetId?: number;
}

export function ProductActions({ product, variant = 'main', quantity = 1, wishlistTargetId }: ProductActionsProps) {
  const { addToCart } = useCart();
  const { wishlistedProductIds, handleWishlistClick } = useWishlist();
  const router = useRouter();

  // Chỉ check isWishlisted nếu có wishlistTargetId hợp lệ
  const isWishlisted = wishlistTargetId ? wishlistedProductIds.has(wishlistTargetId) : false;
  // Nút Yêu thích chỉ hoạt động khi đã có targetId (tức là đã chọn variant)
  const canWishlist = !!wishlistTargetId;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/cart');
  };

  const handleWishlistButtonClick = () => {
    if (!canWishlist) {
      toast.info('Vui lòng chọn phân loại sản phẩm trước');
      return;
    }
    handleWishlistClick(wishlistTargetId!);
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
        <button 
          onClick={handleWishlistButtonClick}
          disabled={!canWishlist}
          title={!canWishlist ? 'Chọn phân loại để lưu yêu thích' : (isWishlisted ? 'Bỏ yêu thích' : 'Lưu yêu thích')}
          className={`w-full border py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-medium ${
            !canWishlist
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
        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100 transform active:scale-95"
      >
        <CreditCard size={20} />
        <span>MUA NGAY</span>
      </button>
      <button
        onClick={handleAddToCart}
        className="flex-1 bg-orange-100 text-orange-600 hover:bg-orange-200 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 border border-orange-200 min-w-[180px]"
      >
        <ShoppingCart size={20} />
        <span>THÊM VÀO GIỎ</span>
      </button>
      <button
        onClick={handleWishlistButtonClick}
        disabled={!canWishlist}
        className={`px-6 rounded-xl border-2 transition-all flex items-center justify-center transform min-h-[56px] ${
          !canWishlist
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
