import api from '@/lib/axios';
import { Address, AddressInput } from '@/models/Address';

export class AddressController {
  static async getAddresses(): Promise<Address[]> {
    try {
      const response = await api.get('/users/me/addresses');
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
  }

  static async createAddress(address: AddressInput): Promise<Address | null> {
    try {
      // Tuyệt đối không dùng ...address để tránh mang theo dữ liệu cũ/sai kiểu
      const payload = { 
        recipient_name: address.recipient_name,
        phone: address.phone,
        province: address.province,
        district: address.district,
        ward: address.ward,
        street: address.street,
        is_default: address.is_default ? true : false 
      };
      const response = await api.post('/users/me/addresses', payload);
      return response.data?.data || null;
    } catch (error) {
      console.error('Error creating address:', error);
      return null;
    }
  }

  static async updateAddress(id: number, address: AddressInput): Promise<Address | null> {
    try {
      const payload = { 
        recipient_name: address.recipient_name,
        phone: address.phone,
        province: address.province,
        district: address.district,
        ward: address.ward,
        street: address.street,
        is_default: address.is_default ? true : false 
      };
      const response = await api.patch(`/users/me/addresses/${id}`, payload);
      return response.data?.data || null;
    } catch (error) {
      console.error('Error updating address:', error);
      return null;
    }
  }

  static async deleteAddress(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/users/me/addresses/${id}`);
      return response.status === 200 || response.status === 204;
    } catch (error) {
      console.error('Error deleting address:', error);
      return false;
    }
  }
}
