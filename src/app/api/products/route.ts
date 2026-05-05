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
    sortBy: (searchParams.get('sort') as any) || 'newest',
  };

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;

  const result = ProductController.searchProducts(filters, page, pageSize);

  return NextResponse.json(result);
}
