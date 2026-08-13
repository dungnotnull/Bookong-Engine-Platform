# Backend Development Task By Phases Tracking Logs

Tài liệu này dùng ĐỂ THEO DÕI RIÊNG tiến độ thực hiện các task BACKEND theo từng phase.
AI Agent BE bắt buộc phải cập nhật trạng thái (`[ ]`, `[x]`, `[/]`) hoặc Note lại chi tiết implementation ở đây sau khi làm xong 1 feature.

## Phase 1: Project Setup & Foundation
- [x] **1.1 Init Application**
  - [x] Khởi tạo NestJS project (`nest new backend`).
  - [x] Cấu hình ESLint, Prettier, `.editorconfig`, `.gitignore`.
  - [x] Setup `@nestjs/config` và load biến môi trường từ `.env`.
- [x] **1.2 Database & Database Tools Setup**
  - [x] Khởi tạo Prisma (`npx prisma init`) hoặc TypeORM.
  - [x] Setup Docker Compose chứa PostgreSQL và Redis (nếu phát triển local).
  - [x] Viết migration đầu tiên để kích hoạt extension pgvector (`CREATE EXTENSION IF NOT EXISTS vector;`).
- [x] **1.3 Core NestJS Configs**
  - [x] Cấu hình Global Validation Pipe, Global Exception Filter, và Response Transform Interceptor.
  - [x] Tích hợp Redis Client (sử dụng `ioredis` hoặc `@nestjs/cache-manager`).
- [x] **1.4 AI Vector Service (Python - Viết dưới dạng Microservice/API riêng)**
  - [x] Khởi tạo repo/thư mục python: `requirements.txt` (FastAPI, sentence-transformers).
  - [x] Viết script load model `AITeamVN/Vietnamese_Embedding_v2`.
  - [x] Expose API `POST /embed` nhận text, trả về vector array `[float]`.
