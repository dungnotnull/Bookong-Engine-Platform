'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Calendar, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-float p-8 border border-gray-100 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-booking-navy">Đặt phòng thành công!</h1>
          <p className="text-xs text-gray-500 mt-1">Mã xác nhận đơn hàng: <strong className="text-gray-900">BK-2026-9876</strong></p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-left text-xs space-y-2 border border-gray-200">
          <p className="font-bold text-gray-900">Sunset Sanato Resort Phú Quốc</p>
          <p className="text-gray-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-booking-navy" /> Dương Đông, Phú Quốc
          </p>
          <p className="text-gray-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-booking-navy" /> 2 đêm (15 Thg 09 - 17 Thg 09, 2026)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/user/bookings" className="flex-1">
            <Button variant="action" className="w-full font-bold">
              Quản lý đơn hàng
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full font-bold">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
