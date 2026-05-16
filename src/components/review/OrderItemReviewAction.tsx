'use client';
import { useEffect, useState } from 'react';
import { ReviewController } from '@/controllers/ReviewController';
import { Review } from '@/models/Review';
import { Star, MessageSquare } from 'lucide-react';
import { ReviewModal } from './ReviewModal';

interface OrderItemReviewActionProps {
  orderItemId: number;
  productName: string;
  orderStatus: string;
}

export function OrderItemReviewAction({ orderItemId, productName, orderStatus }: OrderItemReviewActionProps) {
  const [reviewStatus, setReviewStatus] = useState<{ exists: boolean; feedback?: Review } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const canReview = orderStatus === 'delivered' || orderStatus === 'completed';

  useEffect(() => {
    const checkStatus = async () => {
      if (!canReview) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await ReviewController.checkReviewStatus(orderItemId);
        setReviewStatus(data);
      } catch (error) {
        console.error('Failed to check review status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, [orderItemId, canReview]);

  if (!canReview || isLoading) return null;

  if (reviewStatus?.exists) {
    return (
      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
          <Star size={12} className="fill-green-600" />
          Đã đánh giá {reviewStatus.feedback?.rate}/5
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="text-[10px] font-black uppercase text-gray-400 hover:text-orange-500 tracking-widest transition-colors"
        >
          Xem đánh giá
        </button>

        {showModal && reviewStatus.feedback && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
             <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl relative animate-in zoom-in-95 duration-200">
                <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                  <Star size={20} />
                </button>
                <div className="text-center mb-4">
                   <div className="flex justify-center gap-0.5 mb-2">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={16} className={i < reviewStatus.feedback!.rate ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                     ))}
                   </div>
                   <h4 className="font-bold text-gray-900">{reviewStatus.feedback.headline}</h4>
                </div>
                <p className="text-sm text-gray-600 italic bg-gray-50 p-4 rounded-2xl">"{reviewStatus.feedback.content}"</p>
                <button onClick={() => setShowModal(false)} className="w-full mt-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">Đóng</button>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 pt-3 border-t border-gray-50">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition-all active:scale-95"
        >
          <MessageSquare size={14} />
          Viết đánh giá
        </button>
      </div>

      {showModal && (
        <ReviewModal
          orderItemId={orderItemId}
          productName={productName}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            // Refresh status
            ReviewController.checkReviewStatus(orderItemId).then(setReviewStatus);
          }}
        />
      )}
    </>
  );
}
