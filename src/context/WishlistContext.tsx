'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Wishlist, WishlistController } from '@/controllers/WishlistController';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface WishlistContextType {
  wishlists: Wishlist[];
  activeWishlistId: number | null;
  wishlistedProductIds: Set<number>;
  isLoading: boolean;
  setActiveWishlistId: (id: number) => void;
  fetchWishlists: () => Promise<void>;
  toggleWishlistItem: (productId: number, wishlistId?: number) => Promise<boolean>;
  createWishlist: (name: string) => Promise<boolean>;
  deleteWishlist: (id: number) => Promise<boolean>;
  renameWishlist: (id: number, name: string) => Promise<boolean>;
  handleWishlistClick: (productId: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [activeWishlistId, setActiveWishlistId] = useState<number | null>(null);
  const [wishlistedProductIds, setWishlistedProductIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // States cho Picker Modal
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);

  const router = useRouter();

  const fetchWishlists = async () => {
    setIsLoading(true);
    const data = await WishlistController.getMyWishlists();
    setWishlists(data);
    
    if (data.length > 0) {
      const defaultList = data.find(w => w.is_default === 1) || data[0];
      setActiveWishlistId(defaultList.id);
      
      // Lấy danh sách ID đã lưu
      let allIds = new Set<number>();
      for (const w of data) {
        const itemsRes = await WishlistController.getWishlistItems(w.id, { limit: 100 });
        if (itemsRes?.items) {
          itemsRes.items.forEach(item => allIds.add(item.product_id));
        }
      }
      setWishlistedProductIds(allIds);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  const handleWishlistClick = (productId: number) => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      toast.info('Vui lòng đăng nhập để lưu sản phẩm yêu thích');
      router.push('/login');
      return;
    }

    // Nếu sản phẩm đã nằm trong Wishlist -> gỡ nó luôn (dùng list mặc định hoặc check list)
    if (wishlistedProductIds.has(productId)) {
      // Gọi toggle -> backend tự xoá nếu đã có
      // Do có thể có nhiều list, backend xoá item theo product_id và wishlist_id
      // Nhưng để đơn giản ở FE, ta cứ truyền undefined để nó xoá ở list mặc định
      // HOẶC nếu nó đang ở nhiều list, nên có cách xoá đúng. 
      // Hàm toggle API BE ưu tiên xoá nếu đã tồn tại.
      toggleWishlistItem(productId);
      return;
    }

    // Nếu chỉ có <= 1 list -> Lưu luôn vào đó (hoặc default)
    if (wishlists.length <= 1) {
      toggleWishlistItem(productId, wishlists[0]?.id);
      return;
    }

    // Có nhiều list -> Hiện Picker
    setPendingProductId(productId);
    setShowPickerModal(true);
  };

  const handlePickerSelect = async (wishlistId: number) => {
    if (!pendingProductId) return;
    
    const success = await toggleWishlistItem(pendingProductId, wishlistId);
    if (success) {
      setShowPickerModal(false);
      setPendingProductId(null);
    }
  };

  const toggleWishlistItem = async (productId: number, wishlistId?: number) => {
    // Optimistic update
    const isCurrentlySaved = wishlistedProductIds.has(productId);
    const newSet = new Set(wishlistedProductIds);
    
    if (isCurrentlySaved) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
    }
    setWishlistedProductIds(newSet);

    const res = await WishlistController.toggleItem(productId, wishlistId);
    if (res) {
      if (res.action === 'added') {
        toast.success('Đã lưu vào danh sách yêu thích');
      } else {
        toast.info('Đã bỏ lưu yêu thích');
      }
      return true;
    } else {
      // Revert if failed
      setWishlistedProductIds(wishlistedProductIds);
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
      return false;
    }
  };

  const createWishlist = async (name: string) => {
    const newList = await WishlistController.createWishlist(name);
    if (newList) {
      setWishlists((prev) => [...prev, newList]);
      setActiveWishlistId(newList.id);
      return true;
    }
    return false;
  };

  const deleteWishlist = async (id: number) => {
    const success = await WishlistController.deleteWishlist(id);
    if (success) {
      setWishlists((prev) => prev.filter((w) => w.id !== id));
      if (activeWishlistId === id) {
        const remaining = wishlists.filter((w) => w.id !== id);
        setActiveWishlistId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
    return success;
  };

  const renameWishlist = async (id: number, name: string) => {
    const success = await WishlistController.renameWishlist(id, name);
    if (success) {
      setWishlists((prev) => 
        prev.map((w) => (w.id === id ? { ...w, name } : w))
      );
    }
    return success;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        activeWishlistId,
        wishlistedProductIds,
        isLoading,
        setActiveWishlistId,
        fetchWishlists,
        toggleWishlistItem,
        createWishlist,
        deleteWishlist,
        renameWishlist,
        handleWishlistClick,
      }}
    >
      {children}

      {/* Modal chọn danh sách yêu thích */}
      {showPickerModal && pendingProductId && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg">Lưu vào danh sách</h3>
              <p className="text-xs text-gray-500">Chọn danh sách bạn muốn lưu sản phẩm này</p>
            </div>
            <div className="max-h-60 overflow-y-auto p-2">
              {wishlists.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handlePickerSelect(w.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-medium text-sm">{w.is_default ? '⭐' : '📋'} {w.name}</span>
                  <span className="text-gray-400 text-xs">Lưu</span>
                </button>
              ))}
            </div>
            <div className="p-3 border-t bg-gray-50">
              <button 
                onClick={() => {
                  setShowPickerModal(false);
                  setPendingProductId(null);
                }}
                className="w-full py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
