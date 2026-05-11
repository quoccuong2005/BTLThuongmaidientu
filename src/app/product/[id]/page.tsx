import { notFound } from 'next/navigation';
import { ProductController } from '@/controllers/ProductController';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductDetailsClient } from '@/components/product/ProductDetailsClient';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await ProductController.getProductById(params.id);
  if (!product) notFound();


  const related = (await ProductController.getProductsByCategory(product.categorySlug, 8))
    .filter(p => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
        <a href="/" className="hover:text-orange-500 transition-colors">Trang chủ</a>
        <span className="text-gray-300">/</span>
        <a href={`/category/${product.categorySlug}`} className="hover:text-orange-500 transition-colors">{product.category}</a>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium truncate">{product.title}</span>
      </nav>

      {/* Main Content (Client Component) */}
      <ProductDetailsClient product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeader title="Sản phẩm tương tự" viewAllHref={`/category/${product.categorySlug}`} icon="🛍️" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            {related.slice(0, 10).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
