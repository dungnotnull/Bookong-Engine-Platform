# RULE.md - Quy tắc phát triển Frontend & UI/UX Directives (Bookong Platform)

Tài liệu này định nghĩa các nguyên tắc **bắt buộc và tối thượng** khi AI Agent hoặc lập trình viên thực hiện bất kỳ công việc thiết kế UI, phát triển tính năng, tích hợp API hoặc refactor trong thư mục `frontend/` của dự án **Bookong - Booking Engine Platform**.

---

## 🌟 1. BA NGUYÊN LÝ NỀN TẢNG (CORE PRINCIPLES)

Mọi thay đổi trong mã nguồn Frontend phải tuân thủ nghiêm ngặt 3 nguyên lý:

1. **Tối giản & Tái sử dụng (Minimalist & Reusable)**: Thiết kế component mô-đun hóa, nguyên tử (Atomic Component Architecture). Không trùng lặp code styling hay logic state. Chỉ sử dụng những dependencies thật sự cần thiết.
2. **Triệt để & Toàn diện (Thorough & Robust)**: Xử lý triệt để 100% các trạng thái UI: `Loading (Skeleton)`, `Empty State`, `Error State`, `Success Notification`. Bắt lỗi API chuẩn theo hợp đồng [API-CONTRACT.md](../API-CONTRACT.md) và xử lý mượt mà các trường hợp đếm ngược giữ phòng (Hold Timer Expiration), hết phòng, sai định dạng ngày.
3. **Vô hình & Đỉnh cao UX (Invisible & High Aesthetic UX)**: Giao diện hiện đại, sang trọng lấy cảm hứng trực tiếp từ **Booking.com**. Hiệu ứng chuyển cảnh mượt mà (smooth transitions, micro-animations), phản hồi tức thì khi click/hover, responsive hoàn hảo 100% từ Mobile đến Desktop (320px - 1920px+).

---

## 📋 2. QUY TRÌNH PHÁT TRIỂN 6 BƯỚC (BẮT BUỘC)

Không bỏ qua bất kỳ bước nào dưới đây. Nếu phát hiện thiếu thông tin hoặc sai lệch thiết kế, phải làm rõ trước khi tiếp tục:

1. **Lập kế hoạch Task & UI Component Breakdown**: Phân tích Yêu cầu -> Vẽ cấu trúc Component & Route -> Xác định State локальный & Global.
2. **Đối soát Hợp đồng API**: Đọc kỹ [API-CONTRACT.md](../API-CONTRACT.md) để xác định đúng Endpoint, Query Params, Request Body và DTO Response.
3. **Thực thi UI & Logic State**: Xây dựng UI chuẩn thiết kế Booking.com với Tailwind CSS & Shadcn UI. Tích hợp API qua Custom Hooks / React Query / SWR / Axios.
4. **Xử lý Edge Cases & Comment Tiếng Việt**: Viết comment giải thích logic phức tạp (Hold Timer, Dynamic Pricing, Date Range Filter). Đảm bảo không đọng lại `console.log` hay dead code.
5. **Đánh dấu Trạng thái & Bằng chứng**: Cập nhật dấu `[x]` kèm thông tin kiểm thử (build pass, no lint error) vào [DEVELOPMENT-TASK-BY-PHASES-TRACKING-LOGS.md](./DEVELOPMENT-TASK-BY-PHASES-TRACKING-LOGS.md).
6. **Theo dõi Bug & Bài học Kinh nghiệm**: Ghi nhận bất kỳ lỗi nảy sinh (Hydration mismatch, Timer desync, Responsive break) vào [ISSUES-LIST-TRACKING.md](./ISSUES-LIST-TRACKING.md).

---

## 🚨 3. NGUỒN DỮ LIỆU CHUẨN (SOURCE OF TRUTH)

Trước khi viết bất kỳ dòng code nào, BẮT BUỘC phải đọc và tuân thủ các tài liệu sau:

1. 📄 **[API-CONTRACT.md](../API-CONTRACT.md)**
   * Hợp đồng giao tiếp giữa Frontend và Backend.
   * Tất cả Payload, Response data wrapper `{ success, data, meta }` hoặc `{ success: false, errorCode, message }` phải khớp **100%**.
   * Đơn vị tiền tệ hiển thị: **VND (Việt Nam Đồng)** dạng số nguyên (được format đẹp dạng `1.500.000 ₫`).
   * 🚨 **QUY TẮC BẮT BUỘC**: Nếu Frontend cần thêm field hoặc chỉnh sửa endpoint, BẮT BUỘC phải cập nhật [API-CONTRACT.md](../API-CONTRACT.md) trước hoặc đồng thời.

2. 📄 **[PROJECT-DETAIL.md](../PROJECT-DETAIL.md)**
   * Nắm rõ luồng nghiệp vụ:
     * **Hero Search Box**: Tìm kiếm theo Địa điểm, Semantic AI Query ("Biệt thự gần biển có hồ bơi"), Khoảng ngày Check-in/Check-out, Số lượng khách.
     * **Hold Room (Temporary Lock)**: Đếm ngược 15 phút (900s) ở trang Checkout. Hiển thị cảnh báo trực quan khi thời gian sắp hết.
     * **Dynamic Pricing Preview**: Giá phòng nhảy theo số đêm, ngày cuối tuần/lễ và mã giảm giá.
     * **Hybrid Vector & FTS Search**: Hiển thị điểm tương đồng Semantic (Semantic Match Score) nếu search theo câu mô tả.

