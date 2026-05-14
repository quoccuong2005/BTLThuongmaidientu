// CONTROLLER: ProductController
// Handles all business logic for products

import { Product, SearchFilters, PaginatedResult, ProductApiResponse, SingleProductApiResponse } from '@/models/Product';
import api from '@/lib/axios';

export class ProductController {
  private static mapApiProduct(item: any): Product {
    return {
      id: item.id,
      title: item.name,
      price: parseFloat(item.display_price),
      originalPrice: item.default_price ? parseFloat(item.default_price) : undefined,
      image: item.images && item.images.length > 0 ? item.images[0].url : 'https://placehold.co/400x300?text=No+Image',
      images: item.images?.map((img: any) => img.url),
      location: 'Toàn Quốc',
      category: item.category?.name || 'Danh mục',
      categorySlug: String(item.category_id),
      condition: 'new',
      postedAt: item.created_at,
      seller: 'Chợ Việt',
      views: item.view_count,
      description: item.description,
      totalSold: item.total_sold,
      rating: item.rate_count > 0 ? item.rate_total / item.rate_count / 100 : 5, // Mapping rate_total to 1-5 scale
      variants: item.products,
      isFeatured: item.is_featured === 1 || item.is_featured === true,
    };
  }

  static async getFeaturedProducts(limit = 12): Promise<Product[]> {
    try {
      const response = await api.get<ProductApiResponse>(`/products?limit=${limit}&sort=view_count&order=DESC`);
      return response.data.data.items.map(this.mapApiProduct);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  }

  static async getNewProducts(limit = 8): Promise<Product[]> {
    try {
      const response = await api.get<ProductApiResponse>(`/products?limit=${limit}&sort=created_at&order=DESC`);
      return response.data.data.items.map(this.mapApiProduct);
    } catch (error) {
      console.error("Error fetching new products:", error);
      return [];
    }
  }

  static async getUrgentProducts(limit = 4): Promise<Product[]> {
    return this.getNewProducts(limit);
  }

  static async searchProducts(
    filters: SearchFilters,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResult<Product>> {
    try {
      const params: any = {
        page,
        limit: pageSize,
      };

      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.category) params.category_id = filters.category;

      if (filters.sortBy === 'price_asc') {
        params.sort = 'display_price';
        params.order = 'ASC';
      } else if (filters.sortBy === 'price_desc') {
        params.sort = 'display_price';
        params.order = 'DESC';
      } else if (filters.sortBy === 'popular') {
        params.sort = 'view_count';
        params.order = 'DESC';
      } else {
        params.sort = 'created_at';
        params.order = 'DESC';
      }

      const response = await api.get<ProductApiResponse>('/products', { params });
      const { items, pagination } = response.data.data;

      return {
        data: items.map(this.mapApiProduct),
        total: pagination.count * pagination.total_pages,
        page: pagination.page,
        pageSize: pagination.limit,
        totalPages: pagination.total_pages,
      };
    } catch (error) {
      console.error("Error searching products:", error);
      return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await api.get<SingleProductApiResponse>(`/products/${id}`);
      if (response.data && response.data.data) {
        return this.mapApiProduct(response.data.data);
      }
      return null;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  }

  static async getProductsByCategory(category_id: string, limit = 8): Promise<Product[]> {
    const result = await this.searchProducts({ category: category_id }, 1, limit);
    return result.data;
  }


  static formatPrice(price: number | string): string {
    const p = typeof price === 'string' ? parseFloat(price) : price;
    if (p === undefined || p === null || isNaN(p)) {
      return '0 đ';
    }
    if (p >= 1_000_000_000) {
      return `${(p / 1_000_000_000).toFixed(1)} tỷ`;
    }
    if (p >= 1_000_000) {
      return `${(p / 1_000_000).toFixed(1)} triệu`;
    }

    return `${p.toLocaleString('vi-VN')} đ`;
  }


  static getDiscount(price: number, originalPrice?: number): number | null {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }


  static getRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return `${Math.floor(diffDays / 30)} tháng trước`;
  }
}
