'use client';
import { useState } from 'react';
import { Product, ProductVariant } from '@/models/Product';
import { ProductController } from '@/controllers/ProductController';
import { ProductActions } from './ProductActions';
import { Star, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product.variants?.[0] || null);
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left: images + details */}
      <div className="lg:col-span-2 space-y-4">
        {/* Gallery */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          <div className="aspect-[4/3] relative group">
            <img
              src={images[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-orange-500 scale-95' : 'border-transparent opacity-60'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2 py-1 rounded-lg">CHÍNH HÃNG</span>
              <div className="flex items-center gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'} />
                ))}
                <span className="text-xs text-gray-400 ml-1">({product.views} lượt xem)</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-orange-500 font-black text-4xl">
                  {ProductController.formatPrice(currentPrice)}
                </span>
              </div>
              <div className="h-10 w-px bg-gray-100"></div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Đã bán</span>
                <span className="font-bold text-gray-800">{product.totalSold || 0}+</span>
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="py-6 border-t border-gray-50">
                <p className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Chọn phiên bản</p>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-3 rounded-2xl border-2 transition-all text-sm font-semibold flex items-center gap-2 ${selectedVariant?.id === variant.id
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-100 hover:border-gray-200 text-gray-600'
                        }`}
                    >
                      {selectedVariant?.id === variant.id && <CheckCircle2 size={16} />}
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="py-6 border-t border-gray-50">
              <p className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Số lượng</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-3 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="w-12 text-center font-black text-gray-900 text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-3 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <span className="text-xs text-gray-400 font-medium">Sản phẩm có sẵn</span>
              </div>
            </div>

            <ProductActions 
              product={{ ...product, id: currentId, title: currentTitle, image: currentImage, price: currentPrice }} 
              variant="main" 
              quantity={quantity} 
            />

            {/* Description */}
            <div className="mt-4 pt-6 border-t border-gray-50">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Mô tả sản phẩm</h3>
              <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-line bg-gray-50/50 p-4 rounded-2xl">
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side remains mostly the same but could be improved */}
      <div className="space-y-4">
        <div className="bg-white rounded-3xl shadow-sm p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {product.seller.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{product.seller}</p>
              <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                <CheckCircle2 size={12} />
                <span>Đã xác minh tài khoản</span>
              </div>
            </div>
          </div>

          <ProductActions 
            product={{ ...product, id: currentId, title: currentTitle, image: currentImage, price: currentPrice }} 
            variant="sidebar" 
            quantity={quantity} 
          />

          <div className="mt-8 grid grid-cols-3 gap-2">
            <div className="p-3 bg-gray-50 rounded-2xl text-center">
              <p className="font-black text-gray-900">4.9</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Đánh giá</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl text-center">
              <p className="font-black text-gray-900">98%</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Phản hồi</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl text-center">
              <p className="font-black text-gray-900">12</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Tin đăng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
