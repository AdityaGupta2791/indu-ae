# System Architecture — Indu AE Tutor-Student Learning Platform

> **Version:** 1.0
> **Date:** 2026-03-16
> **Status:** DRAFT — Awaiting Approval
> **Author:** System Architect
> **Depends on:** [module-breakdown.md](module-breakdown.md) v2.1

---

## 1. Architecture Style

### Decision: Modular Monolith

The platform will be built as a **modular monolith** — a single deployable application with clean internal module boundaries.

| Factor | Decision |
|--------|----------|
| **Pattern** | Modular monolith |
| **Why not microservices** | Early-stage product, small team, unnecessary DevOps complexity |
| **Module isolation** | Each module has its own folder with routes, controllers, services, models |
| **Future path** | Any module can be extracted into a standalone service later if needed |

**Principle:** Each of the 16 modules (from module-breakdown.md) maps to its own folder in the backend. Modules communicate via service imports — no direct database access across module boundaries.

```
Module A                    Module B
┌──────────────────┐       ┌──────────────────┐
│ Routes            │       │ Routes            │
│ Controller        │       │ Controller        │
│ Service ◄─────────┼───────┤ Service           │
│ Validators        │       │ Validators        │
│ Types/DTOs        │       │ Types/DTOs        │
└──────────────────┘       └──────────────────┘
        │                          │
        ▼                          ▼
   Prisma ORM (shared database layer)
```

**Cross-module rule:** Module B can import Module A's **service** (not controller, not model directly). This keeps boundaries clean and makes future extraction possible.

---

## 2. Tech Stack

### 2.1 Core Stack

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Frontend** | React + TypeScript + Tailwind + ShadcN/UI | Existing | Already built — not modified in this phase |
| **Backend Runtime** | Node.js | 20 LTS | Stable, long-term support, TypeScript native |
| **Backend Framework** | Express.js + TypeScript | 4.x | Familiar to team, lightweight, production-proven |
| **ORM** | Prisma | 5.x | Type-safe queries, readable schema, excellent migrations |
| **Database** | PostgreSQL | 16.x | ACID compliance for financial data, relational model fits domain |
| **Language** | TypeScript | 5.x | End-to-end type safety (frontend + backend) |

### 2.2 External Services

| Service | Provider | Purpose |
|---------|----------|---------|
| **Payments** | Stripe | Credit purchases by parents (AED currency) |
| **Video Meetings** | Zoom API | Meeting creation, secure links, cloud recording |
| **Email** | AWS SES | Transactional emails — verification, booking confirmations, reminders |
| **File Storage** | AWS S3 | Tutor certifications, assessment reports, course materials |
| **Cloud Hosting** | AWS (Bahrain region) | Low latency for UAE users |

### 2.3 Development & Tooling

| Tool | Purpose |
|------|---------|
| **Prisma Migrate** | Database migrations (version-controlled schema changes) |
| **Zod** | Request validation (runtime type checking for API inputs) |
| **Passport.js + JWT** | Authentication (access tokens + refresh tokens) |
| **Multer + S3** | File upload handling |
| **node-cron** | Scheduled jobs (class reminders 24hr/1hr before, earning calculations) |
| **Winston** | Structured logging |
| **Jest + Supertest** | Unit + integration testing |
| **ESLint + Prettier** | Code quality and formatting |
| **Swagger (swagger-jsdoc + swagger-ui-express)** | API documentation |

---

## 3. System Architecture Diagram

