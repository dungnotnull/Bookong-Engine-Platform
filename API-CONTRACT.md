# API Contract (Source of Truth)

Tài liệu này là Source of Truth cho toàn bộ API giao tiếp giữa Frontend và Backend.
MỌI THAY ĐỔI VỀ ENDPOINT, PAYLOAD, QUERY PARAMS HAY RESPONSE ĐỀU PHẢI ĐƯỢC CẬP NHẬT VÀ THỐNG NHẤT TẠI ĐÂY TRƯỚC.

## 1. Cơ bản (Base)
- Base URL: `/api/v1`
- Chuẩn hóa Response chung:
  - Success (Single Object): `{ "success": true, "data": { ... } }`
  - Success (Paginated List): `{ "success": true, "data": [ ... ], "meta": { "page": 1, "limit": 10, "total": 100, "totalPages": 10, "hasNextPage": true } }`
  - Error: `{ "success": false, "errorCode": "ERR_CODE", "message": "Chi tiết lỗi" }`

**Lưu ý:** Các API trả về danh sách đều hỗ trợ Query Params `?page=1&limit=10` (mặc định page=1, limit=10).

---

## 2. Các API chính (Core APIs)

### 2.1. Search & Filter
`GET /api/v1/search`
- **Query Params**: `q` (string), `checkIn` (ISO Date), `checkOut` (ISO Date), `guests` (number), `minPrice`, `maxPrice`, `page`, `limit`.
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
- **Query Params**: `page`, `limit`
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
  - **Query Params**: `page`, `limit`
  - **Response Data**: `[ { "id": "uuid", "name": "str", "city": "str", "status": "APPROVED", "coverImage": "str" } ]`
- `GET /api/v1/hotels/:id`:
  - **Response Data**: `{ "id": "uuid", "name": "str", "description": "str", "address": "str", "images": ["url1"], "hotelAmenities": [...] }`
- `POST /api/v1/hotels`: 
  - **Payload**: `{ "name": "str", "address": "str", "city": "str", "country": "str", "coverImage": "url", "images": ["url"] }`
  - **Response Data**: Thông tin khách sạn vừa tạo (object).
- `GET /api/v1/hotels/:hotelId/rooms`:
  - **Query Params**: `checkIn` (ISO string / YYYY-MM-DD), `checkOut` (ISO string / YYYY-MM-DD), `includeInactive` (boolean)
  - **Response Data**: `[ { "id": "uuid", "name": "str", "type": "str", "basePrice": 100, "capacity": 2, "quantity": 5, "availableQuantity": 3, "imageUrl": "url", "amenities": [...], "isActive": true } ]`
- `DELETE /api/v1/rooms/:id`:
  - **Response Data**: Thông tin phòng sau khi xoá mềm (isActive = false).

---

### 2.9. Admin Dashboard
- `GET /api/v1/admin/analytics`:
  - **Response Data**: `{ "totalUsers": 100, "totalHotels": 50, "pendingHotelsCount": 5, "totalRooms": 200, "totalGMV": 50000 }`
- `GET /api/v1/admin/users`:
  - **Query Params**: `page`, `limit`
  - **Response Data**: `[ { "id": "uuid", "email": "a@b.c", "role": "USER", "isBanned": false, "createdAt": "ISO Date" } ]`
- `PATCH /api/v1/admin/users/:id/status`:
  - **Payload**: `{ "isBanned": true }`
  - **Response Data**: Thông tin User sau khi cập nhật trạng thái.
- `POST /api/v1/admin/users`:
  - **Payload**: `{ "email": "admin2@b.c", "password": "123", "fullName": "Admin 2" }`
  - **Response Data**: Thông tin Admin vừa tạo.
- `GET /api/v1/admin/hotels`:
  - **Query Params**: `status` (PENDING|APPROVED|REJECTED), `page`, `limit`
  - **Response Data**: `[ { "id": "uuid", "name": "str", "host": { "email": "a@b.c" }, "status": "PENDING" } ]`
- `GET /api/v1/admin/hotels/pending`:
  - **Query Params**: `page`, `limit`
  - **Response Data**: `[ { "id": "uuid", "name": "str", "host": { "email": "a@b.c" }, "status": "PENDING" } ]`
- `PATCH /api/v1/admin/hotels/:id/approve`:
  - **Payload**: `{ "isApproved": true }`
  - **Response Data**: Thông tin Khách sạn sau khi duyệt/từ chối.

---

### 2.10. Host Analytics
- `GET /api/v1/host/analytics`:
  - **Response Data**: `{ "totalHotels": 3, "totalRooms": 15, "monthlyBookings": 12, "occupancyRate": 75.5 }`
- `GET /api/v1/host/bookings`:
  - **Query Params**: `page`, `limit`
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

---

### 2.12. Upload
`POST /api/v1/upload/image`
- **Request Type**: `multipart/form-data`
- **Payload**: field `file` (chứa file ảnh .jpg, .png, .webp, max 5MB). Yêu cầu Token (Header `Authorization: Bearer <token>`).
- **Response Data**:
  ```json
  {
    "success": true,
    "data": {
      "url": "http://localhost:3000/uploads/filename.jpg"
    }
  }
  ```

---

### 2.13. Reviews & Messages (Phase 6)
- `POST /api/v1/hotels/:hotelId/reviews`:
  - **Payload**: `{ "bookingId": "uuid", "locationRating": 5, "cleanlinessRating": 5, "serviceRating": 5, "valueRating": 5, "comment": "Tốt" }`
  - **Response Data**: Thông tin Review vừa tạo. (Yêu cầu Token, user phải check-out booking này).
- `GET /api/v1/hotels/:hotelId/reviews`:
  - **Query Params**: `page`, `limit`
  - **Response Data**: Danh sách review phân trang kèm thông tin User.
- `DELETE /api/v1/reviews/:id`:
  - **Response Data**: `{ "message": "Review deleted successfully" }` (Admin only).
- `GET /api/v1/messages/:bookingId`:
  - **Response Data**: `[ { "id": "uuid", "senderId": "uuid", "receiverId": "uuid", "content": "str", "createdAt": "ISO Date" } ]` (Chỉ Host hoặc Guest của booking mới xem được).

**Socket.io (Realtime Chat)**
- **Connection URL**: `ws://localhost:3000` (hoặc URL backend tương ứng).
- **Authentication**: Truyền Token qua `auth: { token: '...' }` hoặc Header `Authorization: Bearer ...`.
- **Events (Client to Server)**:
  - `joinRoom`: Payload `{ "bookingId": "uuid" }` -> Join vào room chat của booking.
  - `sendMessage`: Payload `{ "bookingId": "uuid", "content": "Hello" }` -> Gửi tin nhắn.
- **Events (Server to Client)**:
  - `newMessage`: Payload object Message. Lắng nghe để update UI.

