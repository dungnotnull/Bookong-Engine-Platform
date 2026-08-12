# ISSUES LIST TRACKING (FRONTEND)

Tài liệu này dùng để ghi nhận, phân tích nguyên nhân gốc rễ (Root Cause) và theo dõi tiến độ xử lý tất cả các sự cố, lỗi UI/UX, bug bất đồng bộ state, lỗi tích hợp API nảy sinh trong quá trình phát triển ứng dụng **Frontend (Next.js 14 App Router)** của dự án **Bookong Engine Platform**.

---

## 🛑 1. QUY TRÌNH PHÂN LOẠI & XỬ LÝ SỰ CỐ

Khi phát hiện bug hoặc sự cố trong quá trình phát triển Frontend:

1. **Khấu trừ & Xác định nguyên nhân (Root Cause Analysis)**: Đọc log console browser, kiểm tra Network tab (Request Payload, Response Body, HTTP Status), kiểm tra React Developer Tools / Zustand store.
2. **Đánh giá mức độ nghiêm trọng (Severity)**:
   - 🔴 **CRITICAL**: Lỗi làm hỏng luồng đặt phòng (Hold timer crash, Checkout submit thất bại, app bị màn hình trắng/Fatal Error, lọt quyền Admin/Host).
   - 🟠 **HIGH**: Lỗi sai lệch hiển thị giá tiền, sai kết quả tìm kiếm, lỗi hủy phòng không hiện đúng số tiền hoàn trả, lỗi responsive bị bể layout nặng trên Mobile.
   - 🟡 **MEDIUM**: Lỗi nhỏ về UX, đếm sai số đêm khi chọn ngày đặc biệt, animation bị giật nhẹ, toast notification không hiện đúng nội dung lỗi API backend.
   - 🟢 **LOW**: Lỗi typo văn bản, khoảng cách padding/margin chưa chuẩn Booking.com specs.
3. **Cập nhật danh sách bên dưới**: Thêm dòng mới vào Bảng tổng hợp sự cố kèm trạng thái (`OPEN`, `IN_PROGRESS`, `RESOLVED`).
4. **Viết chi tiết xử lý**: Ghi chép phương án giải quyết và bài học kinh nghiệm để tránh tái diễn.

---

## 📋 2. BẢNG TỔNG HỢP SỰ CỐ (FRONTEND ISSUES TRACKING TABLE)

| ID | Trang / Component | Mô tả tóm tắt sự cố | Mức độ | Trạng thái | Người xử lý | Ngày giải quyết |
|---|---|---|---|---|---|---|
| *FE-ISSUE-001* | Checkout Page | Lệch đồng hồ đếm ngược Hold Timer 15m khi user chuyển tab | 🔴 CRITICAL | 🟢 RESOLVED | AI Agent | 2026-08-12 |
| *FE-ISSUE-002* | Hero Search Bar | Lệch múi giờ UTC khi chọn Check-in / Check-out trên Date Range Picker | 🟠 HIGH | 🟢 RESOLVED | AI Agent | 2026-08-12 |
| *FE-ISSUE-003* | Next.js App Router | Hydration Mismatch do render ngày tháng/tiền tệ phía Client khác Server | 🟡 MEDIUM | 🟢 RESOLVED | AI Agent | 2026-08-12 |
| *FE-ISSUE-004* | User Bookings Page | Nút Hủy phòng không kiểm tra ngày hiện tại với ngày Check-in | 🟠 HIGH | 🟢 RESOLVED | AI Agent | 2026-08-12 |
| *FE-ISSUE-005* | Hotel Detail Page | Form Đánh giá hiển thị cho cả các đơn hàng chưa CHECKED_OUT | 🟠 HIGH | 🟢 RESOLVED | AI Agent | 2026-08-12 |

---

## 🔍 3. CHI TIẾT PHÂN TÍCH & GIẢI PHÁP CHO CÁC SỰ CỐ THƯỜNG GẶP (KNOWN EDGE CASES)

### 🔴 FE-ISSUE-001: Lệch đồng hồ đếm ngược Hold Timer (15 phút) khi chuyển tab browser
- **Mô tả**: Khi người dùng chuyển sang tab khác trong khi đang ở trang Checkout, `setInterval` của trình duyệt bị giảm tần suất (browser throttling), khiến đồng hồ đếm ngược 15 phút trên UI bị chậm hơn so với thời gian hết hạn thực tế (`expiresAt`) do Backend trả về.
- **Nguyên nhân gốc rễ**: Phụ thuộc vào đếm lùi từng giây bằng `setInterval(() => count - 1, 1000)` thay vì so sánh thời gian thực tế với mộc `expiresAt`.
- **Giải pháp triệt để**:
  - Không giảm biến đếm `secondsLeft - 1`.
  - Mỗi nhịp timer, lấy `Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)`.
  - Tích hợp sự kiện `document.addEventListener('visibilitychange')` để tự động tính lại ngay khi người dùng quay lại tab Checkout.
- **Bằng chứng khắc phục**: Đồng hồ đếm ngược hiển thị chính xác theo thời gian thực tế của Server dù user chuyển tab hay thu nhỏ trình duyệt.

---

