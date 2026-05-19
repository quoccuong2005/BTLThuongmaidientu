import api from '@/lib/axios';

export interface WishlistItem {
  id: number;
  wishlist_id: number;
  product_id: number;
  note: string | null;
  price_alert: boolean;
  stock_alert: boolean;
  added_at: string;
  product: {
    id: number;
    product_line_id: number;
    product_line_name: string;
    name: string;
    sku: string;
    price: number;
    image_url: string | null;
    stock: number;
    is_out_of_stock: boolean;
  };
}

export interface Wishlist {
  id: number;
  user_id: number;
  name: string;
  is_default: number;
  share_token: string | null;
  created_at: string;
  updated_at: string;
}

export class WishlistController {
  // 1. Lấy tất cả danh sách yêu thích
  static async getMyWishlists(): Promise<Wishlist[]> {
    try {
      const res = await api.get('/wishlist');
      return res.data?.data || [];
    } catch (error) {
      console.error('Failed to get wishlists', error);
      return [];
    }
  }

  // 2. Lấy items của một danh sách cụ thể
  static async getWishlistItems(wishlistId: number, params?: any): Promise<{ items: WishlistItem[], total: number } | null> {
    try {
      const res = await api.get(`/wishlist/${wishlistId}/items`, { params });
      return res.data?.data || { items: [], total: 0 };
    } catch (error) {
      console.error('Failed to get wishlist items', error);
      return null;
    }
  }

  // 3. Bật/tắt yêu thích (Toggle)
  static async toggleItem(productId: number, wishlistId?: number): Promise<{ action: 'added' | 'removed', item_id?: number } | null> {
    try {
      const body = wishlistId ? { product_id: productId, wishlist_id: wishlistId } : { product_id: productId };
      const res = await api.post('/wishlist/items/toggle', body);
      return res.data?.data;
    } catch (error) {
      console.error('Failed to toggle wishlist item', error);
      return null;
    }
  }

  // 4. Tạo danh sách mới
  static async createWishlist(name: string): Promise<Wishlist | null> {
    try {
      const res = await api.post('/wishlist', { name });
      return res.data?.data;
    } catch (error) {
      console.error('Failed to create wishlist', error);
      return null;
    }
  }

  // 5. Xoá danh sách
  static async deleteWishlist(id: number): Promise<boolean> {
    try {
      await api.delete(`/wishlist/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete wishlist', error);
      return false;
    }
  }

  // 6. Đổi tên danh sách
  static async renameWishlist(id: number, name: string): Promise<boolean> {
    try {
      await api.patch(`/wishlist/${id}/name`, { name });
      return true;
    } catch (error) {
      console.error('Failed to rename wishlist', error);
      return false;
    }
  }

  // 7. Chuyển sang giỏ hàng
  static async moveToCart(itemId: number): Promise<boolean> {
    try {
      await api.post(`/wishlist/items/${itemId}/move-to-cart`);
      return true;
    } catch (error) {
      console.error('Failed to move to cart', error);
      return false;
    }
  }

  // 8. Cập nhật ghi chú
  static async updateItemNote(itemId: number, note: string | null): Promise<boolean> {
    try {
      await api.patch(`/wishlist/items/${itemId}/note`, { note });
      return true;
    } catch (error) {
      console.error('Failed to update note', error);
      return false;
    }
  }

  // 9. Bật tắt cảnh báo giá
  static async togglePriceAlert(itemId: number): Promise<{ price_alert: boolean } | null> {
    try {
      const res = await api.patch(`/wishlist/items/${itemId}/price-alert`);
      return res.data?.data;
    } catch (error) {
      console.error('Failed to toggle price alert', error);
      return null;
    }
  }

  // 10. Bật tắt cảnh báo hết hàng
  static async toggleStockAlert(itemId: number): Promise<{ stock_alert: boolean } | null> {
    try {
      const res = await api.patch(`/wishlist/items/${itemId}/stock-alert`);
      return res.data?.data;
    } catch (error) {
      console.error('Failed to toggle stock alert', error);
      return null;
    }
  }

  // 11. Sinh link chia sẻ
  static async generateShareLink(wishlistId: number): Promise<string | null> {
    try {
      const res = await api.post(`/wishlist/${wishlistId}/share`);
      return res.data?.data?.token;
    } catch (error) {
      console.error('Failed to generate share link', error);
      return null;
    }
  }

  // 12. Xem danh sách công khai
  static async getPublicWishlist(token: string): Promise<any> {
    try {
      const res = await api.get(`/wishlist/public/${token}`);
      return res.data?.data;
    } catch (error) {
      console.error('Failed to get public wishlist', error);
      return null;
    }
  }
}