- [x] **1.5 Authentication & Authorization**
  - [x] Define Schema Bảng `User` (id, email, password_hash, role: ADMIN/HOST/USER).
  - [x] Implement `AuthModule` (Tích hợp JWT, bcrypt).
  - [x] Viết Guards: `JwtAuthGuard` (verify token), `RolesGuard` (phân quyền).
  - [x] Tạo APIs: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`.

## Phase 2: Core Domain & DB Design (Users, Hotels, Rooms)
- [x] **2.1 Define Database Schema (Prisma/TypeORM)**
  - [x] Bảng `Hotel` (id, host_id, name, description, address, city, country, star_rating, search_vector).
  - [x] Bảng `Room` (id, hotel_id, name, type, base_price, capacity, quantity, search_vector).
  - [x] Bảng `Amenity` (id, name, icon) & Bảng trung gian `HotelAmenity`, `RoomAmenity`.
- [x] **2.2 Master Data CRUD APIs (Admin/Host/Public)**
  - [!] **CONSTRAINT**: Host chỉ được phép Create/Update/Delete các Hotel/Room có `host_id == current_user.id`.
  - [x] **Amenity APIs**: `GET /amenities`, `POST /amenities`, `PATCH /amenities/:id`, `DELETE /amenities/:id`.
  - [x] **Hotel APIs**: 
    - `POST /hotels` (Host tạo).
    - `GET /hotels/my-hotels` (Host xem danh sách KS của mình).
    - `GET /hotels/:id` (Public xem chi tiết KS).
    - `PATCH /hotels/:id`, `DELETE /hotels/:id` (Host/Admin).
  - [x] **Room APIs**: 
    - `POST /hotels/:hotelId/rooms` (Host tạo phòng).
    - `GET /hotels/:hotelId/rooms` (Public xem danh sách phòng).
    - `GET /rooms/:id`, `PATCH /rooms/:id`, `DELETE /rooms/:id`.
- [x] **2.3 Vector Syncing Logic**
  - [x] Tích hợp `HttpModule` (Axios) gọi sang Python Service.
  - [x] Viết logic Service Observer/Interceptor: Khi Hotel hoặc Room được Create/Update, gộp `name + description + amenities` -> gọi Python API `/embed` lấy vector.
  - [x] Update cột `search_vector` trong PostgreSQL sử dụng raw query của `pgvector` (do các ORM thường chưa support native vector type).

## Phase 3: Search Engine & Availability Queries
- [ ] **3.1 Define Schema Bookings & Inventory**
  - [ ] Bảng `Booking` (id, user_id, room_id, check_in, check_out, status, total_price).
- [ ] **3.2 Thuật toán Query Availability (Core Logic)**
  - [!] **CONSTRAINT**: `Check-out` date luôn phải lớn hơn `Check-in` date ít nhất 1 ngày. `Check-in` date >= ngày hiện tại.
  - [ ] Viết function tính tổng số phòng ĐÃ BOOK (trạng thái Confirmed hoặc Pending Hold) trong khoảng `[Start_Date, End_Date]` cho một `room_id` cụ thể.
  - [ ] Function kiểm tra: `Available = Room.quantity - Đã_Book > 0`.
- [ ] **3.3 Hybrid Search API (`GET /search`)**
  - [ ] Parse Query Params: `q` (text), `checkIn`, `checkOut`, `guests`, `minPrice`, `maxPrice`.
  - [ ] Nếu có `q`: Gọi Python API lấy vector, sinh Raw SQL Query dùng toán tử `<->` của pgvector.
  - [ ] Kết hợp Raw SQL Vector Search với các điều kiện:
    - Sức chứa (Room.capacity >= guests).
    - Mức giá (Room.base_price trong khoảng min, max).
    - Availability: Tính logic phòng trống ở 3.2.
  - [ ] Trả về danh sách Hotels/Rooms thỏa mãn kèm điểm số similarity (nếu có `q`).

## Phase 4: Booking, Dynamic Pricing & Promotions
- [ ] **4.1 Dynamic Pricing System**
  - [!] **CONSTRAINT**: BE bắt buộc phải chạy vòng lặp qua từng đêm nghỉ để áp dụng hệ số giá tương ứng với `PricingRule`. Không nhân `base_price` * tổng số đêm.
  - [ ] Bảng `PricingRule` (hotel_id, name, multiplier/flat_fee, start_date, end_date, day_of_week).
  - [ ] Viết Hàm `CalculatePrice`: Lấy `base_price` của room -> lặp qua từng ngày từ `checkIn` đến `checkOut` -> áp dụng hệ số từ `PricingRule` (nếu có) -> Cộng tổng ra `totalPrice`.
  - [ ] API `POST /bookings/preview-price` (Trả về break down giá từng ngày).
- [ ] **4.2 Promotions & Coupons**
  - [!] **CONSTRAINT**: Validate Coupon phải kiểm tra `min_spend`, `expiry_date`, số lượng mã còn lại (`quantity`).
  - [ ] Bảng `Coupon` (code, discount_type: %, amount, max_discount, min_spend, host_id/null, expiry).
  - [ ] APIs Coupon: `POST /coupons` (Admin/Host tạo), `GET /coupons` (List mã giảm giá), `PATCH /coupons/:id`, `DELETE /coupons/:id`.
  - [ ] Validate Coupon Logic: Cập nhật hàm `CalculatePrice` để trừ tiền khuyến mãi khi nhập mã.
- [ ] **4.3 Hold Room System (Redis)**
  - [!] **CONSTRAINT**: Redis Hold Key TTL = 15 phút. Nếu quá 15 phút không thanh toán -> Tự xóa khỏi Redis (hoàn trả Inventory).
  - [ ] API `POST /bookings/hold`: Verify Availability.
  - [ ] Nếu còn phòng -> Generate UUID `hold_id`.
  - [ ] Set Redis Key `hold:{room_id}:{hold_id}` = `{ checkIn, checkOut, quantity }` với TTL 15 phút.
  - [ ] Trả về `hold_id` và `expiresAt`.
- [ ] **4.4 Submit Booking & Transaction**
  - [!] **CONSTRAINT**: Bắt buộc bọc Transaction và dùng DB Row Lock (`SELECT FOR UPDATE`) khi thanh toán phòng để tránh Overbooking. Kiểm tra lại Hold Key trong Redis trước khi trừ tiền.
  - [ ] API `POST /bookings/submit`: Nhận `hold_id`, `payment_method`, `user_info`.
  - [ ] Validate Redis Key `hold_id` có tồn tại không.
  - [ ] Bọc Transaction: Tạo record `Booking` (status: CONFIRMED/PENDING_PAYMENT), XÓA Redis Key `hold_id`.
  - [ ] Xử lý Concurrency (Sử dụng DB Row Lock `SELECT FOR UPDATE` trên Room nếu cần).
- [ ] **4.5 Wishlist System**
  - [ ] Bảng `Wishlist` (user_id, hotel_id).
  - [ ] APIs Wishlist: 
    - `POST /wishlist` (Thêm KS vào wishlist).
    - `GET /wishlist` (Lấy danh sách wishlist của User).
    - `DELETE /wishlist/:hotelId` (Xóa KS khỏi wishlist).

## Phase 5: Host & Admin System (Policies & Analytics)
- [ ] **5.1 Cancellation Policies**
  - [!] **CONSTRAINT**: Không cho phép User tự hủy phòng (Cancel) nếu thời gian hiện tại >= ngày Check-in.
  - [ ] Bảng `CancellationPolicy` (hotel_id, days_before_checkin, penalty_percentage).
  - [ ] API `POST /bookings/:id/cancel`: Lấy chính sách -> Tính toán số tiền hoàn trả (Refund Amount) -> Đổi status Booking sang `CANCELLED`.
- [ ] **5.2 Analytics API for Host**
  - [ ] API Lấy Tổng Doanh Thu (Sum Total Price của các booking Confirmed/Completed) theo tháng.
  - [ ] API Tính Tỉ lệ lấp đầy (Occupancy Rate = Số đêm đã book / Tổng số đêm có thể book của khách sạn) trong một khoảng thời gian.
- [x] **5.3 Analytics API for Admin**
  - [x] API Lấy GMV toàn sàn (Tạm thời mock, chờ module Booking).
  - [x] Thống kê số lượng User đăng ký mới, số lượng Hotel Active.
- [ ] **5.4 Host & Admin Booking Management APIs**
  - [!] **CONSTRAINT**: Host chỉ có quyền lấy danh sách booking của khách sạn do mình sở hữu.
  - [ ] `GET /host/bookings`: Lấy danh sách booking của khách sạn (Filter theo status, date).
  - [ ] `PATCH /host/bookings/:id/status`: Cập nhật trạng thái booking (ví dụ: ACCEPTED, CHECKED_IN, CHECKED_OUT).
  - [x] `GET /admin/users` & `PATCH /admin/users/:id/role`: Quản lý Role của User.
  - [x] `GET /admin/hotels` & `PATCH /admin/hotels/:id/status`: Phê duyệt khách sạn mới lên sàn.

## Phase 6: Advanced & Polish
- [ ] **6.1 Verified Reviews System**
  - [!] **CONSTRAINT**: User CHỈ được viết review NẾU VÀ CHỈ NẾU có Booking ID tại khách sạn đó với status `CHECKED_OUT`. Mỗi booking chỉ review 1 lần.
  - [ ] Bảng `Review` (booking_id, user_id, hotel_id, location_rating, cleanliness_rating, service_rating, value_rating, comment).
  - [ ] APIs Review:
    - `POST /hotels/:hotelId/reviews`: User viết đánh giá (GUARD: Booking của user tại hotel này phải có status `CHECKED_OUT`).
    - `GET /hotels/:hotelId/reviews`: Public xem danh sách đánh giá của khách sạn.
    - `DELETE /reviews/:id`: Admin xóa đánh giá vi phạm.
  - [ ] Cập nhật điểm đánh giá trung bình của Hotel (Trigger hoặc Cronjob tính lại điểm).
- [ ] **6.2 Messaging System (Socket.io)**
  - [ ] Bảng `Message` (id, sender_id, receiver_id, booking_id, content, created_at).
  - [ ] REST APIs: `GET /messages/:bookingId` (Lấy lịch sử tin nhắn của 1 booking).
  - [ ] Cài đặt `@nestjs/websockets`, `@nestjs/platform-socket.io`.
  - [ ] Tạo `ChatGateway`, Xử lý authentication cho Socket.
  - [ ] Emit message realtime giữa User và Host dựa vào `booking_id` làm Room Socket.
- [ ] **6.3 Background Jobs & Cron**
  - [ ] Tích hợp `@nestjs/schedule`.
  - [ ] Cronjob mỗi ngày: Chuyển các booking quá ngày check-out thành `CHECKED_OUT` nếu Host quên update.
  - [ ] Cronjob dọn dẹp các Pending Booking chưa thanh toán.
- [ ] **6.4 Database Optimization**
  - [ ] Thêm Index cho các cột Date (`check_in`, `check_out`), `hotel_id`, `user_id`.
  - [ ] Kiểm tra HNSW / IVFFlat index cho Vector column để search nhanh hơn.

---
**Nhật ký làm việc (BE Agent Logs)**:
- *(Thêm log làm việc vào đây để không quên context...)*
