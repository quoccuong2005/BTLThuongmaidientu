import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black">C</span>
              </div>
              <span className="font-black text-orange-500 text-lg">ChợViệt</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Website mua bán rao vặt hàng đầu, kết nối người mua và người bán trên toàn quốc.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">f</a>
              <a href="#" className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">Y</a>
              <a href="#" className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">ig</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-3">Danh mục</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {['Bất động sản', 'Xe cộ', 'Đồ điện tử', 'Thú cưng', 'Thời trang', 'Việc làm'].map(c => (
                <li key={c}><Link href={`/category/${c}`} className="hover:text-orange-500">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-3">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {['Trung tâm trợ giúp', 'Chính sách bảo mật', 'Điều khoản sử dụng', 'Liên hệ', 'Báo cáo vi phạm'].map(l => (
                <li key={l}><Link href="#" className="hover:text-orange-500">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-3">Tải ứng dụng</h4>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 bg-black text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-800">
                <span>🍎</span><span>App Store</span>
              </a>
              <a href="#" className="flex items-center gap-2 bg-black text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-800">
                <span>▶</span><span>Google Play</span>
              </a>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400">Hotline hỗ trợ:</p>
              <p className="font-bold text-orange-500">1900 6xxx</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400">© 2024 ChợViệt. Tất cả quyền được bảo lưu.</p>
          <p className="text-xs text-gray-400">Được phát triển với ❤️ tại Việt Nam</p>
        </div>
      </div>
    </footer>
  );
}
