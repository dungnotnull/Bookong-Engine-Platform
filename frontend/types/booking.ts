export type BookingStatus = 'HELD' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface HoldSession {
  holdId: string;
  expiresAt: string; // ISO8601 Date
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface PriceBreakdown {
  basePrice: number;
  seasonalSurge: number;
  discountAmount: number;
  totalAmount: number;
  nights: number;
}

export interface Booking {
  id: string;
  code: string; // Mã đặt phòng hiển thị cho khách
  roomId: string;
  roomName: string;
  hotelName: string;
  userId: string;
  customerInfo: CustomerInfo;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: string;
  createdAt: string;
}
