import api from '@/lib/axios';
import { Product } from '@/models/Product';

export interface Wishlist {
  id: number;
  user_id: number;
  name: string;
  is_default: number;
  share_token: string | null;
  created_at: string;
  updated_at: string;
  item_count?: number; // Optional count
}

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

export interface WishlistItemsResponse {
  items: WishlistItem[];
  total: number;
  page: number;
  limit: number;
}

export interface PublicWishlistResponse extends WishlistItemsResponse {
  wishlist_name: string;
}

export class WishlistController {
  // ─── DANH SÁCH WISHLIST (TABS) ──────────────────────────────────────────────
  
  static async getMyWishlists(): Promise<Wishlist[]> {
    try {
      const response = await api.get('/wishlist');
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error getting wishlists:', error);
      return [];
    }
  }

  static async createWishlist(name: string): Promise<Wishlist | null> {
    try {
      const response = await api.post('/wishlist', { name });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating wishlist:', error);
      throw error;
    }
  }

  static async renameWishlist(id: number, name: string): Promise<boolean> {
    try {
      const response = await api.patch(`/wishlist/${id}/name`, { name });
      return response.status === 200;
    } catch (error) {
      console.error('Error renaming wishlist:', error);
      throw error;
    }
  }

  static async deleteWishlist(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/wishlist/${id}`);
      return response.status === 200 || response.status === 204;
    } catch (error) {
      console.error('Error deleting wishlist:', error);
      throw error;
    }
  }

  static async generateShareLink(id: number): Promise<string | null> {
    try {
      const response = await api.post(`/wishlist/${id}/share`);
      const data = response.data?.data || response.data;
      return data?.token || null;
    } catch (error) {
      console.error('Error generating share link:', error);
      throw error;
    }
  }

  static async getPublicWishlist(
    token: string,
    params?: { page?: number; limit?: number; sort?: string }
  ): Promise<PublicWishlistResponse | null> {
    try {
      // Dùng URL base hoặc api instance nhưng không gửi auth (tùy config server)
      const response = await api.get(`/wishlist/public/${token}`, { params });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error getting public wishlist:', error);
      throw error;
    }
  }

  // ─── ITEMS TRONG WISHLIST ───────────────────────────────────────────────────

  static async getWishlistItems(
    wishlistId: number,
    params?: { page?: number; limit?: number; sort?: string }
  ): Promise<WishlistItemsResponse | null> {
    try {
      const response = await api.get(`/wishlist/${wishlistId}/items`, { params });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error getting wishlist items:', error);
      return null;
    }
  }

  static async toggleWishlistItem(
    productId: number,
    wishlistId?: number
  ): Promise<{ action: 'added' | 'removed'; item_id?: number } | null> {
    try {
      const payload: any = { product_id: productId };
      if (wishlistId) payload.wishlist_id = wishlistId;

      const response = await api.post('/wishlist/items/toggle', payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      throw error;
    }
  }

  static async moveToCart(itemId: number): Promise<boolean> {
    try {
      const response = await api.post(`/wishlist/items/${itemId}/move-to-cart`);
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error moving item to cart:', error);
      throw error;
    }
  }

  static async updateItemNote(itemId: number, note: string | null): Promise<boolean> {
    try {
      const response = await api.patch(`/wishlist/items/${itemId}/note`, { note });
      return response.status === 200;
    } catch (error) {
      console.error('Error updating item note:', error);
      throw error;
    }
  }

  static async togglePriceAlert(itemId: number): Promise<{ price_alert: boolean } | null> {
    try {
      const response = await api.patch(`/wishlist/items/${itemId}/price-alert`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error toggling price alert:', error);
      throw error;
    }
  }

  static async toggleStockAlert(itemId: number): Promise<{ stock_alert: boolean } | null> {
    try {
      const response = await api.patch(`/wishlist/items/${itemId}/stock-alert`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error toggling stock alert:', error);
      throw error;
    }
  }
}
