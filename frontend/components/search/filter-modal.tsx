'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface FilterValues {
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
}

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [minPrice, setMinPrice] = useState<number>(500000);
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const [amenities, setAmenities] = useState<string[]>(['wifi', 'pool']);

  const handleAmenityToggle = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(10000000);
    setAmenities([]);
  };

  const handleApplyFilters = () => {
    onApply({
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      amenities: amenities.length > 0 ? amenities : undefined,
    });
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Bộ lọc nâng cao (Airbnb & Booking.com)">
      <div className="space-y-6 text-xs text-main">
        {/* Khoảng giá */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-main">Khoảng giá theo đêm (VND)</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-border rounded-xl p-3 bg-gray-50/50">
              <span className="text-[10px] font-bold text-muted uppercase">Tối thiểu</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full text-sm font-bold outline-none bg-transparent"
              />
            </div>
            <div className="border border-border rounded-xl p-3 bg-gray-50/50">
              <span className="text-[10px] font-bold text-muted uppercase">Tối đa</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full text-sm font-bold outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Tiện ích nổi bật */}
        <div className="space-y-3 border-t border-border-light pt-4">
          <h4 className="font-bold text-sm text-main">Tiện nghi nổi bật</h4>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={amenities.includes('wifi')}
                onChange={() => handleAmenityToggle('wifi')}
                className="accent-rausch w-4 h-4"
              />
              WiFi tốc độ cao
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={amenities.includes('pool')}
                onChange={() => handleAmenityToggle('pool')}
                className="accent-rausch w-4 h-4"
              />
              Hồ bơi riêng / Vô cực
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={amenities.includes('parking')}
                onChange={() => handleAmenityToggle('parking')}
                className="accent-rausch w-4 h-4"
              />
              Bãi đỗ xe miễn phí
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={amenities.includes('bathtub')}
                onChange={() => handleAmenityToggle('bathtub')}
                className="accent-rausch w-4 h-4"
              />
              Bồn tắm riêng
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-border-light pt-4">
          <button type="button" onClick={handleReset} className="font-bold text-main underline">
            Xóa tất cả
          </button>
          <Button variant="action" className="bg-rausch hover:bg-rausch-hover text-white font-bold px-6 py-2.5" onClick={handleApplyFilters}>
            Hiển thị chỗ nghỉ
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
