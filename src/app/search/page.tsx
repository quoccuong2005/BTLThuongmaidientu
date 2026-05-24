import { CategoryController } from '@/controllers/CategoryController';
import { Filter, SlidersHorizontal } from 'lucide-react';
import SortSelect from '@/components/ui/SortSelection';
import SearchResultsClient from '@/components/search/SearchResultsClient';

interface SearchPageProps {
  searchParams: { q?: string; category?: string; sort?: string; order?: string; location?: string; is_featured?: string; page?: string; limit?: string };
}

const LOCATION_KEYWORDS: Record<string, string[]> = {
  'Toàn Quốc': [],
  'TP. Hồ Chí Minh': ['tp.hcm', 'hcm', 'hồ chí minh', 'ho chi minh'],
  'Hà Nội': ['hà nội', 'ha noi'],
  'Đà Nẵng': ['đà nẵng', 'da nang'],
};

const normalizeLocation = (value: string) => value.toLowerCase().replace(/\s+/g, '').replace(/\./g, '').replace(/đ/g, 'd');

const matchesLocation = (productLocation: string, selectedLocation: string) => {
  if (!selectedLocation || selectedLocation === 'Toàn Quốc') return true;
  const normalizedLocation = normalizeLocation(productLocation);
  const keywords = LOCATION_KEYWORDS[selectedLocation] || [normalizeLocation(selectedLocation)];
  return keywords.some(keyword => normalizedLocation.includes(normalizeLocation(keyword)));
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
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
                <a
                  href={`/search${searchParams.q ? `?q=${encodeURIComponent(searchParams.q)}` : ''}${searchParams.location && searchParams.location !== 'Toàn Quốc' ? `${searchParams.q ? '&' : '?'}location=${encodeURIComponent(searchParams.location)}` : ''}${searchParams.sort ? `&sort=${encodeURIComponent(searchParams.sort)}` : ''}${searchParams.order ? `&order=${encodeURIComponent(searchParams.order)}` : ''}${searchParams.is_featured ? `&is_featured=${encodeURIComponent(searchParams.is_featured)}` : ''}${searchParams.q || (searchParams.location && searchParams.location !== 'Toàn Quốc') || searchParams.sort || searchParams.order || searchParams.is_featured ? '&' : '?'}page=1&limit=15`}
                  className={`block px-2 py-1.5 rounded-lg text-sm ${!searchParams.category ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Tất cả
                </a>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <a
                    href={`/search?category=${cat.slug}${searchParams.location && searchParams.location !== 'Toàn Quốc' ? `&location=${encodeURIComponent(searchParams.location)}` : ''}${searchParams.sort ? `&sort=${encodeURIComponent(searchParams.sort)}` : ''}${searchParams.order ? `&order=${encodeURIComponent(searchParams.order)}` : ''}${searchParams.is_featured ? `&is_featured=${encodeURIComponent(searchParams.is_featured)}` : ''}&page=1&limit=15`}
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
          {/* Featured filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">Sản phẩm nổi bật</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href={`/search`}
                  className={`block px-2 py-1.5 rounded-lg ${searchParams.is_featured === undefined ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Tất cả
                </a>
              </li>
              <li>
                <a
                  href={`/search${searchParams.q ? `?q=${encodeURIComponent(searchParams.q)}` : ''}${searchParams.category ? `${searchParams.q ? '&' : '?'}category=${encodeURIComponent(searchParams.category)}` : ''}${searchParams.location && searchParams.location !== 'Toàn Quốc' ? `${searchParams.q || searchParams.category ? '&' : '?'}location=${encodeURIComponent(searchParams.location)}` : ''}${searchParams.sort ? `${searchParams.q || searchParams.category || (searchParams.location && searchParams.location !== 'Toàn Quốc') ? '&' : '?'}sort=${encodeURIComponent(searchParams.sort)}` : ''}${searchParams.order ? `${searchParams.q || searchParams.category || (searchParams.location && searchParams.location !== 'Toàn Quốc') || searchParams.sort ? '&' : '?'}order=${encodeURIComponent(searchParams.order)}` : ''}${searchParams.q || searchParams.category || (searchParams.location && searchParams.location !== 'Toàn Quốc') || searchParams.sort || searchParams.order ? '&' : '?'}is_featured=true&page=1&limit=15`}
                  className={`block px-2 py-1.5 rounded-lg ${searchParams.is_featured === 'true' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Chỉ sản phẩm nổi bật
                </a>
              </li>
              <li>
                <a
                  href={`/search${searchParams.q ? `?q=${encodeURIComponent(searchParams.q)}` : ''}${searchParams.category ? `${searchParams.q ? '&' : '?'}category=${encodeURIComponent(searchParams.category)}` : ''}${searchParams.location && searchParams.location !== 'Toàn Quốc' ? `${searchParams.q || searchParams.category ? '&' : '?'}location=${encodeURIComponent(searchParams.location)}` : ''}${searchParams.sort ? `${searchParams.q || searchParams.category || (searchParams.location && searchParams.location !== 'Toàn Quốc') ? '&' : '?'}sort=${encodeURIComponent(searchParams.sort)}` : ''}${searchParams.order ? `${searchParams.q || searchParams.category || (searchParams.location && searchParams.location !== 'Toàn Quốc') || searchParams.sort ? '&' : '?'}order=${encodeURIComponent(searchParams.order)}` : ''}${searchParams.q || searchParams.category || (searchParams.location && searchParams.location !== 'Toàn Quốc') || searchParams.sort || searchParams.order ? '&' : '?'}is_featured=false&page=1&limit=15`}
                  className={`block px-2 py-1.5 rounded-lg ${searchParams.is_featured === 'false' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Không phải nổi bật
                </a>
              </li>
            </ul>
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
                {searchParams.location && searchParams.location !== 'Toàn Quốc' && (
                  <p className="text-sm text-gray-500 mt-0.5">{`Tại ${searchParams.location}`}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <SortSelect searchParams={searchParams} />
                {/* Mobile filter button */}
                <button className="md:hidden flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                  <SlidersHorizontal size={14} /> Lọc
                </button>
              </div>
            </div>
          </div>

          <SearchResultsClient searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}
