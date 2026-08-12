'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Building2, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { HotelWizardForm } from '@/components/host/hotel-wizard-form';
import { Hotel } from '@/types/hotel';
import { apiClient } from '@/lib/api-client';

export default function HostPropertiesPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock dữ liệu ban đầu nếu chưa gọi API backend
  const mockHotels: Hotel[] = [
    {
      id: 'hotel_1',
      hostId: 'host_current',
      name: 'Phú Quốc Sunset Luxury Resort',
      address: 'Đường Trần Hưng Đạo, Dương Đông',
      city: 'Phú Quốc',
      description: 'Resort sát biển sở hữu hồ bơi vô cực ngắm hoàng hôn cực đẹp...',
      rating: 9.2,
      reviewCount: 142,
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      images: [],
      amenities: [],
      isApproved: true,
    },
    {
      id: 'hotel_2',
      hostId: 'host_current',
      name: 'Đà Nẵng Ocean View Villa',
      address: 'Võ Nguyên Giáp, Sơn Trà',
      city: 'Đà Nẵng',
      description: 'Villa sang trọng phong cách hiện đại thích hợp cho gia đình...',
      rating: 8.9,
      reviewCount: 96,
      coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
      images: [],
      amenities: [],
      isApproved: true,
    },
  ];

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/hotels/my-hotels');
      const data = (res as any).data;
      if (Array.isArray(data) && data.length > 0) {
        setHotels(data);
      } else {
        setHotels(mockHotels);
      }
    } catch {
      setHotels(mockHotels);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleCreatedSuccess = () => {
    setIsModalOpen(false);
    fetchHotels();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-booking-navy">Danh sách Khách sạn của bạn</h1>
          <p className="text-xs text-gray-500 mt-1">Quản lý và tạo mới các cơ sở lưu trú đăng trên Bookong</p>
        </div>
        <Button variant="action" onClick={() => setIsModalOpen(true)} className="font-bold gap-2">
          <Plus className="w-4 h-4" />
          Thêm Khách sạn mới
        </Button>
      </div>

      {/* Hotel Property Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-2xl border border-gray-100 shadow-airbnb overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full bg-gray-100">
                  {hotel.coverImage ? (
                    <Image src={hotel.coverImage} alt={hotel.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Building2 className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-booking-navy text-white px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-booking-yellow text-booking-yellow" />
                    {hotel.rating || 9.0}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-base text-gray-900">{hotel.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-booking-navy shrink-0" />
                    {hotel.address}, {hotel.city}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-2">{hotel.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-4">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Đã duyệt (Active)
                </span>
                <Button variant="outline" size="sm" className="font-bold">
                  Quản lý loại phòng
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Wizard Form */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Đăng ký Khách sạn mới">
        <HotelWizardForm onSuccess={handleCreatedSuccess} onCancel={() => setIsModalOpen(false)} />
      </Dialog>
    </div>
  );
}
