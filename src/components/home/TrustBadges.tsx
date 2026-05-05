export function TrustBadges() {
  const badges = [
    { image: 'https://e7.pngegg.com/pngimages/439/850/png-clipart-computer-icons-safety-security-safety-miscellaneous-angle-thumbnail.png', title: 'Mua bán an toàn', desc: 'Giao dịch được bảo vệ' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq5PLxFsEnqpFv6-DHUim5rKJydu6TJwPvCg&s', title: 'Tin đã xác minh', desc: 'Người bán uy tín' },
    { image: 'https://img.favpng.com/13/19/18/chat-icon-png-favpng-VKinQiXDg2r36LkdNHRSUCeDr.jpg', title: 'Chat trực tiếp', desc: 'Liên hệ dễ dàng' },
    { image: 'https://png.pngtree.com/png-clipart/20230315/original/pngtree-news-vector-icon-design-illustration-png-image_8989607.png', title: 'Đăng tin miễn phí', desc: 'Nhanh chóng, đơn giản' },
  ];

  // Hàm kiểm tra xem có phải link ảnh không
  const isImageUrl = (str: string) => {
    return str.startsWith('http') || str.startsWith('/');
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {badges.map(b => (
        <div key={b.title} className="bg-white rounded-xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm">
          {/* Thêm w-10 h-10 và flex để icon/ảnh luôn căn giữa và đều nhau */}
          <span className="text-3xl flex-shrink-0 w-10 h-10 flex items-center justify-center">
            {isImageUrl(b.image) ? (
              <img 
                src={b.image} 
                alt={b.title} 
                className="w-8 h-8 object-contain" 
              />
            ) : (
              b.image
            )}
          </span>
          <div>
            <p className="font-semibold text-sm text-gray-800">{b.title}</p>
            <p className="text-xs text-gray-500">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
