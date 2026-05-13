import Link from 'next/link';
import { Cpu, LayoutGrid, Radar, TicketPercent, Truck, Zap } from 'lucide-react';
import { Category } from '@/models/Product';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="tech-card overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm">
      <div className="tech-shell p-4 text-white md:p-5">
        <div className="relative z-[1] flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-100">
              <Radar className="h-3.5 w-3.5" /> Category scanner
            </p>
            <h2 className="mt-2 flex items-center gap-2 text-xl font-black text-white">
              <LayoutGrid className="h-5 w-5 text-orange-200" />
              Danh mục nổi bật
            </h2>
            <p className="mt-1 text-sm text-orange-100/85">
              Lướt nhanh các ngành hàng chính, ưu tiên hiển thị deal và sản phẩm đang tăng trưởng.
            </p>
          </div>
          <Link
            href="/search"
            className="tap-bounce inline-flex min-h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-bold text-orange-600 transition-colors hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
          >
            Xem tất cả
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="tap-bounce tech-card group flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 text-center transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-orange-50 ring-1 ring-orange-100 transition-colors group-hover:bg-orange-100">
              {typeof cat.icon === 'string' && cat.icon.startsWith('http') ? (
                <img src={cat.icon} alt={cat.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-orange-500">
                  <Cpu className="h-5 w-5" />
                </div>
              )}
            </div>
            <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-slate-800">{cat.name}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-2 border-t border-orange-100 bg-orange-50/50 p-3 md:grid-cols-3">
        <Link
          href="/search?sort=popular"
          className="tap-bounce tech-card rounded-2xl border border-orange-200 bg-white px-3 py-3 transition-colors hover:bg-orange-50"
        >
          <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
            <Zap className="h-3.5 w-3.5" /> Deal giờ vàng
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">Giảm sâu đến 50%</p>
          <p className="mt-1 text-xs font-semibold text-slate-600">Tự động ưu tiên sản phẩm có voucher tốt.</p>
        </Link>
        <Link
          href="/search?sort=newest"
          className="tap-bounce tech-card rounded-2xl border border-orange-200 bg-white px-3 py-3 transition-colors hover:bg-orange-50"
        >
          <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
            <Radar className="h-3.5 w-3.5" /> Hàng mới về
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">Cập nhật theo ngày</p>
          <p className="mt-1 text-xs font-semibold text-slate-600">Theo dõi sản phẩm vừa mở bán.</p>
        </Link>
        <div className="tech-card rounded-2xl border border-orange-200 bg-white px-3 py-3">
          <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
            <Truck className="h-3.5 w-3.5" /> Freeship
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">Đơn từ 99K miễn phí vận chuyển</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
            <TicketPercent className="h-3.5 w-3.5" /> Có thể áp dụng cùng voucher
          </p>
        </div>
      </div>
    </section>
  );
}
