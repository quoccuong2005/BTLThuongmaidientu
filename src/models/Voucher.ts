export interface Voucher {
  id: number;
  code: string;
  name: string;
  type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  scope?: string;
  category_id?: number | null;
  estimatedDiscount?: number;
  actualDiscount?: number;
  description: string;
  is_collected: boolean;
  start_date: string;
  end_date: string;
}

export interface MyVoucher {
  id: number;
  user_id: number;
  voucher_id: number;
  status: string;
  collected_at: string;
  used_at: string | null;
  days_left: number;
  is_expired: boolean;
  voucher: Voucher;
}
