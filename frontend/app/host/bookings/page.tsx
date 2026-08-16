'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import { BookingStatus } from '@/types/booking';
import { formatCurrency, formatDateVi } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Pagination } from '@/components/common/pagination';
import { apiClient } from '@/lib/api-client';
import { ChatDrawer } from '@/components/chat/chat-drawer';

interface HostBookingItem {
  id: string;
  code?: string;
  customerName?: string;
  roomName?: string;
  checkIn: string;
  checkOut: string;
  amount?: number;
  totalPrice?: number;
  totalAmount?: number;
  status: BookingStatus;
  user?: {
    id: string;
    email?: string;
    fullName?: string;
  };
  room?: {
    id: string;
    name?: string;
    type?: string;
  };
}

export default function HostBookingsPage() {
  const [hostBookings, setHostBookings] = useState<HostBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 10;

  const fetchHostBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await apiClient.get('/host/bookings', { params: { page, limit: LIMIT } });
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const meta = res?.meta || {};

      setHostBookings(data);
      setTotalPages(meta.totalPages || Math.ceil((data.length || 1) / LIMIT));
      setTotalItems(meta.total ?? data.length);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách đơn đặt phòng của Host. Vui lòng kiểm tra quyền truy cập.');
      setHostBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHostBookings();
  }, [fetchHostBookings]);

  const updateStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      await apiClient.patch(`/host/bookings/${id}/status`, { status: newStatus });
      setHostBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err: any) {
      alert(err?.message || 'Cập nhật trạng thái đơn thất bại.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Quản lý Đơn đặt phòng của Host</h1>
        <p className="text-xs text-gray-500 mt-1">Xem chi tiết đơn khách đặt và cập nhật trạng thái nhận/trả phòng</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : error ? (
        <ErrorState
          title="Lỗi tải danh sách đơn đặt phòng"
          message={error}
          onRetry={fetchHostBookings}
          isRetrying={isLoading}
        />
      ) : hostBookings.length === 0 ? (
        <EmptyState
          title="Chưa có đơn đặt phòng nào"
          description="Hiện tại khách sạn của bạn chưa phát sinh đơn đặt phòng nào mới."
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-airbnb overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                    <th className="p-4">Mã đơn</th>
                    <th className="p-4">Tên Khách hàng</th>
                    <th className="p-4">Loại phòng</th>
                    <th className="p-4">Thời gian ở</th>
                    <th className="p-4">Tổng tiền</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-right">Đổi trạng thái & Chat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hostBookings.map((b) => {
                    const displayCode = b.code || b.id.substring(0, 8).toUpperCase();
                    const customerName = b.user?.fullName || b.user?.email || b.customerName || 'Khách vãng lai';
                    const roomName = b.room?.name || b.roomName || 'Phòng tiêu chuẩn';
                    const totalPrice = b.totalPrice ?? b.totalAmount ?? b.amount ?? 0;
                    return (
                      <tr key={b.id} className="hover:bg-gray-50/80">
                        <td className="p-4 font-bold text-booking-navy">{displayCode}</td>
                        <td className="p-4 font-bold text-gray-900">{customerName}</td>
                        <td className="p-4 text-gray-700">{roomName}</td>
                        <td className="p-4 text-gray-500">
                          {formatDateVi(b.checkIn)} - {formatDateVi(b.checkOut)}
                        </td>
                        <td className="p-4 font-black text-booking-navy">{formatCurrency(totalPrice)}</td>
                      <td className="p-4">
                        <Badge variant={b.status === 'CONFIRMED' ? 'blue' : b.status === 'CHECKED_OUT' ? 'navy' : 'green'}>
                          {b.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-bold gap-1 text-booking-navy border-booking-navy/30"
                          onClick={() => setActiveChatBookingId(b.id)}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Chat
                        </Button>
                        {b.status === 'CONFIRMED' && (
                          <Button size="sm" variant="action" onClick={() => updateStatus(b.id, 'CHECKED_IN')}>
                            Nhận phòng (Check-in)
                          </Button>
                        )}
                        {b.status === 'CHECKED_IN' && (
                          <Button size="sm" variant="yellow" className="font-bold text-slate-900" onClick={() => updateStatus(b.id, 'CHECKED_OUT')}>
                            Trả phòng (Check-out)
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalItems}
            limit={LIMIT}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}

      {/* Socket.io Realtime Chat Drawer với Guest */}
      {activeChatBookingId && (
        <ChatDrawer
          bookingId={activeChatBookingId}
          isOpen={!!activeChatBookingId}
          onClose={() => setActiveChatBookingId(null)}
        />
      )}
    </div>
  );
}
