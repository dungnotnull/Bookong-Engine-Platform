# Bookong Frontend - Conventions & Technical Architecture

Tài liệu này định nghĩa cấu trúc kiến trúc, tiêu chuẩn mã nguồn, quy chuẩn thiết kế UI/UX và các lệnh phát triển dành riêng cho ứng dụng **Frontend (Next.js 14 App Router)** của dự án **Bookong Engine Platform**.

---

## 🏗️ 1. ARCHITECTURE OVERVIEW & TECH STACK

Ứng dụng Frontend là một Web Application hiện đại, đáp ứng tốt cho 3 nhóm người dùng (Guest, Host, Admin), giao tiếp với NestJS Backend qua REST API và hiển thị kết quả tìm kiếm Semantic Vector linh hoạt.

| Thành phần | Công nghệ / Thư viện | Mục đích |
|---|---|---|
| **Framework** | **Next.js 14 (App Router)** | Render phía server (SSR/SSG/ISR), Routing, Tối ưu SEO |
| **Language** | **TypeScript 5.x** | Static Typing, Type Safety đồng bộ với API DTOs |
| **Styling** | **Tailwind CSS + Vanilla CSS** | Utility-first styling, Custom Booking.com theme variables |
| **Component Library** | **Shadcn UI + Radix UI** | Accessible, unstyled headless UI components |
| **Icons** | **Lucide React** | Bộ icon hiện đại, đồng nhất |
| **State Management** | **Zustand & React Context** | Quản lý global state (Search criteria, Auth user, Hold Timer, Wishlist) |
| **Data Fetching** | **Axios / React Query (TanStack Query)** | API Client, Caching, Revalidation, Optimistic Updates |
| **Date Utilities** | **Date-fns** | Xử lý múi giờ, tính số đêm, format ISO8601 |
| **Form & Validation** | **React Hook Form + Zod** | Validate form đặt phòng, form Host tạo khách sạn |
| **Realtime Chat** | **Socket.io-client** | Nhắn tin 1-1 giữa Guest và Host qua Socket Gateway |

---

## 📁 2. DIRECTORY STRUCTURE CONVENTIONS

```
frontend/
├── app/                                # Next.js 14 App Router
│   ├── (auth)/                         # Auth Layout & Routes (Login, Register)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (public)/                       # Main Customer Routes
│   │   ├── page.tsx                    # Homepage (Hero Search, Featured Properties, Semantic Bar)
│   │   ├── search/page.tsx             # Search Results (Filter Sidebar, Property List, Semantic Score)
│   │   ├── hotels/[id]/page.tsx        # Hotel & Room Detail (Gallery, Amenities, Date Calendar, Reviews)
│   │   └── wishlist/page.tsx           # Saved Properties (Wishlist)
│   ├── (checkout)/                     # Checkout Flow
│   │   ├── checkout/[roomId]/page.tsx  # Checkout Page (Hold Timer 15m Sticky Banner, Guest Form, Coupon)
│   │   └── booking-success/page.tsx    # Confirmation Page (QR Code, Receipt, Manage Booking)
│   ├── (user)/                         # Guest Account & Booking Management
│   │   ├── profile/page.tsx            # User Profile Settings
│   │   └── bookings/page.tsx           # Booking History, Cancellation & Review modal
│   ├── host/                           # Host Management Portal (Protected by Host Role Guard)
│   │   ├── dashboard/page.tsx          # Analytics (Occupancy %, Revenue Chart)
│   │   ├── properties/page.tsx         # Hotel & Room CRUD
│   │   ├── dynamic-pricing/page.tsx    # Seasonal & Holiday Price Calendar Config
│   │   └── bookings/page.tsx           # Booking Approvals & Status Updates (ACCEPTED, CHECKED_IN)
│   ├── admin/                          # Admin Platform Governance (Protected by Admin Role Guard)
│   │   ├── dashboard/page.tsx          # System-wide Analytics & Platform GMV
│   │   ├── hotels-approval/page.tsx    # Approve/Reject Host Listings
│   │   └── users/page.tsx              # User & Host Account Governance (Ban/Active)
│   ├── layout.tsx                      # Root Layout (Navbar, Footer, Toast Provider)
│   └── globals.css                     # Design Tokens & Tailwind Directives
├── components/
│   ├── ui/                             # Shadcn UI primitives (Button, Dialog, Calendar, Slider...)
│   ├── common/                         # Shared UI (Header, Footer, HeroSearchBar, RatingBadge, Skeleton)
│   ├── search/                         # FilterSidebar, PropertyCard, SemanticScoreTag, SortDropdown
│   ├── hotel-detail/                   # ImageGallery, RoomSelectionTable, ReviewSection, HostProfile
│   ├── checkout/                       # HoldTimerBanner, PriceBreakdown, CouponInput, GuestForm
│   ├── user/                           # CancellationModal, ReviewFormModal
│   ├── chat/                           # ChatDrawer, ChatMessageList, ChatInput
│   └── host/                           # PropertyForm, PriceCalendarEditor, RevenueChart
├── hooks/                              # Custom React Hooks
│   ├── use-hold-timer.ts               # Hook quản lý thời gian đếm ngược 15 phút giữ phòng
│   ├── use-search-filters.ts           # Hook sync search query params với URL
│   ├── use-auth.ts                     # Hook quản lý đăng nhập/đăng xuất & JWT Token
│   ├── use-socket-chat.ts              # Hook kết nối Socket.io theo room booking_id
│   └── use-dynamic-price.ts            # Hook tính toán preview giá tiền thời gian thực
├── lib/                                # Core Utilities & API Client
│   ├── api-client.ts                   # Axios instance với Interceptors bắt lỗi chuẩn API-CONTRACT
│   ├── formatters.ts                   # formatCurrency (VND), formatDate, calculateNights
│   └── constants.ts                    # Booking.com Theme Colors, Default Facilities, Amenities
├── stores/                             # Zustand Global Stores
│   ├── use-search-store.ts             # Lưu thông tin Search (Location, Dates, Guests, Semantic Query)
│   ├── use-booking-store.ts            # Lưu thông tin Hold Session & Active Booking
│   └── use-auth-store.ts               # Lưu User Profile & Tokens
└── types/                              # TypeScript Definitions
    ├── api.ts                          # Generic Response Wrapper { success, data, meta, errorCode }
    ├── hotel.ts                        # Hotel, Room, Amenity, Facility interfaces
    ├── booking.ts                      # Booking, HoldSession, PriceCalculation, CancellationPolicy
    └── user.ts                         # User, Host, Admin interfaces
```

