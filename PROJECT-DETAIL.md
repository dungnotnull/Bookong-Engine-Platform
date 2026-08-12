# PROJECT DETAIL

Tài liệu này chứa thông tin chi tiết về các yêu cầu, feature và breakdown chi tiết các task qua từng Phase của dự án Bookong.

## 1. Yêu cầu tính năng & Technical Focus
- **Tìm kiếm phòng/khách sạn**: Theo khoảng ngày (Check-in/Check-out) & số lượng khách.
- **Dynamic Pricing**: Tính giá theo mùa vụ, ngày lễ, ngày trong tuần cuối tuần. Tính tổng tiền dựa trên số đêm, loại phòng, phụ phí & discount code.
- **Hold Room (Temporary Reservation Locking)**: Khóa chỗ tạm thời 10-15 phút bằng Redis Expiration / Cron. Tránh việc User điền form xong thì báo hết phòng.
- **Advanced Search & Filter**: Hybrid search giữa Full-text search đa tiêu chí (Giá, Amenities, Rating, Location) và Semantic search (Gộp các trường name + description + facilities vào 1 vector duy nhất để search thông qua `pgvector` và Python service với model `AITeamVN/Vietnamese_Embedding_v2`).
- **Quản lý inventory (số lượng room)**: Tránh booking quá số lượng (Overbooking) bằng transaction hoặc cơ chế lock.
- **Đa vai trò (Multiple Role)**: Admin (quản lý hệ thống) và Host (chủ khách sạn quản lý tài sản), User (người dùng đặt phòng).
- **Chính sách Hoàn/Hủy (Cancellation & Refund Policies)**: Cho phép thiết lập các mức giá khác nhau tùy chính sách (Free cancellation, Non-refundable).
- **Mã Giảm Giá & Khuyến Mãi (Promotions & Coupons)**: Quản lý mã giảm giá hệ thống và của riêng Host.
- **Báo cáo & Thống kê (Analytics)**: Biểu đồ doanh thu, tỉ lệ lấp đầy phòng cho Host/Admin.
- **Verified Reviews & Messaging**: Hệ thống đánh giá dành riêng cho user đã hoàn thành booking và tính năng nhắn tin trực tiếp với Host.

---

## 2. BREAKDOWN TASK CHI TIẾT THEO TỪNG PHASE (CHO CẢ FE & BE)

### Phase 1: Project Setup & Foundation
**Mục tiêu**: Xây dựng kiến trúc gốc cho cả 3 thành phần (FE NextJS, BE NestJS, Python Vector Service).
- **Task 1.1**: Khởi tạo repo FE (NextJS), config routing, convention CSS, ESLint.
- **Task 1.2**: Khởi tạo repo BE (NestJS), setup Prisma/TypeORM, kết nối PostgreSQL, setup Redis.
- **Task 1.3**: Khởi tạo Python Microservice, load embedding model `AITeamVN/Vietnamese_Embedding_v2` qua thư viện (sentence-transformers), tạo API endpoint `/embed` để trả về vector.
- **Task 1.4**: Cấu hình PostgreSQL với extension `pgvector`.
- **Task 1.5**: Setup Authentication cơ bản (JWT Auth, định nghĩa Roles: Admin, Host, User).

### Phase 2: Core Domain & Inventory Design (Users, Hotels, Rooms)
**Mục tiêu**: Quản lý được thông tin Khách sạn và Phòng, đảm bảo vector data được sync.
- **Task 2.1**: Thiết kế Schema DB (Tables: Users, Hotels, Rooms, Amenities, Facilities). Bảng Hotel/Room sẽ có field `search_vector`.
- **Task 2.2**: Xây dựng CRUD API cho Hotel và Room (dành cho Role Host).
- **Task 2.3**: Viết trigger hoặc Service Observer: Khi create/update Hotel/Room, BE gọi Python Service lấy embedding vector của `name + description + facilities` -> Lưu vào field `search_vector`.
- **Task 2.4**: Giao diện (FE) Host Dashboard: Form thêm mới, sửa xóa Hotel và Room, quản lý Amenities.

