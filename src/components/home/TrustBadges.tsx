export function TrustBadges() {
  const badges = [
    { icon: '🛡️', title: 'Mua bán an toàn', desc: 'Giao dịch được bảo vệ' },
    { icon: '✅', title: 'Tin đã xác minh', desc: 'Người bán uy tín' },
    { icon: '💬', title: 'Chat trực tiếp', desc: 'Liên hệ dễ dàng' },
    { icon: '🚀', title: 'Đăng tin miễn phí', desc: 'Nhanh chóng, đơn giản' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {badges.map(b => (
        <div key={b.title} className="bg-white rounded-xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm">
          <span className="text-3xl flex-shrink-0">{b.icon}</span>
          <div>
            <p className="font-semibold text-sm text-gray-800">{b.title}</p>
            <p className="text-xs text-gray-500">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
