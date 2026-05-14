import api from '@/lib/axios';
import { Product } from '@/models/Product';

export interface CartItem extends Product {
  quantity: number;
}

export class CartController {
  static async getCart(): Promise<CartItem[]> {
    try {
      const response = await api.get('/cart');
      if (response.data && response.data.data) {
        return response.data.data.items.map((item: any) => ({
          // Kiểm tra nhiều trường ID khác nhau từ Server
          id: item.product_id || item.product_variant_id || item.id,
          title: item.product_variant?.name || item.name || 'Sản phẩm',
          price: parseFloat(item.product_variant?.price || item.price || 0),
          // Kiểm tra nhiều trường khác nhau để lấy ảnh
          image: item.product_variant?.image_url || 
                 item.image_url || 
                 item.image || 
                 (item.product_variant?.images && item.product_variant.images[0]?.url) ||
                 '',
          quantity: item.quantity,
          location: 'Toàn Quốc',
          category_id: item.product?.category_id || item.category_id,
          category: 'Danh mục',
          categorySlug: '',
          condition: 'new',
          postedAt: new Date().toISOString(),
          seller: 'Người bán',
        }));
      }
      return [];
    } catch (error) {
      console.error('Error in CartController.getCart:', error);
      return [];
    }
  }

  static async addToCart(productId: number | string, quantity: number): Promise<boolean> {
    try {
      const response = await api.post('/cart', {
        product_id: Number(productId),
        quantity: quantity
      });
      return response.status === 201 || response.status === 200;
    } catch (error) {
      console.error('Error in CartController.addToCart:', error);
      return false;
    }
  }

  static async clearCart(): Promise<boolean> {
    try {
      const response = await api.delete('/cart');
      return response.status === 200 || response.status === 204;
    } catch (error) {
      console.error('Error in CartController.clearCart:', error);
      return false;
    }
  }

  static async updateQuantity(productId: number | string, quantity: number): Promise<boolean> {
    try {
      const response = await api.patch('/cart', {
        product_id: Number(productId),
        quantity: quantity
      });
      return response.status === 200;
    } catch (error) {
      console.error('Error in CartController.updateQuantity:', error);
      return false;
    }
  }

  static async removeFromCart(productId: number | string): Promise<boolean> {
    try {
      const response = await api.delete(`/cart/${productId}`);
      return response.status === 200 || response.status === 204;
    } catch (error) {
      console.error('Error in CartController.removeFromCart:', error);
      return false;
    }
  }
}
