'use client';

import React, { useEffect, useState } from 'react';
import { HeroSearchBar } from '@/components/search/hero-search-bar';
import { FilterSidebar } from '@/components/search/filter-sidebar';
import { PropertyCard } from '@/components/search/property-card';
import { Hotel } from '@/types/hotel';
import { apiClient } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchResultsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockSearchResults: Hotel[] = [
    {
      id: 'hotel_1',
      hostId: 'host_1',
      name: 'Phú Quốc Sunset Luxury Resort',
      address: 'Đường Trần Hưng Đạo, Dương Đông',
      city: 'Phú Quốc',
      description: 'Resort sát biển sở hữu hồ bơi vô cực ngắm hoàng hôn cực đẹp tại đảo ngọc...',
      rating: 9.2,
      reviewCount: 142,
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      images: [],
      amenities: [],
      rooms: [
        {
          id: 'room_1',
          hotelId: 'hotel_1',
          name: 'Deluxe Ocean View',
          type: 'Deluxe',
          basePrice: 1500000,
          capacity: 2,
          quantity: 5,
          amenities: [],
        },
      ],
    },
    {
      id: 'hotel_2',
      hostId: 'host_2',
      name: 'Đà Nẵng Ocean View Villa & Spa',
      address: 'Võ Nguyên Giáp, Sơn Trà',
      city: 'Đà Nẵng',
      description: 'Biệt thự phong cách hiện đại thích hợp nghỉ dưỡng gia đình...',
      rating: 8.9,
      reviewCount: 96,
      coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
      images: [],
      amenities: [],
      rooms: [
        {
          id: 'room_2',
          hotelId: 'hotel_2',
          name: 'Executive Villa',
          type: 'Suite',
          basePrice: 2800000,
          capacity: 4,
          quantity: 2,
          amenities: [],
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchSearch = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get('/search');
        const data = (res as any).data;
        if (Array.isArray(data) && data.length > 0) {
          setHotels(data);
        } else {
          setHotels(mockSearchResults);
        }
      } catch {
        setHotels(mockSearchResults);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearch();
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Search Bar */}
      <div className="bg-booking-navy py-6">
        <div className="booking-container">
          <HeroSearchBar />
        </div>
      </div>

      {/* Main Results Body */}
      <div className="booking-container flex flex-col md:flex-row gap-6">
        <FilterSidebar />

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-gray-900">
              Tìm thấy {hotels.length} chỗ nghỉ phù hợp
            </h1>
            <select className="text-xs font-bold border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-800">
              <option>Gợi ý hàng đầu</option>
              <option>Giá thấp đến cao</option>
              <option>Đánh giá cao nhất</option>
              <option>Độ khớp ngữ nghĩa (AI Score)</option>
            </select>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          ) : (
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <PropertyCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
