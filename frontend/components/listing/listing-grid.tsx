'use client';

import React from 'react';
import { ListingCard, ListingItemType } from '@/components/listing/listing-card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/empty-state';

interface ListingGridProps {
  listings: ListingItemType[];
  isLoading?: boolean;
}

export function ListingGrid({ listings, isLoading = false }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="airbnb-container py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="space-y-3">
            <Skeleton className="aspect-[20/19] w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="airbnb-container py-8">
        <EmptyState
          title="Không tìm thấy chỗ nghỉ phù hợp"
          description="Hiện chưa có chỗ nghỉ nào khả dụng hoặc không có dữ liệu trả về từ hệ thống."
        />
      </div>
    );
  }

  return (
    <div className="airbnb-container py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
