'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Tags, ShieldAlert, KeyRound, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); // Thêm hook useRouter để chuyển hướng
  
  // Kiểm tra xem có phải đang ở trang đăng nhập không
  const isLoginPage = pathname === '/admin/login';

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi Admin?')) {
      // 1. Xóa thẻ bài trong localStorage
      localStorage.removeItem('admin_token');
      
      // 2. Xóa thẻ bài trong Cookie bằng cách cài đặt ngày hết hạn về quá khứ
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // 3. Đá về trang chủ giao diện user
      router.push('/');
    }
  };

  // Nếu là trang đăng nhập -> Trả về form đăng nhập trơ trọi (không sidebar)
  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Nếu là các trang quản trị khác -> Hiện Sidebar bình thường
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <span className="text-2xl font-black text-orange-500">ChợTốt Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
            <LayoutDashboard size={20} /> Tổng quan
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
            <Tags size={20} /> Quản lý danh mục
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
            <Package size={20} /> Dòng Sản phẩm
          </Link>
          
          <div className="pt-4 pb-2">
            <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Phân quyền Hệ thống</span>
          </div>
          <Link href="/admin/roles" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
            <ShieldAlert size={20} /> Vai trò (Roles)
          </Link>
          <Link href="/admin/permissions" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
            <KeyRound size={20} /> Quyền (Permissions)
          </Link>
        </nav>

        {/* Nút Đăng xuất ở cuối Sidebar */}
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