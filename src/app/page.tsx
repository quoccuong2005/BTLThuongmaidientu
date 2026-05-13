import { ProductController } from '@/controllers/ProductController';
import { CategoryController } from '@/controllers/CategoryController';
import { ProductCard } from '../components/ui/ProductCard';
import { CategoryGrid } from '../components/ui/CategoryGrid';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BannerCarousel } from '@/components/ui/BannerCarousel';
import { FlashSaleSection } from '@/components/home/FlashSaleSection';
import { TrustBadges } from '@/components/home/TrustBadges';
import { QuickPostBanner } from '@/components/home/QuickPostBanner';
import { BANNERS } from '@/lib/db';
import { BadgeCheck, Cpu, CreditCard, Gauge, Heart, PackageCheck, Radar, RefreshCcw, ScanLine, ShieldCheck, ShoppingCart, Sparkles, Star, TicketPercent, Truck, UserCog, Users, Zap } from 'lucide-react';

export default async function HomePage() {
  const categories = await CategoryController.getTopCategories(12);
  const featuredProducts = await ProductController.getFeaturedProducts(8);
  const newProducts = await ProductController.getNewProducts(8);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 space-y-6">
      <section className="tech-shell rounded-3xl text-white overflow-hidden shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[1.7fr_1.3fr] p-6 md:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
                <Radar size={13} /> Live commerce engine
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
                <Zap size={13} /> Siêu sale mỗi ngày
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">Mua sắm thông minh trong giao diện thương mại thế hệ mới</h1>
            <p className="max-w-2xl text-sm sm:text-base text-orange-100/85">
              Khám phá sản phẩm chính hãng, flash sale realtime, voucher thông minh và gợi ý mua hàng được tối ưu cho trải nghiệm mobile-first.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/search?sort=popular"
                className="inline-flex items-center justify-center rounded-xl bg-white text-orange-600 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
              >
                Mua ngay
              </a>
              <a
                href="/search?sort=newest"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
              >
                Xem hàng mới
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="tech-glass rounded-3xl p-4 text-center">
                <p className="text-2xl font-semibold">500+</p>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-100/90">Thương hiệu</p>
              </div>
              <div className="tech-glass rounded-3xl p-4 text-center">
                <p className="text-2xl font-semibold">20k+</p>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-100/90">Sản phẩm hot</p>
              </div>
              <div className="tech-glass rounded-3xl p-4 text-center">
                <p className="text-2xl font-semibold">24h</p>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-100/90">Giao nhanh</p>
              </div>
            </div>
          </div>
          <div className="tech-glass relative overflow-hidden rounded-[1.75rem] p-5">
            <div className="relative space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.3em] text-orange-100/90">Realtime deal hub</p>
                <Cpu size={18} className="text-orange-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-orange-100">Flash sale</p>
                  <p className="mt-2 text-2xl font-black">-50%</p>
                  <p className="mt-1 text-xs text-orange-100/90">Deal có giới hạn</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-orange-100">Smart voucher</p>
                  <p className="mt-2 text-2xl font-black">GIAM30</p>
                  <p className="mt-1 text-xs text-orange-100/90">Tự áp dụng</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-orange-100">
                  <span>Conversion score</span>
                  <span>98%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-[98%] rounded-full bg-orange-300" />
                </div>
                <p className="mt-2 text-sm text-orange-100/95">Ưu tiên sản phẩm có voucher, đánh giá tốt và tốc độ giao nhanh.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <BannerCarousel banners={BANNERS} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <a
            href="/search?sort=popular"
            className="tap-bounce tech-card rounded-2xl border border-orange-200 bg-orange-50 p-4 transition-colors hover:bg-orange-100"
          >
            <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-orange-700">
              <Zap size={14} /> Deal sốc mỗi giờ
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">Săn giá tốt cho sản phẩm hot</p>
            <p className="mt-1 text-xs text-slate-600">Nhiều mã giảm tự động áp dụng khi thanh toán.</p>
          </a>
          <a
            href="/search?sort=newest"
            className="tap-bounce tech-card rounded-2xl border border-orange-200 bg-white p-4 transition-colors hover:bg-orange-50"
          >
            <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-orange-700">
              <Sparkles size={14} /> Gian hàng mới
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">Cập nhật liên tục thương hiệu mới</p>
            <p className="mt-1 text-xs text-slate-600">Khám phá sản phẩm vừa mở bán trong tuần.</p>
          </a>
        </div>
      </section>

      <FlashSaleSection products={featuredProducts} />

      <section className="tech-card rounded-3xl border border-orange-100 bg-white p-4 shadow-sm md:p-5">
        <SectionHeader title="Product Boost Zone" viewAllHref="/search?sort=popular" icon={<Zap size={18} />} />
        <div className="grid gap-3 lg:grid-cols-[1fr_1.5fr]">
          <div className="tech-shell overflow-hidden rounded-2xl p-4 text-white">
            <div className="relative z-[1] space-y-3">
              <p className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-100">
                <ShoppingCart size={13} /> Đẩy chốt đơn
              </p>
              <h2 className="text-2xl font-black leading-tight">Sản phẩm đang được ưu tiên hiển thị</h2>
              <p className="text-sm text-orange-100/90">
                Tập trung vào sản phẩm có lượt mua tốt, giá nổi bật và CTA thêm giỏ rõ ràng để tăng chuyển đổi.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="tech-glass rounded-xl p-3 text-center">
                  <p className="text-xl font-black">+38%</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-orange-100">Tỷ lệ click</p>
                </div>
                <div className="tech-glass rounded-xl p-3 text-center">
                  <p className="text-xl font-black">2.4x</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-orange-100">Thêm giỏ</p>
                </div>
                <div className="tech-glass rounded-xl p-3 text-center">
                  <p className="text-xl font-black">99K</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-orange-100">Freeship</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            {featuredProducts.slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} variant="horizontal" />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="tech-card rounded-3xl border border-orange-200 bg-orange-50 p-5 md:col-span-2">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Voucher độc quyền</p>
          <p className="mt-2 text-xl font-bold text-gray-900">Nhập mã GIAM30 để nhận ưu đãi tối đa 300K</p>
          <p className="mt-1 text-sm text-slate-700">Áp dụng cho nhiều ngành hàng, tự động trừ khi thanh toán.</p>
        </div>
        <div className="tech-card rounded-3xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Freeship extra</p>
          <p className="mt-2 text-xl font-bold text-gray-900">Đơn từ 99K giao nhanh miễn phí</p>
          <p className="mt-1 text-sm text-slate-700">Miễn phí giao hàng cho khu vực nội thành.</p>
        </div>
      </section>

      <CategoryGrid categories={categories} />

      <section className="tech-card bg-white rounded-3xl shadow-sm border border-orange-100 p-4 md:p-6">
        <SectionHeader title="Sản phẩm nổi bật" viewAllHref="/search?sort=popular" icon={<Radar size={18} />} />
        <div className="mb-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-700">Đẩy sản phẩm</p>
            <p className="mt-1 text-sm font-bold text-slate-900">Ưu tiên sản phẩm có lượt mua cao</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-700">Deal nổi bật</p>
            <p className="mt-1 text-sm font-bold text-slate-900">Hiển thị giá tốt và voucher trước</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-700">Chốt đơn nhanh</p>
            <p className="mt-1 text-sm font-bold text-slate-900">CTA thêm giỏ nằm ngay trên card</p>
          </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="tech-chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold">
            <ScanLine size={13} /> Top sản phẩm nhiều lượt xem
          </span>
          <span className="tech-chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold">
            <TicketPercent size={13} /> Voucher hiển thị nổi bật
          </span>
          <span className="tech-chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold">
            <ShoppingCart size={13} /> Thêm giỏ nhanh
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="tech-card bg-white rounded-3xl shadow-sm border border-orange-100 p-4 md:p-6">
        <SectionHeader title="Hàng mới về" viewAllHref="/search?sort=newest" icon={<Cpu size={18} />} />
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="tech-chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold">
            <Sparkles size={13} /> Sản phẩm vừa mở bán
          </span>
          <span className="tech-chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold">
            <Radar size={13} /> Theo dõi xu hướng mới
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="tech-card bg-white rounded-3xl shadow-sm border border-orange-100 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-700">Trust layer</p>
            <h2 className="mt-1 text-lg font-black text-slate-900">Hạ tầng mua sắm an toàn</h2>
          </div>
          <span className="tech-chip hidden rounded-full px-3 py-1 text-xs font-bold sm:inline-flex">Realtime protection</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="tech-card flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
            <ShieldCheck className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Chính hãng đảm bảo</p>
              <p className="text-sm text-slate-600">Sản phẩm được kiểm duyệt từ nhà bán uy tín.</p>
            </div>
          </div>
          <div className="tech-card flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
            <Truck className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Giao nhanh toàn quốc</p>
              <p className="text-sm text-slate-600">Theo dõi đơn hàng theo thời gian thực.</p>
            </div>
          </div>
          <div className="tech-card flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
            <BadgeCheck className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Thanh toán an toàn</p>
              <p className="text-sm text-slate-600">Hỗ trợ nhiều phương thức thanh toán linh hoạt.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tech-card rounded-3xl border border-orange-100 bg-white p-4 md:p-5">
        <SectionHeader title="Hệ module E-commerce" icon={<Gauge size={18} />} />
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { key: 'users', label: 'users', icon: Users, desc: 'Hồ sơ khách hàng và định danh tài khoản' },
            { key: 'admin', label: 'admin', icon: UserCog, desc: 'Quản trị vận hành danh mục và gian hàng' },
            { key: 'products', label: 'products', icon: PackageCheck, desc: 'Quản lý sản phẩm, biến thể, tồn kho' },
            { key: 'orders', label: 'orders', icon: Truck, desc: 'Quy trình xử lý đơn và giao vận' },
            { key: 'payments', label: 'payments', icon: CreditCard, desc: 'Thanh toán đa phương thức an toàn' },
            { key: 'returns', label: 'returns', icon: RefreshCcw, desc: 'Đổi trả linh hoạt theo chính sách' },
            { key: 'vouchers', label: 'vouchers', icon: TicketPercent, desc: 'Mã giảm giá và ưu đãi flash-sale' },
            { key: 'reviews', label: 'reviews', icon: Star, desc: 'Đánh giá xác thực sau khi mua hàng' },
            { key: 'wish_list', label: 'wish_list', icon: Heart, desc: 'Lưu yêu thích và gợi ý mua lại' },
          ].map(item => (
            <div key={item.key} className="tech-card rounded-2xl border border-slate-200 p-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <item.icon size={18} />
              </div>
              <p className="mt-2 text-sm font-bold text-slate-900">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <TrustBadges />
      <QuickPostBanner />
    </div>
  );
}
