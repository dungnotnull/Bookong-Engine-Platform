'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { PropertyListing } from '@/lib/dummy-data';
import { Hotel } from '@/types/hotel';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

export type ListingItemType = PropertyListing | Hotel;

interface ListingCardProps {
  listing: ListingItemType;
  className?: string;
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Normalize data between PropertyListing and Hotel
  const title = 'title' in listing ? listing.title : listing.name;
  const location = 'location' in listing ? listing.location : `${listing.city || ''} ${listing.address ? `· ${listing.address}` : ''}`;
  const rating = listing.rating || 9.0;
  const price = 'pricePerNight' in listing 
    ? listing.pricePerNight 
    : (listing.rooms && listing.rooms.length > 0 ? listing.rooms[0].basePrice : 1500000);

  const rawImages = (listing.images && listing.images.length > 0)
    ? listing.images
    : (('coverImage' in listing && listing.coverImage) ? [listing.coverImage] : []);

  const validImages = rawImages.filter((img) => img && typeof img === 'string' && !img.startsWith('blob:'));

  const images = validImages.length > 0
    ? validImages
    : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop'];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);

    try {
      if (nextLiked) {
        await apiClient.post('/wishlist', { hotelId: listing.id });
      } else {
        await apiClient.delete(`/wishlist/${listing.id}`);
      }
    } catch {
      // Optimistic UI state kept
    }
  };

  return (
    <div className={cn('group relative flex flex-col cursor-pointer', className)}>
      {/* Image Carousel Slider container */}
      <div className="relative aspect-[20/19] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-airbnb-card group-hover:shadow-airbnb-hover transition-all duration-300">
        <Link href={`/hotels/${listing.id}`} className="block h-full w-full">
          <Image
            src={images[currentImageIndex]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {'isGuestFavorite' in listing && listing.isGuestFavorite && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-main shadow-md backdrop-blur-sm">
              Được khách yêu thích
            </span>
          )}
        </div>

        {/* Heart Wishlist Button */}
        <button
          onClick={toggleWishlist}
          aria-label="Thêm vào yêu thích"
          className="absolute top-3 right-3 z-10 p-2 rounded-full transition-transform active:scale-90 hover:scale-110"
        >
          <Heart
            className={cn(
              'w-6 h-6 transition-colors duration-200 drop-shadow-md',
              isLiked ? 'fill-rausch text-rausch' : 'text-white fill-black/20 stroke-white stroke-[2]'
            )}
          />
        </button>

        {/* Arrow Navigation (shown on hover if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/90 text-main shadow-md opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/90 text-main shadow-md opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot Carousel Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Listing Content Description */}
      <div className="mt-3 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-sm text-main line-clamp-1 group-hover:text-rausch transition-colors">
            {title}
          </h3>
          {typeof listing.rating === 'number' && listing.rating > 0 ? (
            <div className="flex items-center gap-1 text-xs font-semibold text-main shrink-0">
              <Star className="w-3.5 h-3.5 fill-main text-main" />
              <span>{listing.rating.toFixed(1)}</span>
            </div>
          ) : typeof listing.starRating === 'number' && listing.starRating > 0 ? (
            <div className="flex items-center gap-0.5 text-xs font-semibold text-amber-600 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{listing.starRating} sao</span>
            </div>
          ) : (
            <div className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded shrink-0">
              Mới
            </div>
          )}
        </div>

        <p className="text-xs text-muted font-normal line-clamp-1">{location}</p>

        <div className="mt-1.5 flex items-baseline gap-1 text-xs text-main">
          <span className="font-bold text-sm text-main">{formatCurrency(price)}</span>
          <span className="text-muted font-normal">/ đêm</span>
        </div>
      </div>
    </div>
  );
}
