'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Building2, MapPin, Star, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { HotelWizardForm } from '@/components/host/hotel-wizard-form';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Pagination } from '@/components/common/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Hotel } from '@/types/hotel';
import { apiClient } from '@/lib/api-client';

export default function HostPropertiesPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 10;

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await apiClient.get('/hotels/my-hotels', { params: { page, limit: LIMIT } });
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const meta = res?.meta || {};

      setHotels(data);
      setTotalPages(meta.totalPages || Math.ceil((data.length || 1) / LIMIT));
      setTotalItems(meta.total ?? data.length);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách khách sạn của bạn. Vui lòng kiểm tra quyền Host hoặc thử lại sau.');
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

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
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorState
          title="Lỗi tải danh sách khách sạn"
          message={error}
          onRetry={fetchHotels}
          isRetrying={isLoading}
        />
      ) : hotels.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8" />}
          title="Bạn chưa có khách sạn nào"
          description="Bắt đầu mở rộng kinh doanh bằng cách đăng ký cơ sở lưu trú đầu tiên của bạn trên hệ thống Bookong."
          actionLabel="Tạo khách sạn ngay"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <>
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
                      {hotel.rating ? hotel.rating.toFixed(1) : '9.0'}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-base text-gray-900">{hotel.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-booking-navy shrink-0" />
                      {hotel.address}, {hotel.city}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-2">{hotel.description || 'Chưa có mô tả'}</p>
                  </div>
                </div>

                {/* Footer Action Card - Link Quản lý loại phòng */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-4">
                  {(() => {
                    const isApproved = hotel.status === 'APPROVED' || hotel.isApproved === true;
                    const isRejected = hotel.status === 'REJECTED';
                    if (isApproved) {
                      return (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200/60 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Đã duyệt (Active)
                        </span>
                      );
                    }
                    if (isRejected) {
                      return (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-red-700 bg-red-50 border border-red-200/60 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          Bị từ chối
                        </span>
                      );
                    }
                    return (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full text-amber-700 bg-amber-50 border border-amber-200/60 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Đang chờ duyệt
                      </span>
                    );
                  })()}
                  
                  {/* Nút Quản lý loại phòng có sự kiện onClick / Link sang /host/rooms */}
                  <Link href={`/host/rooms?hotelId=${hotel.id}`}>
                    <Button variant="outline" size="sm" className="font-bold gap-1.5 hover:bg-booking-blue hover:text-white transition-colors">
                      <BedDouble className="w-3.5 h-3.5" /> Quản lý loại phòng
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalItems}
            limit={LIMIT}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}

      {/* Modal Wizard Form */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Đăng ký Khách sạn mới">
        <HotelWizardForm onSuccess={handleCreatedSuccess} onCancel={() => setIsModalOpen(false)} />
      </Dialog>
    </div>
  );
}
