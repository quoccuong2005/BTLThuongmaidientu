import Link from 'next/link';
import { Plus, Camera, Tag } from 'lucide-react';

export function QuickPostBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="text-xl font-bold mb-1">Bán đồ không dùng đến?</h3>
        <p className="text-orange-100 text-sm">Đăng tin miễn phí trong 60 giây. Hàng nghìn người mua đang chờ!</p>
        <div className="flex gap-4 mt-3 text-sm text-orange-100">
          <span className="flex items-center gap-1"><Camera size={14} /> Chụp ảnh</span>
          <span className="flex items-center gap-1"><Tag size={14} /> Đặt giá</span>
          <span className="flex items-center gap-1"><Plus size={14} /> Đăng tin</span>
        </div>
      </div>
      <Link href="/post" className="flex-shrink-0 bg-white text-orange-500 hover:bg-orange-50 font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg">
        <Plus size={18} />
        Đăng tin ngay
      </Link>
    </div>
  );
}
