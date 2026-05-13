'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navItems = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/search', label: 'Danh mục', icon: LayoutGrid },
  { href: '/cart', label: 'Giỏ hàng', icon: ShoppingCart },
  { href: '/profile', label: 'Tài khoản', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-[200] border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`tap-bounce relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
                isActive ? 'text-orange-600' : 'text-slate-500'
              }`}
            >
              <Icon size={18} />
              {item.href === '/cart' && itemCount > 0 && (
                <span className="absolute top-2 right-7 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] leading-4 text-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
