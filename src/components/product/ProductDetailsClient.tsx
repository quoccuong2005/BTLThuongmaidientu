'use client';
import { useState } from 'react';
import { Product, ProductVariant } from '@/models/Product';
import { ProductController } from '@/controllers/ProductController';
import { ProductActions } from './ProductActions';
import { Star, CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Heart, PackageCheck, RefreshCcw, TicketPercent, Truck, UserCog, Users } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const searchParams = useSearchParams();
  const variantParam = searchParams.get('variant');
  console.log("ddd", product)
  const initialVariant = product.variants?.find(v => v.id.toString() === variantParam)
    || product.variants?.[0]
    || null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(initialVariant);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);


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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: images + details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Gallery */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-50">
          <div className="aspect-[16/10] relative group">
            <img
              src={images[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white text-orange-500 border border-white"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white text-orange-500 border border-white"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
            {/* View count floating badge */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20 flex items-center gap-2">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              {product.rating || 5} · {(product.views || 0).toLocaleString('vi-VN')} lượt xem
            </div>
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="p-6 flex gap-4 overflow-x-auto no-scrollbar bg-gray-50/30">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-[1.25rem] overflow-hidden border-2 transition-all duration-300 ${activeImageIndex === idx ? 'border-orange-500 scale-105 shadow-xl' : 'border-white opacity-60 hover:opacity-100 shadow-sm'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 border border-gray-50">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-orange-100 uppercase tracking-widest border border-orange-400">
                Chính hãng
              </span>
              <span className="bg-blue-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-blue-100 uppercase tracking-widest border border-blue-400">
                {product.condition === 'new' ? 'Mới 100%' : 'Đã qua sử dụng'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.2] tracking-tight">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 py-4">
              <div className="flex flex-col">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">Giá ưu đãi</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-orange-600 font-black text-5xl tracking-tighter">
                    {ProductController.formatPrice(currentPrice)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-300 text-xl line-through decoration-gray-200">
                      {ProductController.formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-gray-100"></div>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">Đã giao dịch</p>
                <span className="text-2xl font-black text-gray-800">{product.totalSold || 0}+ sản phẩm</span>
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="py-8 border-t border-gray-100">
                <p className="text-sm font-black text-gray-900 mb-5 uppercase tracking-widest">Phân loại sản phẩm</p>
                <div className="flex flex-wrap gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-6 py-4 rounded-[1.25rem] border-2 transition-all duration-300 text-sm font-bold flex items-center gap-3 ${selectedVariant?.id === variant.id
                        ? 'border-orange-500 bg-orange-50/50 text-orange-600 shadow-xl shadow-orange-100'
                        : 'border-gray-100 hover:border-orange-200 text-gray-500 bg-white hover:bg-orange-50/20'
                        }`}
                    >
                      {selectedVariant?.id === variant.id && <CheckCircle2 size={18} />}
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="py-8 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex flex-col">
                  <p className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Số lượng</p>
                  <div className="flex items-center p-1.5 bg-gray-100 rounded-2xl w-fit">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-3 bg-white hover:bg-gray-50 text-gray-900 rounded-xl transition-all shadow-sm active:scale-90"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="w-16 text-center font-black text-gray-900 text-xl">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-3 bg-white hover:bg-gray-50 text-gray-900 rounded-xl transition-all shadow-sm active:scale-90"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 mt-auto">
                  <ProductActions
                    product={{ ...product, id: currentId, title: currentTitle, image: currentImage, price: currentPrice }}
                    variant="main"
                    quantity={quantity}
                    wishlistTargetId={selectedVariant?.id}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 pt-10 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-orange-500 rounded-full" />
                <h3 className="text-xl font-black text-gray-900">Chi tiết sản phẩm</h3>
              </div>
              <div className="text-gray-600 leading-[1.8] text-base whitespace-pre-line bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 shadow-inner">
                {product.description}
              </div>
            </div>

            <div className="mt-2 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
                <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                  <TicketPercent size={14} /> vouchers
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Áp dụng mã giảm GIAM30 và freeship khi thanh toán.</p>
              </div>
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
                <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                  <CreditCard size={14} /> payments
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Hỗ trợ COD, thẻ nội địa và ví điện tử phổ biến.</p>
              </div>
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
                <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                  <RefreshCcw size={14} /> returns
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Đổi trả trong 7 ngày với sản phẩm lỗi từ nhà bán.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side Sidebar */}
      <div className="space-y-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 border border-gray-50 lg:sticky lg:top-24">
          <div className="flex items-center gap-4 mb-8">
            <img src="../../Logochoviet.png" alt="Icon" className="w-20 h-20 object-contain" />
            <div>
              <p className="font-black text-gray-900 text-xl tracking-tight">{product.seller}</p>
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-black uppercase tracking-widest mt-1">
                <CheckCircle2 size={14} className="fill-green-600 text-white" />
                <span>Người bán uy tín</span>
              </div>
            </div>
          </div>

          <ProductActions
            product={{ ...product, id: currentId, title: currentTitle, image: currentImage, price: currentPrice }}
            variant="sidebar"
            quantity={quantity}
            wishlistTargetId={selectedVariant?.id}
          />

          <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
            <div className="flex flex-col items-center gap-1">
              <p className="text-xl font-black text-gray-900">4.9</p>
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Đánh giá</p>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-gray-100">
              <p className="text-xl font-black text-gray-900">98%</p>
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest text-center leading-none">Phản hồi</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-xl font-black text-gray-900">12</p>
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest text-center leading-none">Tin đăng</p>
            </div>
          </div>

          <button className="w-full mt-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all border border-gray-200 active:scale-95">
            Xem cửa hàng
          </button>
        </div>
      </div>
    </div>
  );
}
