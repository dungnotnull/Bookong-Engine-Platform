'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, Plus, Edit2, Trash2, CheckCircle2, ShieldAlert, Tag, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { CouponFormModal, CouponData } from '@/components/coupons/coupon-form-modal';
import { formatCurrency, formatDateVi } from '@/lib/formatters';
import { apiClient } from '@/lib/api-client';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponData | null>(null);

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await apiClient.get('/coupons');
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setCoupons(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách mã giảm giá hệ thống.');
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreate = () => {
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: CouponData) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`[ADMIN] Bạn có chắc chắn muốn xóa vĩnh viễn mã giảm giá "${code}"?`)) return;

    try {
      await apiClient.delete(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Không thể xóa mã giảm giá.');
    }
  };

  const activeCount = coupons.filter((c) => c.status === 'ACTIVE').length;
  const globalCouponsCount = coupons.filter((c) => !(c as any).hostId).length;

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="navy" className="bg-booking-blue text-white">Admin Portal</Badge>
            <span className="text-xs text-gray-500 font-bold">Toàn hệ thống</span>
          </div>
          <h1 className="text-2xl font-black text-booking-navy mt-1 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-booking-blue" />
            Quản lý Mã giảm giá Hệ thống (Admin Coupons)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý tất cả mã giảm giá chiến dịch toàn hệ thống và mã giảm giá của các Đối tác Host
          </p>
        </div>

        <Button onClick={handleCreate} variant="yellow" className="font-bold text-slate-900 gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Tạo Mã Ưu Đãi Hệ Thống
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-airbnb flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-extrabold shrink-0">
            <Ticket className="w-6 h-6 text-booking-blue" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold block">Tổng mã toàn sàn</span>
            <span className="text-xl font-black text-booking-navy">{coupons.length} mã</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-airbnb flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold block">Mã đang hoạt động</span>
            <span className="text-xl font-black text-emerald-600">{activeCount} mã</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-airbnb flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-booking-navy flex items-center justify-center font-extrabold shrink-0">
            <ShieldAlert className="w-6 h-6 text-booking-blue" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold block">Mã Global Admin</span>
            <span className="text-xl font-black text-booking-navy">{globalCouponsCount} mã</span>
          </div>
        </div>
      </div>

      {/* Content Table */}
      {isLoading ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : error ? (
        <ErrorState title="Lỗi tải mã giảm giá" message={error} onRetry={fetchCoupons} isRetrying={isLoading} />
      ) : coupons.length === 0 ? (
        <EmptyState
          title="Chưa có mã giảm giá nào trên hệ thống"
          description="Tạo mã giảm giá chiến dịch toàn hệ thống đầu tiên."
          actionLabel="Tạo Mã Hệ Thống"
          onAction={handleCreate}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-airbnb overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase border-b border-gray-200">
                <tr>
                  <th className="p-4">Mã Code</th>
                  <th className="p-4">Phạm vi</th>
                  <th className="p-4">Mức giảm</th>
                  <th className="p-4">Điều kiện</th>
                  <th className="p-4">Đã dùng / Tổng</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Hạn dùng</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {coupons.map((coupon) => {
                  const usedCount = (coupon as any)._count?.usages || 0;
                  const isGlobal = !(coupon as any).hostId;
                  const isPercentage = coupon.discountType === 'PERCENTAGE';
                  const discountDisplay = isPercentage
                    ? `${coupon.amount}%`
                    : formatCurrency(coupon.amount);

                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4">
                        <span className="font-extrabold text-booking-navy bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-mono text-sm tracking-wider">
                          {coupon.code}
                        </span>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                          {coupon.visibility === 'PUBLIC' ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-500" /> Public
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-amber-500" /> Hidden
                            </>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        {isGlobal ? (
                          <Badge variant="navy" className="bg-purple-100 text-purple-800 border-purple-200">
                            Global Admin
                          </Badge>
                        ) : (
                          <Badge variant="gray" className="bg-gray-100 text-gray-700">
                            Host Partner
                          </Badge>
                        )}
                      </td>

                      <td className="p-4 font-bold text-gray-900">
                        {discountDisplay}
                        {isPercentage && coupon.maxDiscount && (
                          <span className="block text-[10px] text-gray-500 font-semibold">
                            Tối đa: {formatCurrency(coupon.maxDiscount)}
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-gray-600">
                        {coupon.minSpend ? (
                          <span>Tối thiểu {formatCurrency(coupon.minSpend)}</span>
                        ) : (
                          <span className="text-gray-400 italic">Không yêu cầu</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-booking-navy">{usedCount}</span>
                        <span className="text-gray-400">
                          {coupon.quantity ? ` / ${coupon.quantity}` : ' / Vô hạn'}
                        </span>
                      </td>

                      <td className="p-4">
                        {coupon.status === 'ACTIVE' ? (
                          <Badge variant="green">Hoạt động</Badge>
                        ) : coupon.status === 'PAUSED' ? (
                          <Badge variant="orange">Tạm dừng</Badge>
                        ) : coupon.status === 'EXPIRED' ? (
                          <Badge variant="gray">Hết hạn</Badge>
                        ) : (
                          <Badge variant="navy">Nháp</Badge>
                        )}
                      </td>

                      <td className="p-4 text-gray-600">
                        {coupon.expiryDate ? (
                          formatDateVi(coupon.expiryDate)
                        ) : (
                          <span className="text-emerald-600 font-semibold">Không giới hạn</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-booking-blue transition-colors"
                            title="Sửa mã"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => coupon.id && handleDelete(coupon.id, coupon.code)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Xóa mã"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CouponFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedCoupon}
        onSuccess={fetchCoupons}
      />
    </div>
  );
}
