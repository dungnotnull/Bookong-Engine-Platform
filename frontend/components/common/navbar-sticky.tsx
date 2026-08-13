'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Menu, User, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';

export function NavbarSticky() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (pathname.startsWith('/host') || pathname.startsWith('/admin')) {
    return null;
  }

  const displayName = user?.fullName || user?.email || 'User';
  const avatarInitial = displayName[0]?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border-light shadow-sm transition-all duration-300">
      <div className="airbnb-container h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-rausch font-black text-2xl tracking-tighter">
          <span>bookong</span>
          <span className="w-2.5 h-2.5 rounded-full bg-rausch inline-block -ml-1" />
        </Link>

        {/* Right Menu Utilities */}
        <div className="flex items-center gap-2">
          <Link
            href="/host/dashboard"
            className="hidden sm:block text-xs font-bold text-main hover:bg-surface px-4 py-2.5 rounded-full transition-colors"
          >
            Cho thuê chỗ nghỉ qua Bookong
          </Link>

          <button
            className="p-2.5 rounded-full hover:bg-surface text-main transition-colors"
            title="Đổi ngôn ngữ / tiền tệ"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* User Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 border border-border rounded-full p-1.5 pl-3 hover:shadow-md transition-all duration-200 bg-white"
            >
              <Menu className="w-4 h-4 text-main" />
              <div className="w-8 h-8 rounded-full bg-main text-white flex items-center justify-center font-bold text-xs">
                {isMounted && user ? avatarInitial : <User className="w-4 h-4 text-white" />}
              </div>
            </button>

            {/* User Dropdown Modal */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-modal border border-border-light py-2 z-50 animate-fade-in text-xs font-semibold text-main">
                {isMounted && isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-3 border-b border-border-light">
                      <p className="font-extrabold text-sm text-main">{displayName}</p>
                      <p className="text-muted text-[11px] font-normal">{user.email}</p>
                    </div>
                    <Link
                      href="/bookings"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-surface"
                    >
                      Chuyến đi / Đặt phòng của tôi
                    </Link>

                    {(user.role === 'HOST' || user.role === 'ADMIN') && (
                      <Link
                        href={user.role === 'ADMIN' ? '/admin/dashboard' : '/host/dashboard'}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2.5 hover:bg-surface text-rausch font-bold"
                      >
                        {user.role === 'ADMIN' ? 'Admin Portal Dashboard' : 'Host Portal Dashboard'}
                      </Link>
                    )}

                    <div className="border-t border-border-light my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 font-extrabold hover:bg-surface text-main"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 font-bold hover:bg-surface text-muted"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
