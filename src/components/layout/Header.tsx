'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  ChevronDown,
  Cpu,
  LogOut,
  MapPin,
  Menu,
  Radar,
  Search,
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  Zap,
  X,
  Ticket
} from 'lucide-react';
import { LOCATIONS, POPULAR_SEARCHES } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import { CategoryController } from '@/controllers/CategoryController';
import { Category } from '@/models/Product';
import { BellIcon } from '@/components/notifications/BellIcon';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Toàn Quốc');
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { itemCount } = useCart();

  useEffect(() => {
    const syncUser = () => {
      const savedUser = localStorage.getItem('user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    syncUser();

    window.addEventListener('storage', syncUser);
    window.addEventListener('cho-viet-auth', syncUser);

    // Fetch categories
    CategoryController.getTopCategories(8).then(setCategories);

    const params = new URLSearchParams(window.location.search);
    const locationFromUrl = params.get('location');
    if (locationFromUrl) {
      setSelectedLocation(locationFromUrl);
    }

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('cho-viet-auth', syncUser);
    };
  }, []);

  const quickSearches = useMemo(() => POPULAR_SEARCHES.slice(0, 6), []);

  const handleSearch = (query: string) => {
    const finalQuery = query.trim();
    const params = new URLSearchParams();

    if (finalQuery) {
      params.set('q', finalQuery);
    }
    if (selectedLocation && selectedLocation !== 'Toàn Quốc') {
      params.set('location', selectedLocation);
    }

    const queryString = params.toString();
    window.location.assign(`/search${queryString ? `?${queryString}` : ''}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-[120] border-b border-orange-100 bg-white/90 backdrop-blur-xl">
      <div className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-1 text-[11px] font-semibold md:px-4">
          <span className="inline-flex items-center gap-1">
            <Radar size={12} className="text-orange-300" />
            Live commerce online - Freeship đơn từ 99K
          </span>
          <span className="hidden items-center gap-1 text-orange-200 sm:inline-flex">
            <Zap size={12} />
            Flash Sale mỗi ngày
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-2 md:px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex-shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
            <Image src="/Logochoviet.png" alt="ChoViet Commerce" width={92} height={44} className="h-11 w-auto object-contain" />
          </Link>

          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowLocationDrop(prev => !prev)}
              className="tap-bounce inline-flex min-h-11 items-center gap-1 rounded-xl border border-orange-100 bg-orange-50/80 px-3 text-sm font-semibold text-slate-700 hover:border-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <MapPin size={14} className="text-orange-500" />
              <span className="max-w-[90px] truncate">{selectedLocation}</span>
              <ChevronDown size={13} />
            </button>
            {showLocationDrop && (
              <div className="absolute left-0 top-full mt-1 min-w-[180px] rounded-xl border border-orange-100 bg-white py-1 shadow-lg shadow-orange-100/60">
                {LOCATIONS.map(loc => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationDrop(false);

                      const params = new URLSearchParams(window.location.search);
                      if (loc === 'Toàn Quốc') {
                        params.delete('location');
                      } else {
                        params.set('location', loc);
                      }
                      const queryString = params.toString();
                      window.location.assign(`${window.location.pathname}${queryString ? `?${queryString}` : ''}`);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-orange-50 ${selectedLocation === loc ? 'font-semibold text-orange-600' : 'text-slate-700'
                      }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex min-h-11 flex-1 items-center overflow-hidden rounded-xl border-2 border-orange-500 bg-white shadow-sm shadow-orange-100">
            <span className="hidden h-11 items-center border-r border-orange-100 px-3 text-orange-500 sm:inline-flex">
              <Cpu size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Tìm sản phẩm, thương hiệu..."
              className="h-11 flex-1 px-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              aria-label="Tìm kiếm sản phẩm"
              className="tap-bounce inline-flex h-11 min-w-11 items-center justify-center bg-orange-500 text-white hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <Search size={18} />
            </button>
          </div>

          <div className="hidden items-center gap-1 sm:flex">
            <Link
              href="/content"
              title="Goc tin tuc"
              className="tap-bounce inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-transparent text-slate-600 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <BookOpen size={20} />
            </Link>
            <Link
              href="/vouchers"
              title="Kho Voucher"
              className="tap-bounce inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-transparent text-slate-600 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Ticket size={20} />
            </Link>
            <Link
              href="/orders"
              title="Đơn hàng"
              className="tap-bounce inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-transparent text-slate-600 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <ShoppingBag size={20} />
            </Link>
            <Link
              href="/wishlist"
              title="Danh sách yêu thích"
              className="tap-bounce relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-transparent text-slate-600 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Heart size={20} />
            </Link>
            <BellIcon />
            <Link
              href="/cart"
              title="Giỏ hàng"
              className="tap-bounce relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-transparent text-slate-600 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-orange-500 px-1 text-center text-[10px] font-bold leading-4 text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold border border-orange-200 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs text-gray-400 leading-tight">Xin chào,</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[100px]">{user.name}</p>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 hidden md:block transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors mx-1 rounded-xl"
                  >
                    <User size={16} />
                    <span className="font-semibold">Tài khoản của tôi</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors mx-1 rounded-xl"
                  >
                    <ShoppingBag size={16} />
                    <span className="font-semibold">Đơn hàng</span>
                  </Link>
                  <div className="my-1 mx-3 border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors mx-1 rounded-xl font-semibold"
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <User size={20} className="text-gray-600" />
                <span className="text-sm font-medium hidden md:block">Đăng nhập</span>
              </Link>
            )}

            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-xl md:hidden">
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <button
            onClick={() => setShowMobileMenu(prev => !prev)}
            className="tap-bounce inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-orange-50 sm:hidden"
            aria-label="Mở menu di động"
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="tap-bounce tech-chip whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold hover:bg-orange-100 flex items-center gap-1.5"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {showMobileMenu && (
        <div className="border-t border-slate-200 bg-white px-3 pb-3 pt-2 sm:hidden">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/content" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700">
              Goc tin tuc
            </Link>
            <Link href="/vouchers" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700">
              Kho Voucher
            </Link>
            <Link href="/orders" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700">
              Đơn hàng của tôi
            </Link>
            <Link href="/cart" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700">
              Giỏ hàng ({itemCount})
            </Link>
            <Link href="/wishlist" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700">
              Danh sách yêu thích
            </Link>
            <Link href="/help" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700">
              Trợ giúp
            </Link>
            <Link href="/about" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700">
              Giới thiệu
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