### Phase 3: Search Engine & Availability Checking
**Mục tiêu**: Có thể tìm kiếm phòng bằng Semantic, kiểm tra phòng trống chính xác.
- **Task 3.1 (BE)**: Xây dựng thuật toán Query Availability: Filter các room có số lượng (Inventory) lớn hơn tổng số booking đã chốt hoặc đang hold trong khoảng ngày `[Start_Date, End_Date]`.
- **Task 3.2 (BE)**: Xây dựng Hybrid Search: Kết hợp Vector Similarity Search (`<->` operator trong pgvector) và Filter điều kiện cứng (Giá, Location, Amenities, Availability).
- **Task 3.3 (FE)**: Xây dựng Homepage với thanh Search Box đa năng (Địa điểm, Semantic query, Date Range, Số người).
- **Task 3.4 (FE)**: Xây dựng trang Search Results, hiển thị đẹp mắt, có sidebar Filter.

### Phase 4: Booking Flow, Pricing & Promotions
**Mục tiêu**: Hoàn thiện luồng đặt phòng, tính tiền linh hoạt, hold phòng an toàn và các tính năng kích cầu (Wishlist, Coupon).
- **Task 4.1 (BE)**: Thiết kế bảng Pricing Rule (Ngày lễ, weekend, mùa vụ) & Logic áp dụng Pricing. Cung cấp API Preview Price.
- **Task 4.2 (BE)**: Code cơ chế Temporary Reservation Lock bằng Redis. API `POST /bookings/hold` -> sinh ra Redis Key `hold:room_id` với TTL 15p.
- **Task 4.3 (FE)**: Giao diện chi tiết Phòng (Room Detail). Hiển thị lịch để check giá từng ngày. Thêm nút "Lưu vào Wishlist".
- **Task 4.4 (FE)**: Checkout Form. Gọi API hold phòng ngay khi vào trang checkout, show Countdown Timer (15 phút). Có ô nhập Mã Giảm Giá.
- **Task 4.5 (BE)**: API Submit Booking & Payment (có thể mock trước). Trừ Inventory thật, xóa Redis hold, lưu DB trạng thái Confirm.
- **Task 4.6 (BE/FE)**: Tính năng Wishlist (Saved Properties) cho User.
- **Task 4.7 (BE/FE)**: Xây dựng Module Promotions & Coupons (Admin/Host tạo mã, validate mã khi checkout).

### Phase 5: Host & Admin Management (Policies & Analytics)
**Mục tiêu**: Các chức năng quản lý vận hành, thống kê doanh thu và thiết lập chính sách.
- **Task 5.1**: Admin Dashboard (Approve Hotel, Manage Users).
- **Task 5.2**: Host - Quản lý Booking (Chấp nhận, Hủy, Xem calendar booking).
- **Task 5.3**: Quản lý Dynamic Pricing (Host tự set giá cao cho cuối tuần, lễ).
- **Task 5.4 (BE/FE)**: Cấu hình Chính sách Hoàn/Hủy (Cancellation Policies - Free cancellation, Non-refundable) và xử lý logic hoàn tiền khi User hủy phòng.
- **Task 5.5 (BE/FE)**: Hệ thống Báo Cáo & Thống Kê (Analytics). Host: Doanh thu, Occupancy Rate. Admin: Tổng GMV, Platform Stats.

### Phase 6: Polish & Advanced Features
**Mục tiêu**: Verified Reviews, SEO, Messaging, Cải thiện trải nghiệm.
- **Task 6.1**: Chức năng Verified Reviews & Rating (Chỉ cho phép User đã Checked-out đánh giá, break down điểm Location, Cleanliness...).
- **Task 6.2**: Notification (Email hoặc App push) khi booking thành công.
- **Task 6.3**: Hệ thống Messaging (Nhắn tin trực tiếp 1-1 giữa User và Host qua Socket.io).
- **Task 6.4**: UI/UX Polish, Micro-animations, Skeleton loading trên FE.
- **Task 6.5**: Tối ưu index và performance query trên BE.
