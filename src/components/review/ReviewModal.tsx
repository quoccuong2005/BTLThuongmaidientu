'use client';
import { useState } from 'react';
import { Star, X, MessageSquare, Send } from 'lucide-react';
import { ReviewController } from '@/controllers/ReviewController';
import { toast } from 'sonner';

interface ReviewModalProps {
  orderItemId: number;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({ orderItemId, productName, onClose, onSuccess }: ReviewModalProps) {
  const [rate, setRate] = useState(5);
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [hoverRate, setHoverRate] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !content.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung đánh giá');
      return;
    }

    try {
      setIsSubmitting(true);
      await ReviewController.createReview({
        order_item_id: orderItemId,
        rate,
        headline,
        content
      });
      toast.success('Cảm ơn bạn đã gửi đánh giá!');
      onSuccess();
      onClose();
    } catch (error: any) {
      if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('Gửi đánh giá thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} className="text-orange-500" />
          </div>
          <h3 className="text-xl font-black text-gray-900">Đánh giá sản phẩm</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-1">{productName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mức độ hài lòng</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRate(star)}
                  onMouseLeave={() => setHoverRate(0)}
                  onClick={() => setRate(star)}
                  className="p-1 transition-transform active:scale-90"
                >
                  <Star
                    size={36}
                    className={`transition-colors ${
                      star <= (hoverRate || rate)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-100'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-orange-500">
              {rate === 5 ? 'Tuyệt vời' : rate === 4 ? 'Hài lòng' : rate === 3 ? 'Bình thường' : rate === 2 ? 'Không hài lòng' : 'Rất tệ'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Tiêu đề đánh giá</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ví dụ: Sản phẩm rất tốt, Giao hàng nhanh..."
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Nội dung chi tiết</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ trải nghiệm thực tế của bạn về sản phẩm này..."
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all resize-none"
                rows={4}
                required
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-4 px-4 rounded-2xl border border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-4 px-4 rounded-2xl bg-orange-500 font-bold text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={18} />
                  Gửi đánh giá
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
