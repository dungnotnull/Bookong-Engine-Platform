'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WishlistPage() {
  return (
    <div className="booking-container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Danh sách Chỗ nghỉ Đã lưu (Wishlist)</h1>
        <p className="text-xs text-gray-500 mt-1">Các khách sạn và villa ưa thích của bạn</p>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4">
        <Heart className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-base font-bold text-gray-900">Danh sách yêu thích đang trống</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Nhấp vào biểu tượng trái tim ở bất kỳ chỗ nghỉ nào để lưu lại danh sách các chuyến đi mơ ước của bạn.
        </p>
        <Link href="/search">
          <Button variant="action" className="font-bold">Khám phá chỗ nghỉ</Button>
        </Link>
      </div>
    </div>
  );
}