```
                    ┌─────────────────────────────────┐
                    │           CLIENTS                │
                    │          React SPA (Web Only)    │
                    └───────┬───────┴──────────────────┘
                            │ HTTPS (REST API)
                    ┌───────▼───────────────────────────┐
                    │         NGINX                │
                    │    (Reverse Proxy + SSL + CORS)     │
                    └───────┬───────────────────────────┘
                            │
         ┌──────────────────▼──────────────────────────┐
         │           EXPRESS.JS APPLICATION              │
         │          (Modular Monolith)                   │
         │                                              │
         │  ┌─────────────────────────────────────────┐ │
         │  │          MIDDLEWARE LAYER                │ │
         │  │  ┌─────────┬───────────┬──────────────┐ │ │
         │  │  │  Auth    │ Role      │ Permission   │ │ │
         │  │  │  (JWT)   │ Guard     │ Guard        │ │ │
         │  │  ├─────────┼───────────┼──────────────┤ │ │
         │  │  │  Rate    │ Request   │ Error        │ │ │
         │  │  │  Limiter │ Validator │ Handler      │ │ │
         │  │  └─────────┴───────────┴──────────────┘ │ │
         │  └─────────────────────────────────────────┘ │
         │                                              │
         │  ┌─────────────────────────────────────────┐ │
         │  │          MODULE LAYER                    │ │
         │  │                                         │ │
         │  │  ┌────────┐ ┌────────┐ ┌─────────────┐ │ │
         │  │  │  Auth  │ │ User   │ │   Tutor     │ │ │
         │  │  │  M1    │ │ M2     │ │   M3        │ │ │
         │  │  ├────────┤ ├────────┤ ├─────────────┤ │ │
         │  │  │ Course │ │ Avail. │ │ Demo Book.  │ │ │
         │  │  │  M4    │ │ M5     │ │   M6        │ │ │
         │  │  ├────────┤ ├────────┤ ├─────────────┤ │ │
         │  │  │ Class  │ │ Credit │ │  Payment    │ │ │
         │  │  │  M7    │ │ M8     │ │   M9        │ │ │
         │  │  ├────────┤ ├────────┤ ├─────────────┤ │ │
         │  │  │Meeting │ │Assess. │ │  Notif.     │ │ │
         │  │  │ M10    │ │ M11    │ │   M12       │ │ │
         │  │  ├────────┤ ├────────┤ ├─────────────┤ │ │
         │  │  │  CMS   │ │Analyt. │ │  Review     │ │ │
         │  │  │  M13   │ │ M14    │ │   M15       │ │ │
         │  │  ├────────┤ └────────┘ └─────────────┘ │ │
         │  │  │Earning │                             │ │
         │  │  │ M16    │                             │ │
         │  │  └────────┘                             │ │
         │  └─────────────────────────────────────────┘ │
         │                                              │
         │  ┌─────────────────────────────────────────┐ │
         │  │          DATA ACCESS LAYER              │ │
         │  │          Prisma ORM Client               │ │
         │  └────┬──────────┬──────────┬──────────────┘ │
         └───────┼──────────┼──────────┼────────────────┘
                 │          │          │
          ┌──────▼──────┐        ┌────▼────┐
          │ PostgreSQL  │        │ AWS S3  │
          │   (RDS)     │        │(Files)  │
          └─────────────┘        └─────────┘

External Service Integrations:
  ┌──────────┐  ┌──────────┐  ┌──────────────┐
  │  Stripe  │  │ Zoom API │  │ AWS SES      │
  │(Payments)│  │ (Video)  │  │ (Email)      │
  └──────────┘  └──────────┘  └──────────────┘
```

---

