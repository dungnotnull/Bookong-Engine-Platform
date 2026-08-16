export interface PropertyListing {
  id: string;
  title: string;
  location: string;
  distance: string;
  datesAvailable: string;
  pricePerNight: number;
  rating: number;
  starRating?: number;
  reviewCount: number;
  isGuestFavorite?: boolean;
  images: string[];
  category: string;
  amenities: string[];
  capacity: number;
  hostName: string;
  hostAvatar?: string;
  isSuperhost?: boolean;
}

export const CATEGORIES = [
  { id: 'all', label: 'Tất cả chỗ nghỉ', icon: 'Grid' },
  { id: 'hotel', label: 'Khách sạn', icon: 'Building' },
  { id: 'resort', label: 'Resort', icon: 'Sparkles' },
  { id: 'homestay', label: 'Homestay', icon: 'Home' },
  { id: 'villa', label: 'Biệt thự', icon: 'Building2' },
  { id: 'apartment', label: 'Căn hộ', icon: 'Hotel' },
  { id: 'beach', label: 'Gần biển', icon: 'Waves' },
  { id: 'pool', label: 'Hồ bơi tuyệt đẹp', icon: 'Sun' },
  { id: 'luxury', label: 'Sang trọng', icon: 'Crown' },
  { id: 'nature', label: 'Gần gũi thiên nhiên', icon: 'Trees' },
];

export const DUMMY_LISTINGS: PropertyListing[] = [
  {
    id: 'listing_1',
    title: 'Sunset Sanato Villa sát biển ngắm hoàng hôn',
    location: 'Phú Quốc, Kiên Giang',
    distance: 'Cách trung tâm 3,2 km',
    datesAvailable: '15 - 20 Thg 9',
    pricePerNight: 2450000,
    rating: 4.96,
    reviewCount: 184,
    isGuestFavorite: true,
    category: 'villa',
    amenities: ['WiFi tốc độ cao', 'Hồ bơi riêng', 'Bãi đỗ xe', 'Bếp hiện đại'],
    capacity: 4,
    hostName: 'Trần Hoàng',
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'listing_2',
    title: 'Đà Nẵng Ocean Villa & Spa vô cực',
    location: 'Sơn Trà, Đà Nẵng',
    distance: 'Bên bờ biển Mỹ Khê',
    datesAvailable: '18 - 23 Thg 9',
    pricePerNight: 3800000,
    rating: 4.92,
    reviewCount: 120,
    isGuestFavorite: true,
    category: 'luxury',
    amenities: ['Hồ bơi vô cực', 'Spa & Massage', 'Bữa sáng miễn phí'],
    capacity: 6,
    hostName: 'Nguyễn Minh',
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'listing_3',
    title: 'Đà Lạt Pine Cabin giữa rừng thông mơ mộng',
    location: 'Phường 3, Đà Lạt',
    distance: 'Cách hồ Xuân Hương 2,5 km',
    datesAvailable: '20 - 25 Thg 9',
    pricePerNight: 1250000,
    rating: 4.88,
    reviewCount: 94,
    isGuestFavorite: false,
    category: 'mountain',
    amenities: ['Lò sưởi ấm', 'Ban công view đồi', 'BBQ sân vườn'],
    capacity: 2,
    hostName: 'Lê Thu Hà',
    isSuperhost: false,
    images: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'listing_4',
    title: 'An Bàng Beach Penthouse ngắm bình minh',
    location: 'Hội An, Quảng Nam',
    distance: 'Ngay bãi biển An Bàng',
    datesAvailable: '10 - 14 Thg 10',
    pricePerNight: 2900000,
    rating: 4.98,
    reviewCount: 215,
    isGuestFavorite: true,
    category: 'beach',
    amenities: ['Sân thượng bồn tắm', 'View 360 độ biển', 'Dịch vụ nấu ăn'],
    capacity: 4,
    hostName: 'Phạm Bảo',
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'listing_5',
    title: 'Nha Trang Seaview Studio cao cấp',
    location: 'Trần Phú, Nha Trang',
    distance: 'Cách bãi biển 100m',
    datesAvailable: '22 - 27 Thg 9',
    pricePerNight: 1100000,
    rating: 4.85,
    reviewCount: 78,
    isGuestFavorite: false,
    category: 'beach',
    amenities: ['Tầng cao view biển', 'Gym & Bể bơi tòa nhà', 'Bãi đỗ xe'],
    capacity: 2,
    hostName: 'Vũ Đức',
    isSuperhost: false,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'listing_6',
    title: 'Sapa Cloud Hilltop Bungalow săn mây',
    location: 'Muống Hoa, Sapa',
    distance: 'View toàn cảnh thung lũng',
    datesAvailable: '05 - 10 Thg 10',
    pricePerNight: 1650000,
    rating: 4.94,
    reviewCount: 162,
    isGuestFavorite: true,
    category: 'mountain',
    amenities: ['Bồn tắm gỗ Pơ-mu', 'Sưởi sàn', 'Ăn sáng đặc sản'],
    capacity: 2,
    hostName: 'Hà Văn',
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop',
    ],
  },
];
