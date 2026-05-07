import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import AdminWrapper from '@/components/layout/AdminWrapper'; // Đảm bảo file này đã tồn tại

export const metadata: Metadata = {
  title: 'Chợ Việt - Website Mua Bán Rao Vặt Trực Tuyến',
  description: 'Mua bán, trao đổi đồ cũ mới. Xe cộ, bất động sản, điện tử, thú cưng và nhiều hơn nữa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        {/* Truyền Component vào dưới dạng thẻ JSX vào trong Props */}
        <AdminWrapper header={<Header />} footer={<Footer />}>
          {children}
        </AdminWrapper>
      </body>
    </html>
  );
}