'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/host') || pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-gray-600 text-xs">
      <div className="booking-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Hỗ trợ 24/7</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:underline">Trung tâm trợ giúp</Link></li>
              <li><Link href="#" className="hover:underline">Chính sách hủy phòng</Link></li>
              <li><Link href="#" className="hover:underline">Quản lý đơn đặt phòng</Link></li>
              <li><Link href="#" className="hover:underline">Dịch vụ khách hàng</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Khám phá</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:underline">Khách sạn tại Phú Quốc</Link></li>
              <li><Link href="#" className="hover:underline">Resort cao cấp Đà Nẵng</Link></li>
              <li><Link href="#" className="hover:underline">Homestay Đà Lạt</Link></li>
              <li><Link href="#" className="hover:underline">Biệt thự ven biển</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Dành cho Đối tác</h4>
            <ul className="space-y-2">
              <li><Link href="/host/dashboard" className="hover:underline text-booking-blue font-semibold">Đăng ký cho thuê nhà / Khách sạn</Link></li>
              <li><Link href="#" className="hover:underline">Trang tổng quan Chủ nhà</Link></li>
              <li><Link href="#" className="hover:underline">Cấu hình Dynamic Pricing</Link></li>
              <li><Link href="#" className="hover:underline">Điều khoản đối tác</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Về Bookong.com</h4>
            <p className="text-gray-500 leading-relaxed mb-3">
              Bookong Engine Platform - Nền tảng đặt phòng lưu trú hàng đầu tích hợp công nghệ AI Vector Search và Dynamic Pricing.
            </p>
            <p className="font-semibold text-gray-700">© 2026 Bookong.com. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