## 4. Backend Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma              # Database schema (single source of truth)
│   ├── migrations/                # Version-controlled DB migrations
│   └── seed.ts                    # Seed data (subjects, grade levels, admin user)
│
├── src/
│   ├── app.ts                     # Express app setup (middleware registration)
│   ├── server.ts                  # Server entry point (listen on port)
│   ├── config/
│   │   ├── env.ts                 # Environment variable validation (zod)
│   │   ├── database.ts            # Prisma client singleton
│   │   ├── stripe.ts              # Stripe client setup
│   │   ├── zoom.ts                # Zoom API client setup
│   │   └── s3.ts                  # AWS S3 client setup
│   │
│   ├── shared/
│   │   ├── middlewares/
│   │   │   ├── authenticate.ts    # JWT verification — extracts user from token
│   │   │   ├── authorize.ts       # Role guard — requireRole('tutor', 'admin')
│   │   │   ├── permission.ts      # Permission guard — requirePermission('tutor_management')
│   │   │   ├── validate.ts        # Zod schema validation middleware
│   │   │   ├── rateLimiter.ts     # Rate limiting (in-memory)
│   │   │   └── errorHandler.ts    # Global error handler
│   │   ├── utils/
│   │   │   ├── apiResponse.ts     # Standardized API response format
│   │   │   ├── apiError.ts        # Custom error classes
│   │   │   ├── pagination.ts      # Pagination helper
│   │   │   └── fileUpload.ts      # Multer + S3 upload helper
│   │   └── types/
│   │       ├── express.d.ts       # Express Request type extensions
│   │       └── common.ts          # Shared TypeScript types
│   │
│   ├── modules/
│   │   ├── auth/                  # M1: Authentication & Authorization
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.validators.ts # Zod schemas for request validation
│   │   │   └── auth.types.ts      # Module-specific types/DTOs
│   │   │
│   │   ├── user/                  # M2: User & Profile Management
│   │   │   ├── user.routes.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.validators.ts
│   │   │   └── user.types.ts
│   │   │
│   │   ├── tutor/                 # M3: Tutor Management
│   │   ├── course/                # M4: Course & Subject Management
│   │   ├── availability/          # M5: Availability & Scheduling
│   │   ├── demo-booking/          # M6: Demo Class Booking
│   │   ├── class-booking/         # M7: Class Booking
│   │   ├── credit/                # M8: Credit Wallet System
│   │   ├── payment/               # M9: Payment Processing (Stripe)
│   │   ├── meeting/               # M10: Video Meeting Integration (Zoom)
│   │   ├── assessment/            # M11: Assessment & Evaluation
│   │   ├── notification/          # M12: Notification System
│   │   ├── cms/                   # M13: CMS Content Management
│   │   ├── analytics/             # M14: Admin Analytics & Reporting
│   │   ├── review/                # M15: Rating & Review
│   │   └── earning/               # M16: Tutor Earnings
│   │
│   │   # Each module follows the same structure:
│   │   # ├── <module>.routes.ts
│   │   # ├── <module>.controller.ts
│   │   # ├── <module>.service.ts
│   │   # ├── <module>.validators.ts
│   │   # └── <module>.types.ts
│   │
│   └── jobs/
│       ├── classReminder.ts       # Cron: send reminders 24hr + 1hr before class
│       └── earningCalculator.ts   # Cron: auto-create earning records on class completion
│
├── tests/
│   ├── unit/                      # Unit tests per module
│   ├── integration/               # API endpoint tests
│   └── fixtures/                  # Test data
│
├── .env.example                   # Environment variable template
├── tsconfig.json
├── package.json
└── jest.config.ts
```

### Module Internal Pattern

Every module follows the **same 5-file pattern**:

```
modules/credit/
├── credit.routes.ts         # Route definitions + middleware binding
├── credit.controller.ts     # HTTP layer — parse request, call service, send response
├── credit.service.ts        # Business logic — ALL logic lives here
├── credit.validators.ts     # Zod schemas for request body/params/query validation
└── credit.types.ts          # TypeScript interfaces and DTOs for this module
```

**Rules:**
- **Controller** never accesses Prisma directly — always calls Service
- **Service** contains all business logic and Prisma queries
- **Routes** file binds middleware (auth, role, permission, validation) to controller methods
- **Validators** define Zod schemas — used by the `validate` middleware
- **Cross-module calls:** Service A can import Service B. Never import Controller or Routes across modules.

---

## 5. Middleware Pipeline

Every API request passes through this pipeline:

```
Incoming Request
    │
    ▼
┌──────────────┐
│ Rate Limiter  │  In-memory, per IP
└──────┬───────┘
       ▼
┌──────────────┐
│ Body Parser   │  JSON parsing
└──────┬───────┘
       ▼
┌──────────────┐
│ CORS          │  Allow frontend origin
└──────┬───────┘
       ▼
┌──────────────┐
│ Authenticate  │  Verify JWT → attach user to req.user
│ (if protected)│  Public routes skip this
└──────┬───────┘
       ▼
┌──────────────┐
│ Authorize     │  Check role: requireRole('parent', 'admin')
│ (Role Guard)  │
└──────┬───────┘
       ▼
┌──────────────┐
│ Permission    │  Admin-only: requirePermission('tutor_management')
│ (Perm Guard)  │  Skipped for non-admin roles
└──────┬───────┘
       ▼
