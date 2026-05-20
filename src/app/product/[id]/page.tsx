import { notFound } from 'next/navigation';
import { ProductController } from '@/controllers/ProductController';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductDetailsClient } from '@/components/product/ProductDetailsClient';
import { ChevronRight } from 'lucide-react';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await ProductController.getProductById(params.id);
  if (!product) notFound();
  console.log("product", product)

  const related = (await ProductController.getProductsByCategory(product.categorySlug, 8))
    .filter(p => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-gray-100">
        <a href="/" className="hover:text-orange-500 transition-all flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Trang chủ
        </a>
        <ChevronRight size={12} className="text-gray-300" />
        <a href={`/category/${product.categorySlug}`} className="hover:text-orange-500 transition-all">{product.category}</a>
        <ChevronRight size={12} className="text-gray-300" />
        <span className="text-gray-900 truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main Content (Client Component) */}
      <ProductDetailsClient product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeader title="Sản phẩm tương tự" viewAllHref={`/category/${product.categorySlug}`} />
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
