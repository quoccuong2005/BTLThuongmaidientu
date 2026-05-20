import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { NotificationProvider } from '@/context/NotificationContext';

const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'ChoViet Commerce - Mua sắm trực tuyến',
  description: 'Sàn thương mại điện tử với ưu đãi mỗi ngày, mua sắm nhanh và trải nghiệm mobile-first.',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={roboto.variable}>
      <body className={roboto.className}>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              <Toaster position="top-right" richColors />
              <Header />
              <main className="min-h-screen pb-20 md:pb-0">{children}</main>
              <Footer />
              <MobileBottomNav />
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
