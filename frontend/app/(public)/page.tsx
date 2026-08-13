'use client';

import React, { useState } from 'react';
import { PillSearchBar } from '@/components/search/pill-search-bar';
import { CategoryBar } from '@/components/listing/category-bar';
import { ListingGrid } from '@/components/listing/listing-grid';
import { FilterModal } from '@/components/search/filter-modal';
import { DUMMY_LISTINGS } from '@/lib/dummy-data';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredListings = selectedCategory === 'all'
    ? DUMMY_LISTINGS
    : DUMMY_LISTINGS.filter((item) => item.category === selectedCategory);

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

      {/* Category Scroll Filter Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenFilterModal={() => setIsFilterOpen(true)}
      />

      {/* Main Listing Grid */}
      <section>
        <ListingGrid listings={filteredListings} />
      </section>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => {}}
      />
    </div>
  );
}
