'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Home, User, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/stores/use-auth-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AdminHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const displayName = user?.fullName || user?.email || 'System Administrator';

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 h-16 px-6 flex items-center justify-between shadow-sm">
      {/* Left: Brand + Admin Portal Tag */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-white font-black text-xl tracking-tighter">
          <span>bookong</span>
          <span className="w-2 h-2 rounded-full bg-rausch inline-block -ml-1" />
        </Link>
        <div className="h-4 w-px bg-slate-700" />
        <Badge variant="navy" className="font-extrabold text-[11px] gap-1 px-2.5 py-0.5 bg-booking-navy border border-blue-400/30 text-blue-200">
          <ShieldAlert className="w-3.5 h-3.5 text-booking-yellow" /> ADMIN SYSTEM CONTROL
        </Badge>
      </div>

      {/* Right: User Profile & Actions */}
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-300 hover:text-white hover:bg-slate-800 gap-1.5 rounded-xl">
            <Home className="w-4 h-4 text-booking-yellow" />
            <span className="hidden md:inline">Về Trang chủ Bookong</span>
          </Button>
        </Link>

        <div className="h-4 w-px bg-slate-700" />

        {/* Admin Info Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700">
          <div className="w-7 h-7 rounded-full bg-booking-yellow text-slate-900 flex items-center justify-center text-xs font-black">
            {displayName[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />}
          </div>
          <div className="hidden lg:block text-left pr-1">
            <p className="text-xs font-extrabold text-white leading-none">{displayName}</p>
            <p className="text-[10px] text-gray-400 font-semibold">{user?.email}</p>
          </div>
        </div>

        {/* Logout Button for Admin */}
        <Button
          variant="danger"
          size="sm"
          onClick={handleLogout}
          className="text-xs font-bold gap-1.5 rounded-xl shadow-xs"
          title="Đăng xuất khỏi hệ thống Admin"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </Button>
      </div>
    </header>
  );
}
