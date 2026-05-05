import { ProductController } from '@/controllers/ProductController';
import { CategoryController } from '@/controllers/CategoryController';
import { BANNERS } from '@/lib/db';
import { ProductCard } from '@/components/ui/ProductCard';
import { CategoryGrid } from '@/components/ui/CategoryGrid';
import { BannerCarousel } from '@/components/ui/BannerCarousel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TrustBadges } from '@/components/home/TrustBadges';
import { QuickPostBanner } from '@/components/home/QuickPostBanner';

// This is a Server Component - data fetching at the page level (Controller layer)
export default function HomePage() {
  // Controller calls - business logic stays in controllers
  const categories = CategoryController.getTopCategories(12);
  const featuredProducts = ProductController.getFeaturedProducts(8);
  const newProducts = ProductController.getNewProducts(8);
  const urgentProducts = ProductController.getUrgentProducts(4);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 space-y-5">
      {/* Hero: Banner + Side listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BannerCarousel banners={BANNERS} />
        </div>
        {/* Urgent listings sidebar */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <SectionHeader title="🔥 Tin gấp" viewAllHref="/search?urgent=true" />
          <div className="space-y-3">
            {urgentProducts.length > 0
              ? urgentProducts.map(p => <ProductCard key={p.id} product={p} variant="horizontal" />)
              : newProducts.slice(0, 3).map(p => <ProductCard key={p.id} product={p} variant="horizontal" />)
            }
          </div>
        </div>
      </div>

      {/* Categories */}
      <CategoryGrid categories={categories} />

      {/* Trust badges */}
      <TrustBadges />

      {/* Featured products */}
      <section className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
        <SectionHeader title="Tin đăng nổi bật" viewAllHref="/search?sort=popular" icon="⭐" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Quick post CTA */}
      <QuickPostBanner />

      {/* Newest listings */}
      <section className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
        <SectionHeader title="Tin mới đăng" viewAllHref="/search?sort=newest" icon="🆕" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
