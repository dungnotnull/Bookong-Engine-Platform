'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PillSearchBar } from '@/components/search/pill-search-bar';
import { CategoryBar } from '@/components/listing/category-bar';
import { ListingGrid } from '@/components/listing/listing-grid';
import { FilterModal, FilterValues } from '@/components/search/filter-modal';
import { ErrorState } from '@/components/common/error-state';
import { Pagination } from '@/components/common/pagination';
import { Hotel } from '@/types/hotel';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/use-auth-store';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 12;

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API GET /api/v1/hotels kèm page, limit, category & filters (Fix BUG-011)
      const queryParams: Record<string, any> = {
        page,
        limit: LIMIT,
      };

      if (selectedCategory && selectedCategory !== 'all') {
        queryParams.category = selectedCategory;
      }
      if (activeFilters.minPrice) {
        queryParams.minPrice = activeFilters.minPrice;
      }
      if (activeFilters.maxPrice) {
        queryParams.maxPrice = activeFilters.maxPrice;
      }

      const res: any = await apiClient.get('/hotels', { params: queryParams });
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const meta = res?.meta || {};

      // Đồng bộ danh sách yêu thích nếu người dùng đã đăng nhập
      const wishHotelIds = new Set<string>();
      if (useAuthStore.getState().isAuthenticated) {
        try {
          const wishRes: any = await apiClient.get('/wishlist');
          const wishRaw = wishRes?.data ?? wishRes;
          const wishList = Array.isArray(wishRaw) ? wishRaw : Array.isArray(wishRaw?.data) ? wishRaw.data : [];
          wishList.forEach((w: any) => {
            const hId = w.hotelId || w.hotel?.id || w.id;
            if (hId) wishHotelIds.add(hId);
          });
        } catch {
          // ignore
        }
      }

      const mappedHotels = data.map((h: Hotel) => ({
        ...h,
        isWishlisted: wishHotelIds.has(h.id),
      }));

      setHotels(mappedHotels);
      setTotalPages(meta.totalPages || Math.ceil((data.length || 1) / LIMIT));
      setTotalItems(meta.total ?? data.length);
    } catch (err: any) {
      setError(err?.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại backend.');
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedCategory, activeFilters]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  const handleApplyFilterModal = (filters: FilterValues) => {
    setActiveFilters(filters);
    setPage(1);
  };

  return (
    <div className="pb-16 space-y-4">
      {/* Hero Section với PillSearchBar lớn */}
      <section className="bg-gradient-to-b from-surface to-white pt-8 pb-10 px-4 border-b border-border-light">
        <div className="airbnb-container text-center space-y-3 mb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-main">
            Tìm nơi ở hoàn hảo cho chuyến đi tiếp theo
          </h1>
          <p className="text-xs md:text-sm text-muted max-w-xl mx-auto">
            Trải nghiệm không gian nghỉ dưỡng cao cấp cùng trợ lý AI Semantic Vector Search thông minh...
          </p>
        </div>

        {/* Hero Search Bar Pill */}
        <PillSearchBar />
      </section>

      {/* Category Scroll Filter Bar (Fix BUG-011 Event Handler) */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        onOpenFilterModal={() => setIsFilterOpen(true)}
      />

      {/* Main Listing Grid / Error State */}
      <section className="airbnb-container">
        {error ? (
          <div className="py-6">
            <ErrorState
              title="Lỗi tải danh sách chỗ nghỉ"
              message={error}
              onRetry={fetchHotels}
              isRetrying={isLoading}
            />
          </div>
        ) : (
          <>
            <ListingGrid listings={hotels} isLoading={isLoading} />
            {!isLoading && hotels.length > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                total={totalItems}
                limit={LIMIT}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </section>

      {/* Filter Modal (Fix BUG-011 onApply Filter) */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilterModal}
      />
    </div>
  );
}
