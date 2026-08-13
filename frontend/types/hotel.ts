export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  category: 'HOTEL' | 'ROOM'; // Phân biệt tiện nghi Khách sạn hoặc Phòng
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  type: string; // Deluxe, Suite, Standard...
  basePrice: number; // Giá gốc VND/đêm
  capacity: number; // Sức chứa khách
  quantity: number; // Tổng số phòng khả dụng trong kho
  amenities: Amenity[];
  imageUrl?: string;
  createdAt?: string;
}

export interface Hotel {
  id: string;
  hostId: string;
  name: string;
  address: string;
  city: string;
  description: string;
  rating?: number; // Điểm đánh giá (vd 8.8)
  reviewCount?: number;
  coverImage?: string;
  images: string[];
  amenities: Amenity[];
  rooms?: Room[];
  isApproved?: boolean;
  createdAt?: string;
}
