export interface Address {
  id: number;
  recipient_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AddressInput {
  recipient_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  is_default: boolean;
}
