# Workspace Rules & Directives (Shopew)

Mỗi khi thao tác hoặc phát triển dự án Shopew, tất cả AI Agents BẮT BUỘC phải đọc và tuân thủ các file quan trọng thuộc Source of Truth sau đây:
1. `API-CONTRACT.md`: Schema, Endpoint, Status Code, Tiền tệ VND.
2. `CHANGELOG.md`: Lịch sử thay đổi và cập nhật dự án.
3. `CLAUDE.md` (bao gồm `frontend/CLAUDE.md` & `backend/CLAUDE.md`): Tech stack & Hướng dẫn vận hành.
4. `PROJECT-DETAIL.md`: Phân tích nghiệp vụ SPU/SKU, Redis Order Queue, Flash Sale, Chat WebSocket.
5. Thư mục Kỹ năng (`.agents/skills/`): Đọc và tuân thủ file `SKILL.md` của từng skill trước khi thực thi.

## Quy tắc thao tác
- **Đọc Skills trước (Skills First):** Đọc kỹ các tài liệu `SKILL.md` trong `.agents/skills/` liên quan tới tác vụ trước khi triển khai.
- Clean code (không comment-out code cũ, không console.log dư thừa).
- 100% Comment bằng Tiếng Việt ngắn gọn, súc tích và đúng trọng tâm.
- **Xác nhận trước khi Git Push:** CHỈ `git commit` mã nguồn cục bộ. Tuyệt đối KHÔNG `git push` lên remote nếu chưa có sự kiểm tra và đồng ý trực tiếp từ người dùng.
- **Phạm vi code:** Agent CHỈ ĐƯỢC code trong `backend/`, TUYỆT ĐỐI KHÔNG ĐƯỢC code trong `frontend/`.
- **Xử lý lỗi Frontend:** Đối với các bug hoặc problem của frontend, PHẢI log vào file `d:\vibe-coding\Bookong-Engine-Platform\BUG-TRACKING.md`.
- **Theo dõi tiến độ:** Khi implement các task trong `d:\vibe-coding\Bookong-Engine-Platform\backend\DEVELOPMENT-TASK-BY-PHASES-TRACKING-LOGS.md`, làm xong task nào phải đánh dấu hoàn thành, sau đó CẬP NHẬT thông tin vào file `d:\vibe-coding\Bookong-Engine-Platform\API-CONTRACT.md`.



