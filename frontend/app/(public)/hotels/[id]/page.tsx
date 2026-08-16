'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { MapPin, Star, Share2, Heart, Wifi, Waves, Car, Wind, Grid } from 'lucide-react';
import { RoomSelectionTable } from '@/components/hotel-detail/room-selection-table';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageGalleryModal } from '@/components/common/image-gallery-modal';
import { Hotel } from '@/types/hotel';
import { apiClient } from '@/lib/api-client';

export default function HotelDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Tính số đêm (Nights) từ checkIn và checkOut
  let nights = 1;
  if (checkIn && checkOut) {
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) nights = diffDays;
  }

  const fetchHotel = useCallback(async () => {
    if (!params.id) return;
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API GET /api/v1/hotels/:id kèm query checkIn / checkOut nếu có
      const queryStr = new URLSearchParams({
        ...(checkIn && { checkIn }),
        ...(checkOut && { checkOut }),
      }).toString();

      const [hotelRes, reviewsRes]: [any, any] = await Promise.all([
        apiClient.get(`/hotels/${params.id}${queryStr ? `?${queryStr}` : ''}`),
        apiClient.get(`/hotels/${params.id}/reviews`).catch(() => []),
      ]);

      const data = hotelRes?.data || hotelRes;
      if (data && typeof data === 'object' && data.id) {
        setHotel(data);
      } else {
        setHotel(null);
      }

      const revList = Array.isArray(reviewsRes?.data) ? reviewsRes.data : Array.isArray(reviewsRes) ? reviewsRes : [];
      setReviews(revList);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải thông tin chi tiết khách sạn. Vui lòng thử lại sau.');
      setHotel(null);
    } finally {
      setIsLoading(false);
    }
  }, [params.id, checkIn, checkOut]);

  useEffect(() => {
    fetchHotel();
  }, [fetchHotel]);

  // Wishlist toggle handler for BUG-014
  const toggleWishlist = async () => {
    if (!hotel) return;
    try {
      if (isLiked) {
        await apiClient.delete(`/wishlist/${hotel.id}`);
        setIsLiked(false);
      } else {
        await apiClient.post('/wishlist', { hotelId: hotel.id });
        setIsLiked(true);
      }
    } catch {
      setIsLiked(!isLiked);
    }
  };

  if (isLoading) {
    return (
      <div className="airbnb-container py-8 space-y-6">
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <Skeleton className="h-80 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="md:col-span-2 h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="airbnb-container py-12">
        <ErrorState
          title="Không thể tải thông tin khách sạn"
          message={error}
          onRetry={fetchHotel}
          isRetrying={isLoading}
        />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="airbnb-container py-12">
        <EmptyState
          title="Không tìm thấy thông tin khách sạn"
          description="Khách sạn bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ khỏi sàn."
        />
      </div>
    );
  }

  const galleryImages = hotel.images && hotel.images.length > 0
    ? hotel.images
    : (hotel.coverImage ? [hotel.coverImage] : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop']);

  return (
    <div className="airbnb-container py-8 space-y-8">
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
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" /> Chia sẻ
          </button>
          <button
            onClick={toggleWishlist}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
              isLiked
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            {isLiked ? 'Đã lưu Yêu thích' : 'Lưu Yêu thích'}
          </button>
        </div>
      </div>

      {/* Hero Photo Gallery Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-3 h-80 md:h-96 rounded-2xl overflow-hidden shadow-airbnb group">
        <div
          onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}
          className="md:col-span-2 relative h-full cursor-pointer overflow-hidden"
        >
          <Image src={galleryImages[0]} alt="Cover" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="grid grid-rows-2 gap-3 h-full">
          <div
            onClick={() => { setGalleryIndex(1); setIsGalleryOpen(true); }}
            className="relative h-full cursor-pointer overflow-hidden"
          >
            <Image src={galleryImages[1] || galleryImages[0]} alt="Gallery 1" fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div
            onClick={() => { setGalleryIndex(2); setIsGalleryOpen(true); }}
            className="relative h-full cursor-pointer overflow-hidden"
          >
            <Image src={galleryImages[2] || galleryImages[0]} alt="Gallery 2" fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

        {/* Button 'Xem tất cả hình ảnh' */}
        <button
          onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}
          className="absolute bottom-4 right-4 px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white text-booking-navy font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2 border border-gray-200 backdrop-blur-md"
        >
          <Grid className="w-4 h-4 text-booking-blue" />
          Xem tất cả hình ảnh ({galleryImages.length})
        </button>
      </div>

      {/* Description & Amenities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Giới thiệu chỗ nghỉ</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {hotel.description || 'Chưa có thông tin mô tả chi tiết về chỗ nghỉ này.'}
          </p>

          <div className="space-y-2 pt-4">
            <h4 className="text-xs font-bold text-gray-800">Các tiện nghi nổi bật:</h4>
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
              <span className="font-bold text-sm text-booking-navy block">Đánh giá chung</span>
              <span className="text-xs text-gray-500">{hotel.reviewCount || 0} đánh giá xác thực</span>
            </div>
            <div className="bg-booking-navy text-white text-base font-black px-3 py-2 rounded-xl">
              {hotel.rating ? hotel.rating.toFixed(1) : '9.0'}
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
      <RoomSelectionTable rooms={hotel.rooms || []} nights={nights} checkIn={checkIn} checkOut={checkOut} />

      {/* Verified Guest Reviews List Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-airbnb p-6 space-y-4">
        <h3 className="text-lg font-bold text-booking-navy">Đánh giá thực tế từ khách đã lưu trú</h3>
        {reviews.length === 0 ? (
          <p className="text-xs text-gray-500 italic">Chưa có đánh giá nào cho khách sạn này. Đánh giá mới nhất sẽ xuất hiện sau khi khách hàng hoàn tất lưu trú.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev: any, idx: number) => (
              <div key={rev.id || idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{rev.user?.fullName || rev.userName || 'Khách xác thực'}</span>
                  <span className="bg-booking-navy text-white text-[11px] font-black px-2 py-0.5 rounded">
                    {((rev.cleanlinessRating + rev.locationRating + rev.serviceRating + rev.valueRating) / 4).toFixed(1)} / 10
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed italic">&quot;{rev.comment}&quot;</p>
                <div className="text-[10px] text-gray-400 font-semibold pt-1 border-t border-gray-200 flex justify-between">
                  <span>Vị trí: {rev.locationRating}/10 · Sạch sẽ: {rev.cleanlinessRating}/10</span>
                  <span>Đã lưu trú</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Gallery Modal */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        initialIndex={galleryIndex}
        title={hotel.name}
      />
    </div>
  );
}
