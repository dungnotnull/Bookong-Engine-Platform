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
| [x] | **BUG-000** | `Database` | Prisma Schema thiếu các trường lưu trữ `images` và `coverImage` cho Khách sạn và Phòng. Dẫn đến không thể lưu link ảnh thực tế. | 🔴 CRITICAL | AI Agent | 13/08/2026 |
| [ ] | **BUG-005** | `Frontend` | Đăng nhập Host thành công nhưng bị đẩy lại trang đăng nhập. Nguyên nhân do `use-auth-store` chỉ lưu token ở `localStorage`, còn Next.js Middleware lại kiểm tra qua `cookie` nên bị chặn lại. | 🔴 CRITICAL | @Frontend-Team | Chờ fix |


