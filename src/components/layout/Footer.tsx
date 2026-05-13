import Link from 'next/link';
import { Apple, Cpu, PlayCircle, Radar, ShieldCheck, Truck, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="tech-shell mt-10 overflow-hidden border-t border-orange-200 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {[
            { icon: Radar, title: 'Live deal engine', desc: 'Theo dõi ưu đãi và voucher theo thời gian thực' },
            { icon: ShieldCheck, title: 'Secure checkout', desc: 'Thanh toán an toàn, chính sách đổi trả rõ ràng' },
            { icon: Truck, title: 'Smart delivery', desc: 'Giao nhanh, cập nhật trạng thái đơn liên tục' },
          ].map(item => (
            <div key={item.title} className="tech-glass rounded-2xl p-4">
              <item.icon className="h-5 w-5 text-orange-200" />
              <p className="mt-2 text-sm font-bold">{item.title}</p>
              <p className="mt-1 text-xs text-orange-100/85">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="tech-glass w-9 h-9 rounded-lg flex items-center justify-center">
                <Cpu className="h-5 w-5 text-orange-200" />
              </div>
              <span className="font-black text-white text-lg">ChoViet Commerce</span>
            </div>
            <p className="text-sm text-orange-100/85 leading-relaxed">
              Nền tảng mua sắm trực tuyến phong cách high-tech commerce, tối ưu cho trải nghiệm mobile-first và chuyển đổi.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="tech-glass w-8 h-8 rounded-lg text-white text-xs font-bold flex items-center justify-center">f</a>
              <a href="#" className="tech-glass w-8 h-8 rounded-lg text-white text-xs font-bold flex items-center justify-center">Y</a>
              <a href="#" className="tech-glass w-8 h-8 rounded-lg text-white text-xs font-bold flex items-center justify-center">ig</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Ngành hàng</h4>
            <ul className="space-y-2 text-sm text-orange-100/85">
              {['Bất động sản', 'Xe cộ', 'Đồ điện tử', 'Thú cưng', 'Thời trang', 'Việc làm'].map(c => (
                <li key={c}><Link href={`/category/${c}`} className="hover:text-orange-200">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-orange-100/85">
              {['Trung tâm trợ giúp', 'Chính sách bảo mật', 'Điều khoản sử dụng', 'Liên hệ', 'Báo cáo vi phạm'].map(l => (
                <li key={l}><Link href="#" className="hover:text-orange-200">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Tải ứng dụng</h4>
            <div className="space-y-2">
              <a href="#" className="tech-glass flex items-center gap-2 text-white text-xs px-3 py-2 rounded-lg hover:bg-white/20">
                <Apple size={14} />
                <span>App Store</span>
              </a>
              <a href="#" className="tech-glass flex items-center gap-2 text-white text-xs px-3 py-2 rounded-lg hover:bg-white/20">
                <PlayCircle size={14} />
                <span>Google Play</span>
              </a>
            </div>
            <div className="mt-4">
              <p className="inline-flex items-center gap-1 text-xs text-orange-100/80">
                <Zap size={12} /> Hotline hỗ trợ
              </p>
              <p className="font-bold text-orange-200">1900 6xxx</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-orange-100/70">© 2026 ChoViet Commerce. Tất cả quyền được bảo lưu.</p>
          <p className="text-xs text-orange-100/70">High-tech commerce theme lưu tại `design-system/MASTER.md`</p>
        </div>
      </div>
    </footer>
  );
}
