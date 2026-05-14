'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
// 1. THÊM ICON TICKET VÀO ĐÂY
import { LayoutDashboard, Package, Tags, ShieldAlert, KeyRound, LogOut, ShoppingCart, Ticket } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); 
  
  const isLoginPage = pathname === '/admin/login';

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi Admin?')) {
      localStorage.removeItem('admin_token');
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/');
    }
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <span className="text-2xl font-black text-orange-500">ChợTốt Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === '/admin' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>
            <LayoutDashboard size={20} /> Tổng quan
          </Link>
          <Link href="/admin/categories" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === '/admin/categories' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>
            <Tags size={20} /> Quản lý danh mục
          </Link>
          <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname.startsWith('/admin/products') ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>
            <Package size={20} /> Dòng Sản phẩm
          </Link>

          {/* 2. ĐƯỜNG DẪN QUẢN LÝ VOUCHER (Thêm vào dưới Sản phẩm) */}
          <Link href="/admin/vouchers" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === '/admin/vouchers' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>
            <Ticket size={20} /> Quản lý Voucher
          </Link>

          <Link href="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === '/admin/orders' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>
            <ShoppingCart size={20} /> Đơn hàng
          </Link>
          
          <div className="pt-4 pb-2">
            <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Phân quyền Hệ thống</span>
          </div>
          <Link href="/admin/roles" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === '/admin/roles' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>
            <ShieldAlert size={20} /> Vai trò (Roles)
          </Link>
          <Link href="/admin/permissions" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === '/admin/permissions' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>
            <KeyRound size={20} /> Quyền (Permissions)
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}