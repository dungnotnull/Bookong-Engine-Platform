import { Amenity } from '@/types/hotel';

// Bảng màu Booking.com Brand System
export const BOOKING_THEME = {
  NAVY: '#003580',
  BLUE: '#006CE4',
  YELLOW: '#FEBB02',
  GREEN: '#008009',
  ORANGE: '#E55D00',
  LIGHT_BG: '#F5F7FA',
};

// Danh sách Tiện nghi Mẫu (Master Data)
export const DEFAULT_AMENITIES: Amenity[] = [
  { id: 'wifi', name: 'WiFi miễn phí', icon: 'Wifi', category: 'HOTEL' },
  { id: 'pool', name: 'Hồ bơi ngoài trời', icon: 'Waves', category: 'HOTEL' },
  { id: 'parking', name: 'Bãi đỗ xe miễn phí', icon: 'Car', category: 'HOTEL' },
  { id: 'aircon', name: 'Điều hòa nhiệt độ', icon: 'Wind', category: 'ROOM' },
  { id: 'breakfast', name: 'Bữa sáng miễn phí', icon: 'Utensils', category: 'HOTEL' },
  { id: 'bath', name: 'Bồn tắm riêng', icon: 'Bath', category: 'ROOM' },
  { id: 'balcony', name: 'Ban công hướng biển', icon: 'Sun', category: 'ROOM' },
  { id: 'minibar', name: 'Minibar & Tủ lạnh', icon: 'Coffee', category: 'ROOM' },
];

// Danh sách Thành phố Nổi bật Việt Nam
export const POPULAR_CITIES = [
  { name: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop' },
  { name: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&auto=format&fit=crop' },
  { name: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&auto=format&fit=crop' },
  { name: 'Nha Trang', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop' },
];
