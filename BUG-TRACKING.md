# HỆ THỐNG THEO DÕI LỖI (BUG TRACKING LIST)

Tài liệu này được sử dụng để toàn bộ team (Frontend, Backend, QC/QA) ghi nhận, phân công và theo dõi tiến độ xử lý các lỗi (bugs) hoặc các vấn đề (issues) phát sinh trong suốt quá trình phát triển và vận hành dự án **Bookong Engine Platform**.

---

## 🛑 QUY TRÌNH LOG BUG VÀ XỬ LÝ

1. **Phát hiện & Ghi nhận**: Bất kỳ ai phát hiện lỗi đều có thể thêm 1 dòng mới vào bảng `DANH SÁCH BUG` bên dưới. Hãy ghi rõ ID, Mô tả ngắn gọn, và mức độ nghiêm trọng.
2. **Phân công (Assign)**: Tag tên thành viên hoặc team chịu trách nhiệm (vd: `@Frontend-Team`, `@Backend-Team`).
3. **Thực thi (In Progress)**: Người nhận việc có thể ghi chú `🔄 IN PROGRESS` vào cột trạng thái.
4. **Đóng Bug (Resolved)**: Khi fix xong và test pass, chỉ cần sửa `[ ]` thành `[x]` ở cột Status. Mọi người nhìn vào dấu tick là sẽ biết bug đã được fix.

---

## 🔴 MỨC ĐỘ NGHIÊM TRỌNG (SEVERITY)
- **CRITICAL**: Sập app, không thể thanh toán, lọt quyền bảo mật, sai lệch database nghiêm trọng. Cần fix ngay lập tức (ASAP).
- **HIGH**: Lỗi sai logic nghiệp vụ quan trọng (tính sai tiền, sai kết quả tìm kiếm), vỡ layout diện rộng.
- **MEDIUM**: Lỗi hiển thị UI, sai text, lỗi animation, UX chưa tốt.
- **LOW**: Lỗi typo, màu sắc/font chữ chưa chuẩn thiết kế.

---

## 📋 DANH SÁCH THEO DÕI

*Đánh dấu `[x]` vào cột Status khi bug đã được giải quyết.*