┌──────────────┐
│ Validate      │  Validate req.body/params/query against Zod schema
└──────┬───────┘
       ▼
┌──────────────┐
│ Controller    │  Handle request → call service → send response
└──────┬───────┘
       ▼
┌──────────────┐
│ Error Handler │  Catch any thrown errors → standardized error response
└──────────────┘
```

### Example Route Definition

```typescript
// modules/tutor/tutor.routes.ts

import { Router } from 'express';
import { authenticate } from '../../shared/middlewares/authenticate';
import { requireRole } from '../../shared/middlewares/authorize';
import { requirePermission } from '../../shared/middlewares/permission';
import { validate } from '../../shared/middlewares/validate';
import { TutorController } from './tutor.controller';
import { createTutorSchema, updateTutorSchema } from './tutor.validators';

const router = Router();
const controller = new TutorController();

// Admin creates a tutor (requires admin role + tutor_management permission)
router.post(
  '/',
  authenticate,
  requireRole('super_admin', 'admin'),
  requirePermission('tutor_management'),
  validate(createTutorSchema),
  controller.create
);

// Tutor updates own profile
router.patch(
  '/profile',
  authenticate,
  requireRole('tutor'),
  validate(updateTutorSchema),
  controller.updateProfile
);

// Public tutor directory
router.get(
  '/directory',
  controller.getDirectory
);

export default router;
```

---

## 6. Authentication Flow

### 6.1 JWT Strategy

| Token | Lifetime | Storage | Purpose |
|-------|----------|---------|---------|
| **Access Token** | 15 minutes | Memory (frontend) | API authentication |
| **Refresh Token** | 7 days | HttpOnly cookie | Silent token renewal |

### 6.2 JWT Payload Structure

```typescript
// For external users (parent, tutor, consultant)
{
  sub: "user-uuid",
  email: "user@example.com",
  role: "parent",         // parent | tutor | consultant
  iat: 1234567890,
  exp: 1234568790
}

// For admin users (super_admin, admin)
{
  sub: "admin-uuid",
  email: "admin@example.com",
  role: "admin",          // super_admin | admin
  permissions: [           // only present for admin roles
    "user_management",
    "tutor_management",
    "booking_oversight"
  ],
  iat: 1234567890,
  exp: 1234568790
}
```

### 6.3 Auth Flows

```
SIGNUP (Parent — self-registration)
  POST /api/auth/signup → create user (status: unverified) → send verification email
  GET  /api/auth/verify-email?token=xxx → mark user verified → redirect to login

LOGIN
  POST /api/auth/login → validate credentials → generate access + refresh tokens
  Response: { accessToken } + Set-Cookie: refreshToken (HttpOnly)

TOKEN REFRESH
  POST /api/auth/refresh → read refresh cookie → validate → new access token

PASSWORD RESET
  POST /api/auth/forgot-password → send reset email with token
  POST /api/auth/reset-password → validate token → update password

ADMIN-PROVISIONED ACCOUNTS (Tutor, Consultant, Admin)
  POST /api/admin/users → Admin creates account → system sends invite email with temp password
  First login → forced password change
```

---

## 7. API Design Conventions

### 7.1 Base URL

```
Production:  https://api.induae.com/api/v1
Development: http://localhost:5000/api/v1
```

### 7.2 RESTful URL Patterns

```
GET    /api/v1/tutors              → List tutors (with filters, pagination)
GET    /api/v1/tutors/:id          → Get single tutor
POST   /api/v1/tutors              → Create tutor (admin)
PATCH  /api/v1/tutors/:id          → Update tutor
DELETE /api/v1/tutors/:id          → Soft delete / deactivate tutor

# Nested resources
GET    /api/v1/tutors/:id/availability    → Get tutor's availability
POST   /api/v1/tutors/:id/reviews         → Submit review for tutor
GET    /api/v1/parents/:id/children       → Get parent's children
GET    /api/v1/parents/:id/bookings       → Get parent's bookings
```

### 7.3 Standard Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },              // Single object or array
  "meta": {                     // Only for paginated responses
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "You need 3 credits to book this class. Current balance: 1.",
    "statusCode": 400
  }
}
```

### 7.4 Pagination, Filtering & Sorting

