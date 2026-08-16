'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/formatters';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

export function ImageGalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title = 'Thư viện hình ảnh',
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const normalizedImages = images.map(normalizeImageUrl).filter(Boolean);

  const handleNext = useCallback(() => {
    if (normalizedImages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
  }, [normalizedImages.length]);

  const handlePrev = useCallback(() => {
    if (normalizedImages.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  }, [normalizedImages.length]);

  // Keyboard navigation listener (Arrow keys & Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  if (!isOpen || normalizedImages.length === 0) return null;

  const currentImage = normalizedImages[currentIndex] || normalizedImages[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md text-white animate-in fade-in duration-200">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 text-booking-yellow">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-gray-400">
              Hình ảnh <strong className="text-white">{currentIndex + 1}</strong> / {normalizedImages.length}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
          title="Đóng thư viện (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex-1 flex items-center justify-center p-4 min-h-0 select-none cursor-grab active:cursor-grabbing"
      >
        {/* Navigation Buttons */}
        {normalizedImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-white/20 backdrop-blur-sm text-white transition-all hover:scale-110 shadow-lg border border-white/10"
              title="Ảnh trước (Phím Mũi tên Trái)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-white/20 backdrop-blur-sm text-white transition-all hover:scale-110 shadow-lg border border-white/10"
              title="Ảnh tiếp theo (Phím Mũi tên Phải)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Large Image Preview Container */}
        <div className="relative max-w-5xl max-h-full flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`Gallery Preview ${currentIndex + 1}`}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl transition-all duration-300 transform scale-100"
          />
        </div>
      </div>

      {/* Bottom Thumbnails Carousel Bar */}
      {normalizedImages.length > 1 && (
        <div className="shrink-0 p-4 border-t border-white/10 bg-black/60 backdrop-blur-md overflow-x-auto">
          <div className="flex items-center justify-center gap-3 min-w-max mx-auto px-4">
            {normalizedImages.map((imgUrl, idx) => (
              <button
                key={`${imgUrl}-${idx}`}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  idx === currentIndex
                    ? 'border-booking-yellow scale-110 shadow-lg shadow-booking-yellow/20 ring-2 ring-booking-yellow/40'
                    : 'border-white/20 opacity-50 hover:opacity-100 hover:scale-105'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