### 🟠 FE-ISSUE-002: Lệch múi giờ UTC / Local Time khi chọn Check-in / Check-out
- **Mô tả**: Chọn ngày 15/09 trên Date Picker nhưng khi gửi lên API Backend lại bị lùi thành `2026-09-14T17:00:00.000Z` do chuyển đổi mốc giờ địa phương (GMT+7) về UTC 00:00.
- **Nguyên nhân gốc rễ**: Thư viện Date picker trả về đối tượng `Date` mặc định theo mốc 00:00 giờ địa phương, khi dùng `.toISOString()` bị chuyển lùi 7 tiếng về ngày hôm trước.
- **Giải pháp triệt để**:
  - Sử dụng `date-fns/format`: `format(date, 'yyyy-MM-dd')` để bóc tách chính xác chuỗi ngày mà không bị ảnh hưởng bởi chuyển đổi timezone offset.
  - Đồng bộ format chuỗi `YYYY-MM-DD` chuẩn giao tiếp tại [API-CONTRACT.md](../API-CONTRACT.md).
- **Bằng chứng khắc phục**: Chọn ngày 15/09 luôn gửi chuỗi `"2026-09-15"` lên API Backend.

---

### 🟡 FE-ISSUE-003: Lỗi Next.js Hydration Mismatch với Format Currency / Date
- **Mô tả**: Console báo lỗi `Hydration failed because the initial UI does not match what was rendered on the server` tại các vị trí hiển thị giá tiền hoặc ngày tháng.
- **Nguyên nhân gốc rễ**: Hàm `Intl.NumberFormat` hoặc `formatDate` phụ thuộc vào Locale của môi trường chạy (Node.js trên Server vs Browser của User).
- **Giải pháp triệt để**:
  - Đóng gói các component format hiển thị động trong Custom Component dạng Client-only hoặc dùng hook `useMounted`.
  - Hoặc chỉ định rõ locale cố định: `new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`.
- **Bằng chứng khắc phục**: Console hoàn toàn sạch sẽ, không còn cảnh báo Hydration Mismatch.

---

### 🟠 FE-ISSUE-004: Nút Hủy phòng không kiểm tra ngày hiện tại với ngày Check-in
- **Mô tả**: User cố gắng ấn Hủy phòng khi đã đến hoặc qua ngày Check-in, Backend trả về lỗi `CANNOT_CANCEL_AFTER_CHECKIN` làm crash hoặc hiện toast lỗi không rõ nghĩa.
- **Nguyên nhân gốc rễ**: Frontend không validate điều kiện ngày `currentDate >= checkInDate` trước khi mở modal Hủy phòng.
- **Giải pháp triệt để**:
  - Ẩn/Disable nút "Hủy phòng" trên trang `/user/bookings` nếu `isAfter(new Date(), parseISO(booking.checkIn))` hoặc `isSameDay(new Date(), parseISO(booking.checkIn))`.
  - Thay thế bằng nhãn ghi chú rõ ràng: *"Đã quá thời gian được cho phép hủy theo chính sách"*.
- **Bằng chứng khắc phục**: Nút Hủy phòng chỉ sáng khi thỏa mãn điều kiện thời gian của chính sách.

---

### 🟠 FE-ISSUE-005: Form Đánh giá hiển thị cho cả các đơn hàng chưa CHECKED_OUT
- **Mô tả**: User vừa chuyển trạng thái `CONFIRMED` hoặc `CHECKED_IN` đã thấy nút "Viết đánh giá", khi submit lên Backend trả về 403 Forbidden `ONLY_CHECKED_OUT_BOOKING_CAN_REVIEW`.
- **Nguyên nhân gốc rễ**: Frontend chỉ kiểm tra xem user có booking tại khách sạn đó hay không mà không check kỹ `booking.status === 'CHECKED_OUT'`.
- **Giải pháp triệt để**:
  - Thêm điều kiện cứng trên UI: `booking.status === 'CHECKED_OUT' && !booking.hasReviewed`.
  - Chỉ hiển thị nút "Viết đánh giá" đối với đơn đã hoàn thành trả phòng.
- **Bằng chứng khắc phục**: Người dùng không bị gửi request đánh giá sai trạng thái, tránh lỗi 403.

---

## 📚 4. BÀI HỌC KINH NGHIỆM & QUY CHUẨN TRÁNH BUG RỦI RO (LESSONS LEARNED)

1. **Luôn kiểm tra Empty State & Skeleton State**: Không bao giờ để giao diện bị trống hoặc đơ khi chưa có dữ liệu API.
2. **Sanitize Data trước khi render**: Luôn dùng Optional Chaining (`hotel?.facilities?.map(...)`) và fallback value (`hotel?.name || 'Khách sạn chưa cập nhật tên'`) để tránh crash app do `TypeError: Cannot read properties of undefined`.
3. **Sync State với URL**: Luôn ưu tiên lưu thông tin bộ lọc tìm kiếm (Dates, Location, Guests, Filter params) lên URL Search Params thay vì chỉ lưu local state. Việc này giúp khách hàng có thể copy/share đường link kết quả tìm kiếm cho người khác mà vẫn giữ nguyên giao diện bộ lọc.
