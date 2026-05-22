'use client';
import { useState } from 'react';
import { Product, ProductVariant } from '@/models/Product';
import { ProductController } from '@/controllers/ProductController';
import { ProductActions } from './ProductActions';
import { Star, StarHalf, CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Heart, PackageCheck, RefreshCcw, TicketPercent, Truck, UserCog, Users, Info, MapPin, ShieldCheck, Zap, MessageSquare, Store } from 'lucide-react';
import { ProductReviews } from './ProductReviews';
import { useSearchParams } from 'next/navigation';

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const searchParams = useSearchParams();
  const variantParam = searchParams.get('variant');
  const initialVariant = product.variants?.find(v => v.id.toString() === variantParam) || null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(initialVariant);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  console.log("Product details:", product);
  const images = product.images || [product.image];
  const currentPrice = selectedVariant ? parseFloat(selectedVariant.price) : product.price;
  const currentTitle = selectedVariant ? selectedVariant.name : product.title;
  const currentImage = selectedVariant ? selectedVariant.image_url : product.image;
  const currentId = selectedVariant ? selectedVariant.id : product.id;
  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-4 space-y-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap pb-2">
        <a href="/" className="hover:text-blue-600">Trang chủ</a>
        <ChevronRight size={12} />
        <a href="#" className="hover:text-blue-600">{product.category}</a>
        <ChevronRight size={12} />
        <span className="text-gray-900 font-medium truncate">{product.title}</span>
      </nav>

      {/* Product Title Section */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
            Chính hãng
          </span>
          <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
            {product.condition === 'new' ? 'Mới 100%' : 'Đã qua sử dụng'}
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
          {product.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery & Description */}
        <div className="lg:col-span-7 space-y-8">
          {/* Gallery */}
          <div className="bg-white rounded-3xl p-4 md:p-8 border border-gray-100 shadow-sm relative group">
            <div className="aspect-[4/3] relative flex items-center justify-center overflow-hidden">
              <img
                src={images[activeImageIndex]}
                alt={product.title}
                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gray-100/80 hover:bg-white rounded-full text-gray-800 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-100/80 hover:bg-white rounded-full text-gray-800 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${activeImageIndex === idx ? 'border-orange-500' : 'border-gray-100 hover:border-orange-200'
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = product.rating ?? 0;
                  const fullStars = Math.floor(ratingValue);
                  const hasHalfStar = ratingValue - fullStars >= 0.5;
                  const isFilled = i < fullStars;
                  const isHalf = i === fullStars && hasHalfStar;

                  return isFilled ? (
                    <Star
                      key={i}
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ) : isHalf ? (
                    <StarHalf
                      key={i}
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ) : (
                    <Star
                      key={i}
                      size={14}
                      className="text-gray-200 fill-gray-200"
                    />
                  );
                })}
                <span className="ml-1.5 text-gray-400 text-[10px] font-bold">({(product.rating ?? 0).toFixed(1)})</span>
              </div>
              <span>•</span>
              <span>{(product.views || 0).toLocaleString('vi-VN')} lượt xem</span>
              <span>•</span>
              <span>{product.totalSold || 0}+ đã bán</span>
            </div>
          </div>

          {/* Product Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
              Chi tiết sản phẩm
            </h3>
            <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <ProductReviews productLineId={Number(product.id)} />
        </div>

        {/* Right Column: Buying Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Price Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-orange-600">
                {ProductController.formatPrice(currentPrice)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-300 line-through">
                  {ProductController.formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Phân loại sản phẩm</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center gap-2 ${selectedVariant?.id === variant.id
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-100 hover:border-orange-200 text-gray-500 bg-white'
                        }`}
                    >
                      {selectedVariant?.id === variant.id && <CheckCircle2 size={16} />}
                      {variant.name}
                    </button>
                  ))}
                </div>
                {!selectedVariant && (
                  <p className="text-sm text-orange-600 font-semibold mt-2">Vui lòng chọn phân loại sản phẩm để mua hàng.</p>
                )}
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="pt-6 border-t border-gray-50 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Số lượng</p>
                <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 active:scale-90 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 active:scale-90 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <ProductActions
                product={{ ...product, id: currentId, title: currentTitle, image: currentImage, price: currentPrice }}
                variant="premium"
                quantity={quantity}
                requiresVariantSelection={Boolean(product.variants && product.variants.length > 0)}
                isVariantSelected={Boolean(selectedVariant)}
                wishlistTargetId={selectedVariant?.id}
              />
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 p-2 border border-gray-100 flex items-center justify-center">
                <img src="../../Logochoviet.png" alt="Seller" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{product.seller}</p>
                <div className="flex items-center gap-1 text-xs text-green-600 font-bold uppercase tracking-wider mt-1">
                  <CheckCircle2 size={14} className="fill-green-600 text-white" />
                  <span>Người bán uy tín</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-orange-500 text-orange-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-orange-50 transition-all">
                  <MessageSquare size={16} />
                  Nhắn tin
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-100">
                  <Store size={16} />
                  Xem Shop
                </button>
              </div> */}

              <div className="pt-4 space-y-2 text-xs text-gray-500 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <span>Địa điểm:</span>
                  <span className="text-gray-900 font-medium">{product.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ngày đăng:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(product.postedAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Original Promo Cards */}
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase text-orange-700 mb-1">
                <TicketPercent size={14} /> Vouchers
              </p>
              <p className="text-xs font-semibold text-gray-800">Áp dụng mã giảm GIAM30 và freeship khi thanh toán.</p>
            </div>
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase text-orange-700 mb-1">
                <CreditCard size={14} /> Payments
              </p>
              <p className="text-xs font-semibold text-gray-800">Hỗ trợ COD, thẻ nội địa và ví điện tử phổ biến.</p>
            </div>
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase text-orange-700 mb-1">
                <RefreshCcw size={14} /> Returns
              </p>
              <p className="text-xs font-semibold text-gray-800">Đổi trả trong 7 ngày với sản phẩm lỗi từ nhà bán.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
