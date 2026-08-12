'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/dummy-data';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onOpenFilterModal: () => void;
}

export function CategoryBar({
  selectedCategory,
  onSelectCategory,
  onOpenFilterModal,
}: CategoryBarProps) {
  return (
    <div className="bg-white border-b border-border-light py-4 sticky top-20 z-30 shadow-sm">
      <div className="airbnb-container flex items-center justify-between gap-4">
        {/* Categories Scrollable Row */}
        <div className="flex items-center gap-8 overflow-x-auto scrollbar-none py-1 flex-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  'flex flex-col items-center gap-2 pb-2 text-xs font-semibold whitespace-nowrap transition-all border-b-2 duration-200 hover:text-main hover:border-border',
                  isSelected
                    ? 'border-main text-main font-extrabold'
                    : 'border-transparent text-muted'
                )}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Trigger Button */}
        <button
          onClick={onOpenFilterModal}
          className="hidden sm:flex items-center gap-2 border border-border rounded-xl px-4 py-2.5 text-xs font-bold text-main hover:border-main hover:bg-surface transition-all shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Bộ lọc</span>
        </button>
      </div>
    </div>
  );
}
