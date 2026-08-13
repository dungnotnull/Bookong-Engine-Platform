'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/stores/use-search-store';
import { AmenitySelector } from '@/components/host/amenity-selector';
import { Button } from '@/components/ui/button';

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchStore = useSearchStore();

  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentAmenities = searchParams.get('amenities')
    ? searchParams.get('amenities')!.split(',').filter(Boolean)
    : searchStore.selectedAmenities;

  const updateFiltersInUrl = (filters: {
    minPrice?: number | null;
    maxPrice?: number | null;
    amenities?: string[] | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.minPrice !== undefined) {
      if (filters.minPrice !== null && filters.minPrice > 0) {
        params.set('minPrice', filters.minPrice.toString());
      } else {
        params.delete('minPrice');
      }
    }

    if (filters.maxPrice !== undefined) {
      if (filters.maxPrice !== null && filters.maxPrice > 0) {
        params.set('maxPrice', filters.maxPrice.toString());
      } else {
        params.delete('maxPrice');
      }
    }

    if (filters.amenities !== undefined) {
      if (filters.amenities && filters.amenities.length > 0) {
        params.set('amenities', filters.amenities.join(','));
      } else {
        params.delete('amenities');
      }
    }

    // Reset về trang 1 khi thay đổi bộ lọc
    params.delete('page');

    // Đồng bộ Zustand Store
    searchStore.setSearchParams({
      minPrice: filters.minPrice ?? undefined,
      maxPrice: filters.maxPrice ?? undefined,
      selectedAmenities: filters.amenities ?? [],
    });

    router.push(`/search?${params.toString()}`);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('amenities');
    params.delete('page');

    searchStore.resetFilters();
    router.push(`/search?${params.toString()}`);
  };

  return (
    <aside className="w-full md:w-64 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-6 shrink-0">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-gray-900">Bộ lọc tìm kiếm</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs text-booking-blue hover:underline p-0 h-auto font-bold"
        >
          Đặt lại bộ lọc
        </Button>
      </div>

      {/* Filter Price Range */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <label className="text-xs font-bold text-gray-800">Khoảng giá / Đêm (VND)</label>
        <div className="space-y-1.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
            <input
              type="radio"
              name="priceRange"
              checked={!currentMinPrice && currentMaxPrice === '1000000'}
              onChange={() => updateFiltersInUrl({ minPrice: null, maxPrice: 1000000 })}
              className="accent-booking-blue"
            />
            Dưới 1.000.000 ₫
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
            <input
              type="radio"
              name="priceRange"
              checked={currentMinPrice === '1000000' && currentMaxPrice === '3000000'}
              onChange={() => updateFiltersInUrl({ minPrice: 1000000, maxPrice: 3000000 })}
              className="accent-booking-blue"
            />
            1.000.000 ₫ - 3.000.000 ₫
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
            <input
              type="radio"
              name="priceRange"
              checked={currentMinPrice === '3000000' && !currentMaxPrice}
              onChange={() => updateFiltersInUrl({ minPrice: 3000000, maxPrice: null })}
              className="accent-booking-blue"
            />
            Trên 3.000.000 ₫
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
            <input
              type="radio"
              name="priceRange"
              checked={!currentMinPrice && !currentMaxPrice}
              onChange={() => updateFiltersInUrl({ minPrice: null, maxPrice: null })}
              className="accent-booking-blue"
            />
            Tất cả mức giá
          </label>
        </div>
      </div>

      {/* Popular Amenities Filter */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <label className="text-xs font-bold text-gray-800">Tiện nghi phổ biến</label>
        <AmenitySelector
          selectedIds={currentAmenities}
          onChange={(selectedAmenities) => updateFiltersInUrl({ amenities: selectedAmenities })}
        />
      </div>
    </aside>
  );
}
