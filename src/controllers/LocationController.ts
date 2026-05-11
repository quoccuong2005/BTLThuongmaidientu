import axios from 'axios';

export interface Province {
  PROVINCE_ID: number;
  PROVINCE_NAME: string;
  PROVINCE_CODE: string;
}

export interface District {
  DISTRICT_ID: number;
  DISTRICT_NAME: string;
  PROVINCE_ID: number;
}

export interface Ward {
  WARDS_ID: number;
  WARDS_NAME: string;
  DISTRICT_ID: number;
}

const VIETTEL_POST_API = 'https://partner.viettelpost.vn/v2/categories';

export class LocationController {
  static async getProvinces(): Promise<Province[]> {
    try {
      const response = await axios.get(`${VIETTEL_POST_API}/listProvinceById?provinceId=-1`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  }

  static async getDistricts(provinceId: number): Promise<District[]> {
    try {
      const response = await axios.get(`${VIETTEL_POST_API}/listDistrict?provinceId=${provinceId}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  }

  static async getWards(districtId: number): Promise<Ward[]> {
    try {
      const response = await axios.get(`${VIETTEL_POST_API}/listWards?districtId=${districtId}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching wards:', error);
      return [];
    }
  }
}
