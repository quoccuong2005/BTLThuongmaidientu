import axios from 'axios';
import api from '@/lib/axios';


export class ReviewController {
  static getHeaders() {
    if (typeof window === 'undefined') return {};
    const sessionId = localStorage.getItem('sessionId');
    return {
      'x-auth-signature': sessionId || '',
    };
  }

  static async createReview(dto: { order_item_id: number; rate: number; headline: string; content: string }) {
    try {
      const response = await api.post(`/reviews`, dto, {
        headers: this.getHeaders(),
      });
      return response.data?.data || response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }

  static async getMyReviews() {
    try {
      const response = await api.get(`/reviews/me`, {
        headers: this.getHeaders(),
      });
      return response.data?.data || [];
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }

  static async checkReviewStatus(orderItemId: number) {
    try {
      const response = await api.get(`/reviews/order-item/${orderItemId}`, {
        headers: this.getHeaders(),
      });
      return response.data?.data || response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }

  static async getProductLineReviews(productLineId: number, page: number = 1, limit: number = 10, rate?: number) {
    try {
      const params: any = { page, limit };
      if (rate) params.rate = rate;
      const response = await api.get(`/reviews/product-line/${productLineId}`, { params });
      return response.data?.data || response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
}
