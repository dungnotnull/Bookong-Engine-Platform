'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Building2, BedDouble, CalendarCheck, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { apiClient } from '@/lib/api-client';

interface HostAnalytics {
  totalHotels: number;
  totalRooms: number;
  monthlyBookings: number;
  occupancyRate: number;
}

export default function HostDashboardPage() {
  const [analytics, setAnalytics] = useState<HostAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API GET /api/v1/host/analytics
      const res: any = await apiClient.get('/host/analytics');
      const data = res?.data || res;
      if (data && typeof data === 'object') {
        setAnalytics({
          totalHotels: data.totalHotels ?? 0,
          totalRooms: data.totalRooms ?? 0,
          monthlyBookings: data.monthlyBookings ?? 0,
          occupancyRate: data.occupancyRate ?? 0,
        });
      } else {
        setAnalytics({
          totalHotels: 0,
          totalRooms: 0,
          monthlyBookings: 0,
          occupancyRate: 0,
        });
      }
    } catch (err: any) {
      // Nếu API endpoint chưa khởi tạo trên backend, ta catch và thông báo lỗi rõ ràng kèm nút Thử lại
      setError(err?.message || 'Không thể lấy dữ liệu thống kê Host từ máy chủ.');
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

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
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorState
          title="Lỗi tải chỉ số thống kê"
          message={error}
          onRetry={fetchAnalytics}
          isRetrying={isLoading}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-airbnb">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Khách sạn đang quản lý</span>
              <div className="p-2 bg-blue-50 text-booking-blue rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 mt-3">{analytics?.totalHotels ?? 0}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Cập nhật từ hệ thống</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-airbnb">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Tổng số Loại phòng</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <BedDouble className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 mt-3">{analytics?.totalRooms ?? 0}</p>
            <span className="text-[11px] text-gray-500">Đang hoạt động trong kho</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-airbnb">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Lượt đặt phòng tháng này</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 mt-3">{analytics?.monthlyBookings ?? 0}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Tổng lượt đặt phòng</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-airbnb">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Tỉ lệ lấp đầy (Occupancy)</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 mt-3">{analytics?.occupancyRate ?? 0}%</p>
            <span className="text-[11px] text-purple-600 font-semibold">Tỉ lệ phòng lấp đầy</span>
          </div>
        </div>
      )}

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
