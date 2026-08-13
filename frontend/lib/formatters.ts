import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Định dạng tiền tệ VND chuẩn Booking.com (ví dụ: 1.500.000 ₫)
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ngày tháng hiển thị người dùng (ví dụ: 15 Thg 09, 2026)
 */
export function formatDateVi(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd MMM, yyyy', { locale: vi });
  } catch {
    return dateString;
  }
}

/**
 * Tính tổng số đêm ở giữa ngày Check-in và Check-out
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  try {
    const start = parseISO(checkIn);
    const end = parseISO(checkOut);
    const nights = differenceInCalendarDays(end, start);
    return nights > 0 ? nights : 1;
  } catch {
    return 1;
  }
}
