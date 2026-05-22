// API Route: /api/products
// REST endpoint - part of Controller layer in MVC

import { NextRequest, NextResponse } from 'next/server';
import { ProductController } from '@/controllers/ProductController';
import { SearchFilters } from '@/models/Product';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters: SearchFilters = {
    keyword: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    location: searchParams.get('location') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    condition: (searchParams.get('condition') as any) || undefined,
    sort: searchParams.get('sort') || undefined,
    order: (searchParams.get('order') as any) || undefined,
    is_featured: searchParams.get('is_featured') === 'true' ? true : searchParams.get('is_featured') === 'false' ? false : undefined,
  };

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;
  const sessionId = request.headers.get('x-auth-signature') || undefined;

  const result = await ProductController.searchProducts(filters, page, pageSize, sessionId);

  return NextResponse.json(result);
}