---

## ⚡ 3. DEVELOPER COMMANDS

Chạy các câu lệnh sau tại thư mục `frontend/`:

```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi chạy server phát triển (Dev Server tại http://localhost:3001)
npm run dev

# 3. Kiểm tra lỗi TypeScript mà không build
npm run type-check

# 4. Kiểm tra lỗi mã nguồn với ESLint
npm run lint

# 5. Đóng gói bản Production
npm run build

# 6. Chạy thử bản Production sau khi build
npm start
```

---

## 🎨 4. DESIGN SYSTEM & UI GUIDELINES (BOOKING.COM BENCHMARK)

### 4.1. Color Palette Variable System
* **`bg-booking-navy` (`#003580`)**: Dùng cho Header chính, Hero Banner.
* **`bg-booking-blue` (`#006CE4`)**: Nút CTA chính ("Tìm kiếm", "Đặt ngay", "Xem phòng trống").
* **`border-booking-yellow` / `bg-booking-yellow` (`#FEBB02`)**: Viền Hero Search Box, badge khuyến mãi.
* **`text-booking-green` (`#008009`)**: Nhãn "Miễn phí hủy phòng", "Không cần trả trước".
* **`bg-booking-orange` (`#E55D00`)**: Banner giữ phòng đếm ngược (Hold Room 15 phút), nhãn "Chỉ còn 1 phòng".
* **`bg-booking-rating` (`#003580`)**: Khung hiển thị điểm số rating (ví dụ `9.2`).

---

## 🔄 5. ANH XẠ BẢNG API ENDPOINTS VỚI BACKEND CORE MODULES

| Backend Module | Endpoint | Method | Vai trò trên Frontend |
|---|---|---|---|
| **Auth** | `/api/v1/auth/register` | `POST` | Đăng ký tài khoản User/Host |
| **Auth** | `/api/v1/auth/login` | `POST` | Đăng nhập & lưu JWT Token |
| **Auth** | `/api/v1/auth/me` | `GET` | Lấy thông tin User hiện tại & Role |
| **Amenities** | `/api/v1/amenities` | `GET / POST` | Quản lý Tiện nghi khách sạn & phòng |
| **Hotels** | `/api/v1/hotels` | `POST` | Host tạo khách sạn mới |
| **Hotels** | `/api/v1/hotels/my-hotels` | `GET` | Host xem danh sách khách sạn của mình |
| **Search** | `/api/v1/search` | `GET` | Tìm kiếm phòng trống (Hybrid Semantic + Filters) |
| **Booking Hold**| `/api/v1/bookings/hold` | `POST` | Khóa chỗ tạm thời 15 phút |
| **Pricing** | `/api/v1/bookings/calculate-price` | `POST` | Tính toán giá phân rã từng ngày |
| **Booking Submit**| `/api/v1/bookings` | `POST` | Submit đơn đặt phòng & xác nhận |
| **Booking Cancel**| `/api/v1/bookings/:id/cancel` | `POST` | Hủy đặt phòng theo chính sách hoàn tiền |
| **Host Bookings**| `/api/v1/host/bookings` | `GET / PATCH` | Host quản lý & đổi trạng thái booking |
| **Admin Governance**| `/api/v1/admin/hotels/:id/approve` | `PATCH` | Admin phê duyệt khách sạn lên sàn |
| **Admin Governance**| `/api/v1/admin/users/:id/status` | `PATCH` | Admin khóa/mở tài khoản |
| **Reviews** | `/api/v1/hotels/:hotelId/reviews` | `POST / GET` | Đánh giá xác thực (chỉ cho `CHECKED_OUT`) |
| **Messaging** | `/api/v1/messages/:bookingId` | `GET` | Lịch sử nhắn tin 1-1 Guest <-> Host |
