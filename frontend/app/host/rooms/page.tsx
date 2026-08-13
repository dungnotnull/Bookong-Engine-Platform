'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, BedDouble, Users, Layers, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { RoomModalForm } from '@/components/host/room-modal-form';
import { Room, Hotel } from '@/types/hotel';
import { formatCurrency } from '@/lib/formatters';
import { apiClient } from '@/lib/api-client';

export default function HostRoomsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Host's hotels first
  const fetchHostHotels = useCallback(async () => {
    setIsLoadingHotels(true);
    setError(null);
    try {
      const res: any = await apiClient.get('/hotels/my-hotels');
      const data = res?.data || res || [];
      if (Array.isArray(data) && data.length > 0) {
        setHotels(data);
        setSelectedHotelId(data[0].id);
      } else {
        setHotels([]);
        setSelectedHotelId('');
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể lấy danh sách khách sạn của bạn. Vui lòng thử lại.');
      setHotels([]);
    } finally {
      setIsLoadingHotels(false);
    }
  }, []);

  useEffect(() => {
    fetchHostHotels();
  }, [fetchHostHotels]);

  // Fetch rooms whenever selectedHotelId changes
  const fetchRooms = useCallback(async () => {
    if (!selectedHotelId) {
      setRooms([]);
      return;
    }
    setIsLoadingRooms(true);
    setError(null);
    try {
      const res: any = await apiClient.get(`/hotels/${selectedHotelId}/rooms`);
      const data = res?.data || res || [];
      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        setRooms([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách loại phòng của khách sạn này.');
      setRooms([]);
    } finally {
      setIsLoadingRooms(false);
    }
  }, [selectedHotelId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleRoomCreated = () => {
    setIsModalOpen(false);
    fetchRooms();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-booking-navy">Quản lý Loại phòng & Kho phòng</h1>
          <p className="text-xs text-gray-500 mt-1">Cấu hình chi tiết loại phòng, sức chứa và kiểm soát số lượng khả dụng</p>
        </div>
        <Button
          variant="action"
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedHotelId}
          className="font-bold gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm Loại phòng mới
        </Button>
      </div>

      {/* Select Hotel Filter */}
      {isLoadingHotels ? (
        <Skeleton className="h-14 w-full rounded-xl" />
      ) : hotels.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8" />}
          title="Bạn chưa tạo khách sạn nào"
          description="Vui lòng tạo cơ sở lưu trú trong trang 'Danh sách Khách sạn' trước khi thêm phòng."
        />
      ) : (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <span className="text-xs font-bold text-gray-700">Chọn Khách sạn:</span>
          <select
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-gray-50 border border-gray-300 rounded-lg text-booking-navy focus:outline-none"
          >
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.city})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Room Inventory List Table / States */}
      {isLoadingRooms ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : error ? (
        <ErrorState
          title="Lỗi tải danh sách loại phòng"
          message={error}
          onRetry={fetchRooms}
          isRetrying={isLoadingRooms}
        />
      ) : rooms.length === 0 && selectedHotelId ? (
        <EmptyState
          icon={<BedDouble className="w-8 h-8" />}
          title="Chưa có loại phòng nào cho khách sạn này"
          description="Bắt đầu tạo các loại phòng như Deluxe, Suite, Standard để khách hàng có thể đặt phòng."
          actionLabel="Tạo loại phòng đầu tiên"
          onAction={() => setIsModalOpen(true)}
        />
      ) : rooms.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-airbnb overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tên loại phòng</th>
                  <th className="py-3.5 px-4">Phân loại</th>
                  <th className="py-3.5 px-4">Sức chứa</th>
                  <th className="py-3.5 px-4">Số lượng trong kho (Quantity)</th>
                  <th className="py-3.5 px-4">Giá cơ sở / Đêm</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50/80 transition-smooth">
                    <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-booking-navy shrink-0" />
                      <span>{room.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="blue">{room.type}</Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <span className="flex items-center gap-1 font-semibold">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        {room.capacity} Khách
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-max">
                        <Layers className="w-3.5 h-3.5" />
                        {room.quantity} phòng khả dụng
                      </span>
                    </td>
                    <td className="py-4 px-4 font-black text-booking-navy">
                      {formatCurrency(room.basePrice)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-booking-blue font-semibold hover:underline">Chỉnh sửa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Modal Dialog Form */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tạo loại phòng mới">
        <RoomModalForm
          hotelId={selectedHotelId}
          onSuccess={handleRoomCreated}
          onCancel={() => setIsModalOpen(false)}
        />
      </Dialog>
    </div>
  );
}
