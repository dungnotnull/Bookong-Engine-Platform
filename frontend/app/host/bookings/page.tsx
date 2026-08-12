'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { BookingStatus } from '@/types/booking';
import { formatCurrency, formatDateVi } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HostBookingItem {
  id: string;
  code: string;
  customerName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: BookingStatus;
}

export default function HostBookingsPage() {
  const [hostBookings, setHostBookings] = useState<HostBookingItem[]>([
    {
      id: 'hb_1',
      code: 'BK-2026-9876',
      customerName: 'Nguyễn Văn A',
      roomName: 'Phòng Deluxe Ocean View',
      checkIn: '2026-09-15',
      checkOut: '2026-09-17',
      amount: 3000000,
      status: 'CONFIRMED',
    },
    {
      id: 'hb_2',
      code: 'BK-2026-3344',
      customerName: 'Trần Thị B',
      roomName: 'Executive Suite',
      checkIn: '2026-08-10',
      checkOut: '2026-08-12',
      amount: 5600000,
      status: 'CHECKED_IN',
    },
  ]);

  const updateStatus = (id: string, newStatus: BookingStatus) => {
    setHostBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Quản lý Đơn đặt phòng của Host</h1>
        <p className="text-xs text-gray-500 mt-1">Xem chi tiết đơn khách đặt và cập nhật trạng thái nhận/trả phòng</p>
      </div>

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
                <th className="p-4 text-right">Đổi trạng thái (Host Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hostBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/80">
                  <td className="p-4 font-bold text-booking-navy">{b.code}</td>
                  <td className="p-4 font-bold text-gray-900">{b.customerName}</td>
                  <td className="p-4 text-gray-700">{b.roomName}</td>
                  <td className="p-4 text-gray-500">
                    {formatDateVi(b.checkIn)} - {formatDateVi(b.checkOut)}
                  </td>
                  <td className="p-4 font-black text-booking-navy">{formatCurrency(b.amount)}</td>
                  <td className="p-4">
                    <Badge variant={b.status === 'CONFIRMED' ? 'blue' : b.status === 'CHECKED_OUT' ? 'navy' : 'green'}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
