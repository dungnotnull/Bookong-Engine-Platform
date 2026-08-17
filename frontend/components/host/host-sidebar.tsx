'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, BedDouble, CalendarRange, CalendarDays, Ticket, LogOut, Home, User } from 'lucide-react';
import { useAuthStore } from '@/stores/use-auth-store';

export function HostSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Tổng quan Dashboard', href: '/host/dashboard', icon: LayoutDashboard },
    { label: 'Danh sách Khách sạn', href: '/host/properties', icon: Building2 },
    { label: 'Quản lý Loại phòng', href: '/host/rooms', icon: BedDouble },
    { label: 'Đơn đặt phòng khách', href: '/host/bookings', icon: CalendarDays },
    { label: 'Cấu hình Dynamic Pricing', href: '/host/dynamic-pricing', icon: CalendarRange },
    { label: 'Quản lý Mã giảm giá', href: '/host/coupons', icon: Ticket },
  ];

  const displayName = isMounted && user ? (user.fullName || user.email || 'Host Account') : 'Host Account';
  const displayEmail = isMounted && user ? (user.email || 'host@bookong.vn') : 'host@bookong.vn';
  const avatarInitial = isMounted && user ? (displayName[0]?.toUpperCase() || 'H') : 'H';

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-booking-navy px-3">
            Host Management
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
      </div>

      {/* Bottom Account & Logout Section for Host UX (Fix Hydration Mismatch for BUG-015) */}
      <div className="pt-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-booking-blue text-white flex items-center justify-center text-xs font-extrabold shrink-0">
            {avatarInitial || <User className="w-4 h-4" />}
          </div>
          <div className="truncate text-left">
            <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
            <p className="text-[10px] text-gray-500 font-semibold truncate">{displayEmail}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors w-full"
          >
            <Home className="w-4 h-4 text-booking-navy" />
            <span>Trang chủ Bookong</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất tài khoản</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
