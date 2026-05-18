import { ProductController } from '@/controllers/ProductController';
import { CategoryController } from '@/controllers/CategoryController';
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
  ChevronRight,
  Cpu,
  Gift,
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
  Gem

} from 'lucide-react';

export default async function HomePage() {
  const categories = await CategoryController.getTopCategories(12);
  const featuredProducts = await ProductController.getFeaturedProducts(8);
  const newProducts = await ProductController.getNewProducts(8);

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-3 py-5 md:px-4 md:py-8">
        <section className="grid gap-4 lg:grid-cols-[280px_1fr_320px]">
          {/* Left panel */}
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
              ].map((item) => (
                <a
                  key={item.title}
                  href="/search"
                  className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:border-orange-200 hover:bg-orange-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                    {item.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-black text-slate-900">{item.title}</span>
                    <span className="block text-xs text-slate-500">{item.desc}</span>
                  </span>
                </a>
              ))}
            </div>
          </aside>

          {/* Main hero */}
          <section className="relative h-[420px]   overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(251,106,1,0.28)]">
            <img
              src="/bgtmdt.png"
              alt="Hero thương mại điện tử"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Content */}
            <div className="relative top-[196px] z-10 flex min-h-[420px] flex-col  p-6 md:p-8">
              <div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="/search?sort=popular"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white p-[9px] text-sm font-bold text-[#FB6A01] shadow-xl transition hover:-translate-y-0.5 hover:bg-orange-50"
                  >
                    Mua ngay <ChevronRight size={16} />
                  </a>

                  <a
                    href="/vouchers"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-[9px] text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
                  >
                    Nhận voucher
                  </a>
                </div>
              </div>


            </div>
          </section>

          {/* Right deal panel */}
          <aside className="space-y-4">


            <div className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
                Mã nổi bật
              </p>

              <FeaturedVoucherCard />
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100">
            <BannerCarousel banners={BANNERS} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <a
              href="/search?sort=popular"
              className="group rounded-3xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Zap size={22} />
              </div>
              <p className="text-sm font-black text-slate-900">Deal sốc mỗi giờ</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sản phẩm hot, giá tốt, mã giảm tự động áp dụng.
              </p>
            </a>

            <a
              href="/search?sort=newest"
              className="group rounded-3xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-package-plus-icon lucide-package-plus"><path d="M12 22V12" /><path d="M16 17h6" /><path d="M19 14v6" /><path d="M21 10.535V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.675-.955" /><path d="M3.29 7 12 12l8.71-5" /><path d="m7.5 4.27 8.997 5.148" /></svg>
              </div>
              <p className="text-sm font-black text-slate-900">Hàng mới cập nhật</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Khám phá sản phẩm mới mở bán trong tuần này.
              </p>
            </a>
          </div>
        </section>

        <section className="mt-6">
          <CategoryGrid categories={categories} />
        </section>

        <section className="mt-6">
          <FlashSaleSection products={featuredProducts} />
        </section>

        <section className="mt-6 rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm md:p-6">
          <SectionHeader
            title="Mã giảm giá & ưu đãi"
            viewAllHref="/vouchers"
            icon={<TicketPercent size={18} />}
          />

          <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="relative overflow-hidden rounded-3xl shadow-xl w-[95%] h-[12rem]">
              {/* Background Image */}
              <img
                src="/voucher.png"
                alt="Voucher Banner"
                className="absolute inset-0 h-full w-full object-cover"
              />


            </div>

            <div>
              <VouchersClient limit={2} compact={true} />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm md:p-6">
          <SectionHeader
            title="Sản phẩm nổi bật"
            viewAllHref="/search?sort=popular"
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
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm md:p-6">
          <SectionHeader
            title="Hàng mới về"
            viewAllHref="/search?sort=newest"
            icon={<Cpu size={18} />}
          />

          <div className="mb-5 mt-4 rounded-3xl bg-gradient-to-r from-orange-600 to-orange-400 p-5 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-package-plus-icon lucide-package-plus"><path d="M12 22V12" /><path d="M16 17h6" /><path d="M19 14v6" /><path d="M21 10.535V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.675-.955" /><path d="M3.29 7 12 12l8.71-5" /><path d="m7.5 4.27 8.997 5.148" /></svg> New arrival
                </p>
                <h2 className="mt-2 text-2xl font-black">Sản phẩm mới được cập nhật liên tục</h2>
              </div>
              <a
                href="/search?sort=newest"
                className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-orange-50"
              >
                Xem tất cả <ChevronRight size={16} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

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
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <ShieldCheck className="h-7 w-7 text-orange-600" />
              <p className="mt-4 text-sm font-black text-slate-900">Hàng chính hãng</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sản phẩm được kiểm duyệt từ nhà bán uy tín.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <Truck className="h-7 w-7 text-orange-600" />
              <p className="mt-4 text-sm font-black text-slate-900">Giao nhanh</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Theo dõi đơn hàng và cập nhật trạng thái rõ ràng.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <BadgeCheck className="h-7 w-7 text-orange-600" />
              <p className="mt-4 text-sm font-black text-slate-900">Thanh toán an toàn</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Hỗ trợ nhiều hình thức thanh toán linh hoạt.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <Headphones className="h-7 w-7 text-orange-600" />
              <p className="mt-4 text-sm font-black text-slate-900">Hỗ trợ nhanh</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Luôn sẵn sàng hỗ trợ khi bạn cần tư vấn.
              </p>
            </div>
          </div>
        </section>

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

            <a
              href="/search"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-orange-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50"
            >
              Khám phá sản phẩm <ChevronRight size={16} />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}