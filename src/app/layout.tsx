import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'ChoViet Commerce - Mua sắm trực tuyến',
  description: 'Sàn thương mại điện tử với ưu đãi mỗi ngày, mua sắm nhanh và trải nghiệm mobile-first.',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <CartProvider>
          <Toaster position="top-right" richColors />
          <Header />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
