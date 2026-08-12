'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Building, Users, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function AdminDashboardPage() {
  return (
    <div className="booking-container py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Admin Platform Governance Portal</h1>
        <p className="text-xs text-gray-500 mt-1">Quản trị toàn bộ hệ thống Bookong Platform & Phê duyệt bài đăng</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-2">
          <span className="text-xs font-semibold text-gray-500">Tổng GMV toàn sàn</span>
          <p className="text-2xl font-black text-booking-navy">{formatCurrency(1250000000)}</p>
          <span className="text-[11px] text-emerald-600 font-bold">Tháng hiện tại</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-2">
          <span className="text-xs font-semibold text-gray-500">Khách sạn chờ Phê duyệt</span>
          <p className="text-2xl font-black text-amber-600">4</p>
          <Link href="/admin/hotels-approval" className="text-xs text-booking-blue font-bold hover:underline block">
            Duyệt ngay $\rightarrow$
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-2">
          <span className="text-xs font-semibold text-gray-500">Tổng số Người dùng & Host</span>
          <p className="text-2xl font-black text-gray-900">1,420</p>
          <Link href="/admin/users" className="text-xs text-booking-blue font-bold hover:underline block">
            Quản lý tài khoản $\rightarrow$
          </Link>
        </div>
      </div>
    </div>
  );
}
