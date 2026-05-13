'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistController, Wishlist, WishlistItem } from '@/controllers/WishlistController';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlists: Wishlist[];
  activeWishlistId: number | null;
  wishlistedProductIds: Set<number>;
  isLoading: boolean;
  
  // Actions
  setActiveWishlistId: (id: number | null) => void;
  fetchWishlists: () => Promise<void>;
  toggleWishlistItem: (productId: number, wishlistId?: number) => Promise<boolean>;
  handleWishlistClick: (variantId: number) => Promise<void>;
  createWishlist: (name: string) => Promise<void>;
  deleteWishlist: (id: number) => Promise<boolean>;
  renameWishlist: (id: number, name: string) => Promise<boolean>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [activeWishlistId, setActiveWishlistId] = useState<number | null>(null);
  const [wishlistedProductIds, setWishlistedProductIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Modal Picker state
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);

  // Khởi tạo wishlists
  const fetchWishlists = async () => {
    setIsLoading(true);
    try {
      const lists = await WishlistController.getMyWishlists();
      setWishlists(lists);
      
      // Đặt danh sách mặc định nếu chưa chọn
      if (!activeWishlistId && lists.length > 0) {
        const defaultList = lists.find((w) => w.is_default === 1);
        if (defaultList) {
          setActiveWishlistId(defaultList.id);
        } else {
          setActiveWishlistId(lists[0].id);
        }
      }

      // Nâng cao: Có thể fetch tất cả các sản phẩm đang được wishlist (của danh sách mặc định hoặc tất cả)
      // Để render tim đỏ trên mọi thẻ sản phẩm. Tạm thời giả định ta fetch items của danh sách mặc định để có Set các ID.
      const defaultList = lists.find((w) => w.is_default === 1);
      if (defaultList) {
        const res = await WishlistController.getWishlistItems(defaultList.id, { limit: 100 });
        if (res) {
          const ids = new Set(res.items.map(item => item.product_id));
          setWishlistedProductIds(ids);
        }
      }
    } catch (error) {
      console.error('Lỗi khi fetch wishlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleWishlistItem = async (productId: number, wishlistId?: number): Promise<boolean> => {
    const wasWishlisted = wishlistedProductIds.has(productId);
    
    // Optimistic update
    const newSet = new Set(wishlistedProductIds);
    if (wasWishlisted) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
    }
    setWishlistedProductIds(newSet);

    try {
      const result = await WishlistController.toggleWishlistItem(productId, wishlistId);
      if (!result) throw new Error('No result returned');
      
      // Nếu server trả về thêm thành công hoặc xóa thành công, ta giữ optimistic update
      if (wasWishlisted) {
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        toast.success('Đã lưu vào danh sách yêu thích');
      }
      return true;
    } catch (error) {
      console.error('Lỗi toggle wishlist:', error);
      setWishlistedProductIds(new Set(wishlistedProductIds));
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
      return false;
    }
  };

  const handleWishlistClick = async (variantId: number) => {
    const isWishlisted = wishlistedProductIds.has(variantId);

    if (isWishlisted) {
      await toggleWishlistItem(variantId, activeWishlistId || undefined);
      return;
    }

    if (wishlists.length > 1) {
      setPendingProductId(variantId);
      setShowPickerModal(true);
    } else {
      await toggleWishlistItem(variantId, wishlists[0]?.id || undefined);
    }
  };

  const createWishlist = async (name: string) => {
    const list = await WishlistController.createWishlist(name);
    if (list) {
      setWishlists((prev) => [...prev, list]);
      setActiveWishlistId(list.id);
    }
  };

  const deleteWishlist = async (id: number) => {
    const success = await WishlistController.deleteWishlist(id);
    if (success) {
      setWishlists((prev) => prev.filter((w) => w.id !== id));
      if (activeWishlistId === id) {
        setActiveWishlistId(wishlists.find(w => w.id !== id && w.is_default === 1)?.id || null);
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
              {wishlists.map(w => (
                <button
                  key={w.id}
                  onClick={async () => {
                    await toggleWishlistItem(pendingProductId, w.id);
                    setShowPickerModal(false);
                    setPendingProductId(null);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center justify-between group transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800">{w.is_default === 1 ? '⭐' : '📋'} {w.name}</span>
                  <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Chọn</span>
                </button>
              ))}
            </div>
            <div className="p-3 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => { setShowPickerModal(false); setPendingProductId(null); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Hủy
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
