import Link from 'next/link';
import { ProductController } from '@/controllers/ProductController';
import { CategoryController } from '@/controllers/CategoryController';
import { ContentController } from '@/controllers/ContentController';
import { ProductCard } from '../components/ui/ProductCard';
import { CategoryGrid } from '../components/ui/CategoryGrid';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BannerCarousel } from '@/components/ui/BannerCarousel';
import { FlashSaleSection } from '@/components/home/FlashSaleSection';
import { VouchersClient } from '@/components/vouchers/VouchersClient';
import { FeaturedVoucherCard } from '@/components/vouchers/FeaturedVoucherCard';
import { BANNERS } from '@/lib/db';
import {
  BadgeCheck,
  BookOpen,
  ChevronRight,
  Cpu,
  Headphones,
  PackageCheck,
  Radar,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  TicketPercent,
  Truck,
  Zap,
} from 'lucide-react';

const formatDate = (value?: string) => {
  if (!value) return '';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
};

const LOCATION_KEYWORDS: Record<string, string[]> = {
  'Toàn Quốc': [],
  'TP. Hồ Chí Minh': ['tp hcm', 'hcm', 'hồ chí minh', 'ho chi minh'],
  'Hà Nội': ['hà nội', 'ha noi'],
  'Đà Nẵng': ['đà nẵng', 'da nang'],
};

const normalizeLocation = (value: string) =>
  value
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/\./g, '')
    .replace(/\s+/g, '');

const matchesLocation = (productLocation: string, selectedLocation: string) => {
  if (!selectedLocation || selectedLocation === 'Toàn Quốc') return true;
  const normalizedLocation = normalizeLocation(productLocation);
  const keywords = LOCATION_KEYWORDS[selectedLocation] || [normalizeLocation(selectedLocation)];
  return keywords.some(keyword => normalizedLocation.includes(normalizeLocation(keyword)));
};

const getExcerpt = (summary?: string, content?: string) => {
  const source = (summary || content || '').trim();
  if (!source) return 'No summary available.';
  return source.length > 120 ? `${source.slice(0, 117)}...` : source;
};

