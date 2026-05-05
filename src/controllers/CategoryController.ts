// CONTROLLER: CategoryController
import { Category } from '@/models/Product';
import { CATEGORIES, MOCK_PRODUCTS } from '@/lib/db';

export class CategoryController {
  static getAllCategories(): Category[] {
    return CATEGORIES.map(cat => ({
      ...cat,
      count: MOCK_PRODUCTS.filter(p => p.categorySlug === cat.slug).length,
    }));
  }

  static getCategoryBySlug(slug: string): Category | null {
    return CATEGORIES.find(c => c.slug === slug) || null;
  }

  static getTopCategories(limit = 8): Category[] {
    return this.getAllCategories().slice(0, limit);
  }
}
