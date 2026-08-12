'use client';

import React, { useState } from 'react';
import { Plus, BedDouble, Users, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { RoomModalForm } from '@/components/host/room-modal-form';
import { Room } from '@/types/hotel';
import { formatCurrency } from '@/lib/formatters';

export default function HostRoomsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState('hotel_1');

  // Mock danh sách phòng ban đầu
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'room_1',
      hotelId: 'hotel_1',
      name: 'Phòng Deluxe Hướng Biển Balcony',
      type: 'Deluxe',
      basePrice: 1500000,
      capacity: 2,
      quantity: 5,
      amenities: [
        { id: 'aircon', name: 'Điều hòa', category: 'ROOM' },
        { id: 'bath', name: 'Bồn tắm', category: 'ROOM' },
      ],
    },
    {
      id: 'room_2',
      hotelId: 'hotel_1',
      name: 'Executive Ocean Suite',
      type: 'Suite',
      basePrice: 2800000,
      capacity: 4,
      quantity: 2,
      amenities: [
        { id: 'aircon', name: 'Điều hòa', category: 'ROOM' },
        { id: 'balcony', name: 'Ban công', category: 'ROOM' },
        { id: 'minibar', name: 'Minibar', category: 'ROOM' },
      ],
    },
  ]);

  const handleRoomCreated = () => {
    setIsModalOpen(false);
    // Thêm một phòng mới vào local state đại diện cho kết quả thành công
    const newRoom: Room = {
      id: 'room_' + Date.now(),
      hotelId: selectedHotelId,
      name: 'Phòng Mới Đã Thêm',
      type: 'Standard',
      basePrice: 1200000,
      capacity: 2,
      quantity: 3,
      amenities: [],
    };
    setRooms([newRoom, ...rooms]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-booking-navy">Quản lý Loại phòng & Kho phòng</h1>
          <p className="text-xs text-gray-500 mt-1">Cấu hình chi tiết loại phòng, sức chứa và kiểm soát số lượng khả dụng</p>
        </div>
        <Button variant="action" onClick={() => setIsModalOpen(true)} className="font-bold gap-2">
          <Plus className="w-4 h-4" />
          Thêm Loại phòng mới
        </Button>
      </div>

      {/* Select Hotel Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <span className="text-xs font-bold text-gray-700">Chọn Khách sạn:</span>
        <select
          value={selectedHotelId}
          onChange={(e) => setSelectedHotelId(e.target.value)}
          className="px-3 py-1.5 text-xs font-bold bg-gray-50 border border-gray-300 rounded-lg text-booking-navy focus:outline-none"
        >
          <option value="hotel_1">Phú Quốc Sunset Luxury Resort</option>
          <option value="hotel_2">Đà Nẵng Ocean View Villa</option>
        </select>
      </div>

      {/* Room Inventory List Table */}
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