3. 📄 **[CLAUDE.md](./CLAUDE.md) (Frontend)**
   * Nắm rõ Tech Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Date-fns, Lucide Icons, Zustand / Context.
   * Hệ màu sắc Booking.com Brand System (Deep Navy Blue `#003580`, Action Blue `#006CE4`, Accent Gold/Yellow `#FEBB02`, Green Free Cancellation `#008009`).

4. 📄 **[README.md](../README.md)**
   * Nắm tổng quan hệ thống 3 thành phần (FE NextJS, BE NestJS, AI Vector Python Microservice).

---

## 🛑 4. QUY TẮC THAO TÁC TỐI THƯỢNG (SUPREME RULES FOR FRONTEND)

1. **Phạm vi thư mục tuyệt đối**:
   * Chỉ thao tác và tạo code trong thư mục **frontend/**.
   * Tuyệt đối KHÔNG sửa code trong thư mục `backend/` hay `python_ai_service/`.

2. **Tiêu chuẩn UI/UX Đẳng cấp Booking.com**:
   * **Header / Navigation**: Chuẩn thanh điều hướng Booking.com (Stays, Attractions, Language/Currency Picker, Wishlist, User Menu / Host Dashboard Switcher).
   * **Hero Search Bar**: Thanh tìm kiếm nổi bật với nền xanh phông vàng, tích hợp Date Range Picker (Check-in -> Check-out), Popup chọn số lượng Phòng/Người lớn/Trẻ em.
   * **Sidebar Filter linh hoạt**: Lọc theo khoảng giá (Slider/Min-Max), Xếp hạng sao, Điểm đánh giá (8+ Rất tốt, 9+ Tuyệt hảo), Tiện nghi (Bể bơi, WiFi miễn phí, Bãi đậu xe, Ăn sáng), Loại hình lưu trú (Khách sạn, Resort, Biệt thự, Căn hộ).
   * **Card lưu trú (Property Card)**: Ảnh slider/gallery sắc nét, nhãn "Miễn phí hủy phòng", nhãn "Chỉ còn 1 phòng giá này", điểm đánh giá màu xanh da trời đậm với khung số tròn (ví dụ `8.9`), vị trí khoảng cách đến trung tâm.
   * **Checkout Hold Timer Sticky Banner**: Banner đếm ngược 15 phút cố định phía trên trang Checkout, màu cam/đỏ nổi bật thông báo giữ phòng cho khách.

3. **Comment bằng Tiếng Việt & Clean Code**:
   * Comment bằng **Tiếng Việt** giải thích lý do xử lý logic UI/State phức tạp.
   * Tuyệt đối không lưu code bị comment-out, dead code, `console.log` thừa.

4. **Xử lý Bất đồng bộ & Phản hồi Người dùng (UX Resilience)**:
   * Tất cả button submit đều phải có trạng thái `Disabled` + `Spinner loading` khi đang gọi API.
   * Dùng Skeleton Loading thay vì giao diện trắng hoặc spinner xoay giữa màn hình gây giật lag.
   * Toast notification hiển thị thông báo thành công / thất bại rõ ràng với `errorCode` dễ hiểu.

5. **Đồng bộ Thời gian & Timezone**:
   * Xử lý ngày tháng Check-in / Check-out qua thư viện `date-fns`. Luôn format ISO8601 (`YYYY-MM-DD`) khi gửi lên API Backend.
   * Tính số đêm (number of nights) chính xác không bị lệch múi giờ (UTC vs Local Time).

---

## 🎨 5. QUY CHUẨN THIẾT KẾ & BẢNG MÀU (BOOKING.COM PALETTE)

| Thành phần | Mã màu Hex | Ý nghĩa & Ứng dụng |
|---|---|---|
| **Primary Navy** | `#003580` | Header background, Hero section background |
| **Action Blue** | `#006CE4` | Primary Buttons, Active links, Selected states |
| **Accent Yellow** | `#FEBB02` | Search Bar border/highlight, Promotional badges |
| **Success Green** | `#008009` | Badges: "Miễn phí hủy phòng", "Xác nhận ngay" |
| **Warning Orange** | `#E55D00` | Banner đếm ngược giữ phòng (Hold Timer 15m), "Chỉ còn X phòng" |
| **Rating Blue** | `#003580` | Khung hiển thị điểm đánh giá (Score Badge `8.8`) |
| **Danger Red** | `#D4111E` | Lỗi hết hạn giữ phòng, Hủy đặt phòng, Non-refundable badge |
| **Background Neutral** | `#F5F5F5` | Nền trang chính, Nền Card kết quả tìm kiếm |

---

## 🧪 6. BẰNG CHỨNG HOÀN THÀNH TASK (EVIDENCE OF DONE)

Một task Frontend chỉ được coi là hoàn thành khi đáp ứng đủ các tiêu chí:

1. **Build & Type Check Clean**: Chạy `npm run build` và `npm run lint` không phát sinh lỗi TypeScript hoặc ESLint.
2. **Responsive Check**: Đã kiểm tra hiển thị mượt mà trên Mobile (375px), Tablet (768px), và Desktop (1440px+).
3. **API Integration Test**: Kết nối API thành công với Backend hoặc trả về dữ liệu Mock khớp 100% schema `API-CONTRACT.md`.
4. **Cập nhật Logs**: Đánh dấu `[x]` trong [DEVELOPMENT-TASK-BY-PHASES-TRACKING-LOGS.md](./DEVELOPMENT-TASK-BY-PHASES-TRACKING-LOGS.md) và ghi nhận vấn đề nảy sinh vào [ISSUES-LIST-TRACKING.md](./ISSUES-LIST-TRACKING.md).
