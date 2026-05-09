'use client';
import { useCart } from '@/context/CartContext';
import { ProductController } from '@/controllers/ProductController';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    selectedTotalPrice,
    itemCount, 
    clearCart,
    toggleSelection,
    toggleSelectAll,
    selectedItemIds
  } = useCart();

  const isAllSelected = selectedItemIds.length === items.length && items.length > 0;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h1>
        <p className="text-gray-500 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <Link href="/" className="btn-brand px-8 py-3 inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
        Giỏ hàng của bạn <span className="text-gray-400 font-normal">({itemCount} sản phẩm)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select all header */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
            />
            <span className="font-semibold text-gray-700">Chọn tất cả ({items.length} sản phẩm)</span>
          </div>

          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 border border-gray-50">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={selectedItemIds.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </div>
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 line-clamp-2 leading-snug hover:text-orange-500">
                    <Link href={`/product/${item.id}`}>{item.title}</Link>
                  </h3>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-orange-500 font-bold mb-3">{ProductController.formatPrice(item.price)}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-50 text-gray-500"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-50 text-gray-500"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-gray-900">
                    {ProductController.formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors"
          >
            Xóa tất cả sản phẩm
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Tổng cộng</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-500">
                <span>Tạm tính ({selectedItemIds.length} sản phẩm)</span>
                <span>{ProductController.formatPrice(selectedTotalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="text-green-500 font-medium">Miễn phí</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between font-black text-xl text-gray-900">
                <span>Tổng tiền</span>
                <span className="text-orange-500">{ProductController.formatPrice(selectedTotalPrice)}</span>
              </div>
            </div>
            <button 
              disabled={selectedItemIds.length === 0}
              className={`w-full py-4 font-bold text-lg rounded-xl shadow-lg transition-all active:scale-[0.98] ${
                selectedItemIds.length > 0 
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              MUA HÀNG ({selectedItemIds.length})
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Hỗ trợ thanh toán qua thẻ, ví điện tử hoặc COD
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
