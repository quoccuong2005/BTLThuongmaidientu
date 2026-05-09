import { notFound } from 'next/navigation';
import { ProductController } from '@/controllers/ProductController';
import { MapPin, Clock, Eye, Phone, MessageCircle, Heart, Share2, AlertTriangle, CheckCircle, ShoppingCart, CreditCard } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductActions } from '@/components/product/ProductActions';

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = ProductController.getProductById(params.id);
  if (!product) notFound();

  const related = ProductController.getProductsByCategory(product.categorySlug, 8)
    .filter(p => p.id !== product.id);

  const discount = ProductController.getDiscount(product.price, product.originalPrice);
  const relativeTime = ProductController.getRelativeTime(product.postedAt);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
        <a href="/" className="hover:text-orange-500">Trang chủ</a>
        <span>/</span>
        <a href={`/category/${product.categorySlug}`} className="hover:text-orange-500">{product.category}</a>
        <span>/</span>
        <span className="text-gray-800 truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: images + details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="aspect-[4/3] relative">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                {product.isUrgent && <span className="badge-urgent">GẤP</span>}
                {product.isFeatured && <span className="badge-featured">NỔI BẬT</span>}
                {discount && <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">-{discount}%</span>}
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">{product.title}</h1>
              <div className="flex gap-2 flex-shrink-0">
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Heart size={18} className="text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Share2 size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-orange-500 font-black text-3xl">
                {ProductController.formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-lg">
                  {ProductController.formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Main Action Buttons */}
            <ProductActions product={product} variant="main" />

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Tình trạng</p>
                <p className="text-sm font-semibold">{product.condition === 'new' ? '✅ Mới' : '🔄 Đã qua sử dụng'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Danh mục</p>
                <p className="text-sm font-semibold">{product.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Khu vực</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <MapPin size={12} className="text-orange-500" />{product.location}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Đã đăng</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <Clock size={12} className="text-orange-500" />{relativeTime}
                </p>
              </div>
              {product.views && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Lượt xem</p>
                  <p className="text-sm font-semibold flex items-center gap-1">
                    <Eye size={12} className="text-orange-500" />{product.views.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="font-bold text-gray-800 mb-2">Mô tả</h3>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>Sản phẩm còn mới, tình trạng tốt. Đầy đủ phụ kiện đi kèm.</p>
                <p>Giá có thể thương lượng đối với khách mua ngay. Hỗ trợ ship COD toàn quốc hoặc gặp mặt trực tiếp tại địa chỉ trên.</p>
                <p>Liên hệ ngay để xem sản phẩm và có giá ưu đãi nhất.</p>
              </div>
            </div>
          </div>

          {/* Safety tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
              <AlertTriangle size={16} /> Lưu ý an toàn khi giao dịch
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li className="flex items-center gap-1.5"><CheckCircle size={12} /> Gặp trực tiếp để xem hàng trước khi mua</li>
              <li className="flex items-center gap-1.5"><CheckCircle size={12} /> Không chuyển khoản trước khi nhận hàng</li>
              <li className="flex items-center gap-1.5"><CheckCircle size={12} /> Kiểm tra kỹ sản phẩm trước khi thanh toán</li>
            </ul>
          </div>
        </div>

        {/* Right: seller info + contact */}
        <div className="space-y-4">
          {/* Contact card - sticky */}
          <div className="bg-white rounded-2xl shadow-sm p-5 lg:sticky lg:top-24">
            {/* Seller */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl font-bold text-orange-600">
                {product.seller.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{product.seller}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>⭐ 4.8</span>
                  <span>·</span>
                  <span>Đã xác minh ✅</span>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <ProductActions product={product} variant="sidebar" />

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-around text-center">
              <div>
                <p className="font-bold text-gray-800">12</p>
                <p className="text-xs text-gray-400">Tin đăng</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">4.8★</p>
                <p className="text-xs text-gray-400">Đánh giá</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">2 năm</p>
                <p className="text-xs text-gray-400">Thành viên</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-6 bg-white rounded-2xl shadow-sm p-5">
          <SectionHeader title="Tin tương tự" viewAllHref={`/category/${product.categorySlug}`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {related.slice(0, 8).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
