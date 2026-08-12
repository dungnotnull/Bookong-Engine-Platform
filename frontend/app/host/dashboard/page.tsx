'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, BedDouble, CalendarCheck, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HostDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Title & CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-booking-navy">Tổng quan Chủ nhà (Host Dashboard)</h1>
          <p className="text-xs text-gray-500 mt-1">Theo dõi hoạt động kinh doanh và quản lý lưu trú của bạn</p>
        </div>
        <Link href="/host/properties">
          <Button variant="action" size="md" className="font-bold gap-2">
            <Plus className="w-4 h-4" />
            Tạo Khách sạn mới
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-airbnb">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Khách sạn đang quản lý</span>
            <div className="p-2 bg-blue-50 text-booking-blue rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-3">3</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Tất cả đã phê duyệt</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-airbnb">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Tổng số Loại phòng</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-3">12</p>
          <span className="text-[11px] text-gray-500">Sức chứa tối đa 48 khách</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-airbnb">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Lượt đặt phòng tháng này</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-3">28</p>
          <span className="text-[11px] text-emerald-600 font-semibold">↑ 18% so với tháng trước</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-airbnb">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Tỉ lệ lấp đầy (Occupancy)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-3">82%</p>
          <span className="text-[11px] text-purple-600 font-semibold">Mức lấp đầy rất tốt</span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-airbnb space-y-4">
          <h3 className="text-base font-bold text-gray-900">Quản lý Kho Phòng & Tiện nghi</h3>
          <p className="text-xs text-gray-500">
            Thêm loại phòng Deluxe, Suite, điều chỉnh số lượng khả dụng trong kho để tránh hiện tượng Overbooking.
          </p>
          <Link href="/host/rooms" className="inline-block">
            <Button variant="outline" size="sm" className="font-bold">
              Xem danh sách phòng
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-airbnb space-y-4">
          <h3 className="text-base font-bold text-gray-900">Quy tắc Giá theo Mùa (Dynamic Pricing)</h3>
          <p className="text-xs text-gray-500">
            Cấu hình phụ phí mùa lễ, tết hoặc cuối tuần giúp tối đa hóa lợi nhuận kinh doanh.
          </p>
          <Link href="/host/dynamic-pricing" className="inline-block">
            <Button variant="yellow" size="sm" className="font-bold">
              Thiết lập Bảng giá
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
