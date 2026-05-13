import { ProductController } from '@/controllers/ProductController';
import { CategoryController } from '@/controllers/CategoryController';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Filter, SearchX, SlidersHorizontal } from 'lucide-react';

interface SearchPageProps {
  searchParams: { q?: string; category?: string; sort?: string; location?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { data: products, total } = await ProductController.searchProducts({
    keyword: searchParams.q,
    category: searchParams.category,
    sortBy: (searchParams.sort as any) || 'newest',
  });

  const categories = await CategoryController.getAllCategories();

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4">
      <div className="flex gap-4">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-60 flex-shrink-0 space-y-4">
          {/* Category filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Filter size={16} className="text-orange-500" /> Danh mục
            </h3>
            <ul className="space-y-1">
              <li>
                <a href="/search" className={`block px-2 py-1.5 rounded-lg text-sm ${!searchParams.category ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  Tất cả
                </a>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <a
                    href={`/search?category=${cat.slug}`}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-sm ${searchParams.category === cat.slug ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span className="flex items-center gap-2">
                      {cat.icon.startsWith('http') ? (
                        <img src={cat.icon} alt={cat.name} className="w-5 h-5 object-cover rounded-md" />
                      ) : (
                        <span>{cat.icon}</span>
                      )}
                      {cat.name}
                    </span>
                    {cat.count ? <span className="text-xs text-gray-400">{cat.count}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Price filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">Khoảng giá</h3>
            <div className="space-y-2">
              {[
                ['Dưới 1 triệu', '0-1000000'],
                ['1 - 5 triệu', '1000000-5000000'],
                ['5 - 20 triệu', '5000000-20000000'],
                ['Trên 20 triệu', '20000000-'],
              ].map(([label, range]) => (
                <label key={range} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="price" className="accent-orange-500" />
                  <span className="text-sm text-gray-600">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Product type filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">Loại sản phẩm</h3>
            <div className="space-y-2">
              {[['Tất cả sản phẩm', 'all'], ['Hàng mới chính hãng', 'new']].map(([label, val]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="condition" className="accent-orange-500" defaultChecked={val === 'all'} />
                  <span className="text-sm text-gray-600">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="font-bold text-gray-800">
                  {searchParams.q ? `Kết quả cho "${searchParams.q}"` : 'Tất cả sản phẩm'}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">{total} sản phẩm</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sắp xếp:</span>
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-orange-400">
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="popular">Phổ biến nhất</option>
                </select>
                {/* Mobile filter button */}
                <button className="md:hidden flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                  <SlidersHorizontal size={14} /> Lọc
                </button>
              </div>
            </div>
          </div>

          {/* Products grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <SearchX size={36} className="mx-auto mb-3 text-orange-500" />
              <p className="font-semibold text-gray-700">Không tìm thấy kết quả</p>
              <p className="text-sm text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
