'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, Tag, CreditCard, AlertTriangle, Calendar, Users, AlertCircle } from 'lucide-react';
import { useHoldTimer } from '@/hooks/use-hold-timer';
import { formatCurrency, calculateNights, formatDateVi } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { apiClient } from '@/lib/api-client';
import { addDays, format } from 'date-fns';

export default function CheckoutPage({ params }: { params: { roomId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formattedTime, isExpired, isWarning } = useHoldTimer(900); // 15 phút đếm ngược

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const defaultCheckIn = searchParams.get('checkIn') || format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const defaultCheckOut = searchParams.get('checkOut') || format(addDays(new Date(), 2), 'yyyy-MM-dd');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [checkIn, setCheckIn] = useState<string>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<string>(defaultCheckOut);
  const [roomQuantity, setRoomQuantity] = useState<number>(1);
  
  const [holdId, setHoldId] = useState<string>('');
  const [basePrice, setBasePrice] = useState<number>(3000000);
  const [priceBreakdown, setPriceBreakdown] = useState<{
    basePrice: number;
    seasonalSurge?: number;
    discountAmount?: number;
    totalAmount: number;
  } | null>(null);
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

  // Tính số đêm (Nights) chuẩn: 2 ngày 1 đêm = 1 đêm
  const nights = calculateNights(checkIn, checkOut);

  // Tự động điều chỉnh ngày trả phòng nếu Check-in >= Check-out
  const handleCheckInChange = (newIn: string) => {
    setCheckIn(newIn);
    if (new Date(checkOut) <= new Date(newIn)) {
      const autoOut = format(addDays(new Date(newIn), 1), 'yyyy-MM-dd');
      setCheckOut(autoOut);
    }
  };

  const handleCheckOutChange = (newOut: string) => {
    if (new Date(newOut) <= new Date(checkIn)) {
      const autoOut = format(addDays(new Date(checkIn), 1), 'yyyy-MM-dd');
      setCheckOut(autoOut);
    } else {
      setCheckOut(newOut);
    }
  };

  const finalPrice = priceBreakdown
    ? priceBreakdown.totalAmount
    : Math.max(0, basePrice * roomQuantity - discountAmount);

  // Tự động gọi API POST /api/v1/bookings/hold khi vào trang checkout hoặc đổi số lượng/ngày
  const initHoldSession = useCallback(async () => {
    if (!params?.roomId) return;
    setIsLoadingHold(true);
    setHoldError(null);
    try {
      const res: any = await apiClient.post('/bookings/hold', {
        roomId: params.roomId,
        checkIn,
        checkOut,
        guests: 2,
        roomQuantity,
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
        checkIn,
        checkOut,
        guests: 2,
        roomQuantity,
        discountCode: couponCode.trim().toUpperCase() || undefined,
      });
      const priceData = priceRes?.data || priceRes;
      if (priceData && typeof priceData.totalAmount === 'number') {
        setPriceBreakdown(priceData);
        setBasePrice(priceData.basePrice || priceData.totalAmount);
        if (priceData.discountAmount !== undefined) {
          setDiscountAmount(priceData.discountAmount);
        }
      }
    } catch (err: any) {
      setHoldError(err?.message || 'Không thể khởi tạo phiên giữ phòng. Hãy thử chọn lại ngày hoặc số lượng.');
    } finally {
      setIsLoadingHold(false);
    }
  }, [params?.roomId, checkIn, checkOut, roomQuantity, couponCode]);

  useEffect(() => {
    initHoldSession();
  }, [initHoldSession]);

  // Validate Coupon Code qua API
  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setDiscountAmount(0);
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const res: any = await apiClient.post('/bookings/calculate-price', {
        roomId: params?.roomId,
        checkIn,
        checkOut,
        guests: 2,
        roomQuantity,
        discountCode: code,
      });
      const data = res?.data || res;
      if (data && typeof data.totalAmount === 'number') {
        setPriceBreakdown(data);
        if (data.discountAmount && data.discountAmount > 0) {
          setDiscountAmount(data.discountAmount);
          setCouponSuccess(`Áp dụng mã giảm giá thành công! Giảm ${formatCurrency(data.discountAmount)}`);
        } else {
          setDiscountAmount(0);
          setCouponError('Mã giảm giá không hợp lệ hoặc không áp dụng cho đơn hàng này.');
        }
      } else {
        setDiscountAmount(0);
        setCouponError('Mã giảm giá không hợp lệ.');
      }
    } catch (err: any) {
      setDiscountAmount(0);
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
        roomQuantity,
        checkIn,
        checkOut,
        discountCode: couponCode || undefined,
      });
      router.push('/booking-success');
    } catch (err: any) {
      setSubmitError(err?.message || 'Xác nhận đặt phòng thất bại. Vui lòng kiểm tra lại thông tin và thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="booking-container space-y-6 pt-2">
        {/* Cảnh báo Lỗi Dạng Inline Alert Thân Thiện (Thay thế chiếm toàn màn hình) */}
        {holdError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-800 font-medium shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{holdError}</span>
            </div>
            <button
              onClick={initHoldSession}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shrink-0"
            >
              Thử lại
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form điền thông tin */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chọn Ngày & Số lượng phòng trực tiếp */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-4">
              <h2 className="text-lg font-bold text-booking-navy flex items-center gap-2">
                <Calendar className="w-5 h-5 text-booking-blue" />
                1. Ngày lưu trú & Số lượng phòng
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Ngày nhận phòng *</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="px-3 py-2 text-xs font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-booking-blue"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Ngày trả phòng *</label>
                  <input
                    type="date"
                    min={checkIn || todayStr}
                    value={checkOut}
                    onChange={(e) => handleCheckOutChange(e.target.value)}
                    className="px-3 py-2 text-xs font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-booking-blue"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-booking-navy" /> Số phòng đặt *
                  </label>
                  <select
                    value={roomQuantity}
                    onChange={(e) => setRoomQuantity(Number(e.target.value))}
                    className="px-3 py-2 text-xs font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-booking-blue cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} Phòng
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Thông tin khách hàng */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-4">
              <h2 className="text-lg font-bold text-booking-navy">2. Thông tin người đặt</h2>
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
              <h2 className="text-lg font-bold text-booking-navy">3. Chọn Phương thức thanh toán</h2>
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
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-4 sticky top-16">
              <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Chi tiết giá đặt phòng</h3>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Thời gian lưu trú</span>
                  <span className="font-bold text-gray-900">{nights} đêm ({formatDateVi(checkIn)} - {formatDateVi(checkOut)})</span>
                </div>
                <div className="flex justify-between">
                  <span>Đơn giá phòng / đêm</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(
                      nights > 0 && roomQuantity > 0
                        ? (priceBreakdown?.basePrice || basePrice) / (nights * roomQuantity)
                        : basePrice
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Số lượng phòng đặt</span>
                  <span className="font-bold text-gray-900">x {roomQuantity} phòng</span>
                </div>
                {priceBreakdown?.seasonalSurge && priceBreakdown.seasonalSurge > 0 ? (
                  <div className="flex justify-between text-amber-700">
                    <span>Phụ thu mùa cao điểm / cuối tuần</span>
                    <span className="font-bold">+{formatCurrency(priceBreakdown.seasonalSurge)}</span>
                  </div>
                ) : null}
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
                    onChange={(e) => {
                      const code = e.target.value.toUpperCase();
                      setCouponCode(code);
                      if (!code.trim()) {
                        setDiscountAmount(0);
                        setCouponSuccess('');
                        setCouponError('');
                      }
                    }}
                    className="w-full text-xs uppercase px-3 py-2 border border-gray-300 rounded-lg outline-none font-bold"
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
                isLoading={isSubmitting || isLoadingHold}
                disabled={Boolean(holdError) || isSubmitting || isLoadingHold}
              >
                Xác nhận Đặt phòng ({roomQuantity} phòng · {nights} đêm)
              </Button>
            </div>
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
