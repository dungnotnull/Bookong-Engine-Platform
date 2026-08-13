'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PendingHotel {
  id: string;
  name: string;
  hostName: string;
  city: string;
  createdAt: string;
}

export default function AdminHotelsApprovalPage() {
  const [pendingHotels, setPendingHotels] = useState<PendingHotel[]>([
    { id: 'h_new_1', name: 'Nha Trang Beach Pearl Resort', hostName: 'Nguyễn Văn Host', city: 'Nha Trang', createdAt: '2026-08-11' },
    { id: 'h_new_2', name: 'Đà Lạt Pine Forest Homestay', hostName: 'Lê Thị C', city: 'Đà Lạt', createdAt: '2026-08-12' },
  ]);

  const handleApprove = (id: string) => {
    setPendingHotels((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="booking-container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Phê duyệt Bài đăng Khách sạn mới</h1>
        <p className="text-xs text-gray-500 mt-1">Kiểm tra thông tin trước khi xuất bản lên trang tìm kiếm công cộng</p>
      </div>

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
                  <td className="p-4 font-semibold text-gray-800">{h.hostName}</td>
                  <td className="p-4 text-gray-600">{h.city}</td>
                  <td className="p-4 text-gray-400">{h.createdAt}</td>
                  <td className="p-4 text-right space-x-2">
                    <Button size="sm" variant="action" onClick={() => handleApprove(h.id)} className="gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Chấp nhận (Approve)
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleApprove(h.id)} className="gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Từ chối
                    </Button>
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
