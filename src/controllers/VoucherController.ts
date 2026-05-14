import api from '@/lib/axios';
import { Voucher, MyVoucher } from '@/models/Voucher';

export class VoucherController {
  static async getVouchers(): Promise<Voucher[]> {
    try {
      const response = await api.get('/vouchers');
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      return [];
    }
  }

  static async getMyVouchers(): Promise<MyVoucher[]> {
    try {
      const response = await api.get('/vouchers/my');
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching my vouchers:', error);
      return [];
    }
  }

  static async getApplicableVouchers(subtotal: number, categoryIds?: number[]): Promise<MyVoucher[]> {
    try {
      let url = `/vouchers/my/applicable`;
      const response = await api.get(url, {
        params: {
          subtotal: subtotal,
          category_ids: categoryIds?.join(',')
        }
      });

      if (Array.isArray(response.data?.data?.applicable)) return response.data.data.applicable;
      if (Array.isArray(response.data?.applicable)) return response.data.applicable;
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      return [];
    } catch (error) {
      console.error('Error fetching applicable vouchers:', error);
      return [];
    }
  }

  static async applyVoucher(voucherId: number, subtotal: number, categoryIds: number[] = []): Promise<{ valid: boolean, discount_amount: number, message?: string }> {
    try {
      const response = await api.post('/vouchers/apply', {
        voucher_id: voucherId,
        subtotal: subtotal,
        category_ids: categoryIds
      });
      return {
        valid: true,
        discount_amount: response.data?.data?.discount_amount || response.data?.discount_amount || 0
      };
    } catch (error: any) {
      console.error('Error applying voucher:', error);
      return {
        valid: false,
        discount_amount: 0,
        message: error.response?.data?.message || 'Mã giảm giá không hợp lệ cho đơn hàng này.'
      };
    }
  }

  static async collectVoucher(voucherId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post(`/vouchers/${voucherId}/collect`);
      return { success: response.status === 200 || response.status === 201 };
    } catch (error: any) {
      console.error('Error collecting voucher:', error);
      if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message };
      }
      return { success: false, message: 'Đã xảy ra lỗi khi thu thập mã giảm giá.' };
    }
  }
}
