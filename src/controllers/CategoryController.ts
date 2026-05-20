// CONTROLLER: CategoryController
import { Category, CategoryApiResponse, SingleCategoryApiResponse } from '@/models/Product';
import api from '@/lib/axios';

export class CategoryController {
  static async getAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get<CategoryApiResponse>('/categories', {
        params: {
        page: 1,
        limit: 200,
      },
      });
      if (response.data && response.data.data && response.data.data.items) {
        return response.data.data.items.map(item => ({
          id: item.id,
          name: item.name,
          slug: String(item.id), // Lấy slug là id theo yêu cầu
          icon: item.image_url || '',
          count: 0,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  static async getCategoryBySlug(id: string): Promise<Category | null> {
    try {
      const response = await api.get<SingleCategoryApiResponse>(`/categories/${id}`);
      if (response.data && response.data.data) {
        const item = response.data.data;
        return {
          id: item.id,
          name: item.name,
          slug: String(item.id),
          icon: item.image_url || '',
          count: 0,
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      return null;
    }
  }

  static async getTopCategories(limit = 8): Promise<Category[]> {
    const categories = await this.getAllCategories();
    return categories.slice(0, limit);
  }
}
