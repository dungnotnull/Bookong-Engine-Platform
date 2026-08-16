'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { Plus, BedDouble, Users, Layers, Building2, Calendar } from 'lucide-react';
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

function HostRoomsContent() {
  const searchParams = useSearchParams();
  const targetHotelId = searchParams.get('hotelId');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States tra cứu khả dụng theo ngày (Check-in / Check-out)
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const [checkIn, setCheckIn] = useState<string>(today);
  const [checkOut, setCheckOut] = useState<string>(tomorrow);

  // Fetch Host's hotels first
  const fetchHostHotels = useCallback(async () => {
    setIsLoadingHotels(true);
    setError(null);
    try {
      const res: any = await apiClient.get('/hotels/my-hotels');
      const data = res?.data || res || [];
      if (Array.isArray(data) && data.length > 0) {
        setHotels(data);
        // Ưu tiên chọn hotelId từ URL search parameter nếu khớp
        const matched = targetHotelId ? data.find((h) => h.id === targetHotelId) : null;
        setSelectedHotelId(matched ? matched.id : data[0].id);
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
  }, [targetHotelId]);

  useEffect(() => {
    fetchHostHotels();
  }, [fetchHostHotels]);

  // Fetch rooms whenever selectedHotelId, checkIn, or checkOut changes
  const fetchRooms = useCallback(async () => {
    if (!selectedHotelId) {
      setRooms([]);
      return;
    }
    setIsLoadingRooms(true);
    setError(null);
    try {
      // Truyền params checkIn, checkOut và includeInactive để lấy cả loại phòng bị vô hiệu hóa
      const res: any = await apiClient.get(`/hotels/${selectedHotelId}/rooms`, {
        params: { checkIn, checkOut, includeInactive: 'true' },
      });
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
  }, [selectedHotelId, checkIn, checkOut]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleToggleRoomActive = async (room: Room) => {
    try {
      const nextActive = room.isActive === false ? true : false;
      await apiClient.patch(`/rooms/${room.id}`, { isActive: nextActive });
      fetchRooms();
    } catch (err: any) {
      setError(err?.message || 'Không thể thay đổi trạng thái hoạt động của loại phòng.');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleRoomSaved = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    fetchRooms();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-booking-navy">Quản lý Loại phòng & Kho phòng</h1>
          <p className="text-xs text-gray-500 mt-1">Cấu hình chi tiết loại phòng, sức chứa và kiểm soát số lượng khả dụng thực tế</p>
        </div>
        <Button
          variant="action"
          onClick={handleOpenCreateModal}
          disabled={!selectedHotelId}
          className="font-bold gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm Loại phòng mới
        </Button>
      </div>

      {/* Select Hotel Filter & Date Range Availability Lookup */}
      {isLoadingHotels ? (
        <Skeleton className="h-14 w-full rounded-xl" />
      ) : hotels.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8" />}
          title="Bạn chưa tạo khách sạn nào"
          description="Vui lòng tạo cơ sở lưu trú trong trang 'Danh sách Khách sạn' trước khi thêm phòng."
        />
      ) : (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Chọn Khách sạn:</span>
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

          {/* Controls Tra cứu Khả dụng Kho theo Khoảng ngày */}
          <div className="flex items-center gap-3 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-booking-navy">
              <Calendar className="w-4 h-4 text-booking-blue" />
              <span>Tra cứu kho theo ngày:</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => {
                  const val = e.target.value;
                  setCheckIn(val);
                  if (val && val >= checkOut) {
                    setCheckOut(format(addDays(new Date(val), 1), 'yyyy-MM-dd'));
                  }
                }}
                className="px-2 py-1 text-xs font-bold bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-booking-blue"
              />
              <span className="text-xs text-gray-400 font-extrabold">→</span>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && val > checkIn) {
                    setCheckOut(val);
                  }
                }}
                className="px-2 py-1 text-xs font-bold bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-booking-blue"
              />
            </div>
          </div>
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
          onAction={handleOpenCreateModal}
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
                  <th className="py-3.5 px-4">Số lượng khả dụng (Kho ngày)</th>
                  <th className="py-3.5 px-4">Giá cơ sở / Đêm</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {rooms.map((room) => {
                  const avail = room.availableQuantity ?? room.quantity;
                  const isAvailable = avail > 0;
                  const isRoomDisabled = room.isActive === false;
                  return (
                    <tr key={room.id} className={`hover:bg-gray-50/80 transition-smooth ${isRoomDisabled ? 'bg-red-50/20' : ''}`}>
                      <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-booking-navy shrink-0" />
                        <span className={isRoomDisabled ? 'line-through text-gray-400' : ''}>{room.name}</span>
                        {isRoomDisabled && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-700 border border-red-200">
                            Tạm ngưng
                          </span>
                        )}
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
                        <div className="flex flex-col gap-1">
                          <span
                            className={`flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-full w-max border ${
                              isRoomDisabled
                                ? 'text-red-700 bg-red-50 border-red-200/60'
                                : isAvailable
                                ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60'
                                : 'text-red-700 bg-red-50 border-red-200/60'
                            }`}
                          >
                            <Layers className="w-3.5 h-3.5" />
                            {isRoomDisabled
                              ? 'Ngừng kinh doanh'
                              : isAvailable
                              ? `${avail} / ${room.quantity} phòng khả dụng`
                              : `0 / ${room.quantity} phòng (Hết phòng)`}
                          </span>
                          <span className="text-[10px] text-gray-400 font-semibold pl-1">
                            Tổng kho gốc: {room.quantity} phòng
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-black text-booking-navy">
                        {formatCurrency(room.basePrice)}
                      </td>
                      <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(room)}
                          className="text-booking-blue font-semibold hover:underline bg-blue-50/80 px-2.5 py-1 rounded-lg hover:bg-booking-blue hover:text-white transition-all"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleToggleRoomActive(room)}
                          className={`font-semibold text-xs px-2.5 py-1 rounded-lg transition-all ${
                            isRoomDisabled
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                              : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
                          }`}
                        >
                          {isRoomDisabled ? 'Mở lại' : 'Tạm ngưng'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Modal Dialog Form */}
      <Dialog
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingRoom ? 'Chỉnh sửa thông tin loại phòng' : 'Tạo loại phòng mới'}
      >
        <RoomModalForm
          key={editingRoom ? editingRoom.id : 'new-room'}
          hotelId={selectedHotelId}
          initialData={editingRoom}
          onSuccess={handleRoomSaved}
          onCancel={handleModalClose}
        />
      </Dialog>
    </div>
  );
}

export default function HostRoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3 rounded-xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      }
    >
      <HostRoomsContent />
    </Suspense>
  );
}
