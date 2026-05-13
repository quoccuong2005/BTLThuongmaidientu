'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bell,
  ChevronDown,
  Cpu,
  LogOut,
  MapPin,
  Menu,
  Radar,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  Zap,
  X,
} from 'lucide-react';
import { LOCATIONS, POPULAR_SEARCHES } from '@/lib/db';
import { useCart } from '@/context/CartContext';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Toàn Quốc');
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { itemCount } = useCart();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const quickSearches = useMemo(() => POPULAR_SEARCHES.slice(0, 6), []);

  const handleSearch = (query: string) => {
    const finalQuery = query.trim();
    if (!finalQuery) {
      window.location.assign('/search');
      return;
    }
    window.location.assign(`/search?q=${encodeURIComponent(finalQuery)}`);
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
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-orange-50 ${
                      selectedLocation === loc ? 'font-semibold text-orange-600' : 'text-slate-700'
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
              href="/orders"
              title="Đơn hàng"
              className="tap-bounce inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-transparent text-slate-600 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <ShoppingBag size={20} />
            </Link>
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
            <button
              className="tap-bounce inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-transparent text-slate-600 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label="Thông báo"
            >
              <Bell size={20} />
            </button>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="tap-bounce hidden min-h-11 items-center gap-1 rounded-xl border border-transparent px-2 text-sm font-semibold text-slate-700 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600 sm:inline-flex"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          ) : (
            <Link
              href="/login"
              className="tap-bounce hidden min-h-11 items-center gap-1 rounded-xl border border-transparent px-2 text-sm font-semibold text-slate-700 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600 sm:inline-flex"
            >
              <User size={18} />
              Đăng nhập
            </Link>
          )}

          <button
            onClick={() => setShowMobileMenu(prev => !prev)}
            className="tap-bounce inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-orange-50 sm:hidden"
            aria-label="Mở menu di động"
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {quickSearches.map(keyword => (
            <button
              key={keyword}
              onClick={() => handleSearch(keyword)}
              className="tap-bounce tech-chip whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold hover:bg-orange-100"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

      {showMobileMenu && (
        <div className="border-t border-slate-200 bg-white px-3 pb-3 pt-2 sm:hidden">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/orders" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700">
              Đơn hàng của tôi
            </Link>
            <Link href="/cart" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700">
              Giỏ hàng ({itemCount})
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
