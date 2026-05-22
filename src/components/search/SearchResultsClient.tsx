"use client";

import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { SearchX } from 'lucide-react';
import type { Product } from '@/models/Product';

interface SearchResultsClientProps {
  searchParams: { q?: string; category?: string; sort?: string; order?: string; location?: string; is_featured?: string; page?: string; limit?: string };
}

interface SearchResultResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function SearchResultsClient({ searchParams }: SearchResultsClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (searchParams.q) params.set('q', searchParams.q);
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.sort) params.set('sort', searchParams.sort);
    if (searchParams.order) params.set('order', searchParams.order);
    if (searchParams.location) params.set('location', searchParams.location);
    if (searchParams.is_featured) params.set('is_featured', searchParams.is_featured);
    params.set('page', searchParams.page || '1');
    params.set('pageSize', searchParams.limit || '15');
    return params.toString();
  }, [searchParams]);

  useEffect(() => {
    let canceled = false;
    const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products?${queryString}`, {
          headers: sessionId ? { 'x-auth-signature': sessionId } : undefined,
        });

        if (!response.ok) {
          throw new Error(`Lỗi tải sản phẩm: ${response.status}`);
        }

        const result: SearchResultResponse = await response.json();

        if (!canceled) {
          setProducts(result.data);
          setTotal(result.total);
          setPage(result.page);
          setTotalPages(result.totalPages);
        }
      } catch (err) {
        if (!canceled) {
          setError('Không thể tải sản phẩm. Vui lòng thử lại.');
          setProducts([]);
          setTotal(0);
          setPage(1);
          setTotalPages(0);
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => {
      canceled = true;
    };
  }, [queryString]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-3" />
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-3" />
          <div className="h-72 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-sm">
        <p className="font-semibold text-gray-700">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-sm">
        <SearchX size={36} className="mx-auto mb-3 text-orange-500" />
        <p className="font-semibold text-gray-700">Không tìm thấy kết quả</p>
        <p className="text-sm text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          {page > 1 && (
            <a
              href={`/search?${queryString.replace(/page=\d+/, `page=${page - 1}`)}`}
              className="px-3 py-2 border border-gray-200 rounded-lg hover:border-orange-400 hover:text-orange-500 transition"
            >
              ← Trước
            </a>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <a
              key={pageNumber}
              href={`/search?${queryString.replace(/page=\d+/, `page=${pageNumber}`)}`}
              className={`px-3 py-2 rounded-lg transition ${pageNumber === page ? 'bg-orange-500 text-white' : 'border border-gray-200 hover:border-orange-400 hover:text-orange-500'}`}
            >
              {pageNumber}
            </a>
          ))}
          {page < totalPages && (
            <a
              href={`/search?${queryString.replace(/page=\d+/, `page=${page + 1}`)}`}
              className="px-3 py-2 border border-gray-200 rounded-lg hover:border-orange-400 hover:text-orange-500 transition"
            >
              Sau →
            </a>
          )}
        </div>
      )}
    </>
  );
}
