export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  product_line_id?: number;
  order_item_id: number;
  rate: number;
  headline: string;
  content: string;
  created_at: string;
  updated_at: string;
  product_name?: string;
  product_image?: string;
  user_name?: string;
  user_avatar?: string;
}

export interface CreateReviewDto {
  order_item_id: number;
  rate: number;
  headline: string;
  content: string;
}

export interface ReviewCheckResponse {
  exists: boolean;
  feedback?: Review;
}
