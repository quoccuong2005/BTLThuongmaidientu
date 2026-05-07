import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lính gác CHỈ canh gác các khu vực bắt đầu bằng /admin
  if (pathname.startsWith('/admin')) {
    
    // Yêu cầu xuất trình thẻ bài (Cookie)
    const token = request.cookies.get('admin_token')?.value;

    // Nếu không có thẻ bài -> Bắt quay về trang Login dùng chung (/login)
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], 
};