import { NextResponse } from 'next/server';
import { CategoryController } from '@/controllers/CategoryController';

export async function GET() {
  const categories = await CategoryController.getAllCategories();
  return NextResponse.json({ data: categories });
}
