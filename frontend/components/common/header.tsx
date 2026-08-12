'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Building, Globe } from 'lucide-react';
import { useAuthStore } from '@/stores/use-auth-store';
import { Button } from '@/components/ui/button';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [currency, setCurrency] = useState<'VND' | 'USD'>('VND');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'VND' ? 'USD' : 'VND'));
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/');
  };

  const displayName = user?.fullName || user?.email || 'Tài khoản';

  return (
    <header className="bg-booking-navy text-white shadow-md">
      <div className="airbnb-container flex items-center justify-between py-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tight text-white group-hover:opacity-90">
            Bookong<span className="text-booking-yellow">.com</span>
          </span>
        </Link>

        {/* Top Right Utilities */}
        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <button
            type="button"
            onClick={toggleCurrency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 transition-all"
            title="Đổi đơn vị tiền tệ"
          >
            <Globe className="w-4 h-4 text-booking-yellow" />
            <span>{currency}</span>
          </button>

          {/* Host Portal Button */}
          <Link href="/host/dashboard">
            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-white/30 hover:bg-white/10 transition-all"
            >
              <Building className="w-3.5 h-3.5 text-booking-yellow" />
              <span>Đăng tài sản của bạn</span>
            </button>
          </Link>

          {/* User Auth Dropdown Container */}
          <div className="min-h-[36px] flex items-center">
            {isMounted && isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-booking-navy font-bold text-xs hover:bg-gray-100 transition-all"
                >
                  <User className="w-4 h-4 text-booking-navy" />
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </button>

                {/* Dropdown Modal */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-modal border border-border-light py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-border-light">
                      <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-booking-blue">
                        Role: {user.role}
                      </span>
                    </div>

                    {(user.role === 'HOST' || user.role === 'ADMIN') && (
                      <Link
                        href="/host/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-surface text-booking-navy font-semibold"
                      >
                        <Building className="w-4 h-4" />
                        Host Portal Dashboard
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs hover:bg-red-50 text-red-600 font-semibold border-t border-border-light mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : isMounted ? (
              <div className="flex items-center gap-2">
                <Link href="/register">
                  <Button variant="outline" className="text-xs bg-white text-booking-navy hover:bg-gray-100 font-bold border-none">
                    Đăng ký
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="yellow" className="text-xs font-bold text-slate-900">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="w-20 h-8 bg-white/10 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
