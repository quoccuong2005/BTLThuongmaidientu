import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Chợ Việt - Website Mua Bán Rao Vặt Trực Tuyến',
  description: 'Mua bán, trao đổi đồ cũ mới. Xe cộ, bất động sản, điện tử, thú cưng và nhiều hơn nữa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <CartProvider>
          <Toaster position="top-right" richColors />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
