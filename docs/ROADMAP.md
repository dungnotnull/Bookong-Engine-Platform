# Roadmap Tổng Quan Dự Án Bookong

File này chứa thông tin roadmap các milestones cấp cao (high-level phases). File này được cập nhật thưa (per-milestone).

## Milestone 1: Foundation & Core Infrastructure
- Thiết lập NextJS (FE), NestJS (BE), Python Search Service.
- Thiết lập Database Schema (PostgreSQL + pgvector).
- Authentication (Admin, Host, User).

## Milestone 2: Search Engine & Inventory Management
- Tích hợp model `AITeamVN/Vietnamese_Embedding_v2`.
- Tính năng Hybrid Search (Vector + Full-text).
- Xây dựng thuật toán kiểm tra phòng trống theo khoảng thời gian (Date Range Queries).

## Milestone 3: Booking Flow & Dynamic Pricing
- Tính giá động (Dynamic Pricing) theo mùa vụ, ngày nghỉ lễ.
- Temporary hold room với Redis (khóa phòng 15 phút).
- Hoàn thiện flow đặt phòng và apply discount.

## Milestone 4: Dashboards
- Host Dashboard: Quản lý khách sạn, phòng, booking, giá cả.
- Admin Dashboard: Quản lý platform, system, system metrics, users.

## Milestone 5: Polish, Optimization & Launch
- Review, Notification (Email, in-app).
- Tối ưu SEO cho NextJS.
- Performance testing cho AI Search.
