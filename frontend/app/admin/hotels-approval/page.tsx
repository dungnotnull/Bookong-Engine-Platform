'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { apiClient } from '@/lib/api-client';

interface PendingHotel {
  id: string;
  name: string;
  hostName?: string;
  city: string;
  createdAt?: string;
}

export default function AdminHotelsApprovalPage() {
  const [pendingHotels, setPendingHotels] = useState<PendingHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API GET /api/v1/admin/hotels/pending
      const res: any = await apiClient.get('/admin/hotels/pending');
      const data = res?.data || res || [];
      if (Array.isArray(data)) {
        setPendingHotels(data);
      } else {
        setPendingHotels([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách khách sạn chờ duyệt. Vui lòng kiểm tra quyền Admin.');
      setPendingHotels([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingHotels();
  }, [fetchPendingHotels]);

  const handleApprove = async (id: string, isApproved: boolean) => {
    try {
      await apiClient.patch(`/admin/hotels/${id}/approve`, { isApproved });
      setPendingHotels((prev) => prev.filter((h) => h.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Phê duyệt khách sạn thất bại.');
    }
  };

  return (
    <div className="booking-container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Phê duyệt Bài đăng Khách sạn mới</h1>
        <p className="text-xs text-gray-500 mt-1">Kiểm tra thông tin trước khi xuất bản lên trang tìm kiếm công cộng</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : error ? (
        <ErrorState
          title="Lỗi tải danh sách chờ duyệt"
          message={error}
          onRetry={fetchPendingHotels}
          isRetrying={isLoading}
        />
      ) : pendingHotels.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8" />}
          title="Không có khách sạn nào chờ duyệt"
          description="Hiện tại tất cả bài đăng khách sạn đều đã được xử lý xong."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-airbnb overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-600 uppercase">
                  <th className="p-4">Tên Khách sạn</th>
                  <th className="p-4">Chủ nhà (Host)</th>
                  <th className="p-4">Thành phố</th>
                  <th className="p-4">Ngày đăng</th>
                  <th className="p-4 text-right">Phê duyệt (Admin Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingHotels.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50/80">
                    <td className="p-4 font-bold text-booking-navy flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-booking-blue" /> {h.name}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{h.hostName || 'Host'}</td>
                    <td className="p-4 text-gray-600">{h.city}</td>
                    <td className="p-4 text-gray-400">{h.createdAt ? h.createdAt.split('T')[0] : 'Vừa xong'}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="action" onClick={() => handleApprove(h.id, true)} className="gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Chấp nhận (Approve)
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleApprove(h.id, false)} className="gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Từ chối
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
