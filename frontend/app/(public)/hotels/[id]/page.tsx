'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Star, Share2, Heart, Check, Wifi, Waves, Car, Wind } from 'lucide-react';
import { RoomSelectionTable } from '@/components/hotel-detail/room-selection-table';
import { Hotel } from '@/types/hotel';

export default function HotelDetailPage({ params }: { params: { id: string } }) {
  const [hotel] = useState<Hotel>({
    id: params.id || 'hotel_1',
    hostId: 'host_1',
    name: 'Sunset Sanato Resort & Villa Phú Quốc',
    address: 'Đường Trần Hưng Đạo, Dương Đông',
    city: 'Phú Quốc',
    description:
      'Sunset Sanato Resort & Villa sở hữu vị trí đắc địa sát bờ biển Dương Đông với không gian thiết kế sang trọng, hồ bơi vô cực ngắm hoàng hôn đỉnh cao...',
    rating: 9.2,
    reviewCount: 142,
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop',
    ],
    amenities: [
      { id: 'wifi', name: 'WiFi miễn phí', category: 'HOTEL' },
      { id: 'pool', name: 'Hồ bơi vô cực', category: 'HOTEL' },
      { id: 'parking', name: 'Bãi đỗ xe', category: 'HOTEL' },
    ],
    rooms: [
      {
        id: 'room_1',
        hotelId: params.id,
        name: 'Deluxe Ocean View Balcony',
        type: 'Deluxe',
        basePrice: 1500000,
        capacity: 2,
        quantity: 5,
        amenities: [],
      },
      {
        id: 'room_2',
        hotelId: params.id,
        name: 'Executive Ocean Villa Suite',
        type: 'Suite',
        basePrice: 2800000,
        capacity: 4,
        quantity: 2,
        amenities: [],
      },
    ],
  });

  return (
    <div className="booking-container py-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-booking-navy text-white px-2 py-0.5 rounded">Resort</span>
            <div className="flex text-booking-yellow">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">{hotel.name}</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4 text-booking-navy" />
            {hotel.address}, {hotel.city}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50">
            <Share2 className="w-4 h-4" /> Chia sẻ
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50">
            <Heart className="w-4 h-4 text-red-500" /> Lưu
          </button>
        </div>
      </div>

      {/* Hero Photo Gallery Grid (Booking.com 3-Image Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-80 md:h-96 rounded-2xl overflow-hidden shadow-airbnb">
        <div className="md:col-span-2 relative h-full">
          <Image src={hotel.images[0]} alt="Cover" fill className="object-cover" />
        </div>
        <div className="grid grid-rows-2 gap-3 h-full">
          <div className="relative h-full">
            <Image src={hotel.images[1]} alt="Gallery 1" fill className="object-cover" />
          </div>
          <div className="relative h-full">
            <Image src={hotel.images[2]} alt="Gallery 2" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Description & Amenities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Giới thiệu chỗ nghỉ</h3>
          <p className="text-xs text-gray-600 leading-relaxed">{hotel.description}</p>

          <div className="space-y-2 pt-4">
            <h4 className="text-xs font-bold text-gray-800">Các tiện nghi được ưa chuộng nhất:</h4>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                <Wifi className="w-4 h-4 text-booking-blue" /> WiFi miễn phí
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                <Waves className="w-4 h-4 text-booking-blue" /> Hồ bơi ngoài trời
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                <Car className="w-4 h-4 text-booking-blue" /> Bãi đỗ xe
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                <Wind className="w-4 h-4 text-booking-blue" /> Điều hòa nhiệt độ
              </span>
            </div>
          </div>
        </div>

        {/* Rating Score Card */}
        <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-booking-navy block">Tuyệt hảo</span>
              <span className="text-xs text-gray-500">{hotel.reviewCount} đánh giá xác thực</span>
            </div>
            <div className="bg-booking-navy text-white text-base font-black px-3 py-2 rounded-xl">
              {hotel.rating}
            </div>
          </div>
          <div className="border-t border-blue-100 pt-3 text-xs space-y-1.5 text-gray-700">
            <p><span className="font-semibold text-gray-900">Vị trí:</span> 9.5 / 10</p>
            <p><span className="font-semibold text-gray-900">Sạch sẽ:</span> 9.3 / 10</p>
            <p><span className="font-semibold text-gray-900">Phục vụ:</span> 9.1 / 10</p>
          </div>
        </div>
      </div>

      {/* Interactive Room Table */}
      <RoomSelectionTable rooms={hotel.rooms || []} nights={2} />
    </div>
  );
}
