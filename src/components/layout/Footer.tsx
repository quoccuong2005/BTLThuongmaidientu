import Link from 'next/link';
import { Apple, Cpu, PlayCircle, Radar, ShieldCheck, Truck, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-orange-200 text-white">
      {/* Background Image */}
      <img
        src="/Footer-bg.png"
        alt="Footer Background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#FB6A01]/85" />

      {/* Glow */}
      <div className="absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-red-500/20 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {[
            { icon: Radar, title: 'Live deal engine', desc: 'Theo dõi ưu đãi và voucher theo thời gian thực' },
            { icon: ShieldCheck, title: 'Secure checkout', desc: 'Thanh toán an toàn, chính sách đổi trả rõ ràng' },
            { icon: Truck, title: 'Smart delivery', desc: 'Giao nhanh, cập nhật trạng thái đơn liên tục' },
          ].map(item => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl"
            >
              <item.icon className="h-5 w-5 text-orange-100" />

              <p className="mt-2 text-sm font-bold text-white">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-white/75">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 backdrop-blur-xl">
                <img src="./Logochoviet.png" alt="ChoViet Commerce" />
              </div>

              <span className="text-lg font-black text-white">
                ChoViet Commerce
              </span>
            </div>

            <p className="text-sm leading-relaxed text-white/80">
              Nền tảng mua sắm trực tuyến phong cách high-tech commerce, tối ưu cho trải nghiệm mobile-first và chuyển đổi.
            </p>

            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-xs font-bold text-white backdrop-blur-xl"
              >
                f
              </a>

              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-xs font-bold text-white backdrop-blur-xl"
              >
                Y
              </a>

              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-xs font-bold text-white backdrop-blur-xl"
              >
                ig
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-white">
              Ngành hàng
            </h4>

            <ul className="space-y-2 text-sm text-white/75">
              {['Bất động sản', 'Xe cộ', 'Đồ điện tử', 'Thú cưng', 'Thời trang', 'Việc làm'].map(c => (
                <li key={c}>
                  <Link
                    href={`/category/${c}`}
                    className="transition hover:text-orange-100"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-white">
              Hỗ trợ
            </h4>

            <ul className="space-y-2 text-sm text-white/75">
              {['Trung tâm trợ giúp', 'Chính sách bảo mật', 'Điều khoản sử dụng', 'Liên hệ', 'Báo cáo vi phạm'].map(l => (
                <li key={l}>
                  <Link
                    href="#"
                    className="transition hover:text-orange-100"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-white">
              Tải ứng dụng
            </h4>

            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-xl transition hover:bg-white/20"
              >
                <Apple size={14} />
                <span>App Store</span>
              </a>

              <a
                href="#"
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-xl transition hover:bg-white/20"
              >
                <PlayCircle size={14} />
                <span>Google Play</span>
              </a>
            </div>

            <div className="mt-4">
              <p className="inline-flex items-center gap-1 text-xs text-white/75">
                <Zap size={12} />
                Hotline hỗ trợ
              </p>

              <p className="font-bold text-orange-100">
                1900 6xxx
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-xs text-white/60">
            © 2026 ChoViet Commerce. Tất cả quyền được bảo lưu.
          </p>

          <p className="text-xs text-white/60">
            High-tech commerce theme lưu tại `design-system/MASTER.md`
          </p>
        </div>
      </div>
    </footer>
  );
}
