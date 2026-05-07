'use client';

import { usePathname } from 'next/navigation';

interface AdminWrapperProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export default function AdminWrapper({ children, header, footer }: AdminWrapperProps) {
  const pathname = usePathname();
  
  // Kiểm tra nếu đường dẫn bắt đầu bằng /admin
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    // Nếu là trang admin, chỉ trả về nội dung trang đó (không kèm Header/Footer khách)
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="min-h-screen">{children}</main>
      {footer}
    </>
  );
}