'use client';

import React from 'react';
import { PropertyListing } from '@/lib/dummy-data';
import { ListingCard } from '@/components/listing/listing-card';
import { Skeleton } from '@/components/ui/skeleton';

interface ListingGridProps {
  listings: PropertyListing[];
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
      <div className="airbnb-container py-16 text-center space-y-3">
        <h3 className="text-lg font-bold text-main">Không tìm thấy chỗ nghỉ phù hợp</h3>
        <p className="text-xs text-muted">Thử thay đổi bộ lọc hoặc chọn danh mục lưu trú khác.</p>
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
