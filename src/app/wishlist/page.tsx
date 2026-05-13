'use client';

import React, { useEffect, useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { WishlistController, WishlistItem } from '@/controllers/WishlistController';
import { Trash2, Edit2, Share2, Bell, BellOff, ShoppingCart, Info, Loader2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ProductController } from '@/controllers/ProductController';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const {
    wishlists,
    activeWishlistId,
    setActiveWishlistId,
    createWishlist,
    deleteWishlist,
    renameWishlist,
    toggleWishlistItem,
    isLoading: contextLoading
  } = useWishlist();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const router = useRouter();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      toast.info('Vui lòng đăng nhập để xem danh sách yêu thích');
      router.push('/login');
    }
  }, [router]);
  
  // States cho modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  
  const [deleteListConfirm, setDeleteListConfirm] = useState<{id: number, name: string} | null>(null);
  const [deleteItemConfirm, setDeleteItemConfirm] = useState<{id: number, product_id: number, name: string} | null>(null);
  
  // Fetch items khi chuyển tab
  useEffect(() => {
    if (activeWishlistId) {
      loadItems(activeWishlistId);
    } else {
      setItems([]);
      setTotalItems(0);
    }
  }, [activeWishlistId]);

  const loadItems = async (wishlistId: number) => {
    setIsLoadingItems(true);
    const res = await WishlistController.getWishlistItems(wishlistId, { limit: 50 });
    if (res) {
      setItems(res.items);
      setTotalItems(res.total);
    }
    setIsLoadingItems(false);
  };

  const handleCreateNewList = async () => {
    if (!newListName.trim()) {
      toast.error('Vui lòng nhập tên danh sách');
      return;
    }
    await createWishlist(newListName);
    setNewListName('');
    setIsCreateModalOpen(false);
    toast.success('Tạo danh sách thành công');
  };

  const executeDeleteList = async () => {
    if (!deleteListConfirm) return;
    const success = await deleteWishlist(deleteListConfirm.id);
    if (success) {
      toast.success('Đã xóa danh sách');
    } else {
      toast.error('Không thể xóa danh sách này');
    }
    setDeleteListConfirm(null);
  };

  const executeDeleteItem = async () => {
    if (!deleteItemConfirm) return;
    const success = await toggleWishlistItem(deleteItemConfirm.product_id, activeWishlistId || undefined);
    if (success) {
      setItems(prev => prev.filter(i => i.id !== deleteItemConfirm.id));
      setTotalItems(prev => prev - 1);
    }
    setDeleteItemConfirm(null);
  };

  const handleDeleteListClick = (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    setDeleteListConfirm({ id, name });
  };

  const handleRenameList = async (id: number, oldName: string) => {
    const newName = window.prompt('Nhập tên mới:', oldName);
    if (newName && newName.trim() !== '' && newName !== oldName) {
      const success = await renameWishlist(id, newName);
      if (success) toast.success('Đã đổi tên danh sách');
      else toast.error('Lỗi đổi tên');
    }
  };

  const handleShareList = async (id: number) => {
    try {
      const token = await WishlistController.generateShareLink(id);
      if (token) {
        const url = `${window.location.origin}/wishlist/public/${token}`;
        await navigator.clipboard.writeText(url);
        toast.success('Đã sao chép link chia sẻ vào clipboard!');
      } else {
        toast.error('Không thể tạo link chia sẻ');
      }
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  // Component render item trong wishlist
  const WishlistItemCard = ({ item }: { item: WishlistItem }) => {
    const { addToCart } = useCart();
    const [isMoving, setIsMoving] = useState(false);
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [noteContent, setNoteContent] = useState(item.note || '');
    
    // Alert states
    const [priceAlert, setPriceAlert] = useState(item.price_alert);
    const [stockAlert, setStockAlert] = useState(item.stock_alert);

    const handleMoveToCart = async () => {
      if (item.product.is_out_of_stock) {
        toast.error('Sản phẩm đã hết hàng');
        return;
      }
      setIsMoving(true);
      const success = await WishlistController.moveToCart(item.id);
      if (success) {
        // Optimistic refresh items list
        setItems(prev => prev.filter(i => i.id !== item.id));
        addToCart({
            id: item.product.id,
            title: item.product.name,
            price: item.product.price,
            image: item.product.image_url || '',
            quantity: 1,
            location: '',
            category: '',
            categorySlug: '',
            condition: 'new',
            postedAt: new Date().toISOString(),
            seller: 'System',
        });
        toast.success('Đã chuyển sang giỏ hàng');
      } else {
        toast.error('Lỗi chuyển giỏ hàng');
        setIsMoving(false);
      }
    };

    const handleSaveNote = async () => {
      const val = noteContent.trim() || null;
      const success = await WishlistController.updateItemNote(item.id, val);
      if (success) {
        item.note = val;
        setShowNoteInput(false);
        toast.success('Đã lưu ghi chú');
      }
    };

    const handleRemoveItem = () => {
      setDeleteItemConfirm({
        id: item.id,
        product_id: item.product.id,
        name: `${item.product.product_line_name} (${item.product.name})`
      });
    };

    const handleTogglePriceAlert = async () => {
      setPriceAlert(!priceAlert); // optimistic
      try {
        const res = await WishlistController.togglePriceAlert(item.id);
        if (res) {
          toast.success(res.price_alert ? '🔔 Đã bật nhận thông báo giảm giá' : '🔕 Đã tắt thông báo giảm giá');
        }
      } catch {
        setPriceAlert(priceAlert); // rollback
      }
    };

    const handleToggleStockAlert = async () => {
      setStockAlert(!stockAlert); // optimistic
      try {
        const res = await WishlistController.toggleStockAlert(item.id);
        if (res) {
          toast.success(res.stock_alert ? '🔔 Đã bật nhận thông báo có hàng' : '🔕 Đã tắt thông báo có hàng');
        }
      } catch {
        setStockAlert(stockAlert); // rollback
      }
    };

    return (
      <div className="flex gap-4 p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
          <img src={item.product.image_url || ''} alt={item.product.name} className={`w-full h-full object-cover ${item.product.is_out_of_stock ? 'opacity-50 grayscale' : ''}`} />
          {item.product.is_out_of_stock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HẾT HÀNG</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <Link href={`/product/${item.product.product_line_id}?variant=${item.product.id}`} className="text-base font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 pr-4">
              {item.product.product_line_name} <span className="text-gray-500 font-normal">({item.product.name})</span>
            </Link>
            <button 
              onClick={handleRemoveItem}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
              title="Xoá khỏi danh sách"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="text-orange-500 font-bold mt-1">{ProductController.formatPrice(item.product.price)}</div>
          
          <div className="mt-2 text-sm text-gray-600">
            {item.note && !showNoteInput ? (
              <div className="flex items-start gap-2 bg-yellow-50 p-2 rounded text-xs border border-yellow-100">
                <Info size={14} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{item.note}</span>
                <button onClick={() => setShowNoteInput(true)} className="text-gray-400 hover:text-gray-700"><Edit2 size={12} /></button>
              </div>
            ) : showNoteInput ? (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="border text-xs rounded px-2 py-1 flex-1" 
                  value={noteContent} 
                  onChange={e => setNoteContent(e.target.value)} 
                  placeholder="Ghi chú..." 
                  maxLength={500}
                />
                <button onClick={handleSaveNote} className="bg-blue-500 text-white text-xs px-2 rounded">Lưu</button>
                <button onClick={() => { setShowNoteInput(false); setNoteContent(item.note || ''); }} className="bg-gray-200 text-xs px-2 rounded">Hủy</button>
              </div>
            ) : (
              <button onClick={() => setShowNoteInput(true)} className="text-xs text-blue-500 hover:underline">
                + Thêm ghi chú
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button 
              onClick={handleMoveToCart} 
              disabled={isMoving || item.product.is_out_of_stock}
              className="flex items-center gap-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {isMoving ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
              Chuyển sang giỏ
            </button>
            
            <div className="flex items-center gap-4 border-l pl-3 ml-auto">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-gray-900">
                <input type="checkbox" checked={priceAlert} onChange={handleTogglePriceAlert} className="rounded text-blue-500 w-3.5 h-3.5" />
                Giảm giá
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-gray-900">
                <input type="checkbox" checked={stockAlert} onChange={handleToggleStockAlert} className="rounded text-blue-500 w-3.5 h-3.5" />
                Có hàng
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (contextLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách yêu thích</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* TABS */}
        <div className="flex items-center overflow-x-auto border-b bg-gray-50/50 p-2 gap-2 hide-scrollbar">
          {wishlists.map((w) => (
            <div 
              key={w.id} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer whitespace-nowrap
                ${activeWishlistId === w.id ? 'bg-white shadow-sm border text-blue-600' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}
              `}
              onClick={() => setActiveWishlistId(w.id)}
            >
              <span>{w.is_default === 1 ? '⭐' : '📋'} {w.name}</span>
              
              {activeWishlistId === w.id && (
                <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
                  <button onClick={(e) => { e.stopPropagation(); handleShareList(w.id); }} className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-500" title="Chia sẻ"><Share2 size={14}/></button>
                  {w.is_default === 0 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handleRenameList(w.id, w.name); }} className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-500" title="Đổi tên"><Edit2 size={14}/></button>
                      <button onClick={(e) => handleDeleteListClick(e, w.id, w.name)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500" title="Xóa danh sách"><Trash2 size={14}/></button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
          >
            + Tạo danh sách mới
          </button>
        </div>

        {/* ITEMS LIST */}
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-500 font-medium">
            Có {totalItems} sản phẩm trong danh sách này
          </div>

          {isLoadingItems ? (
            <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có sản phẩm nào</h3>
              <p className="text-gray-500 mb-6">Hãy thêm các sản phẩm bạn yêu thích vào danh sách này.</p>
              <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map(item => <WishlistItemCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </div>

      {/* MODAL TẠO DANH SÁCH MỚI */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b">
              <h3 className="text-lg font-bold">Tạo danh sách mới</h3>
            </div>
            <div className="p-5">
              <input 
                type="text" 
                className="w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500" 
                placeholder="Ví dụ: Mùa hè 2026, Công nghệ..." 
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleCreateNewList()}
              />
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200">Hủy</button>
              <button onClick={handleCreateNewList} className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700">Tạo mới</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA DANH SÁCH */}
      {deleteListConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b">
              <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <Trash2 size={20} /> Xóa danh sách
              </h3>
            </div>
            <div className="p-5">
              <p className="text-gray-700">Bạn có chắc chắn muốn xóa danh sách <strong>"{deleteListConfirm.name}"</strong> không?</p>
              <p className="text-sm text-gray-500 mt-2">Hành động này sẽ xóa toàn bộ sản phẩm bên trong và không thể hoàn tác.</p>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
              <button onClick={() => setDeleteListConfirm(null)} className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200">Hủy</button>
              <button onClick={executeDeleteList} className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700">Xác nhận xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA ITEM */}
      {deleteItemConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b">
              <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <Trash2 size={20} /> Bỏ lưu yêu thích
              </h3>
            </div>
            <div className="p-5">
              <p className="text-gray-700">Bạn có muốn xóa <strong>"{deleteItemConfirm.name}"</strong> khỏi danh sách không?</p>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
              <button onClick={() => setDeleteItemConfirm(null)} className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200">Hủy</button>
              <button onClick={executeDeleteItem} className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700">Xác nhận xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
