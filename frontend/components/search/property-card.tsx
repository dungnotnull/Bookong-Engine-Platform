'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, Sparkles, Check, Heart } from 'lucide-react';
import { Hotel } from '@/types/hotel';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  hotel: Hotel;
}

export function PropertyCard({ hotel }: PropertyCardProps) {
  const searchParams = useSearchParams();
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  const queryParams = new URLSearchParams();
  if (checkIn) queryParams.set('checkIn', checkIn);
  if (checkOut) queryParams.set('checkOut', checkOut);
  if (guests) queryParams.set('guests', guests);

  const queryString = queryParams.toString();
  const hotelHref = `/hotels/${hotel.id}${queryString ? `?${queryString}` : ''}`;
  const minRoomPrice = hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0].basePrice : 1500000;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-airbnb overflow-hidden flex flex-col md:flex-row gap-4 p-4 hover:border-booking-blue transition-smooth">
      {/* Property Image Slider Preview */}
      <div className="relative w-full md:w-64 h-48 md:h-auto rounded-xl overflow-hidden shrink-0 bg-gray-100">
        <Image
          src={hotel.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop'}
          alt={hotel.name}
          fill
          className="object-cover"
        />
        <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-smooth">
          <Heart className="w-4 h-4" />
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
              <div className="text-right">
                <span className="block text-xs font-bold text-gray-900">Rất tốt</span>
                <span className="text-[10px] text-gray-500">{hotel.reviewCount || 120} đánh giá</span>
              </div>
              <div className="bg-booking-navy text-white text-xs font-black px-2.5 py-1.5 rounded-xl">
                {hotel.rating || 8.8}
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 mt-2">{hotel.description}</p>

          {/* Special Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="green">
              <Check className="w-3 h-3" /> Miễn phí hủy phòng
            </Badge>
            <Badge variant="yellow">
              <Sparkles className="w-3 h-3 text-amber-700" /> Khớp AI Semantic: 95%
            </Badge>
          </div>
        </div>

        {/* Pricing & Booking CTA */}
        <div className="flex items-end justify-between border-t border-gray-100 pt-3 mt-2">
          <div>
            <span className="text-[11px] text-gray-500 block">Giá từ</span>
            <span className="text-lg font-black text-booking-navy">{formatCurrency(minRoomPrice)}</span>
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
