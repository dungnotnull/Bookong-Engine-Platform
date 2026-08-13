'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Home, User, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/stores/use-auth-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HostHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const displayName = user?.fullName || user?.email || 'Host Manager';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between shadow-xs">
      {/* Left: Brand + Portal Indicator */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-rausch font-black text-xl tracking-tighter">
          <span>bookong</span>
          <span className="w-2 h-2 rounded-full bg-rausch inline-block -ml-1" />
        </Link>
        <div className="h-4 w-px bg-gray-200" />
        <Badge variant="yellow" className="font-extrabold text-[11px] gap-1 px-2.5 py-0.5">
          <ShieldCheck className="w-3.5 h-3.5" /> HOST PORTAL
        </Badge>
      </div>

      {/* Right: User Profile & Actions */}
      <div className="flex items-center gap-3">
        {/* Back to Homepage */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-700 hover:text-booking-navy gap-1.5 rounded-xl">
            <Home className="w-4 h-4 text-booking-navy" />
            <span className="hidden md:inline">Về Trang chủ Bookong</span>
          </Button>
        </Link>

        <div className="h-4 w-px bg-gray-200" />

        {/* Host User Info */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-gray-50 border border-gray-100">
          <div className="w-7 h-7 rounded-full bg-booking-navy text-white flex items-center justify-center text-xs font-black">
            {displayName[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />}
          </div>
          <div className="hidden lg:block text-left pr-1">
            <p className="text-xs font-extrabold text-gray-900 leading-none">{displayName}</p>
            <p className="text-[10px] text-gray-500 font-semibold">{user?.email}</p>
          </div>
        </div>

        {/* Logout Button for Host */}
        <Button
          variant="danger"
          size="sm"
          onClick={handleLogout}
          className="text-xs font-bold gap-1.5 rounded-xl shadow-xs"
          title="Đăng xuất khỏi tài khoản Host"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </Button>
      </div>
    </header>
  );
}
