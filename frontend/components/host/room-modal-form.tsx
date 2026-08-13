'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AmenitySelector } from '@/components/host/amenity-selector';
import { apiClient } from '@/lib/api-client';
import { Room } from '@/types/hotel';

interface RoomModalFormProps {
  hotelId: string;
  initialData?: Room | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RoomModalForm({ hotelId, initialData, onSuccess, onCancel }: RoomModalFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || 'Deluxe');
  const [basePrice, setBasePrice] = useState<number>(initialData?.basePrice ?? 1200000);
  const [capacity, setCapacity] = useState<number>(initialData?.capacity ?? 2);
  const [quantity, setQuantity] = useState<number>(initialData?.quantity ?? 5);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>(
    initialData?.amenities?.map((a) => a.id) || ['aircon', 'bath', 'balcony']
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || basePrice <= 0 || quantity <= 0) {
      setErrorMsg('Vui lòng nhập đầy đủ tên phòng, giá phòng và số lượng phòng hợp lệ.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      if (initialData?.id) {
        // Gọi API PATCH /api/v1/rooms/:id
        await apiClient.patch(`/rooms/${initialData.id}`, {
          name,
          type,
          basePrice: Number(basePrice),
          capacity: Number(capacity),
          quantity: Number(quantity),
          amenityIds: selectedAmenityIds,
        });
      } else {
        // Gọi API POST /api/v1/hotels/:hotelId/rooms
        await apiClient.post(`/hotels/${hotelId}/rooms`, {
          name,
          type,
          basePrice: Number(basePrice),
          capacity: Number(capacity),
          quantity: Number(quantity),
          amenityIds: selectedAmenityIds,
        });
      }
      onSuccess();
    } catch (err: any) {
      const msg = err?.message || 'Không thể lưu thông tin phòng. Vui lòng thử lại.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
          {errorMsg}
        </div>
      )}

      <Input
        label="Tên Loại phòng *"
        placeholder="vd: Phòng Deluxe Hướng Biển Balcony"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Phân loại phòng *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-booking-blue"
          >
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Superior">Superior</option>
            <option value="Standard">Standard</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>

        <Input
          label="Giá cơ sở / Đêm (VND) *"
          type="number"
          step={50000}
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Sức chứa tối đa (Khách) *"
          type="number"
          min={1}
          max={10}
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          required
        />

        <Input
          label="Số lượng phòng khả dụng (Kho) *"
          type="number"
          min={1}
          max={50}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-xs font-semibold text-gray-700">Tiện nghi riêng của loại phòng này:</label>
        <AmenitySelector
          category="ROOM"
          selectedIds={selectedAmenityIds}
          onChange={setSelectedAmenityIds}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="yellow" isLoading={isLoading} className="font-bold text-slate-900">
          {initialData ? 'Cập nhật Loại phòng' : 'Thêm Loại phòng mới'}
        </Button>
      </div>
    </form>
  );
}

