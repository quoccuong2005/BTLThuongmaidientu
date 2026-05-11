'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell, MessageCircle, User, ChevronDown, MapPin, Menu, X, Plus, LogOut, ShoppingCart, ShoppingBag } from 'lucide-react';
import { LOCATIONS, POPULAR_SEARCHES } from '@/lib/db';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Toàn Quốc');
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { itemCount } = useCart();

  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center text-xs text-white">
          <span>Chào mừng đến với Chợ Việt!</span>
          <div className="flex gap-4">
            <Link href="/help" className="hover:underline">Trợ giúp</Link>
            <Link href="/about" className="hover:underline">Giới thiệu</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto ">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/Logochoviet.png" alt="Logo" width={120} height={120} />
          </Link>

          {/* Search bar */}
          <div className="flex-1 flex items-center border-2 border-orange-500 rounded-xl overflow-hidden bg-white max-w-3xl">
            {/* Location selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLocationDrop(!showLocationDrop)}
                className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-gray-700 border-r border-gray-200 whitespace-nowrap hover:bg-gray-50"
              >
                <MapPin size={14} className="text-orange-500" />
                <span className="max-w-[100px] truncate">{selectedLocation}</span>
                <ChevronDown size={12} />
              </button>
              {showLocationDrop && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[180px] py-1">
                  {LOCATIONS.map(loc => (
                    <button
                      key={loc}
                      onClick={() => { setSelectedLocation(loc); setShowLocationDrop(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${selectedLocation === loc ? 'text-orange-500 font-semibold bg-orange-50' : ''}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search input */}
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tất cả..."
              className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent"
              onKeyDown={e => e.key === 'Enter' && window.location.assign(`/search?q=${searchQuery}`)}
            />
            <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2.5 transition-colors">
              <Search size={18} className="text-white" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl hidden sm:flex">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="relative p-2 hover:bg-gray-100 rounded-xl hidden sm:flex">
              <MessageCircle size={20} className="text-gray-600" />
            </button>
            <Link href="/orders" className="relative p-2 hover:bg-gray-100 rounded-xl flex" title="Đơn hàng">
              <ShoppingBag size={20} className="text-gray-600" />
            </Link>
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-xl flex" title="Giỏ hàng">
              <ShoppingCart size={20} className="text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl group transition-colors">
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
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut size={20} />
                </button>
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
        </div>


      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button className="bg-orange-500 p-2">
              <Search size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
