import Link from 'next/link';
import { Category } from '@/models/Product';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Danh mục</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-3">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center gap-1.5 p-2 md:p-3 rounded-xl hover:bg-orange-50 group transition-colors text-center"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-50 group-hover:bg-orange-100 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-colors">
              {cat.icon}
            </div>
            <span className="text-xs font-medium text-gray-700 group-hover:text-orange-600 leading-tight line-clamp-2 transition-colors">
              {cat.name}
            </span>
            {cat.count !== undefined && cat.count > 0 && (
              <span className="text-xs text-gray-400">{cat.count}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
