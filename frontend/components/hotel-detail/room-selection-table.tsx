'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Users, Check, Sparkles } from 'lucide-react';
import { Room } from '@/types/hotel';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RoomSelectionTableProps {
  rooms: Room[];
  nights: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export function RoomSelectionTable({ rooms, nights, checkIn, checkOut, guests }: RoomSelectionTableProps) {
  const searchParams = useSearchParams();

  const effectiveCheckIn = checkIn || searchParams.get('checkIn') || '';
  const effectiveCheckOut = checkOut || searchParams.get('checkOut') || '';
  const effectiveGuests = guests || searchParams.get('guests') || '';

  const queryParams = new URLSearchParams();
  if (effectiveCheckIn) queryParams.set('checkIn', effectiveCheckIn);
  if (effectiveCheckOut) queryParams.set('checkOut', effectiveCheckOut);
  if (effectiveGuests) queryParams.set('guests', String(effectiveGuests));

  const queryString = queryParams.toString();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-airbnb overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-base text-gray-900">Bảng chọn loại phòng trống</h3>
        <span className="text-xs text-booking-blue font-semibold">Giá hiển thị cho {nights} đêm</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100/70 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
              <th className="p-4">Loại phòng</th>
              <th className="p-4">Sức chứa</th>
              <th className="p-4">Giá cho {nights} đêm</th>
              <th className="p-4">Điều khoản đặt phòng</th>
              <th className="p-4 text-right">Lựa chọn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {rooms.map((room) => {
              const totalPrice = room.basePrice * nights;
              const checkoutHref = `/checkout/${room.id}${queryString ? `?${queryString}` : ''}`;
              return (
                <tr key={room.id} className="hover:bg-blue-50/30 transition-smooth">
                  <td className="p-4">
                    <h4 className="font-extrabold text-sm text-booking-navy">{room.name}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Loại: {room.type}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="blue">Điều hòa</Badge>
                      <Badge variant="gray">Ban công</Badge>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <Users className="w-4 h-4 text-gray-500" />
                      {room.capacity} Khách
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="text-base font-black text-booking-navy block">{formatCurrency(totalPrice)}</span>
                    <span className="text-[10px] text-gray-400 block">Đã bao gồm thuế & phí</span>
                  </td>

                  <td className="p-4 space-y-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Check className="w-3.5 h-3.5" /> Miễn phí hủy phòng
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-medium">
                      <Sparkles className="w-3.5 h-3.5" /> Không cần trả tiền trước
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <Link href={checkoutHref}>
                      <Button variant="yellow" size="md" className="font-bold text-slate-900">
                        Tôi sẽ đặt
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
