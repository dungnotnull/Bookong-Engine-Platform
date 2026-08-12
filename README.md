
# 🏨 Bookong - Booking Engine Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-000000?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![pgvector](https://img.shields.io/badge/Vector-pgvector-006400)](https://github.com/pgvector/pgvector)
[![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis)](https://redis.io/)
[![Python AI](https://img.shields.io/badge/AI%20Service-Python%20FastAPI-3776AB?logo=python)](https://fastapi.tiangolo.com/)

> A high-performance, multi-role accommodation booking engine inspired by **Booking.com**. Features non-overlapping date availability algorithms, seasonal dynamic pricing, temporary 15-minute reservation locks, and hybrid semantic vector search using `pgvector` and an AI embedding microservice.

---

## 📌 Table of Contents
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Technical Highlights](#-technical-highlights)
  - [Date Range & Availability Algorithm](#1-date-range--availability-algorithm)
  - [Temporary Reservation Locking](#2-temporary-reservation-locking)
  - [Hybrid Vector & Full-Text Search](#3-hybrid-vector--full-text-search)
  - [Dynamic Pricing Engine](#4-dynamic-pricing-engine)
- [Database ERD Highlights](#-database-erd-highlights)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## ✨ Key Features

### 👤 Multi-Role Platform Management
* **Guest / User:** Search properties, filter by amenities/price/ratings, reserve rooms with temporary locks, apply coupon codes, and manage bookings.
* **Host / Hotel Owner:** Manage property listings, inventory, room types, seasonal pricing overrides, and view booking analytics.
* **Admin:** Platform governance, user/host management, commission fee setup, and system-wide audit logs.

### 🔍 Advanced Search & AI Discovery
* **Hybrid Search Engine:** Combines PostgreSQL Full-Text Search (FTS) with vector similarity search powered by `pgvector`.
* **Semantic Embeddings:** Dedicated Python microservice generating 768-dim embeddings (`AITeamVN/Vietnamese_Embedding_v2`) for unified `name + description + facilities` vectors.
* **Multi-Criteria Filtering:** Filter by price ranges, star ratings, guest capacity, specific amenities, and geographic distance.

---

## 🏗 System Architecture


```

```
                   ┌─────────────────────────┐
                   │   Next.js 14 Web App    │
                   │  (Guests, Hosts, Admin) │
                   └────────────┬────────────┘
                                │ HTTP / REST
                                ▼
                   ┌─────────────────────────┐
                   │    NestJS Core Server   │
                   └─────┬───────────┬───────┘
                         │           │
       ┌─────────────────┘           └────────────────┐
       │ gRPC / REST                                  │ SQL / Vector
       ▼                                              ▼

```

┌──────────────────────┐                     ┌─────────────────────────┐
│ Python AI Service    │                     │  PostgreSQL + pgvector  │
│ (FastAPI + Embeddings)│                     │ (Relational Data & FTS) │
└──────────────────────┘                     └─────────────────────────┘
▲
│ TTL Lock
┌────────────┴────────────┐
│      Redis Cache        │
│  (Hold Room 15 Mins)    │
└─────────────────────────┘

```

---

## 🛠 Tech Stack

| Domain | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Date-fns |
| **Backend Core** | NestJS, Prisma / TypeORM, TypeScript |
| **AI Embedding Microservice** | Python 3.10+, FastAPI, HuggingFace Transformers, PyTorch |
| **Database & Search** | PostgreSQL 16, `pgvector` extension, Full-Text Search (FTS) |
| **Cache & Locks** | Redis (Keyspace Notifications & TTL Locks) |
| **Utilities** | Docker & Docker Compose, Date-fns (date arithmetic) |

---

## 💡 Technical Highlights

### 1. Date Range & Availability Algorithm
To prevent double-booking across overlapping check-in and check-out periods `[Start_Date, End_Date]`, the availability engine verifies room inventory using interval exclusion:

```sql
-- Checks if any confirmed booking or active hold overlaps with requested dates
SELECT room_type_id 
FROM room_inventory 
WHERE room_type_id = :roomTypeId
  AND total_quantity - (
      SELECT COUNT(*) 
      FROM bookings 
      WHERE room_type_id = :roomTypeId
        AND status IN ('CONFIRMED', 'HELD')
        AND NOT (check_out_date <= :startDate OR check_in_date >= :endDate)
  ) > 0;

```

### 2. Temporary Reservation Locking

During checkout, rooms are locked for 15 minutes while the user fills in guest details and completes payment:

* **Implementation:** Redis Keyspace Expiration with Key pattern `hold:room:{roomTypeId}:{sessionId}`.
* **Fallback:** NestJS scheduled Cron tasks to sweep orphaned expired holds in the PostgreSQL fallback table.

### 3. Hybrid Vector & Full-Text Search

Combines exact text matching with semantic understanding:

1. **Embedding Generation:** Property `Name + Description + Facilities` are concatenated and processed by the Python FastAPI microservice using `AITeamVN/Vietnamese_Embedding_v2`.
2. **Vector Storage:** Embedded vectors are stored in PostgreSQL via `pgvector` (`vector(768)` index).
3. **Hybrid Ranking:** Results are combined using Reciprocal Rank Fusion (RRF) between FTS score and Cosine Distance (`<=>`).

### 4. Dynamic Pricing Engine

Total booking calculation handles multiple pricing variables:


$$\text{Total Price} = \sum_{\text{day} \in \text{Dates}} \Big(\text{BaseRate}_{\text{day}} \times \text{SeasonalMultiplier}_{\text{day}}\Big) + \text{Surcharges} - \text{DiscountCode}$$

* **Date Math:** Calculated precisely on the server using `date-fns` to account for time zones and leap years.

---

## ⚡ Getting Started

### Prerequisites

* Docker & Docker Compose
* Node.js >= 18.x
* Python >= 3.10

### 1. Clone & Environment Setup

```bash
git clone [https://github.com/your-username/bookong.git](https://github.com/your-username/bookong.git)
cd bookong

cp .env.example .env

```

### 2. Start Services via Docker

```bash
docker-compose up -d --build

```

* **NestJS API:** `http://localhost:3000`
* **Next.js Web:** `http://localhost:3001`
* **Python AI Service:** `http://localhost:8000`
* **Postgres DB:** `localhost:5432`

### 3. Database Migration & Vector Index Setup

```bash
cd backend
npm run db:migrate
npm run db:seed

```
