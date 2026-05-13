import { ProductController } from '@/controllers/ProductController';
import { CategoryController } from '@/controllers/CategoryController';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ui/ProductCard';

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await CategoryController.getCategoryBySlug(params.slug);
  if (!category) notFound();

  const { data: products } = await ProductController.searchProducts({ category: params.slug }, 1, 20);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4">
      {/* Category header */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-4xl overflow-hidden">
          {category.icon.startsWith('http') ? (
            <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
          ) : (
            category.icon
          )}
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-800">{category.name}</h1>
          <p className="text-sm text-gray-500">{products.length} sản phẩm</p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm">
          <p className="font-semibold text-gray-700">Danh mục này đang được cập nhật sản phẩm</p>
          <p className="text-sm text-gray-400 mt-1">Vui lòng quay lại sau hoặc khám phá danh mục khác.</p>
        </div>
      )}
    </div>
  );
}
