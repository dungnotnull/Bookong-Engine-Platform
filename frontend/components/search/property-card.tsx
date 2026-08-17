'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Sparkles, Check, Heart } from 'lucide-react';
import { Hotel } from '@/types/hotel';
import { formatCurrency, normalizeImageUrl } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/use-auth-store';

interface PropertyCardProps {
  hotel: Hotel;
}

export function PropertyCard({ hotel }: PropertyCardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const searchParams = useSearchParams();
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  const [isLiked, setIsLiked] = useState<boolean>(Boolean((hotel as any).isWishlisted));
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const isWishlistedProp = (hotel as any).isWishlisted;
  React.useEffect(() => {
    if (isWishlistedProp !== undefined) {
      setIsLiked(Boolean(isWishlistedProp));
    }
  }, [isWishlistedProp]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isTogglingWishlist) return;

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setIsTogglingWishlist(true);

    try {
      if (nextLiked) {
        await apiClient.post('/wishlist', { hotelId: hotel.id });
      } else {
        await apiClient.delete(`/wishlist/${hotel.id}`);
      }
    } catch {
      // Hoàn tác state nếu gọi API thất bại
      setIsLiked(!nextLiked);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const queryParams = new URLSearchParams();
  if (checkIn) queryParams.set('checkIn', checkIn);
  if (checkOut) queryParams.set('checkOut', checkOut);
  if (guests) queryParams.set('guests', guests);

  const queryString = queryParams.toString();
  const hotelHref = `/hotels/${hotel.id}${queryString ? `?${queryString}` : ''}`;
  const minRoomPrice = hotel.rooms && hotel.rooms.length > 0 
    ? Math.min(...hotel.rooms.map((r) => r.basePrice))
    : 0;

  const displayImage = normalizeImageUrl(
    hotel.coverImage || (hotel.images && hotel.images[0]) || ''
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-airbnb overflow-hidden flex flex-col md:flex-row gap-4 p-4 hover:border-booking-blue transition-smooth">
      {/* Property Image Slider Preview */}
      <div className="relative w-full md:w-64 h-48 md:h-auto rounded-xl overflow-hidden shrink-0 bg-gray-100">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={hotel.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs">
            Chưa có ảnh
          </div>
        )}
        <button
          onClick={toggleWishlist}
          disabled={isTogglingWishlist}
          title={isLiked ? 'Bỏ lưu' : 'Lưu vào danh sách yêu thích'}
          aria-label={isLiked ? 'Bỏ lưu' : 'Lưu vào danh sách yêu thích'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-gray-600 shadow-md transition-all duration-200 active:scale-90 hover:scale-110 z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Property Information */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-booking-navy hover:underline">
                <Link href={hotelHref}>{hotel.name}</Link>
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-booking-navy shrink-0" />
                {hotel.address}, {hotel.city}
              </p>
            </div>

            {/* Rating Badge */}
            <div className="flex items-center gap-2 shrink-0">
              {hotel.rating && hotel.rating > 0 ? (
                <>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-gray-900">Đánh giá tốt</span>
                    <span className="text-[10px] text-gray-500">{hotel.reviewCount || 0} đánh giá</span>
                  </div>
                  <div className="bg-booking-navy text-white text-xs font-black px-2.5 py-1.5 rounded-xl">
                    {hotel.rating.toFixed(1)}
                  </div>
                </>
              ) : hotel.starRating && hotel.starRating > 0 ? (
                <div className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-xl border border-amber-200">
                  {hotel.starRating} sao
                </div>
              ) : (
                <div className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-xl">
                  Mới
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 mt-2">{hotel.description || 'Chưa có mô tả'}</p>

          {/* Special Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="green">
              <Check className="w-3 h-3" /> Miễn phí hủy phòng
            </Badge>
            {(hotel as any).similarityScore ? (
              <Badge variant="yellow">
                <Sparkles className="w-3 h-3 text-amber-700" /> Khớp AI: {Math.round((hotel as any).similarityScore * 100)}%
              </Badge>
            ) : null}
          </div>
        </div>

        {/* Pricing & Booking CTA */}
        <div className="flex items-end justify-between border-t border-gray-100 pt-3 mt-2">
          <div>
            <span className="text-[11px] text-gray-500 block">Giá từ</span>
            <span className="text-lg font-black text-booking-navy">
              {minRoomPrice > 0 ? formatCurrency(minRoomPrice) : 'Liên hệ'}
            </span>
            <span className="text-[10px] text-gray-400 block">Đã bao gồm thuế & phí</span>
          </div>
          <Link href={hotelHref}>
            <Button variant="action" size="md" className="font-bold">
              Xem phòng trống
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
