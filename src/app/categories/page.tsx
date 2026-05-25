import Link from 'next/link';
import { ArrowRight, Layers, Tag } from 'lucide-react';
import { CategoryController } from '@/controllers/CategoryController';
import { Category } from '@/models/Product';

export default async function CategoriesPage() {
  const categories = await CategoryController.getAllCategories();

  return (
    <main className="space-y-6 px-4 py-6 lg:px-10">
      <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full bg-orange-500" />
              <p className="text-xs uppercase tracking-[0.32em] text-orange-600">Danh mục sản phẩm</p>
            </div>
            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">Tất cả danh mục</h1>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Khám phá tất cả danh mục đang có trên nền tảng. Chọn một danh mục để xem nhanh các sản phẩm liên quan và ưu đãi nổi bật.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 shadow-sm ring-1 ring-orange-100">
              <Layers size={18} />
              {categories.length} danh mục đang chờ bạn khám phá
            </div>
          </div>

          <div className="rounded-[2rem] border border-orange-100 bg-orange-50 p-6 shadow-sm">
            <div className="flex h-full flex-col justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-orange-700 uppercase tracking-[0.26em]">Khám phá nhanh</p>
                <h2 className="mt-4 text-2xl font-black text-slate-900">Chọn danh mục phù hợp ngay</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Dễ dàng so sánh danh mục, xem icon, và chuyển sang trang bộ lọc sản phẩm chỉ với một chạm.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
                  <p className="text-sm font-semibold text-orange-700">Danh mục nổi bật</p>
                  <p className="mt-2 text-sm text-slate-600">Danh mục có lượt truy cập cao mỗi ngày.</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
                  <p className="text-sm font-semibold text-orange-700">Thêm nhanh</p>
                  <p className="mt-2 text-sm text-slate-600">Chuyển thẳng tới trang tìm kiếm khi chọn danh mục.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category: Category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100">
                {category.icon ? (
                  <img src={category.icon} alt={category.name} className="h-10 w-10 rounded-2xl object-cover" />
                ) : (
                  <Tag size={24} />
                )}
              </div>
              <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-orange-700">
                Xem ngay
              </span>
            </div>

            <h2 className="mt-6 text-xl font-black text-slate-900">{category.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Khám phá sản phẩm và ưu đãi trong danh mục {category.name}.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-orange-600">
              <span>Khám phá</span>
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
