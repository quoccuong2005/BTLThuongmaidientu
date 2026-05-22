'use client';

import { useRouter } from 'next/navigation';

interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  order?: string;
  location?: string;
  is_featured?: string;
  page?: string;
  limit?: string;
}

export default function SortSelect({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const router = useRouter();

  const handleFieldChange = (field: string) => {
    const params = new URLSearchParams();

    if (searchParams.q) params.set('q', searchParams.q);
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.location) params.set('location', searchParams.location);
    if (searchParams.order) params.set('order', searchParams.order);
    if (searchParams.is_featured) params.set('is_featured', searchParams.is_featured);

    if (field) {
      params.set('sort', field);
    }

    params.set('page', '1');

    router.push(`/search?${params.toString()}`);
  };

  const handleOrderChange = (order: string) => {
    const params = new URLSearchParams();

    if (searchParams.q) params.set('q', searchParams.q);
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.location) params.set('location', searchParams.location);
    if (searchParams.sort) params.set('sort', searchParams.sort);
    if (searchParams.is_featured) params.set('is_featured', searchParams.is_featured);

    if (order) {
      params.set('order', order);
    }

    params.set('page', '1');

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sắp xếp:</span>

      <select
        value={searchParams.sort || 'created_at'}
        onChange={(e) => handleFieldChange(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-orange-400"
      >
        <option value="created_at">Mới nhất</option>
        <option value="total_sold">Bán chạy</option>
        <option value="view_count">Xem nhiều</option>
        <option value="id">Mã mới</option>
        <option value="display_price">Giá</option>
      </select>

      <select
        value={searchParams.order || 'DESC'}
        onChange={(e) => handleOrderChange(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-orange-400"
      >
        <option value="DESC">Giảm dần</option>
        <option value="ASC">Tăng dần</option>
      </select>
    </div>
  );
}