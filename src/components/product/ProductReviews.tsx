'use client';
import { useEffect, useState } from 'react';
import { ReviewController } from '@/controllers/ReviewController';
import { Review } from '@/models/Review';
import { Star, MessageCircle, User, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ProductReviewsProps {
  productLineId: number;
}

export function ProductReviews({ productLineId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [rate, setRate] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await ReviewController.getProductLineReviews(productLineId, page, 10, rate);

      if (data && Array.isArray(data.data)) {
        setReviews(data.data);
        setTotal(data.total || data.data.length);
      } else {

        const resultData = Array.isArray(data) ? data : (data?.data || data?.items || []);
        setReviews(resultData);
        setTotal(data?.total || resultData.length || 0);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productLineId, page, rate]);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
        Đánh giá từ khách hàng ({total})
      </h3>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => { setRate(undefined); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${rate === undefined ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
        >
          Tất cả
        </button>
        {[5, 4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => { setRate(r); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${rate === r ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            {r} <Star size={14} className={rate === r ? "fill-white" : "fill-gray-400 text-gray-400"} />
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm">Đang tải đánh giá...</p>
        </div>
      ) : reviews?.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-gray-200" />
          </div>
          <p className="text-gray-500 font-medium">Chưa có đánh giá nào cho sản phẩm này.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((item, idx) => {
            // Handle Mongoose wrapper if present (_doc)
            const review = item._doc || item;
            return (
              <div key={review._id?.toString() || review.id || idx} className="border-b border-gray-50 pb-8 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-gray-900">{review.user_name || 'Khách hàng'}</p>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {new Date(review.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rate ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{review.headline}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.content}</p>

                    {/* Replies */}
                    {review.replies && review.replies.length > 0 && (
                      <div className="space-y-3">
                        {review.replies.map((reply: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-2xl border-l-4 border-orange-500">
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Phản hồi từ Chợ Việt
                            </p>
                            <p className="text-gray-700 text-sm">{reply.content}</p>
                            <p className="text-[9px] text-gray-400 mt-2">
                              {new Date(reply.created_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {total > 10 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
                className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-bold text-gray-900">Trang {page} / {Math.ceil(total / 10)}</span>
              <button
                disabled={page >= Math.ceil(total / 10)}
                onClick={() => setPage(prev => prev + 1)}
                className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
