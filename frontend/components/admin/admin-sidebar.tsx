'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Users, LogOut, Home, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/stores/use-auth-store';

export function AdminSidebar() {
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
    { label: 'Tổng quan Analytics', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Phê duyệt Khách sạn', href: '/admin/hotels-approval', icon: CheckSquare },
    { label: 'Quản lý Người dùng & Admin', href: '/admin/users', icon: Users },
  ];

  const displayName = isMounted && user ? (user.fullName || user.email || 'Admin') : 'Admin Account';
  const displayEmail = isMounted && user ? (user.email || 'admin@bookong.vn') : 'admin@bookong.vn';
  const avatarInitial = isMounted && user ? (displayName[0]?.toUpperCase() || 'A') : 'A';

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 min-h-[calc(100vh-64px)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-booking-yellow px-3 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Admin Control System
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
                      ? 'bg-booking-blue text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-booking-yellow' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <h4 className="font-extrabold text-booking-yellow">Quyền Hạn Cao Nhất</h4>
          <p className="text-slate-400 text-[11px] mt-1">
            Mọi thao tác khóa tài khoản hoặc hủy duyệt bài đăng sẽ có hiệu lực trực tiếp trên toàn bộ nền tảng.
          </p>
        </div>
      </div>

      {/* Bottom Account & Logout Section for Admin (Fix Hydration Mismatch for BUG-015) */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-booking-yellow text-slate-900 flex items-center justify-center text-xs font-black shrink-0">
            {avatarInitial}
          </div>
          <div className="truncate text-left">
            <p className="text-xs font-bold text-white truncate">{displayName}</p>
            <p className="text-[10px] text-slate-400 font-semibold truncate">{displayEmail}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
          >
            <Home className="w-4 h-4 text-booking-yellow" />
            <span>Trang chủ Bookong</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất tài khoản</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
