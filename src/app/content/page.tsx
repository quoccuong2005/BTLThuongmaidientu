import Link from 'next/link';
import { BookOpen, Calendar, Sparkles } from 'lucide-react';
import { ContentController } from '@/controllers/ContentController';
import type { Content } from '@/models/Content';

const formatDate = (value?: string) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
};

const getExcerpt = (item: Content) => {
  const source = (item.summary || item.content || '').trim();
  if (!source) return 'No summary available.';
  return source.length > 160 ? `${source.slice(0, 157)}...` : source;
};

const getCover = (item: Content) =>
  item.coverImageUrl ||
  `https://placehold.co/1200x720?text=${encodeURIComponent('Content')}`;

export default async function ContentPage() {
  const featured = await ContentController.getFeaturedContents(3);
  const latest = await ContentController.getPublicContents({
    limit: 12,
    sort: 'published_at',
    order: 'DESC',
  });

  const featuredSlugs = new Set(featured.map((item) => item.slug));
  const rest = latest.filter((item) => !featuredSlugs.has(item.slug));
  const hero = featured[0] ?? rest[0];
  const highlights = featured.length > 1 ? featured.slice(1, 3) : rest.slice(1, 3);
  const gridItems = featured.length > 0 ? rest.slice(0, 8) : rest.slice(3, 11);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 space-y-6">
      <section className="tech-shell rounded-3xl text-white overflow-hidden shadow-lg">
        <div className="relative p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
              <Sparkles size={13} /> Trung tâm nội dung
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
              <BookOpen size={13} /> Thông tin mua sắm
            </span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight">
            Các hướng dẫn, ưu đãi và bí quyết mua sắm mới nhất
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-orange-100/85">
            Đọc những mẹo nhanh được chọn lọc dành cho người mua thông minh. Lọc theo bài viết nổi bật và
            cập nhật các chiến lược mua hàng ưu đãi hàng tuần.
          </p>
        </div>
      </section>

      {hero ? (
        <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          <Link
            href={`/content/${hero.slug}`}
            className="group relative overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm"
          >
            <img
              src={getCover(hero)}
              alt={hero.title}
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-100">
                <Calendar size={12} /> {formatDate(hero.publishedAt)}
              </div>
              <h2 className="mt-2 text-2xl font-black leading-tight">
                {hero.title}
              </h2>
              <p className="mt-2 text-sm text-orange-100/90 line-clamp-2">
                {getExcerpt(hero)}
              </p>
            </div>
          </Link>

          <div className="grid gap-4">
            {highlights.map((item) => (
              <Link
                key={item.id}
                href={`/content/${item.slug}`}
                className="group tech-card rounded-2xl border border-orange-100 bg-white p-4 transition hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700">
                    Nổi bật
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} /> {formatDate(item.publishedAt)}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-black text-slate-900 group-hover:text-orange-600">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                  {getExcerpt(item)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="tech-card rounded-3xl border border-orange-100 bg-white p-6 text-center text-sm text-slate-500">
          Chưa có nội dung nào. Hãy chạy tập lệnh khởi tạo để thêm các bài đăng mẫu.
        </section>
      )}

      {gridItems.length > 0 && (
        <section className="tech-card rounded-3xl border border-orange-100 bg-white p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-600">
                Cập nhật mới nhất
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Những bài viết mới cho người mua thông minh
              </h2>
            </div>
            <Link
              href="/content"
              className="text-sm font-bold text-orange-500 hover:text-orange-600"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gridItems.map((item) => (
              <Link
                key={item.id}
                href={`/content/${item.slug}`}
                className="group tech-card rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5"
              >
                <img
                  src={getCover(item)}
                  alt={item.title}
                  className="h-40 w-full rounded-xl object-cover"
                />
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <Calendar size={12} />
                  <span>{formatDate(item.publishedAt)}</span>
                </div>
                <h3 className="mt-2 text-base font-black text-slate-900 group-hover:text-orange-600 line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                  {getExcerpt(item)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
