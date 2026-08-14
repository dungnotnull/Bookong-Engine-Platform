'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { apiClient } from '@/lib/api-client';

interface AdminAnalytics {
  totalGMV: number;
  pendingHotelsCount: number;
  totalHotels: number;
  totalUsers: number;
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API GET /api/v1/admin/analytics
      const res: any = await apiClient.get('/admin/analytics');
      const data = res?.data || res;
      if (data && typeof data === 'object') {
        setAnalytics({
          totalGMV: data.totalGMV ?? 0,
          pendingHotelsCount: data.pendingHotelsCount ?? 0,
          totalHotels: data.totalHotels ?? 0,
          totalUsers: data.totalUsers ?? 0,
        });
      } else {
        setAnalytics({
          totalGMV: 0,
          pendingHotelsCount: 0,
          totalHotels: 0,
          totalUsers: 0,
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải số liệu Admin Analytics từ máy chủ.');
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminAnalytics();
  }, [fetchAdminAnalytics]);

  return (
    <div className="booking-container py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Admin Platform Governance Portal</h1>
        <p className="text-xs text-gray-500 mt-1">Quản trị toàn bộ hệ thống Bookong Platform & Phê duyệt bài đăng</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorState
          title="Lỗi tải thống kê Admin"
          message={error}
          onRetry={fetchAdminAnalytics}
          isRetrying={isLoading}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-2">
            <span className="text-xs font-semibold text-gray-500">Tổng GMV toàn sàn</span>
            <p className="text-2xl font-black text-booking-navy">{formatCurrency(analytics?.totalGMV ?? 0)}</p>
            <span className="text-[11px] text-emerald-600 font-bold">Thống kê từ dữ liệu thực</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-2">
            <span className="text-xs font-semibold text-gray-500">Khách sạn chờ Phê duyệt</span>
            <p className="text-2xl font-black text-amber-600">{analytics?.pendingHotelsCount ?? 0}</p>
            <Link href="/admin/hotels-approval" className="text-xs text-booking-blue font-bold hover:underline block">
              Duyệt ngay &rarr;
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-2">
            <span className="text-xs font-semibold text-gray-500">Tổng Khách sạn trên sàn</span>
            <p className="text-2xl font-black text-slate-900">{analytics?.totalHotels ?? 0}</p>
            <Link href="/admin/hotels" className="text-xs text-booking-blue font-bold hover:underline block">
              Quản lý khách sạn &rarr;
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-2">
            <span className="text-xs font-semibold text-gray-500">Tổng số Người dùng & Host</span>
            <p className="text-2xl font-black text-gray-900">{analytics?.totalUsers ?? 0}</p>
            <Link href="/admin/users" className="text-xs text-booking-blue font-bold hover:underline block">
              Quản lý tài khoản &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
