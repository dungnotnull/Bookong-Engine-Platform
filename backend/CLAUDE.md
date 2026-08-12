# backend/CLAUDE.md - Backend Conventions

Đây là file convention riêng cho môi trường Backend. AI Agent BE cần tuân thủ nghiêm ngặt các quy tắc này.

## Tech Stack
- Framework: NestJS
- Database: PostgreSQL (sử dụng ORM Prisma hoặc TypeORM - tùy quyết định lúc init)
- Caching/Locking: Redis
- Khác: `pgvector` cho PostgreSQL

## Nguyên tắc viết Code Backend
- Sử dụng kiến trúc Modular của NestJS (Module, Controller, Service).
- **Date/Time**: Luôn lưu dưới dạng UTC trong CSDL. Khi xử lý logic ở BE cần cẩn thận tính toán timezone và tính toán khoảng ngày (Check-in/Check-out).
- **Transactions**: BẤT KỲ hành động nào liên quan đến Payment hoặc Tạo Booking đều phải bọc trong Database Transaction để tránh mất dữ liệu (ví dụ: tạo Booking và trừ số lượng phòng).

## Tương tác AI Search Service
- Khi tạo/update Hotel, đẩy Data (name + description + facilities) sang Python Service để nhúng, nhận Vector trả về lưu vào Cột Vector trong PostgreSQL.
- Khi Search, lấy text user nhập, gọi Python service lấy Vector, sau đó sử dụng query `<->` của pgvector trên Postgres để tính toán khoảng cách cùng với query lọc (Full-text, Giá, Location).

## Giữ phòng (Temporary Hold)
- Khi FE gọi `/bookings/hold`, kiểm tra xem có đủ số lượng trống không. Nếu có, tạo key Redis với TTL (Time-to-Live) là 15 phút (ví dụ: `hold:{roomId}:{uuid}`). Đồng thời trừ tạm số inventory trong CSDL hoặc duy trì trạng thái pending.
- Kết hợp Cronjob quét các booking pending quá hạn chưa chuyển trạng thái sang confirm để giải phóng room (nếu cơ chế Redis exp không thể cover hoàn toàn logic rollback DB).

## Cập nhật Contract & Logs
- KHÔNG thay đổi Payload/Endpoint nếu chưa cập nhật `API-CONTRACT.md`.
- Ghi lại toàn bộ công việc vào `DEVELOPMENT-TASK-BY-PHASES-TRACKING-LOGS.md` sau mỗi thay đổi lớn.