```
GET /api/v1/tutors?page=1&limit=20&subject=mathematics&grade=7&sortBy=rating&order=desc
```

All list endpoints support:
- `page` + `limit` for pagination
- Filter parameters specific to each resource
- `sortBy` + `order` for sorting

---

## 8. Database Architecture

### 8.1 Database: PostgreSQL 16

| Aspect | Detail |
|--------|--------|
| **Hosting** | AWS RDS (ap-south-1 or me-south-1 Bahrain) |
| **Why PostgreSQL** | ACID compliance for credit/payment transactions, complex relational queries, JSON column support for flexible fields |
| **Schema management** | Prisma Migrate (version-controlled migrations) |
| **Soft deletes** | All primary entities use `deletedAt` timestamp (never hard delete user data). Admin UI has two distinct actions: toggle `isActive` (reversible deactivation) and soft delete (sets `deletedAt` + `isActive: false`, irreversible) |
| **Timestamps** | All tables have `createdAt` + `updatedAt` (auto-managed by Prisma) |
| **IDs** | UUID v4 (not auto-increment integers — better for distributed systems, no ID enumeration) |
| **Currency** | All monetary values stored as integers in **fils** (1 AED = 100 fils) to avoid floating point issues |

### 8.2 Key Schema Design Decisions

| Decision | Rationale |
|----------|-----------|
| UUIDs for primary keys | No sequential ID guessing, safe for public APIs |
| Money as integers (fils) | 50.75 AED stored as `5075` — avoids floating point math errors |
| Soft deletes everywhere | Compliance, audit trail, data recovery. Two-tier pattern: toggle `isActive` (reversible) vs set `deletedAt` + `isActive: false` (irreversible, hides from all lists). Applied to User, TutorProfile, Course, CreditPackage, Student. |
| `status` enums on entities | Every booking, payment, class has a status lifecycle |
| Grade-tier pricing table | Supports D11: Grade 1-6 = 2 credits, Grade 7+ = 3 credits |
| Tutor-Subject-Rate mapping | Supports D4: credit cost varies by tutor + subject |
| `AdminPermission` junction table | Supports D13: granular permission assignment per admin user |

> **Full database schema will be documented in:** [database-schema.md](database-schema.md)

---

## 9. Token Storage Strategy (PostgreSQL)

All tokens are stored in a `Token` table in PostgreSQL (no Redis). This simplifies infrastructure for V1.

| Use Case | Token Type | TTL | Purpose |
|----------|-----------|-----|---------|
| **Refresh tokens** | `REFRESH` | 7 days | Session persistence, validated on token refresh |
| **Email verification** | `EMAIL_VERIFICATION` | 24 hours | One-time use verification link |
| **Password reset** | `PASSWORD_RESET` | 1 hour | One-time use reset link |
| **Rate limiting** | In-memory (`express-rate-limit`) | 1 min window | API abuse prevention (single server) |

**Note:** If the platform scales to multiple servers, Redis can be added for shared rate limiting and caching. For V1 single-server, PostgreSQL handles all token needs.

---

## 10. File Storage Architecture (AWS S3)

```
s3://induae-platform/
├── tutors/
│   ├── {tutorId}/
│   │   ├── profile-photo.jpg
│   │   └── certifications/
│   │       ├── cert-1.pdf
│   │       └── cert-2.pdf
│
├── assessments/
│   ├── {studentId}/
│   │   ├── assessment-{id}.pdf
│   │   └── report-{id}.pdf
│
├── courses/
│   ├── {courseId}/
│   │   └── materials/
│   │       ├── syllabus.pdf
│   │       └── chapter-1.pdf
│
└── cms/
    └── images/
        └── {filename}.jpg
```

**Access control:** All files served via **pre-signed URLs** (time-limited, 15 min expiry). No public bucket access.

---

## 11. External Integration Architecture

### 11.1 Stripe Integration

```
Parent buys credits:
  Frontend → POST /api/v1/payments/create-checkout
    → Backend creates Stripe Checkout Session
    → Returns session URL
    → Frontend redirects to Stripe hosted checkout
    → Stripe processes payment
    → Stripe sends webhook to POST /api/v1/payments/webhook
    → Backend verifies webhook signature
    → Backend adds credits to parent's wallet
    → Backend sends confirmation email
```

