'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { HeroSearchBar } from '@/components/search/hero-search-bar';
import { FilterSidebar } from '@/components/search/filter-sidebar';
import { PropertyCard } from '@/components/search/property-card';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Pagination } from '@/components/common/pagination';
import { Hotel } from '@/types/hotel';
import { apiClient } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const pageFromUrl = Number(searchParams.get('page')) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 10;

  const fetchSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = searchParams.get('q') || searchParams.get('location') || '';
      const checkIn = searchParams.get('checkIn') || '';
      const checkOut = searchParams.get('checkOut') || '';
      const guests = searchParams.get('guests') || '';
      const minPrice = searchParams.get('minPrice') || '';
      const maxPrice = searchParams.get('maxPrice') || '';
      const amenities = searchParams.get('amenities') || '';
      const page = Number(searchParams.get('page')) || 1;

      const params: Record<string, any> = { page, limit: LIMIT };
      if (q) params.q = q;
      if (checkIn) params.checkIn = checkIn;
      if (checkOut) params.checkOut = checkOut;
      if (guests) params.guests = guests;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (amenities) params.amenities = amenities;

      // Gọi API GET /api/v1/search kèm page & limit & các bộ lọc
      const res: any = await apiClient.get('/search', { params });
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const meta = res?.meta || {};

      setHotels(data);
      setTotalPages(meta.totalPages || Math.ceil((data.length || 1) / LIMIT));
      setTotalItems(meta.total ?? data.length);
    } catch (err: any) {
      setError(err?.message || 'Không thể tìm kiếm chỗ nghỉ. Vui lòng kiểm tra lại kết nối API Backend.');
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSearch();
  }, [fetchSearch]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/search?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Search Bar */}
      <div className="bg-booking-navy py-6">
        <div className="booking-container">
          <HeroSearchBar />
        </div>
      </div>

      {/* Main Results Body */}
      <div className="booking-container flex flex-col md:flex-row gap-6">
        <FilterSidebar />

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-gray-900">
              {isLoading ? 'Đang tìm kiếm chỗ nghỉ...' : `Tìm thấy ${totalItems} chỗ nghỉ phù hợp`}
            </h1>
            <select className="text-xs font-bold border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-800">
              <option>Gợi ý hàng đầu</option>
              <option>Giá thấp đến cao</option>
              <option>Đánh giá cao nhất</option>
              <option>Độ khớp ngữ nghĩa (AI Score)</option>
            </select>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          ) : error ? (
            <ErrorState
              title="Lỗi tải kết quả tìm kiếm"
              message={error}
              onRetry={fetchSearch}
              isRetrying={isLoading}
            />
          ) : hotels.length === 0 ? (
            <EmptyState
              title="Không tìm thấy chỗ nghỉ phù hợp"
              description="Thử thay đổi từ khóa tìm kiếm, khoảng ngày lưu trú hoặc bỏ bớt tiêu chí lọc."
            />
          ) : (
            <>
              <div className="space-y-4">
                {hotels.map((hotel) => (
                  <PropertyCard key={hotel.id} hotel={hotel} />
                ))}
              </div>

              {/* Pagination Bar */}
              <Pagination
                page={pageFromUrl}
                totalPages={totalPages}
                total={totalItems}
                limit={LIMIT}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="booking-container py-12 space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
