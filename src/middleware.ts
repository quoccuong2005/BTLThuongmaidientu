import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Kiểm tra xem người dùng có đang cố gắng vào khu vực quản trị (/admin) không
  if (pathname.startsWith('/admin')) {
    
    // Lấy thẻ bài (token) từ Cookie (đã được tạo ra ở hàm handleLogin lúc nãy)
    const token = request.cookies.get('admin_token')?.value;

    // 2. Nếu KHÔNG có thẻ bài (chưa đăng nhập hoặc thẻ bài giả đã bị xóa)
    if (!token) {
      // "Đá" người dùng về lại trang đăng nhập
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Nếu có thẻ bài hợp lệ, hoặc đang ở các trang không cần bảo vệ (như trang chủ, trang đăng nhập) thì cho đi tiếp
  return NextResponse.next();
}

// Tối ưu hóa: Khai báo cho Next.js biết Middleware này CHỈ cần chạy khi vào thư mục /admin
// Giúp web chạy nhanh hơn, không bị lag khi load hình ảnh, CSS...
export const config = {
  matcher: ['/admin/:path*'],
};