export default async function HomePage({ searchParams }: { searchParams?: { location?: string } }) {
  const categories = await CategoryController.getTopCategories(200);
  const featuredProducts = await ProductController.getFeaturedProducts(8);
  const AllProducts = await ProductController.getAllProducts();
  const newProducts = await ProductController.getNewProducts(8);
  const latestContents = await ContentController.getPublicContents({
    limit: 4,
    sort: 'published_at',
    order: 'DESC',
  });

  const selectedLocation = searchParams?.location || 'Toàn Quốc';
  const filteredFeaturedProducts = featuredProducts.filter(product => matchesLocation(product.location, selectedLocation));
  const filteredAllProducts = AllProducts.filter(product => matchesLocation(product.location, selectedLocation));
  const filteredNewProducts = newProducts.filter(product => matchesLocation(product.location, selectedLocation));

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-3 py-5 md:px-4 md:py-8">
        {/* HERO */}
        <section className="grid gap-4 lg:grid-cols-[280px_1fr_320px]">
          <aside className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
              Khám phá nhanh
            </p>

            <div className="mt-5 space-y-3">
              {[
                { icon: <Zap size={18} />, title: 'Flash Sale', desc: 'Deal hot mỗi ngày' },
                { icon: <TicketPercent size={18} />, title: 'Voucher', desc: 'Lưu mã giảm giá' },
                { icon: <ShoppingBag size={18} />, title: 'Hàng mới', desc: 'Sản phẩm vừa lên kệ' },
                { icon: <Truck size={18} />, title: 'Freeship', desc: 'Ưu đãi vận chuyển' },
              ].map(item => (
                <Link
                  key={item.title}
                  href="/search"
                  className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:border-orange-200 hover:bg-orange-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                    {item.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-black text-slate-900">
                      {item.title}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {item.desc}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </aside>

          <section className="relative h-[420px] overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(251,106,1,0.28)]">
            <img
              src="/bgtmdt.png"
              alt="Hero thương mại điện tử"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#FB6A01] shadow-xl transition hover:-translate-y-0.5 hover:bg-orange-50"
                >
                  Mua ngay <ChevronRight size={16} />
                </Link>

                <Link
                  href="/vouchers"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
                >
                  Nhận voucher
                </Link>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-orange-600">
              Mã nổi bật
            </p>
            <FeaturedVoucherCard />
          </aside>
        </section>

        {/* BANNER */}
        <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100">
            <BannerCarousel banners={BANNERS} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/search"
              className="group rounded-3xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Zap size={22} />
              </div>
              <p className="text-sm font-black text-slate-900">Deal sốc mỗi giờ</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sản phẩm hot, giá tốt, mã giảm tự động áp dụng.
              </p>
            </Link>

            <Link
              href="/search"
              className="group rounded-3xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <PackageCheck size={22} />
              </div>
              <p className="text-sm font-black text-slate-900">Hàng mới cập nhật</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Khám phá sản phẩm mới mở bán trong tuần này.
              </p>
            </Link>
          </div>
        </section>

        <section className="mt-6">
          <CategoryGrid categories={categories} title="Danh mục" viewAllHref="/categories" />
        </section>

        <section className="mt-6">
          {filteredAllProducts.length > 0 ? (
            <FlashSaleSection products={filteredAllProducts} />
          ) : (
            <div className="rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-800">Không có sản phẩm phù hợp với địa điểm này.</p>
              <p className="text-sm text-slate-500 mt-2">Hãy thử chọn một địa điểm khác hoặc để là Toàn Quốc.</p>
            </div>
          )}
        </section>

        {/* VOUCHERS */}
        <section className="mt-6 rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm md:p-6">
          <SectionHeader
            title="Mã giảm giá & ưu đãi"
            viewAllHref="/vouchers"
            icon={<TicketPercent size={18} />}
          />

          <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="relative h-[12rem] overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/voucher.png"
                alt="Voucher Banner"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <VouchersClient limit={2} compact={true} />
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="mt-6 rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm md:p-6">
          <SectionHeader
            title="Sản phẩm nổi bật"
            viewAllHref="/search"
            icon={<Radar size={18} />}
          />

          <div className="mb-5 mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              <ScanLine size={13} /> Nhiều lượt xem
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              <Star size={13} /> Đánh giá tốt
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              <ShoppingCart size={13} /> Dễ chốt đơn
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredFeaturedProducts.length > 0 ? (
              filteredFeaturedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-orange-100 bg-orange-50 p-6 text-center text-orange-700">
                Không có sản phẩm nổi bật tại địa điểm này.
              </div>
            )}
          </div>
        </section>

        {/* NEW PRODUCTS */}
        <section className="mt-6 rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm md:p-6">
          <SectionHeader
            title="Hàng mới về"
            viewAllHref="/search"
            icon={<Cpu size={18} />}
          />

          <div className="mb-5 mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              <Sparkles size={13} /> Sản phẩm vừa mở bán
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              <Radar size={13} /> Theo dõi xu hướng mới
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredNewProducts.length > 0 ? (
              filteredNewProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-orange-100 bg-orange-50 p-6 text-center text-orange-700">
                Không có sản phẩm mới tại địa điểm này.
              </div>
            )}
          </div>
        </section>


        {latestContents.length > 0 && (
          <section className="mt-6 rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm md:p-6">


            <SectionHeader
              title="Góc tin tức"
              viewAllHref="/content"
              icon={<BookOpen size={18} />}
            />




            <div className="grid gap-3 md:grid-cols-2">
              {latestContents.map(post => (
                <Link
                  key={post.id}
                  href={`/content/${post.slug}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <img
                    src={post.coverImageUrl || 'https://placehold.co/600x360?text=Content'}
                    alt={post.title}
                    className="h-36 w-full rounded-xl object-cover"
                  />

                  <div className="space-y-2">
                    <span className="text-xs text-slate-500">
                      {formatDate(post.publishedAt)}
                    </span>
                    <h3 className="line-clamp-2 text-base font-black text-slate-900 group-hover:text-orange-600">
                      {post.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-slate-600">
                      {getExcerpt(post.summary, post.content)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* TRUST */}
        <section className="mt-6 rounded-[2rem] border border-orange-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-600">
                Vì sao chọn chúng tôi?
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Mua sắm an toàn, giao hàng nhanh
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Tối ưu trải nghiệm từ lúc xem sản phẩm đến khi thanh toán và nhận hàng.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Hàng chính hãng',
                desc: 'Sản phẩm được kiểm duyệt từ nhà bán uy tín.',
              },
              {
                icon: Truck,
                title: 'Giao nhanh',
                desc: 'Theo dõi đơn hàng và cập nhật trạng thái rõ ràng.',
              },
              {
                icon: BadgeCheck,
                title: 'Thanh toán an toàn',
                desc: 'Hỗ trợ nhiều hình thức thanh toán linh hoạt.',
              },
              {
                icon: Headphones,
                title: 'Hỗ trợ nhanh',
                desc: 'Luôn sẵn sàng hỗ trợ khi bạn cần tư vấn.',
              },
            ].map(item => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
              >
                <item.icon className="h-7 w-7 text-orange-600" />
                <p className="mt-4 text-sm font-black text-slate-900">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-600 to-rose-500 p-6 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-100">
                <PackageCheck size={14} /> Bắt đầu mua sắm
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Tìm sản phẩm bạn yêu thích ngay hôm nay
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-orange-50">
                Săn deal, lưu voucher và trải nghiệm mua sắm nhanh chóng chỉ trong vài bước.
              </p>
            </div>

            <Link
              href="/search"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-orange-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50"
            >
              Khám phá sản phẩm <ChevronRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}