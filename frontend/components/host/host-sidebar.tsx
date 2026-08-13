'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, BedDouble, CalendarRange, CalendarDays } from 'lucide-react';

export function HostSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Tổng quan Dashboard', href: '/host/dashboard', icon: LayoutDashboard },
    { label: 'Danh sách Khách sạn', href: '/host/properties', icon: Building2 },
    { label: 'Quản lý Loại phòng', href: '/host/rooms', icon: BedDouble },
    { label: 'Đơn đặt phòng khách', href: '/host/bookings', icon: CalendarDays },
    { label: 'Cấu hình Dynamic Pricing', href: '/host/dynamic-pricing', icon: CalendarRange },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-60px)] p-4 space-y-6 shrink-0">
      <div>
        <span className="text-[11px] font-black uppercase tracking-wider text-booking-navy px-3">
          Host Portal Management
        </span>
        <nav className="mt-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-smooth ${
                  isActive
                    ? 'bg-booking-navy text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-booking-yellow' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs">
        <h4 className="font-bold text-booking-navy">Tối ưu Doanh thu</h4>
        <p className="text-gray-600 text-[11px] mt-1">
          Thiết lập phụ phí mùa lễ và cuối tuần trong mục Dynamic Pricing để tăng tỉ lệ lấp đầy.
        </p>
      </div>
    </aside>
  );
}
