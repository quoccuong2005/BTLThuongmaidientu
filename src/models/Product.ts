// MODEL: Product
// Defines the shape of a product/listing entity

export interface Product {
  id: string | number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  location: string;
  category_id?: number;
  category: string;
  categorySlug: string;
  condition: 'new' | 'used';
  postedAt: string;
  seller: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
  views?: number;
  description?: string;
  totalSold?: number;
  rating?: number;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  image_url: string;
  price: string;
  stock: number;
}

export interface SingleCategoryApiResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

export interface SingleProductApiResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    created_at: string;
    updated_at: string;
    category_id: number;
    category: {
      id: number;
      name: string;
      image_url: string;
    };
    name: string;
    description: string;
    display_price: string;
    view_count: number;
    total_sold: number;
    rate_total: number;
    rate_count: number;
    products: ProductVariant[];
    images: {
      url: string;
      sort_order: number;
    }[];
  };
}

export interface ProductApiResponse {
  statusCode: number;
  message: string;
  data: {
    items: {
      id: number;
      created_at: string;
      updated_at: string;
      is_deleted: number;
      deleted_at: string | null;
      category_id: number;
      name: string;
      description: string;
      display_price: string;
      view_count: number;
      total_sold: number;
      rate_total: number;
      rate_count: number;
      images: {
        url: string;
        sort_order: number;
      }[];
    }[];
    pagination: {
      count: number;
      page: number;
      limit: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  icon: string;
  count?: number;
}

export interface CategoryApiResponse {
  statusCode: number;
  message: string;
  data: {
    items: {
      id: number;
      name: string;
      image_url: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    }[];
    pagination: {
      count: number;
      page: number;
      limit: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
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

export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  image_url: string;
  price: string;
  stock: number;
}

export interface SingleProductApiResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    created_at: string;
    updated_at: string;
    category_id: number;
    category: {
      id: number;
      name: string;
      image_url: string;
    };
    name: string;
    description: string;
    display_price: string;
    view_count: number;
    total_sold: number;
    rate_total: number;
    rate_count: number;
    products: ProductVariant[];
    images: {
      url: string;
      sort_order: number;
    }[];
  };
}