**Key design decisions:**
- Use **Stripe Checkout** (hosted payment page) — no PCI compliance burden
- Use **webhooks** for payment confirmation — never trust frontend-only confirmation
- All webhook events are idempotent (processing same event twice produces same result)
- Store Stripe `payment_intent_id` for reconciliation

### 11.2 Zoom Integration

```
Class booking confirmed:
  → Backend calls Zoom API to create scheduled meeting
  → Stores meeting ID, join URL, host URL, password
  → Tutor gets host link, Parent gets join link
  → After meeting: Zoom webhook notifies recording availability
  → Backend stores recording URL (Zoom cloud — no local storage)
```

**Key decisions:**
- Use **Zoom Server-to-Server OAuth** (no user login required)
- Platform creates meetings on behalf of a single Zoom account
- Recordings stored on Zoom's cloud (plan-dependent)
- Attendance tracked via Zoom participant report API

### 11.3 Email Integration (AWS SES)

```
Event occurs (booking confirmed, etc.)
  → NotificationService receives event
  → Selects email template
  → Renders template with data
  → Sends via email provider
  → Logs delivery status
```

**Key decisions:**
- Use HTML email templates (stored in codebase, not CMS)
- All emails are transactional (not marketing)
- Event-driven: any module can emit a notification event, NotificationService handles delivery

---

## 12. Scheduled Jobs (Cron)

| Job | Schedule | Purpose |
|-----|----------|---------|
| `classReminder24h` | Every hour | Find classes starting in ~24hrs, send reminder email |
| `classReminder1h` | Every 15 min | Find classes starting in ~1hr, send reminder email |
| `earningCalculator` | Every 30 min | Find classes with status COMPLETED, create earning records if not exists |
| `expiredBookingCleanup` | Daily at midnight | Cancel unconfirmed bookings older than 48hrs, release tutor availability slot |

**Implementation:** `node-cron` library within the same Express process. If job processing becomes heavy, move to a separate worker process or use Bull queue (V2).

---

## 13. Security Architecture

### 13.1 Application Security

| Measure | Implementation |
|---------|----------------|
| **Authentication** | JWT (access + refresh token pattern) |
| **Authorization** | Role guards + permission guards (dual-layer for admin) |
| **Input validation** | Zod schemas on every endpoint |
| **SQL injection** | Prisma ORM (parameterized queries by default) |
| **XSS** | Helmet.js headers, no raw HTML rendering |
| **CSRF** | SameSite cookie attribute + CORS origin whitelist |
| **Rate limiting** | In-memory per-IP limiter (`express-rate-limit`) |
| **File uploads** | Type validation, size limits, S3 pre-signed URLs |
| **Secrets** | Environment variables, never in code. `.env` in `.gitignore` |
| **Payment security** | Stripe Checkout (hosted) — no card data touches our server |
| **Webhook security** | Stripe webhook signature verification |

### 13.2 Data Protection

| Measure | Implementation |
|---------|----------------|
| **Passwords** | bcrypt hashing (12 salt rounds) |
| **Sensitive data** | Never log passwords, tokens, or payment data |
| **Soft deletes** | User data is never permanently deleted (compliance) |
| **Audit trail** | `createdAt`, `updatedAt` on all records. Payment & credit changes logged. |
| **Database encryption** | AWS RDS encryption at rest (default) |
| **Transport encryption** | HTTPS everywhere (TLS 1.2+) |

---

## 14. Environment Configuration

```bash
# .env.example

# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/induae

# JWT
JWT_ACCESS_SECRET=<random-256-bit>
JWT_REFRESH_SECRET=<random-256-bit>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Zoom
ZOOM_ACCOUNT_ID=xxx
ZOOM_CLIENT_ID=xxx
ZOOM_CLIENT_SECRET=xxx

# AWS
AWS_REGION=me-south-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=induae-platform

# Email
EMAIL_PROVIDER=ses
EMAIL_FROM=noreply@induae.com

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## 15. Deployment Architecture

### V1 — Simple Deployment

```
                    ┌──────────────┐
                    │  CloudFront   │ ← Static frontend (React build)
                    │  (CDN)        │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   NGINX       │ ← Reverse proxy + SSL termination
                    └──────┬───────┘
                           │
              ┌────────────▼────────────┐
              │   EC2 (Node.js)          │
              │   Express.js App         │
              │   + node-cron jobs       │
              └─────┬─────────┬─────────┘
                    │         │
             ┌──────▼──────┐
             │    RDS       │
             │ (Postgres)   │
             └──────────────┘
