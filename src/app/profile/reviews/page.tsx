'use client';
import { useEffect, useState } from 'react';
import { ReviewController } from '@/controllers/ReviewController';
import { ProductController } from '@/controllers/ProductController';
import { Review } from '@/models/Review';
import { Star, ArrowLeft, MessageSquare, Package, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await ReviewController.getMyReviews();

        // Enrich reviews with product info if missing
        if (Array.isArray(data) && data.length > 0) {
          const enrichedReviews = await Promise.all(data.map(async (review: any) => {
            // If already has name/image, skip fetching
            if (review.product_name && review.product_image) return review;

            // Get product_line_id from various possible fields
            const pId = review.product_line_id || review.product_id;
            if (pId) {
              try {
                const product = await ProductController.getProductById(String(pId));
                if (product) {
                  return {
                    ...review,
                    product_name: product.title,
                    product_image: product.image,
                    product_line_id: pId // Ensure this is set for linking
                  };
                }
              } catch (err) {
                console.error(`Failed to fetch product info for ${pId}`, err);
              }
            }
            return review;
          }));
          setReviews(enrichedReviews);
        } else {
          setReviews(data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tải đánh giá của bạn...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Đánh giá của tôi</h1>
          <p className="text-gray-500 mt-1">Lịch sử đánh giá sản phẩm của bạn</p>
        </div>
        <Link href="/profile" className="text-orange-500 font-bold flex items-center gap-1 hover:underline">
          <ArrowLeft size={16} /> Quay lại trang cá nhân
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star size={40} className="text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Bạn chưa có đánh giá nào</h3>
          <p className="text-gray-500 mb-8">Hãy mua sắm và chia sẻ trải nghiệm của bạn với cộng đồng nhé!</p>
          <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all inline-block shadow-lg shadow-orange-100">
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.isArray(reviews) && reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Info */}
                <Link
                  href={`/product/${review.product_line_id || review.product_id}`}
                  className="w-full md:w-48 flex-shrink-0 group"
                >
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 mb-3 group-hover:border-orange-200 transition-colors">
                    {review.product_image ? (
                      <img src={review.product_image} alt={review.product_name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <Package size={40} />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {review.product_name || `Sản phẩm #${review.product_id}`}
                  </p>
                </Link>

                {/* Review Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={i < review.rate ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <Calendar size={12} />
                      {new Date(review.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{review.headline}</h4>
                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-50/30">
                      <p className="text-gray-700 text-sm italic leading-relaxed">"{review.content}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
