// MODEL: Product
// Defines the shape of a product/listing entity

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  location: string;
  category: string;
  categorySlug: string;
  condition: 'new' | 'used';
  postedAt: string;
  seller: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
  views?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count?: number;
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
}

export interface SearchFilters {
  keyword?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: 'new' | 'used' | 'all';
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
