import { BadgeCheck, ShieldCheck, Truck, WalletCards } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, title: 'Mua sắm an toàn', desc: 'Đơn hàng được bảo vệ toàn trình' },
    { icon: BadgeCheck, title: 'Gian hàng xác minh', desc: 'Ưu tiên thương hiệu uy tín' },
    { icon: Truck, title: 'Giao nhanh toàn quốc', desc: 'Theo dõi vận chuyển theo thời gian thực' },
    { icon: WalletCards, title: 'Thanh toán linh hoạt', desc: 'Đa dạng phương thức, dễ sử dụng' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {badges.map(b => (
        <div key={b.title} className="bg-white rounded-xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm">
          <b.icon className="w-6 h-6 text-orange-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm text-gray-800">{b.title}</p>
            <p className="text-xs text-gray-500">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
