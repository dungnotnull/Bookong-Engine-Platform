# API Contract (Source of Truth)

Tài liệu này là Source of Truth cho toàn bộ API giao tiếp giữa Frontend và Backend.
MỌI THAY ĐỔI VỀ ENDPOINT, PAYLOAD, QUERY PARAMS HAY RESPONSE ĐỀU PHẢI ĐƯỢC CẬP NHẬT VÀ THỐNG NHẤT TẠI ĐÂY TRƯỚC.

## 1. Cơ bản (Base)
- Base URL: `/api/v1`
- Chuẩn hóa Response chung:
  - Success: `{ "success": true, "data": { ... }, "meta": { ... } }`
  - Error: `{ "success": false, "errorCode": "ERR_CODE", "message": "Chi tiết lỗi" }`

---

## 2. Các API chính (Core APIs)

### 2.1. Search & Filter
`GET /api/v1/search`
- **Query Params**: `q` (string), `checkIn` (ISO Date), `checkOut` (ISO Date), `guests` (number), `minPrice`, `maxPrice`, `amenities` (array).
- **Response Data**: Array các object Hotel kèm Room thỏa mãn điều kiện.
  ```json
  [
    {
      "hotel": { "id": "str", "name": "str", "address": "str", "city": "str", "coverImage": "str", "starRating": 5 },
      "rooms": [
        { "id": "str", "name": "str", "type": "str", "basePrice": 100, "capacity": 2, "imageUrl": "str" }
      ]
    }
  ]
  ```

### 2.2. Đặt phòng tạm thời (Hold Room)
`POST /api/v1/bookings/hold`
- **Payload**: `{ "roomId": "str", "checkIn": "ISO Date", "checkOut": "ISO Date", "guests": 2 }`
- **Response Data**: `{ "holdId": "uuid", "expiresAt": "ISO Date" }`

### 2.3. Tính giá động (Dynamic Pricing)
`POST /api/v1/bookings/calculate-price`
- **Payload**: `{ "roomId": "str", "checkIn": "ISO Date", "checkOut": "ISO Date", "guests": 2, "discountCode": "string" }`
- **Response Data**: `{ "basePrice": 100, "seasonalSurge": 20, "discountAmount": 10, "totalAmount": 110 }`

### 2.4. Submit Booking
`POST /api/v1/bookings`
- **Payload**: `{ "holdId": "uuid", "paymentMethod": "CREDIT_CARD", "discountCode": "string" }`
- **Response Data**: 
  ```json
  {
    "id": "uuid",
    "userId": "uuid",
    "roomId": "uuid",
    "checkIn": "ISO Date",
    "checkOut": "ISO Date",
    "status": "CONFIRMED",
    "totalPrice": 110
  }
  ```

### 2.5. Hủy đặt phòng (Cancel Booking)
`POST /api/v1/bookings/:id/cancel`
- **Response Data**: `{ "id": "uuid", "status": "CANCELLED", "refundAmount": 90 }`

### 2.6. Chuyến đi của tôi (My Trips)
`GET /api/v1/bookings/my-trips`
- **Response Data**:
  ```json
  [
    {
      "id": "uuid",
      "status": "CONFIRMED",
      "checkIn": "ISO Date",
      "checkOut": "ISO Date",
      "totalPrice": 110,
      "room": {
        "id": "uuid", "name": "str", "imageUrl": "str",
        "hotel": { "id": "uuid", "name": "str", "address": "str", "coverImage": "str" }
      }
    }
  ]
  ```

---

### 2.7. Authentication
- `POST /api/v1/auth/register`: 
  - **Payload**: `{ "email": "a@b.c", "password": "123", "fullName": "str", "role": "USER|HOST" }`
  - **Response Data**: `{ "accessToken": "jwt", "user": { "id": "uuid", "email": "a@b.c", "role": "USER" } }`
- `POST /api/v1/auth/login`: 
  - **Payload**: `{ "email": "a@b.c", "password": "123" }`
  - **Response Data**: `{ "accessToken": "jwt", "user": { "id": "uuid", "email": "a@b.c", "role": "USER" } }`
- `GET /api/v1/auth/me`: 
  - **Response Data**: `{ "id": "uuid", "email": "a@b.c", "role": "USER", "fullName": "str" }`

---

### 2.8. Master Data - Hotels & Rooms
- `GET /api/v1/hotels` & `GET /api/v1/hotels/my-hotels`:
  - **Response Data**: `[ { "id": "uuid", "name": "str", "city": "str", "status": "APPROVED", "coverImage": "str" } ]`
- `GET /api/v1/hotels/:id`:
  - **Response Data**: `{ "id": "uuid", "name": "str", "description": "str", "address": "str", "images": ["url1"], "hotelAmenities": [...] }`
- `POST /api/v1/hotels`: 
  - **Payload**: `{ "name": "str", "address": "str", "city": "str", "country": "str", "coverImage": "url", "images": ["url"] }`
  - **Response Data**: Thông tin khách sạn vừa tạo (object).
- `GET /api/v1/hotels/:hotelId/rooms`:
  - **Response Data**: `[ { "id": "uuid", "name": "str", "type": "str", "basePrice": 100, "capacity": 2, "imageUrl": "url" } ]`

---

### 2.9. Admin Dashboard
- `GET /api/v1/admin/dashboard/stats`:
  - **Response Data**: `{ "totalUsers": 100, "totalHotels": 50, "pendingHotels": 5, "totalRooms": 200, "totalGMV": 50000 }`
- `GET /api/v1/admin/users`:
  - **Response Data**: `[ { "id": "uuid", "email": "a@b.c", "role": "USER", "createdAt": "ISO Date" } ]`
- `GET /api/v1/admin/hotels`:
  - **Response Data**: `[ { "id": "uuid", "name": "str", "host": { "email": "a@b.c" }, "status": "PENDING" } ]`

---

### 2.10. Host Analytics
- `GET /api/v1/host/bookings`:
  - **Response Data**: `[ { "id": "uuid", "userId": "uuid", "roomId": "uuid", "status": "CONFIRMED", "totalPrice": 100, "user": { "email": "a@b.c" } } ]`
- `GET /api/v1/host/analytics/revenue`:
  - **Response Data**: `{ "totalRevenue": 15000, "bookingsCount": 45 }`
- `GET /api/v1/host/analytics/occupancy`:
  - **Response Data**: `{ "occupancyRate": 85.5, "totalNights": 30, "bookedNights": 25 }`

---

### 2.11. Coupons, Pricing Rules, Policies, Wishlist
- `GET /api/v1/wishlist`:
  - **Response Data**: `[ { "hotelId": "uuid", "hotel": { "name": "str", "coverImage": "url" } } ]`
- `GET /api/v1/coupons`:
  - **Response Data**: `[ { "id": "uuid", "code": "SUMMER", "discountType": "PERCENTAGE", "amount": 10, "expiryDate": "ISO Date" } ]`
- `GET /api/v1/pricing-rules`:
  - **Response Data**: `[ { "id": "uuid", "name": "Weekend Surge", "multiplier": 1.2, "dayOfWeek": 6 } ]`
- `GET /api/v1/cancellation-policies`:
  - **Response Data**: `[ { "id": "uuid", "daysBeforeCheckIn": 3, "penaltyPercentage": 50 } ]`