| Status | ID | Component | Description | Severity | Assignee | Notes/Ngày Fix |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| [x] | **BUG-001** | `Frontend` | Admin đăng nhập thành công nhưng bị redirect nhầm sang `/host/dashboard` thay vì `/admin/dashboard`. | 🟠 HIGH | AI Agent | 13/08/2026 - Đã phân nhánh redirect riêng cho ADMIN |
| [x] | **BUG-002** | `Backend` | API `GET /hotels/my-hotels` đôi khi trả về mảng rỗng nếu Host vừa đăng ký chưa kịp verify email. | 🟡 MEDIUM | AI Agent | Đóng (Not a bug) - Trả về [] là chuẩn vì Host mới chưa tạo KS nào. |
| [x] | **BUG-003** | `Frontend` | Màn hình Host Dashboard (`/host/dashboard`) bị dính Navbar và Footer của Root Layout khiến giao diện không giống một màn hình độc lập. Cần cấu hình lại Layout Group hoặc ẩn đi. | 🟡 MEDIUM | AI Agent | 13/08/2026 - Đã ẩn NavbarSticky & Footer trên portal /host và /admin |
| [x] | **BUG-004** | `Frontend` | Thay thế nhập URL Unsplash bằng tính năng Upload. Yêu cầu bổ sung UI Upload File, gọi API `POST /api/v1/upload/image`. | 🟡 MEDIUM | AI Agent | 13/08/2026 - Đã tích hợp UI Upload File & API /upload/image |
| [x] | **BUG-005** | `Frontend` | Đăng nhập Host thành công nhưng bị đẩy lại trang đăng nhập. Nguyên nhân do `use-auth-store` chỉ lưu token ở `localStorage`, còn Next.js Middleware lại kiểm tra qua `cookie` nên bị chặn lại. | 🔴 CRITICAL | AI Agent | 13/08/2026 - Đã lưu đồng thời token vào cookie & localStorage trong useAuthStore |
| [x] | **BUG-000** | `Database` | Prisma Schema thiếu các trường lưu trữ `images` và `coverImage` cho Khách sạn và Phòng. Dẫn đến không thể lưu link ảnh thực tế. | 🔴 CRITICAL | AI Agent | 13/08/2026 |
| [x] | **BUG-006** | `Frontend` | Thiếu Form/UI Tạo tài khoản Admin mới ở màn hình Quản lý người dùng (`/admin/users`). Cần bổ sung UI gọi API `POST /admin/users` (Đã implement phía Backend). | 🟡 MEDIUM | AI Agent | 13/08/2026 - Đã tạo Modal UI khởi tạo Admin mới và gọi API POST /admin/users |
| [x] | **BUG-007** | `Frontend` | Cấu hình Bảng giá động (Dynamic Pricing) gọi sai endpoint. Đang gọi `POST /host/pricing-rules` thay vì `POST /pricing-rules`. Dashboard Host cũng gọi API sai định dạng hoặc chưa đồng bộ model với Backend. | 🟠 HIGH | AI Agent | 13/08/2026 - Đã sửa gọi API /pricing-rules (POST/GET/DELETE) và đồng bộ Host Dashboard analytics |
| [x] | **BUG-008** | `Frontend` | Form tạo Khách sạn mới bắt lỗi catch và tự động gọi `onSuccess()` thay vì báo lỗi cho người dùng. Dẫn đến giao diện đóng modal và reload nhưng thực tế Backend chưa tạo thành công (do payload lệch). Cần loại bỏ dòng `onSuccess()` trong block catch và hiển thị `errorMsg`. | 🔴 CRITICAL | AI Agent | 13/08/2026 - Đã loại bỏ onSuccess() trong block catch và hiển thị errorMsg thực tế |
| [x] | **BUG-009** | `Frontend` | Nâng cấp Form "Tạo Tài khoản Admin" ở màn hình `/admin/users` thành Form "Khởi tạo Tài khoản Mới". Cần bổ sung dropdown chọn Role (USER, HOST, ADMIN) và truyền field `role` vào payload `POST /admin/users` (Backend đã hỗ trợ nhận role). | 🟡 MEDIUM | AI Agent | 13/08/2026 - Đã thêm dropdown chọn Role (USER, HOST, ADMIN) và truyền role vào payload API |
| [x] | **BUG-010** | `Frontend` | Nút "Quản lý loại phòng" ở màn hình danh sách khách sạn (`/host/properties`) đang không có sự kiện `onClick`. Cần làm luồng chuyển hướng (hoặc mở Modal) để Host có thể thêm/sửa/xóa phòng. Backend đã có sẵn toàn bộ API cho Room (`POST/GET /hotels/:hotelId/rooms` và `PATCH/DELETE /rooms/:id`). | 🟠 HIGH | AI Agent | 13/08/2026 - Đã gắn Link chuyển hướng sang /host/rooms?hotelId=... và tự động chọn đúng khách sạn |
| [x] | **BUG-011** | `Frontend` | Tại trang chủ (`/`), thanh chọn Danh mục (Category Bar) và Nút "Bộ lọc" (Filter Modal) đang chưa được xử lý sự kiện `onClick/onApply`. Cần truyền thêm tham số (category/amenities) vào hook fetch gọi API `GET /api/v1/hotels` hoặc redirect sang trang search để lọc danh sách. | 🟡 MEDIUM | AI Agent | 13/08/2026 - Đã xử lý event handler category & filter modal truyền tham số tới API /hotels |
| [x] | **BUG-012** | `Frontend` | Khắc phục tình trạng Duplicate API Calls: 1) API `GET /hotels/my-hotels` bị gọi lại liên tục ở các màn `/host/rooms`, `/host/properties`, `/host/dynamic-pricing` khi chuyển tab (cần dùng SWR/React Query/Zustand để cache). 2) `(user)/bookings/page.tsx` lạm dụng try-catch để gọi fallback `GET /bookings` nếu `/bookings/my-trips` lỗi. Cần chuẩn hóa lại cách gọi fetch. | 🟡 MEDIUM | AI Agent | 13/08/2026 - Đã chuẩn hóa gọi trực tiếp GET /bookings/my-trips và tối ưu useCallback fetch |
| [x] | **BUG-013** | `Frontend` | Màn hình Chi tiết Khách sạn (`/hotels/[id]`) đang bị lệch Layout. Khoảng cách lề trái/phải (padding/margin) không đồng nhất với thiết kế của Trang chủ. Cần dùng chung class container (ví dụ `airbnb-container` hoặc `booking-container`) để đảm bảo tính nhất quán UI/UX. | 🟡 MEDIUM | AI Agent | 13/08/2026 - Đã đồng bộ sử dụng class airbnb-container chuẩn lề responsive |
| [x] | **BUG-014** | `Frontend` | Tính năng Yêu thích / Like khách sạn (Wishlist) chưa được tích hợp UI trên trang chủ và trang chi tiết. Backend đã xây dựng sẵn toàn bộ API: `GET /api/v1/wishlist`, `POST /api/v1/wishlist` (body: `{ "hotelId": string }`), và `DELETE /api/v1/wishlist/:hotelId`. Frontend cần gắn sự kiện `onClick` vào icon trái tim và làm màn hình danh sách Yêu thích. | 🟡 MEDIUM | AI Agent | 13/08/2026 - Đã gắn API Wishlist vào icon Trái tim & làm màn hình /wishlist |
| [ ] | **BUG-015** | `Frontend` | Lỗi React Hydration (Server: "S" Client: "A"): Do việc render `displayName[0]` ở các layout (admin-header, admin-sidebar, host-header, host-sidebar) dựa vào `useAuthStore` (zustand localStorage). Trên Server, user là null nên render tên mặc định ("System...", "Host..."), nhưng dưới Client lại render theo user đã đăng nhập. Cần dùng `isMounted` state để đồng bộ. | 🟠 HIGH | @Frontend-Team | Chờ fix hydration |
| [x] | **BUG-016** | `Backend` | Danh sách khách sạn của Host luôn hiển thị "Đang chờ duyệt" dù Admin đã Approve. Nguyên nhân: Frontend check trường `isApproved` boolean, nhưng Backend lại trả về model Prisma gốc với trường `status: "APPROVED" | "PENDING"`. | 🟠 HIGH | AI Agent | 13/08/2026 - Đã map thêm trường `isApproved: hotel.status === 'APPROVED'` trong API `GET /hotels/my-hotels` |
| [x] | **BUG-017** | `Backend` | Tính năng Tìm kiếm (Search) ở trang chủ trả về lỗi `400 Bad Request` nếu không nhập số lượng khách. Nguyên nhân: Thuộc tính `guests` trong `SearchQueryDto` bắt buộc phải có giá trị, nhưng Frontend khi submit SearchBar lại có thể không gửi param này. | 🟠 HIGH | AI Agent | 13/08/2026 - Đã thêm `@IsOptional()` vào thuộc tính `guests` và gán mặc định `guests = 1` nếu Frontend không gửi lên trong `search.service.ts` |
| [ ] | **BUG-018** | `Frontend` | Các ảnh upload từ máy tính không hiển thị (lỗi 400 từ Next.js Image Optimization). Nguyên nhân: API upload trả về link dạng `http://localhost:3000/uploads/...`, nhưng domain `localhost` chưa được khai báo trong `remotePatterns` của file `next.config.mjs`. Cần cấu hình thêm `localhost` vào danh sách cho phép. | 🔴 CRITICAL | @Frontend-Team | Chờ cấu hình next.config |
| [ ] | **BUG-019** | `Frontend` | Nút "Chỉnh sửa" trong danh sách Quản lý Loại phòng (`frontend/app/host/rooms/page.tsx`) chưa được gắn sự kiện `onClick` hoặc chức năng chuyển trang (mới chỉ là thẻ `<button>` giao diện). Cần bổ sung xử lý sự kiện để Host có thể cập nhật thông tin loại phòng. | 🟡 MEDIUM | @Frontend-Team | Chờ gắn sự kiện onClick |
| [ ] | **BUG-020** | `Frontend` | Màn hình Quản lý Kho Phòng (`/host/rooms`) hiện tại chỉ hiển thị tổng số lượng phòng tĩnh (Quantity) mà không có tính năng Tra cứu khả dụng theo ngày (Check-in/Check-out). Cần bổ sung 2 ô chọn ngày DatePicker trên UI và truyền thêm params `?checkIn=...&checkOut=...` vào API `GET /hotels/:hotelId/rooms` để lấy số lượng phòng khả dụng thực tế (`availableQuantity`). | 🟠 HIGH | @Frontend-Team | Đã hỗ trợ backend query params |
| [x] | **BUG-021** | `Backend` | API `GET /host/bookings` trả về dữ liệu bị lồng 2 lớp (double-wrapping) do bị `TransformInterceptor` bọc đè lên dữ liệu đã bọc sẵn. Hệ quả là màn hình quản lý đơn đặt phòng của Host không lấy được mảng danh sách phòng. | 🟠 HIGH | AI Agent | 13/08/2026 - Đã sửa lỗi bằng cách trả thẳng kết quả từ service để Interceptor tự động bọc chuẩn. |
| [ ] | **BUG-022** | `Frontend` | Ở trang Search (`frontend/app/(public)/search/page.tsx`), các bộ lọc bên trái (FilterSidebar) chỉ đang cập nhật state local trong Zustand store (`useSearchStore`), nhưng không tự động đẩy (push) state đó lên URL (query string). Do Component chính chỉ đọc dữ liệu từ `useSearchParams()` để gọi API nên việc click bộ lọc không hề trigger lấy dữ liệu mới. Cần update hàm `setSearchParams` đẩy params lên URL hoặc dùng `router.push`. | 🔴 CRITICAL | @Frontend-Team | Đã thêm logic lọc API phía Backend |
