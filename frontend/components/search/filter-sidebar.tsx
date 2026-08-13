'use client';

import React from 'react';
import { useSearchStore } from '@/stores/use-search-store';
import { AmenitySelector } from '@/components/host/amenity-selector';
import { Button } from '@/components/ui/button';

export function FilterSidebar() {
  const searchStore = useSearchStore();

  return (
    <aside className="w-full md:w-64 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-6 shrink-0">
      <div>
        <h3 className="font-bold text-sm text-gray-900 mb-3">Bộ lọc tìm kiếm</h3>
        <Button variant="ghost" size="sm" onClick={searchStore.resetFilters} className="text-xs text-booking-blue hover:underline p-0 h-auto">
          Đặt lại bộ lọc
        </Button>
      </div>

      {/* Filter Price Range */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <label className="text-xs font-bold text-gray-800">Khoảng giá / Đêm (VND)</label>
        <div className="space-y-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-gray-700">
            <input type="radio" name="price" onChange={() => searchStore.setSearchParams({ maxPrice: 1000000 })} className="accent-booking-blue" />
            Dưới 1.000.000 ₫
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-gray-700">
            <input type="radio" name="price" onChange={() => searchStore.setSearchParams({ minPrice: 1000000, maxPrice: 3000000 })} className="accent-booking-blue" />
            1.000.000 ₫ - 3.000.000 ₫
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-gray-700">
            <input type="radio" name="price" onChange={() => searchStore.setSearchParams({ minPrice: 3000000 })} className="accent-booking-blue" />
            Trên 3.000.000 ₫
          </label>
        </div>
      </div>

      {/* Star Rating */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <label className="text-xs font-bold text-gray-800">Xếp hạng sao</label>
        <div className="flex gap-2">
          {[3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:border-booking-blue hover:text-booking-blue"
            >
              {star} ★
            </button>
          ))}
        </div>
      </div>

      {/* Popular Amenities Filter */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <label className="text-xs font-bold text-gray-800">Tiện nghi phổ biến</label>
        <AmenitySelector
          selectedIds={searchStore.selectedAmenities}
          onChange={(selectedAmenities) => searchStore.setSearchParams({ selectedAmenities })}
        />
      </div>
    </aside>
  );
}
