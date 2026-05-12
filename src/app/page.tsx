import { ProductController } from '@/controllers/ProductController';
import { CategoryController } from '@/controllers/CategoryController';
import { ProductCard } from '@/components/ui/ProductCard';
import { CategoryGrid } from '@/components/ui/CategoryGrid';
import { SectionHeader } from '@/components/ui/SectionHeader';

export default async function HomePage() {
  const categories = await CategoryController.getTopCategories(12);
  const featuredProducts = await ProductController.getFeaturedProducts(8);
  const newProducts = await ProductController.getNewProducts(8);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 text-white overflow-hidden shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr] p-6 md:p-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-100/90">Chợ Việt - Kênh mua bán tin cậy</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Tìm tin đăng chất lượng, giao dịch nhanh chóng và an toàn</h1>
            <p className="max-w-2xl text-sm sm:text-base text-orange-100/85">
              Khám phá hàng ngàn tin đăng mới mỗi ngày, những ưu đãi hot và sản phẩm gấp được chọn lọc riêng cho bạn.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/10 border border-white/20 p-4 text-center">
                <p className="text-2xl font-semibold">1k+</p>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-100/80">Tin đăng</p>
              </div>
              <div className="rounded-3xl bg-white/10 border border-white/20 p-4 text-center">
                <p className="text-2xl font-semibold">12h</p>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-100/80">Tin mới mỗi giờ</p>
              </div>
              <div className="rounded-3xl bg-white/10 border border-white/20 p-4 text-center">
                <p className="text-2xl font-semibold">100%</p>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-100/80">Đảm bảo uy tín</p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-white/10 p-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_55%)]" />
            <div className="relative text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-orange-100/90 mb-3">Nổi bật hôm nay</p>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-5">
                <p className="text-xl font-bold">Tin gấp</p>
                <p className="mt-2 text-sm text-orange-100/90">Các tin đăng có nhu cầu bán nhanh, ưu tiên hiển thị tại đây.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid categories={categories} />

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <SectionHeader title="Tin đăng nổi bật" viewAllHref="/search?sort=popular" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <SectionHeader title="Tin mới đăng" viewAllHref="/search?sort=newest" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
