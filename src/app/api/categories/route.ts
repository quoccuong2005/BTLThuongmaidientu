import { NextResponse } from 'next/server';
import { CategoryController } from '@/controllers/CategoryController';

export async function GET() {
  const categories = CategoryController.getAllCategories();
  return NextResponse.json({ data: categories });
}
