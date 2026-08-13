'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Tag, CreditCard, AlertTriangle, RefreshCw } from 'lucide-react';
import { useHoldTimer } from '@/hooks/use-hold-timer';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { ErrorState } from '@/components/common/error-state';
import { apiClient } from '@/lib/api-client';

export default function CheckoutPage({ params }: { params: { roomId: string } }) {
  const router = useRouter();
  const { formattedTime, isExpired, isWarning } = useHoldTimer(900); // 15 phút đếm ngược

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [holdId, setHoldId] = useState<string>('');
  const [basePrice, setBasePrice] = useState<number>(3000000);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'QR_BANK' | 'AT_HOTEL'>('QR_BANK');
  const [isLoadingHold, setIsLoadingHold] = useState(true);
  const [holdError, setHoldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const finalPrice = Math.max(0, basePrice - discountAmount);

  // Tự động gọi API POST /api/v1/bookings/hold khi vào trang checkout
  const initHoldSession = useCallback(async () => {
    if (!params?.roomId) return;
    setIsLoadingHold(true);
    setHoldError(null);
    try {
      const today = new Date();
      const checkInDate = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
      const checkOutDate = new Date(today.setDate(today.getDate() + 2)).toISOString().split('T')[0];

      const res: any = await apiClient.post('/bookings/hold', {
        roomId: params.roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: 2,
      });

      const data = res?.data || res;
      if (data?.holdId) {
        setHoldId(data.holdId);
      } else {
        setHoldId(`hold_${params.roomId}_${Date.now()}`);
      }

      // Lấy thông tin tính giá thực tế
      const priceRes: any = await apiClient.post('/bookings/calculate-price', {
        roomId: params.roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: 2,
      });
      const priceData = priceRes?.data || priceRes;
      if (priceData?.totalAmount) {
        setBasePrice(priceData.totalAmount);
      }
    } catch (err: any) {
      setHoldError(err?.message || 'Không thể tạo phiên giữ phòng. Vui lòng kiểm tra lại kết nối.');
    } finally {
      setIsLoadingHold(false);
    }
  }, [params?.roomId]);

  useEffect(() => {
    initHoldSession();
  }, [initHoldSession]);

  // Validate Coupon Code qua API
  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      // Gọi API POST /api/v1/coupons/validate hoặc calculate-price có coupon
      const res: any = await apiClient.post('/bookings/calculate-price', {
        roomId: params?.roomId,
        discountCode: couponCode.trim(),
      });
      const data = res?.data || res;
      if (data?.discountAmount) {
        setDiscountAmount(data.discountAmount);
        setCouponSuccess(`Áp dụng mã giảm giá thành công! Giảm ${formatCurrency(data.discountAmount)}`);
      } else {
        setCouponError('Mã giảm giá không hợp lệ hoặc không áp dụng cho đơn hàng này.');
      }
    } catch (err: any) {
      setCouponError(err?.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name || !email || !phone) {
      setSubmitError('Vui lòng điền đầy đủ họ tên, email và số điện thoại liên hệ.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/bookings', {
        holdId: holdId || `hold_${params?.roomId}`,
        customerInfo: { name, email, phone, specialRequests },
        paymentMethod,
        discountCode: couponCode || undefined,
      });
      router.push('/booking-success');
    } catch (err: any) {
      setSubmitError(err?.message || 'Xác nhận đặt phòng thất bại. Vui lòng kiểm tra lại thông tin và thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingHold) {
    return (
      <div className="booking-container py-12 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-booking-blue border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-gray-700">Đang khởi tạo phiên giữ phòng 15 phút...</p>
      </div>
    );
  }

  if (holdError) {
    return (
      <div className="booking-container py-12">
        <ErrorState
          title="Phiên giữ phòng thất bại"
          message={holdError}
          onRetry={initHoldSession}
          isRetrying={isLoadingHold}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Sticky Banner Đếm Ngược 15 Phút Hold Room */}
      <div
        className={`sticky top-0 z-40 text-white shadow-md transition-smooth py-3 px-4 ${
          isWarning ? 'bg-booking-orange animate-pulse' : 'bg-booking-navy'
        }`}
      >
        <div className="booking-container flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs md:text-sm font-bold">
            <Clock className="w-5 h-5 text-booking-yellow" />
            <span>Phòng của bạn đang được giữ tạm thời!</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-black">
            <span>Thời gian còn lại:</span>
            <span className="text-booking-yellow text-sm">{formattedTime}</span>
          </div>
        </div>
      </div>

      <div className="booking-container grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Form điền thông tin */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-4">
            <h2 className="text-lg font-bold text-booking-navy">1. Thông tin khách hàng</h2>
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Họ và tên khách *" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Địa chỉ Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Input label="Số điện thoại *" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Yêu cầu đặc biệt (Không bắt buộc)</label>
                <textarea
                  rows={3}
                  placeholder="ví dụ: Phòng tầng cao, nhận phòng muộn..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-booking-blue"
                />
              </div>
            </form>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-4">
            <h2 className="text-lg font-bold text-booking-navy">2. Chọn Phương thức thanh toán</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-booking-blue">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'QR_BANK'}
                  onChange={() => setPaymentMethod('QR_BANK')}
                  className="accent-booking-blue"
                />
                <CreditCard className="w-5 h-5 text-booking-navy" />
                <span className="text-xs font-bold text-gray-800">Chuyển khoản QR Ngân hàng (Miễn phí giao dịch)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-booking-blue">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CREDIT_CARD'}
                  onChange={() => setPaymentMethod('CREDIT_CARD')}
                  className="accent-booking-blue"
                />
                <CreditCard className="w-5 h-5 text-booking-navy" />
                <span className="text-xs font-bold text-gray-800">Thẻ Quốc tế (Visa / Mastercard)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Price Breakdown Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Chi tiết giá phòng</h3>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Giá cơ sở phòng</span>
                <span className="font-bold text-gray-900">{formatCurrency(basePrice)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Giảm giá Mã Coupon</span>
                  <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Thuế VAT & Phí dịch vụ</span>
                <span>Đã bao gồm</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-booking-navy" /> Mã giảm giá
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full text-xs uppercase px-3 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <Button variant="action" size="sm" onClick={handleApplyCoupon} type="button" isLoading={isApplyingCoupon}>
                  Áp dụng
                </Button>
              </div>
              {couponSuccess && <p className="text-[11px] text-emerald-600 font-bold">{couponSuccess}</p>}
              {couponError && <p className="text-[11px] text-red-500 font-bold">{couponError}</p>}
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-baseline">
              <span className="font-black text-sm text-gray-900">TỔNG CỘNG</span>
              <span className="text-xl font-black text-booking-navy">{formatCurrency(finalPrice)}</span>
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {submitError}
              </div>
            )}

            <Button
              variant="yellow"
              size="lg"
              className="w-full font-bold text-slate-900 py-3 mt-4"
              onClick={handleSubmitBooking}
              isLoading={isSubmitting}
            >
              Xác nhận Đặt phòng
            </Button>
          </div>
        </div>
      </div>

      {/* Modal hết hạn Giữ phòng */}
      <Dialog isOpen={isExpired} onClose={() => router.push('/')} title="Hết thời gian giữ phòng">
        <div className="space-y-4 text-center py-2">
          <AlertTriangle className="w-12 h-12 text-booking-orange mx-auto" />
          <p className="text-xs text-gray-600">
            Thời gian giữ phòng 15 phút đã hết. Vui lòng quay lại tìm kiếm để chọn lại loại phòng của bạn.
          </p>
          <Button variant="action" onClick={() => router.push('/')} className="w-full font-bold">
            Quay lại Tìm kiếm
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
