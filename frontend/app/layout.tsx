import type { Metadata } from 'next';
import './globals.css';
import { NavbarSticky } from '@/components/common/navbar-sticky';
import { Footer } from '@/components/common/footer';
import { GlobalNotification } from '@/components/common/global-notification';

export const metadata: Metadata = {
  title: 'Bookong | Đặt phòng lưu trú & Biệt thự cao cấp',
  description: 'Trải nghiệm tìm kiếm và đặt phòng nghỉ dưỡng hàng đầu phong cách Airbnb & Booking.com.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-white text-main antialiased selection:bg-rausch selection:text-white">
        <GlobalNotification />
        <NavbarSticky />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
