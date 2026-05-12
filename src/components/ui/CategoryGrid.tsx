import Link from 'next/link';
import { Category } from '@/models/Product';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl"></span>
          Danh mục phổ biến
        </h2>
        <a href="/search" className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-0.5">
          Xem tất cả <span>›</span>
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center gap-3 p-4 rounded-3xl border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-1 transition-all text-center group"
          >
            <div className="h-16 w-16 bg-orange-50 group-hover:bg-orange-100 rounded-full flex items-center justify-center text-3xl transition-colors overflow-hidden">
              {typeof cat.icon === 'string' && cat.icon.startsWith('http') ? (
                <img src={cat.icon} alt={cat.name} className="h-full w-full object-cover" />
              ) : (
                <span>{cat.icon || '📁'}</span>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-900 line-clamp-2">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
