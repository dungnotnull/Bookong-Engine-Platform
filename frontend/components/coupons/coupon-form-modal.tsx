'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Calendar, Hash, DollarSign, Percent, AlertCircle } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';

export interface CouponData {
  id?: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  amount: number;
  maxDiscount?: number | null;
  minSpend?: number | null;
  quantity?: number | null;
  usageLimitPerUser?: number;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  visibility: 'PUBLIC' | 'HIDDEN';
  startDate?: string | null;
  expiryDate?: string | null;
}

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CouponData | null;
  onSuccess: () => void;
}

export function CouponFormModal({ isOpen, onClose, initialData, onSuccess }: CouponFormModalProps) {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
  const [amount, setAmount] = useState<number>(10);
  const [maxDiscount, setMaxDiscount] = useState<string>('');
  const [minSpend, setMinSpend] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [usageLimitPerUser, setUsageLimitPerUser] = useState<number>(1);
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED'>('ACTIVE');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'HIDDEN'>('PUBLIC');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData?.id;

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || '');
      setDiscountType(initialData.discountType || 'PERCENTAGE');
      setAmount(initialData.amount || 0);
      setMaxDiscount(initialData.maxDiscount !== null && initialData.maxDiscount !== undefined ? String(initialData.maxDiscount) : '');
      setMinSpend(initialData.minSpend !== null && initialData.minSpend !== undefined ? String(initialData.minSpend) : '');
      setQuantity(initialData.quantity !== null && initialData.quantity !== undefined ? String(initialData.quantity) : '');
      setUsageLimitPerUser(initialData.usageLimitPerUser || 1);
      setStatus(initialData.status || 'ACTIVE');
      setVisibility(initialData.visibility || 'PUBLIC');
      setStartDate(initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '');
      setExpiryDate(initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '');
    } else {
      setCode('');
      setDiscountType('PERCENTAGE');
      setAmount(10);
      setMaxDiscount('');
      setMinSpend('');
      setQuantity('');
      setUsageLimitPerUser(1);
      setStatus('ACTIVE');
      setVisibility('PUBLIC');
      setStartDate('');
      setExpiryDate('');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('Vui lòng nhập mã giảm giá.');
      return;
    }

    if (amount <= 0) {
      setError('Giá trị giảm phải lớn hơn 0.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        code: code.trim().toUpperCase(),
        discountType,
        amount: Number(amount),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        minSpend: minSpend ? Number(minSpend) : null,
        quantity: quantity ? Number(quantity) : null,
        usageLimitPerUser: Number(usageLimitPerUser) || 1,
        status,
        visibility,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
      };

      if (isEdit && initialData?.id) {
        await apiClient.patch(`/coupons/${initialData.id}`, payload);
      } else {
        await apiClient.post('/coupons', payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu mã giảm giá. Vui lòng kiểm tra lại mã đã tồn tại hay chưa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={isEdit ? 'Chỉnh sửa Mã giảm giá' : 'Tạo Mã giảm giá mới'}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mã & Loại Giảm Giá */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-gray-800 block mb-1">Mã giảm giá (Code) *</label>
            <Input
              placeholder="VD: SUMMER2026"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              className="uppercase font-bold tracking-wider"
            />
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Loại giảm giá *</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              className="w-full p-2.5 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-booking-navy font-semibold"
            >
              <option value="PERCENTAGE">Theo Phần trăm (%)</option>
              <option value="FIXED_AMOUNT">Số tiền cố định (VND)</option>
            </select>
          </div>
        </div>

        {/* Mức giảm & Giảm tối đa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-gray-800 block mb-1">
              Mức giảm {discountType === 'PERCENTAGE' ? '(%)' : '(VND)'} *
            </label>
            <Input
              type="number"
              min={1}
              placeholder={discountType === 'PERCENTAGE' ? 'VD: 15' : 'VD: 100000'}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          {discountType === 'PERCENTAGE' && (
            <div>
              <label className="font-bold text-gray-800 block mb-1">Giảm tối đa (VND)</label>
              <Input
                type="number"
                min={0}
                placeholder="Để trống nếu không giới hạn"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
              />
            </div>
          )}

          {discountType === 'FIXED_AMOUNT' && (
            <div>
              <label className="font-bold text-gray-800 block mb-1">Đơn tối thiểu (VND)</label>
              <Input
                type="number"
                min={0}
                placeholder="VD: 500000"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Số lượng mã & Giới hạn sử dụng / user */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-gray-800 block mb-1">Tổng số lượng phát hành</label>
            <Input
              type="number"
              min={1}
              placeholder="Để trống nếu vô hạn"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Lượt dùng tối đa / 1 khách</label>
            <Input
              type="number"
              min={1}
              value={usageLimitPerUser}
              onChange={(e) => setUsageLimitPerUser(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Trạng thái & Hiển thị */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-gray-800 block mb-1">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2.5 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-booking-navy font-semibold"
            >
              <option value="ACTIVE">Kích hoạt (ACTIVE)</option>
              <option value="DRAFT">Nháp (DRAFT)</option>
              <option value="PAUSED">Tạm dừng (PAUSED)</option>
              <option value="EXPIRED">Hết hạn (EXPIRED)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Chế độ hiển thị</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="w-full p-2.5 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-booking-navy font-semibold"
            >
              <option value="PUBLIC">Công khai (PUBLIC)</option>
              <option value="HIDDEN">Ẩn / Riêng tư (HIDDEN)</option>
            </select>
          </div>
        </div>

        {/* Ngày bắt đầu & Ngày hết hạn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-gray-800 block mb-1">Ngày bắt đầu áp dụng</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Ngày hết hạn mã</label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="yellow" isLoading={isLoading} className="font-bold text-slate-900">
            {isEdit ? 'Cập nhật Mã' : 'Tạo Mã Giảm Giá'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
