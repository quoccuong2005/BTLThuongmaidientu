import api from '@/lib/axios';
import {
  Content,
  ContentApiItem,
  ContentDetailApiResponse,
  ContentListApiResponse,
} from '@/models/Content';

type ContentListParams = {
  page?: number;
  limit?: number;
  keyword?: string;
  is_featured?: boolean;
  sort?: string;
  order?: string;
};

export class ContentController {
  private static mapApiContent(item: ContentApiItem): Content {
    const source = item._doc ?? item;
    return {
      id: String(source.id ?? source._id ?? item.id ?? item._id ?? ''),
      title: source.title,
      slug: source.slug,
      summary: source.summary,
      content: source.content,
      coverImageUrl: source.cover_image_url,
      publishedAt: source.published_at,
      isFeatured: source.is_featured === 1 || source.is_featured === true,
    };
  }

  static async getPublicContents(
    params: ContentListParams = {},
  ): Promise<Content[]> {
    try {
      const response = await api.get<ContentListApiResponse>('/content', {
        params,
      });
      const items = response.data?.data?.items ?? [];
      return items.map(this.mapApiContent);
    } catch (error) {
      console.error('Error fetching contents:', error);
      return [];
    }
  }

  static async getFeaturedContents(limit = 3): Promise<Content[]> {
    return this.getPublicContents({
      limit,
      is_featured: true,
      sort: 'published_at',
      order: 'DESC',
    });
  }

  static async getContentBySlug(slug: string): Promise<Content | null> {
    try {
      const response = await api.get<ContentDetailApiResponse>(
        `/content/${slug}`,
      );
      const item = response.data?.data;
      return item ? this.mapApiContent(item) : null;
    } catch (error) {
      console.error(`Error fetching content ${slug}:`, error);
      return null;
    }
  }
}
