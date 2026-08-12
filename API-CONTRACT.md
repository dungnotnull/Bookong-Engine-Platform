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

(Tiếp tục cập nhật thêm khi phát triển các module Auth, Host Dashboard, Admin Dashboard...)