```

### V2 — Scaled Deployment (if needed)

- Multiple EC2 instances behind NGINX
- Separate worker process for cron jobs (avoid duplicate execution)
- Read replica for PostgreSQL (analytics queries)
- Bull queue for async job processing (add Redis at this stage if needed)

---

## 16. Module Dependency Map

Shows which modules depend on which. Critical for understanding build order.

```
M1  Auth ──────────────────────────────── Foundation (no dependencies)
M2  User ──────────────────────────────── Depends on: M1
M3  Tutor ─────────────────────────────── Depends on: M1, M2
M4  Course ────────────────────────────── Depends on: M1 (admin auth)
M5  Availability ──────────────────────── Depends on: M1, M3
M6  Demo Booking ──────────────────────── Depends on: M1, M2, M3, M5, M10, M12
M7  Class Booking ─────────────────────── Depends on: M1, M2, M3, M5, M8, M10, M12
M8  Credit ────────────────────────────── Depends on: M1, M2, M4 (grade-tier pricing)
M9  Payment ───────────────────────────── Depends on: M1, M2, M8
M10 Meeting ───────────────────────────── Depends on: M1 (standalone Zoom integration)
M11 Assessment ────────────────────────── Depends on: M1, M2, M3
M12 Notification ──────────────────────── Depends on: M1 (standalone email service)
M13 CMS ───────────────────────────────── Depends on: M1 (admin auth)
M14 Analytics ─────────────────────────── Depends on: All modules (read-only aggregation)
M15 Review ────────────────────────────── Depends on: M1, M2, M3, M7
M16 Earning ───────────────────────────── Depends on: M1, M3, M7
```

### Recommended Build Order

```
Phase 1 — Foundation:     M1 (Auth) → M2 (User) → M4 (Course/Subject/Grade)
Phase 2 — Supply Side:    M3 (Tutor) → M5 (Availability)
Phase 3 — Demand Side:    M8 (Credit) → M9 (Payment)
Phase 4 — Core Booking:   M10 (Meeting) → M6 (Demo Booking) → M7 (Class Booking)
Phase 5 — Value-Add:      M11 (Assessment) → M15 (Review) → M16 (Earning)
Phase 6 — Operations:     M12 (Notification) → M13 (CMS) → M14 (Analytics)
```

---

## 17. Decisions Log

| # | Decision | Rationale |
|---|----------|-----------|
| A1 | Modular monolith | Early-stage product, simple deployment, clean module boundaries |
| A2 | Express.js + TypeScript | Team familiarity, lightweight, production-proven |
| A3 | PostgreSQL | ACID for financial data, relational model fits domain |
| A4 | Prisma ORM | Type-safe, excellent migrations, readable schema |
| A5 | PostgreSQL Token table | Token storage (refresh, verification, reset) — no Redis in V1 |
| A6 | AWS (Bahrain region) | UAE target market, low latency |
| A7 | Stripe Checkout (hosted) | No PCI burden, webhook-based confirmation |
| A8 | Zoom Server-to-Server OAuth | Platform-managed meetings, no user OAuth flow |
| A9 | JWT (access + refresh) | Stateless auth, secure refresh via HttpOnly cookie |
| A10 | UUID primary keys | No ID enumeration, distributed-safe |
| A11 | Money as fils (integers) | Avoid floating point errors in financial calculations |
| A12 | Soft deletes | Compliance, audit trail, data recovery |
| A13 | Pre-signed S3 URLs | Secure file access without public buckets |
| A14 | node-cron for scheduled jobs | Simple V1, upgradeable to Bull queue in V2 |

---

> **Next step:** [database-schema.md](database-schema.md) — Full Prisma schema with all entities, relationships, enums, and indexes.
