# API Contract (Source of Truth)

Tài liệu này là Source of Truth cho toàn bộ API giao tiếp giữa Frontend và Backend.
MỌI THAY ĐỔI VỀ ENDPOINT, PAYLOAD, QUERY PARAMS HAY RESPONSE ĐỀU PHẢI ĐƯỢC CẬP NHẬT VÀ THỐNG NHẤT TẠI ĐÂY TRƯỚC.

## 1. Cơ bản (Base)
- Base URL: `/api/v1`
- Chuẩn hóa Response chung:
  - Success: `{ "success": true, "data": { ... }, "meta": { ... } }`
  - Error: `{ "success": false, "errorCode": "ERR_CODE", "message": "Chi tiết lỗi" }`

## 2. Các API chính (Core APIs)

### 2.1. Search & Filter
`GET /api/v1/search`
- **Query Params**:
  - `q` (string, optional): Text query (full-text + semantic).
  - `checkIn` (ISO8601 Date, required)
  - `checkOut` (ISO8601 Date, required)
  - `guests` (number, required)
  - `minPrice`, `maxPrice` (number, optional)
  - `amenities` (array of strings, optional)
- **Response**: Array của các Hotel/Room thỏa mãn thời gian trống và query.

### 2.2. Đặt phòng tạm thời (Hold Room)
`POST /api/v1/bookings/hold`
- **Mục đích**: Giữ phòng 10-15 phút khi user đang điền form.
- **Payload**:
  - `roomId` (string)
  - `checkIn` (date)
  - `checkOut` (date)
  - `guests` (number)
- **Response**: 
  - `holdId` (string)
  - `expiresAt` (date)

### 2.3. Submit Booking
`POST /api/v1/bookings`
- **Payload**:
  - `holdId` (string)
  - `customerInfo`: `{ name, email, phone }`
  - `paymentMethod` (string)
  - `discountCode` (string, optional)
- **Response**: Thông tin booking đã confirm và thông tin thanh toán (nếu có).

### 2.4. Tính giá động (Dynamic Pricing)
`POST /api/v1/bookings/calculate-price`
- **Payload**: Giống với /bookings/hold nhưng không thực hiện hold. Cần thêm `discountCode` (optional).
- **Response**:
  - `basePrice`: Giá gốc
  - `seasonalSurge`: Phụ phí mùa/lễ
  - `discountAmount`: Số tiền giảm giá
  - `totalAmount`: Tổng cộng

### 2.5. Authentication
- `POST /api/v1/auth/register`: Đăng ký tài khoản (`email`, `password`, `role`). Trả về `accessToken` và thông tin user.
- `POST /api/v1/auth/login`: Đăng nhập (`email`, `password`). Trả về `accessToken` và thông tin user.
- `GET /api/v1/auth/me`: Lấy thông tin user hiện tại (Yêu cầu JWT).

### 2.6. Master Data - Amenities
- `GET /api/v1/amenities`: Lấy danh sách tiện ích.
- `POST /api/v1/amenities`: Tạo tiện ích mới (Admin/Host). Payload: `{ name, icon }`.
- `PATCH /api/v1/amenities/:id`: Cập nhật tiện ích (Admin/Host).
- `DELETE /api/v1/amenities/:id`: Xóa tiện ích (Admin).

### 2.7. Master Data - Hotels
- `GET /api/v1/hotels`: Lấy danh sách tất cả khách sạn.
- `GET /api/v1/hotels/:id`: Lấy chi tiết một khách sạn.
- `GET /api/v1/hotels/my-hotels`: Lấy danh sách khách sạn của Host hiện tại (Yêu cầu JWT Host).
- `POST /api/v1/hotels`: Tạo khách sạn mới (Yêu cầu JWT Host). Payload: `{ name, description, address, city, country, starRating, amenities: string[] }`.
- `PATCH /api/v1/hotels/:id`: Cập nhật khách sạn (Chỉ Host sở hữu hoặc Admin).
- `DELETE /api/v1/hotels/:id`: Xóa khách sạn (Chỉ Host sở hữu hoặc Admin).

### 2.8. Master Data - Rooms
- `GET /api/v1/hotels/:hotelId/rooms`: Lấy danh sách phòng của một khách sạn.
- `GET /api/v1/rooms/:id`: Lấy chi tiết phòng.
- `POST /api/v1/hotels/:hotelId/rooms`: Tạo phòng mới cho khách sạn (Chỉ Host sở hữu khách sạn). Payload: `{ name, type, basePrice, capacity, quantity, amenities: string[] }`.
- `PATCH /api/v1/rooms/:id`: Cập nhật phòng (Chỉ Host sở hữu hoặc Admin).
- `DELETE /api/v1/rooms/:id`: Xóa phòng (Chỉ Host sở hữu hoặc Admin).

(Tiếp tục cập nhật thêm khi phát triển các module Analytics, Admin Dashboard...)
