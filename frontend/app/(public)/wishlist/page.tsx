'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { ListingGrid } from '@/components/listing/listing-grid';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Hotel } from '@/types/hotel';
import { apiClient } from '@/lib/api-client';

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API GET /api/v1/wishlist
      const res: any = await apiClient.get('/wishlist');
      const data = res?.data || res || [];
      if (Array.isArray(data)) {
        setWishlistItems(data);
      } else {
        setWishlistItems([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách yêu thích. Vui lòng đăng nhập hoặc thử lại sau.');
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <div className="booking-container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Danh sách Chỗ nghỉ Đã lưu (Wishlist)</h1>
        <p className="text-xs text-gray-500 mt-1">Các khách sạn và villa ưa thích của bạn</p>
      </div>

      {isLoading ? (
        <ListingGrid listings={[]} isLoading={true} />
      ) : error ? (
        <ErrorState
          title="Lỗi tải danh sách yêu thích"
          message={error}
          onRetry={fetchWishlist}
          isRetrying={isLoading}
        />
      ) : wishlistItems.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-8 h-8 text-red-500 fill-red-100" />}
          title="Danh sách yêu thích đang trống"
          description="Nhấp vào biểu tượng trái tim ở bất kỳ chỗ nghỉ nào để lưu lại danh sách các chuyến đi mơ ước của bạn."
          actionLabel="Khám phá chỗ nghỉ ngay"
          onAction={() => router.push('/search')}
        />
      ) : (
        <ListingGrid listings={wishlistItems} isLoading={false} />
      )}
    </div>
  );
}
