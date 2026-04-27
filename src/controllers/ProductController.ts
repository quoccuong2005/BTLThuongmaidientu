// CONTROLLER: ProductController
// Handles all business logic for products

import { Product, SearchFilters, PaginatedResult } from '@/models/Product';
import { MOCK_PRODUCTS } from '@/lib/db';

export class ProductController {
  /**
   * Get featured/recommended products for homepage
   */
  static getFeaturedProducts(limit = 12): Product[] {
    return MOCK_PRODUCTS
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  }

  /**
   * Get newest products
   */
  static getNewProducts(limit = 8): Product[] {
    return MOCK_PRODUCTS
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
      .slice(0, limit);
  }

  /**
   * Get urgent products
   */
  static getUrgentProducts(limit = 4): Product[] {
    return MOCK_PRODUCTS.filter(p => p.isUrgent).slice(0, limit);
  }

  /**
   * Search products with filters
   */
  static searchProducts(
    filters: SearchFilters,
    page = 1,
    pageSize = 20
  ): PaginatedResult<Product> {
    let results = [...MOCK_PRODUCTS];

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(kw) ||
        p.category.toLowerCase().includes(kw)
      );
    }

    if (filters.category) {
      results = results.filter(p => p.categorySlug === filters.category);
    }

    if (filters.location && filters.location !== 'Toàn Quốc') {
      results = results.filter(p => p.location.includes(filters.location!));
    }

    if (filters.minPrice) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.condition && filters.condition !== 'all') {
      results = results.filter(p => p.condition === filters.condition);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        results.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        results.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    }

    const total = results.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = results.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  /**
   * Get single product by ID
   */
  static getProductById(id: string): Product | null {
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }

  /**
   * Get products by category
   */
  static getProductsByCategory(categorySlug: string, limit = 8): Product[] {
    return MOCK_PRODUCTS
      .filter(p => p.categorySlug === categorySlug)
      .slice(0, limit);
  }

  /**
   * Format price to Vietnamese currency
   */
  static formatPrice(price: number): string {
    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(1)} tỷ`;
    }
    if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(1)} triệu`;
    }
    if (price >= 1_000) {
      return `${(price / 1_000).toFixed(0)} nghìn`;
    }
    return `${price.toLocaleString('vi-VN')} đ`;
  }

  /**
   * Calculate discount percentage
   */
  static getDiscount(price: number, originalPrice?: number): number | null {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  /**
   * Format relative time
   */
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
