import api from '@/lib/axios';

export interface OrderItemInput {
  product_id: number;
  quantity: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  address_id: number;
  payment_method: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: number;
  status: string;
  subtotal: string;
  shipping_fee: string;
  total_amount: string;
  recipient_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  payment_method: string;
  cancel_reason: string | null;
  return_reason: string | null;
  paid_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  items?: OrderItem[];
}

export class OrderController {
  static async createOrder(orderData: CreateOrderInput): Promise<any> {
    try {
      const response = await api.post('/orders', orderData);
      // If the response has a data property (standard wrapper), return it
      // Otherwise return the whole response body
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error in OrderController.createOrder:', error);
      throw error;
    }
  }

  static async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/orders');
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  static async getOrderDetails(id: string | number): Promise<Order | null> {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data?.data || null;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  }

  static async cancelOrder(id: string | number, reason: string): Promise<boolean> {
    try {
      const response = await api.post(`/orders/${id}/cancel`, { cancel_reason: reason });
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return false;
    }
  }

  static async completeOrder(id: string | number): Promise<boolean> {
    try {
      const response = await api.post(`/orders/${id}/complete`);
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error completing order:', error);
      return false;
    }
  }

  static async verifyPayment(queryParams: string): Promise<any> {
    try {
      const response = await api.get(`/vnp_return?${queryParams}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
}
