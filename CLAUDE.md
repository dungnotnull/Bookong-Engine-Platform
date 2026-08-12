# Bookong - General Project Conventions & Architecture

## Architecture Overview
Bookong là hệ thống Booking Engine Platform (Platform đặt phòng) với kiến trúc bao gồm 3 thành phần chính:
1. **Frontend (FE)**: Web app xây dựng bằng NextJS, giao tiếp với BE qua REST API.
2. **Backend (BE)**: API Server xây dựng bằng NestJS, quản lý logic nghiệp vụ, giao tiếp với CSDL PostgreSQL và Redis (quản lý temporary hold phòng).
3. **AI Search Service (Python)**: Một microservice độc lập viết bằng Python phục vụ cho việc nhúng (embedding) và tìm kiếm ngữ nghĩa (Semantic search) sử dụng model open-source `AITeamVN/Vietnamese_Embedding_v2`. CSDL lưu trữ vector là PostgreSQL với extension `pgvector`.

## Giao tiếp giữa các module
- **FE <-> BE**: FE gọi API của BE. Tất cả payload, response, và query params phải tuân thủ chuẩn tại `API-CONTRACT.md`.
- **BE <-> AI Search Service**: Khi tạo hoặc cập nhật thông tin Hotel/Room (Name + Description + Facilities), BE sẽ gọi qua AI Search Service để lấy vector embedding, sau đó BE lưu vào PostgreSQL qua type `vector`. Khi Search, BE gọi lại AI Search Service để chuyển search query thành vector rồi thực hiện query cosine similarity trên PostgreSQL.
- **BE <-> CSDL**: BE kết nối PostgreSQL cho persistence data và Redis cho các cơ chế caching, locking, và session (như giữ phòng tạm thời trong 15 phút).

## Convention Chung Toàn Dự Án
1. **Source of Truth**: 
   - `API-CONTRACT.md` là file duy nhất quyết định cấu trúc dữ liệu giao tiếp giữa FE và BE. KHÔNG tự ý thay đổi API mà không cập nhật file này trước.
2. **Git Commit / PR**:
   - Format: `[Tên-Module] - Mô tả ngắn gọn`. Ví dụ: `[BE-Search] Cập nhật logic tìm kiếm vector`.
3. **Mã lỗi và Xử lý lỗi**:
   - BE luôn trả về format: `{ "success": false, "errorCode": "XXX", "message": "..." }`. FE luôn bắt lỗi thông qua cấu trúc này.
4. **Agent Roles**:
   - Mỗi thư mục `/frontend` và `/backend` đều có file `CLAUDE.md` riêng để định nghĩa convention cụ thể cho từng stack. Hãy tuân thủ convention riêng biệt đó khi làm việc trong các thư mục tương ứng.
