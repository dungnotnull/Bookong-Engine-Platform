'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Booking } from '@/types/booking';
import { formatCurrency, formatDateVi } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'booking_1',
      code: 'BK-2026-9876',
      roomId: 'room_1',
      roomName: 'Deluxe Ocean View',
      hotelName: 'Sunset Sanato Resort Phú Quốc',
      userId: 'user_1',
      customerInfo: { name: 'Nguyễn Văn A', email: 'user@gmail.com', phone: '0912345678' },
      checkIn: '2026-09-15',
      checkOut: '2026-09-17',
      guests: 2,
      totalAmount: 3000000,
      status: 'CONFIRMED',
      paymentMethod: 'QR_BANK',
      createdAt: '2026-08-12',
    },
    {
      id: 'booking_2',
      code: 'BK-2026-1122',
      roomId: 'room_2',
      roomName: 'Executive Villa',
      hotelName: 'Đà Nẵng Ocean View Villa',
      userId: 'user_1',
      customerInfo: { name: 'Nguyễn Văn A', email: 'user@gmail.com', phone: '0912345678' },
      checkIn: '2026-07-10',
      checkOut: '2026-07-12',
      guests: 4,
      totalAmount: 5600000,
      status: 'CHECKED_OUT',
      paymentMethod: 'CREDIT_CARD',
      createdAt: '2026-07-01',
    },
  ]);

  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState<Booking | null>(null);

  // Ràng buộc kiểm tra điều kiện Hủy phòng (Constraint: checkIn >= current_date)
  const isCanCancel = (booking: Booking) => {
    const today = new Date().toISOString().split('T')[0];
    return booking.checkIn > today && booking.status === 'CONFIRMED';
  };

  const handleConfirmCancel = () => {
    if (!selectedBookingToCancel) return;
    setBookings((prev) =>
      prev.map((b) => (b.id === selectedBookingToCancel.id ? { ...b, status: 'CANCELLED' } : b))
    );
    setSelectedBookingToCancel(null);
  };

  return (
    <div className="booking-container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Lịch sử Đặt phòng của bạn</h1>
        <p className="text-xs text-gray-500 mt-1">Quản lý và xem lại thông tin các chuyến đi</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-booking-navy">{booking.hotelName}</span>
                <Badge variant={booking.status === 'CONFIRMED' ? 'green' : booking.status === 'CHECKED_OUT' ? 'navy' : 'orange'}>
                  {booking.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">Mã đơn: <strong>{booking.code}</strong> · Loại: {booking.roomName}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-booking-navy" />
                {formatDateVi(booking.checkIn)} - {formatDateVi(booking.checkOut)} ({booking.guests} khách)
              </p>
            </div>

            <div className="flex flex-col md:items-end justify-between gap-2 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
              <span className="text-lg font-black text-booking-navy">{formatCurrency(booking.totalAmount)}</span>
              
              <div className="flex items-center gap-2">
                {booking.status === 'CHECKED_OUT' && (
                  <Button variant="yellow" size="sm" className="font-bold text-slate-900">
                    Viết Đánh giá
                  </Button>
                )}

                {booking.status === 'CONFIRMED' && (
                  <Button
                    variant={isCanCancel(booking) ? 'danger' : 'ghost'}
                    size="sm"
                    disabled={!isCanCancel(booking)}
                    onClick={() => isCanCancel(booking) && setSelectedBookingToCancel(booking)}
                  >
                    {isCanCancel(booking) ? 'Hủy đặt phòng' : 'Không thể hủy'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Xác nhận Hủy phòng theo Chính sách */}
      <Dialog isOpen={!!selectedBookingToCancel} onClose={() => setSelectedBookingToCancel(null)} title="Xác nhận Hủy phòng">
        <div className="space-y-4 py-2">
          <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 flex items-start gap-2 border border-amber-200">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Chính sách hủy: Bạn được miễn phí hủy phòng trước ngày nhận phòng {selectedBookingToCancel?.checkIn}. Số tiền hoàn lại sẽ là 100%.</span>
          </div>
          <p className="text-xs text-gray-700">Bạn có chắc chắn muốn hủy đơn đặt phòng <strong>{selectedBookingToCancel?.code}</strong> không?</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setSelectedBookingToCancel(null)}>Không hủy</Button>
            <Button variant="danger" onClick={handleConfirmCancel}>Xác nhận Hủy</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
