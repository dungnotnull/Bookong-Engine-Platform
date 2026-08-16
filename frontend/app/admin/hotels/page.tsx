'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Trash2,
  User,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog } from '@/components/ui/dialog';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Pagination } from '@/components/common/pagination';
import { apiClient } from '@/lib/api-client';
import { formatDateVi, normalizeImageUrl } from '@/lib/formatters';

interface AdminHotelItem {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country?: string;
  starRating?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  coverImage?: string;
  images?: string[];
  createdAt: string;
  host?: {
    email: string;
    fullName?: string;
  };
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<AdminHotelItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionHotelId, setActionHotelId] = useState<string | null>(null);
  const [hotelToDelete, setHotelToDelete] = useState<AdminHotelItem | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 10;

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = { page, limit: LIMIT };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      const res: any = await apiClient.get('/admin/hotels', { params });
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const meta = res?.meta || {};

      setHotels(data);
      setTotalPages(meta.totalPages || Math.ceil((data.length || 1) / LIMIT));
      setTotalItems(meta.total ?? data.length);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách khách sạn. Vui lòng kiểm tra quyền Admin.');
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleUpdateStatus = async (hotelId: string, isApproved: boolean) => {
    setActionHotelId(hotelId);
    try {
      await apiClient.patch(`/admin/hotels/${hotelId}/approve`, { isApproved });
      const newStatus = isApproved ? 'APPROVED' : 'REJECTED';
      setHotels((prev) =>
        prev.map((h) => (h.id === hotelId ? { ...h, status: newStatus } : h))
      );
    } catch (err: any) {
      alert(err?.message || 'Cập nhật trạng thái duyệt thất bại.');
    } finally {
      setActionHotelId(null);
    }
  };

  const handleDeleteHotel = async () => {
    if (!hotelToDelete) return;
    setActionHotelId(hotelToDelete.id);
    try {
      await apiClient.delete(`/hotels/${hotelToDelete.id}`);
      setHotels((prev) => prev.filter((h) => h.id !== hotelToDelete.id));
      setHotelToDelete(null);
    } catch (err: any) {
      alert(err?.message || 'Xóa khách sạn thất bại.');
    } finally {
      setActionHotelId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Quản lý Tất cả Khách sạn</h1>
          <p className="text-xs text-slate-500 mt-1">
            Kiểm soát toàn bộ các cơ sở lưu trú, duyệt hoặc tạm dừng kinh doanh trên toàn hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="navy" className="px-3 py-1 text-xs font-bold gap-1">
            <Building2 className="w-3.5 h-3.5 text-booking-yellow" /> Tổng {totalItems} Khách sạn
          </Badge>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-500 px-3 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Trạng thái:
        </span>
        {[
          { id: 'ALL', label: 'Tất cả' },
          { id: 'APPROVED', label: 'Đã duyệt (Active)' },
          { id: 'PENDING', label: 'Đang chờ duyệt' },
          { id: 'REJECTED', label: 'Bị từ chối' },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-booking-navy text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Table / Data Content */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
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
          title="Không tìm thấy khách sạn nào"
          description="Chưa có cơ sở lưu trú nào phù hợp với bộ lọc trạng thái được chọn."
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-airbnb overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Thông tin Khách sạn</th>
                    <th className="py-3.5 px-4">Chủ nhà (Host)</th>
                    <th className="py-3.5 px-4">Ngày đăng ký</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4 text-right">Thao tác Quản trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {hotels.map((hotel) => {
                    const coverUrl = normalizeImageUrl(
                      hotel.coverImage || (hotel.images && hotel.images[0]) || ''
                    );

                    return (
                      <tr key={hotel.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Hotel Name & Cover */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-gray-200 flex items-center justify-center">
                              {coverUrl ? (
                                <Image src={coverUrl} alt={hotel.name} fill className="object-cover" />
                              ) : (
                                <Building2 className="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm text-slate-900">{hotel.name}</span>
                              {hotel.starRating && hotel.starRating > 0 ? (
                                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {hotel.starRating} sao
                                </span>
                              ) : null}
                            </div>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-booking-navy shrink-0" />
                              {hotel.address}, {hotel.city}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Host Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {hotel.host?.fullName || 'Chủ nhà'}
                            </p>
                            <p className="text-[10px] text-slate-500 font-semibold">{hotel.host?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 font-semibold text-gray-600">
                        {formatDateVi(hotel.createdAt)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {hotel.status === 'APPROVED' ? (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200/60 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đã duyệt (Active)
                          </span>
                        ) : hotel.status === 'REJECTED' ? (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-rose-700 bg-rose-50 border border-rose-200/60 inline-flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Bị từ chối
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-amber-700 bg-amber-50 border border-amber-200/60 inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 animate-spin" /> Đang chờ duyệt
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/hotels/${hotel.id}`} target="_blank">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs font-semibold text-gray-600 hover:text-booking-blue gap-1"
                              title="Xem trang chi tiết công khai"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>

                          {hotel.status !== 'APPROVED' && (
                            <Button
                              variant="action"
                              size="sm"
                              disabled={actionHotelId === hotel.id}
                              onClick={() => handleUpdateStatus(hotel.id, true)}
                              className="text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                            </Button>
                          )}

                          {hotel.status !== 'REJECTED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={actionHotelId === hotel.id}
                              onClick={() => handleUpdateStatus(hotel.id, false)}
                              className="text-xs font-bold text-amber-700 border-amber-300 hover:bg-amber-50"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Từ chối
                            </Button>
                          )}

                          <Button
                            variant="danger"
                            size="sm"
                            disabled={actionHotelId === hotel.id}
                            onClick={() => setHotelToDelete(hotel)}
                            className="text-xs font-bold px-2"
                            title="Xóa khách sạn"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
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

      {/* Modal Confirm Delete Hotel */}
      <Dialog
        isOpen={!!hotelToDelete}
        onClose={() => setHotelToDelete(null)}
        title="Xác nhận Xóa Khách sạn"
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-gray-700">
            Bạn có chắc chắn muốn xóa vĩnh viễn khách sạn <strong>{hotelToDelete?.name}</strong> khỏi hệ thống?
            Hành động này sẽ xóa toàn bộ các loại phòng và đơn đặt phòng liên quan.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setHotelToDelete(null)}>Hủy bỏ</Button>
            <Button
              variant="danger"
              onClick={handleDeleteHotel}
              disabled={!!actionHotelId}
              className="font-bold"
            >
              {actionHotelId === hotelToDelete?.id ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
