import Link from 'next/link';
import { Plus, PackageCheck, Store, Tag } from 'lucide-react';

export function QuickPostBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="text-xl font-bold mb-1">Mở gian hàng và bán sản phẩm ngay</h3>
        <p className="text-orange-100 text-sm">Đăng sản phẩm nhanh, nhận đơn sớm với bộ công cụ bán hàng tối ưu.</p>
        <div className="flex gap-4 mt-3 text-sm text-orange-100">
          <span className="flex items-center gap-1"><Store size={14} /> Tạo gian hàng</span>
          <span className="flex items-center gap-1"><Tag size={14} /> Thiết lập giá</span>
          <span className="flex items-center gap-1"><PackageCheck size={14} /> Quản lý đơn</span>
        </div>
      </div>
      <Link href="/post" className="flex-shrink-0 bg-white text-orange-500 hover:bg-orange-50 font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg">
        <Plus size={18} />
        Đăng sản phẩm
      </Link>
    </div>
  );
}
