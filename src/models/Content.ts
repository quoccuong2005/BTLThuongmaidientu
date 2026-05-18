export interface Content {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  isFeatured: boolean;
}

export interface ContentApiPayload {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  cover_image_url?: string;
  published_at?: string;
  is_featured?: number | boolean;
}

export interface ContentApiItem extends ContentApiPayload {
  _doc?: ContentApiPayload;
}

export interface ContentListApiResponse {
  data?: {
    items: ContentApiItem[];
    pagination?: {
      count: number;
      page: number;
      limit: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

export interface ContentDetailApiResponse {
  data?: ContentApiItem;
}
