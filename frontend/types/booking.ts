export type BookingStatus = 'HELD' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'PENDING_PAYMENT' | 'COMPLETED';

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
  code?: string; // Mã đặt phòng hiển thị cho khách
  hotelId?: string;
  roomId?: string;
  roomName?: string;
  hotelName?: string;
  userId: string;
  customerInfo?: CustomerInfo;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount?: number;
  totalPrice?: number;
  status: BookingStatus;
  paymentMethod?: string;
  refundAmount?: number;
  createdAt?: string;
  room?: {
    id: string;
    hotelId?: string;
    name: string;
    type?: string;
    imageUrl?: string;
    hotel?: {
      id: string;
      name: string;
      address?: string;
      city?: string;
      coverImage?: string;
    };
  };
}
