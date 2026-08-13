'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  total?: number;
  limit?: number;
}

export function Pagination({ page, totalPages, onPageChange, total, limit }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers array (with ellipsis for large page counts)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const startItem = total && limit ? (page - 1) * limit + 1 : undefined;
  const endItem = total && limit ? Math.min(page * limit, total) : undefined;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-gray-100 mt-6">
      {/* Items count summary */}
      {total !== undefined && startItem !== undefined && endItem !== undefined ? (
        <p className="text-xs text-gray-500 font-medium">
          Hiển thị <strong className="text-gray-900">{startItem}-{endItem}</strong> trong tổng số <strong className="text-gray-900">{total}</strong> mục
        </p>
      ) : (
        <p className="text-xs text-gray-500 font-medium">
          Trang <strong className="text-gray-900">{page}</strong> / <strong className="text-gray-900">{totalPages}</strong>
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 w-8 p-0 rounded-lg"
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pages.map((p, idx) => (
          <React.Fragment key={idx}>
            {typeof p === 'number' ? (
              <button
                type="button"
                onClick={() => onPageChange(p)}
                className={`h-8 min-w-[32px] px-2.5 rounded-lg text-xs font-bold transition-all ${
                  p === page
                    ? 'bg-booking-blue text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ) : (
              <span className="px-1 text-xs text-gray-400 font-bold">...</span>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 w-8 p-0 rounded-lg"
          title="Trang tiếp"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
