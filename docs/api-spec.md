# API Specification — Indu AE Tutor-Student Learning Platform

> **Version:** 1.0
> **Date:** 2026-03-16
> **Status:** DRAFT — Awaiting Approval
> **Author:** System Architect
> **Base URL:** `/api/v1`
> **Depends on:** [module-breakdown.md](module-breakdown.md), [system-architecture.md](system-architecture.md), [database-schema.md](database-schema.md)

---

## 1. API Conventions

### 1.1 Base URL

```
Production:  https://api.induae.com/api/v1
Development: http://localhost:5000/api/v1
```

### 1.2 Authentication

All protected routes require:
```
Header: Authorization: Bearer <access_token>
```

Refresh token is sent/received via HttpOnly cookie automatically.

### 1.3 Standard Response Format

```json
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 156, "totalPages": 8 }
}

// Error
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "You need 3 credits. Current balance: 1.",
    "statusCode": 400
  }
}
```

### 1.4 Common Query Parameters (List Endpoints)

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (default: 20, max: 100) |
| `sortBy` | string | Field to sort by |
| `order` | string | `asc` or `desc` (default: desc) |
| `search` | string | General search term |

### 1.5 Auth Shorthand Used Below

| Symbol | Meaning |
|--------|---------|
| **Public** | No authentication required |
| **Auth** | Any authenticated user |
| **Parent** | Role: PARENT |
| **Tutor** | Role: TUTOR |
| **Consultant** | Role: CONSULTANT |
| **Admin** | Role: ADMIN or SUPER_ADMIN |
| **Admin(perm)** | Admin with specific permission, e.g., Admin(tutor_management) |
| **SuperAdmin** | Role: SUPER_ADMIN only |

---

## 2. M1: Authentication & Authorization

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | Public | Parent self-registration |
| POST | `/auth/login` | Public | Login (all roles) |
| POST | `/auth/refresh` | Cookie | Refresh access token |
| POST | `/auth/logout` | Auth | Logout (invalidate refresh token) |
| GET | `/auth/verify-email` | Public | Verify email via token |
| POST | `/auth/forgot-password` | Public | Request password reset email |
| POST | `/auth/reset-password` | Public | Reset password with token |
| POST | `/auth/change-password` | Auth | Change own password (for forced change on first login) |

### Request/Response Details

**POST `/auth/signup`** — Parent self-registration
```json
// Request
{
  "email": "parent@example.com",
  "password": "SecurePass123!",
  "firstName": "Ahmed",
  "lastName": "Al Rashid",
  "phone": "+971501234567"
}

// Response (201)
{
  "success": true,
  "data": {
    "message": "Account created. Please check your email to verify."
  }
}
```

**POST `/auth/login`** — Login for all roles
```json
// Request
{
  "email": "parent@example.com",
  "password": "SecurePass123!"
}

// Response (200) — also sets refresh token as HttpOnly cookie
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "parent@example.com",
      "role": "PARENT",
      "firstName": "Ahmed",
      "lastName": "Al Rashid",
      "permissions": []
    }
  }
}

// For admin users, permissions array is populated:
// "permissions": ["USER_MANAGEMENT", "TUTOR_MANAGEMENT"]
```

**POST `/auth/refresh`** — Silent token renewal
```json
// Request: no body needed — refresh token read from HttpOnly cookie

// Response (200)
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**POST `/auth/forgot-password`**
```json
// Request
{ "email": "parent@example.com" }

// Response (200) — always returns success (don't reveal if email exists)
{
  "success": true,
  "data": { "message": "If this email exists, a reset link has been sent." }
}
```

**POST `/auth/reset-password`**
```json
// Request
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}

// Response (200)
{
  "success": true,
  "data": { "message": "Password reset successfully." }
}
```

---

## 3. M2: User & Profile Management

### Parent Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/parents/profile` | Parent | Get own profile |
| PATCH | `/parents/profile` | Parent | Update own profile |
| GET | `/parents/children` | Parent | List own children (read-only) |

**GET `/parents/profile`**
```json
// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Ahmed",
    "lastName": "Al Rashid",
    "email": "parent@example.com",
    "phone": "+971501234567",
    "address": "Dubai Marina",
    "city": "Dubai",
    "country": "UAE",
    "children": [
      {
        "id": "uuid",
        "firstName": "Omar",
        "lastName": "Al Rashid",
        "grade": { "id": "uuid", "name": "Grade 5" },
        "subjects": [
          { "id": "uuid", "name": "Mathematics" },
          { "id": "uuid", "name": "English" }
        ]
      }
    ],
    "walletBalance": 12
  }
}
```

> **Note:** Parent child CUD routes (POST/PATCH/DELETE `/parents/children`) have been **removed**. Child management is now admin-only (see Admin Child Management below). Parents retain read-only access via `GET /parents/children`.

### Admin Child Management Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/parents/:parentId/children` | Admin(user_management) | List children for a parent |
| POST | `/admin/parents/:parentId/children` | Admin(user_management) | Create child profile under a parent |
| PATCH | `/admin/parents/:parentId/children/:childId` | Admin(user_management) | Update child profile |
| DELETE | `/admin/parents/:parentId/children/:childId` | Admin(user_management) | Delete child profile |

**POST `/admin/parents/:parentId/children`** — Admin creates child
```json
// Request
{
  "firstName": "Omar",
  "lastName": "Al Rashid",
  "gradeId": "uuid-of-grade-5",
  "subjectIds": ["uuid-of-math", "uuid-of-english"],
  "notes": "Needs extra help with fractions"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Omar",
    "grade": { "id": "uuid", "name": "Grade 5" },
    "subjects": [
      { "id": "uuid", "name": "Mathematics" },
      { "id": "uuid", "name": "English" }
    ]
  }
}
```

### Admin User Management Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/users` | Admin(user_management) | List all users (filterable by role) |
| GET | `/admin/users/:id` | Admin(user_management) | Get user details |
| POST | `/admin/users` | SuperAdmin | Create admin/tutor/consultant account |
| PATCH | `/admin/users/:id` | Admin(user_management) | Update user |
| PATCH | `/admin/users/:id/status` | Admin(user_management) | Activate/deactivate user (toggle `isActive`) |
| DELETE | `/admin/users/:id` | Admin(user_management) | Soft delete user (sets `deletedAt` + `isActive: false`) |
| GET | `/admin/users/:id/permissions` | SuperAdmin | Get admin user's permissions |
| PUT | `/admin/users/:id/permissions` | SuperAdmin | Set admin user's permissions |

**POST `/admin/users`** — Create admin-provisioned account
```json
// Request
{
  "email": "tutor@example.com",
  "role": "TUTOR",
  "firstName": "Sara",
  "lastName": "Khan",
  "phone": "+971507654321"
}
// System generates temp password and sends invite email
// For ADMIN role, also include:
// "permissions": ["USER_MANAGEMENT", "BOOKING_OVERSIGHT"]

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "tutor@example.com",
    "role": "TUTOR",
    "message": "Account created. Invite email sent with temporary password."
  }
}
```

**PUT `/admin/users/:id/permissions`** — Assign permissions to admin user
```json
// Request
{
  "permissions": ["USER_MANAGEMENT", "TUTOR_MANAGEMENT", "BOOKING_OVERSIGHT"]
}

// Response (200)
{
  "success": true,
  "data": {
    "userId": "uuid",
    "permissions": ["USER_MANAGEMENT", "TUTOR_MANAGEMENT", "BOOKING_OVERSIGHT"]
  }
}
```

---

## 4. M3: Tutor Management

### Public Endpoints (Tutor Directory)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tutors` | Public | Search/list tutors (public directory) |
| GET | `/tutors/:id` | Public | Get tutor public profile |

**GET `/tutors`** — Public tutor directory
```
Query params: ?subject=Mathematics&grade=5&minRating=4&page=1&limit=20&sortBy=rating&order=desc
```
```json
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "firstName": "Sara",
      "lastName": "Khan",
      "profilePhotoUrl": "https://...",
      "introVideoUrl": "https://www.youtube.com/watch?v=...",
      "bio": "10 years of teaching experience...",
      "experience": 10,
      "rating": 4.7,
      "totalReviews": 23,
      "subjects": [
        { "id": "uuid", "name": "Mathematics" },
        { "id": "uuid", "name": "Physics" }
      ],
      "isAvailable": true
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 45, "totalPages": 3 }
}
```

### Tutor Self-Management Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tutors/profile` | Tutor | Get own full profile |
| PATCH | `/tutors/profile` | Tutor | Update own profile (bio, phone, photo, introVideoUrl) |
| GET | `/tutors/my-students` | Tutor | List students assigned to this tutor |
| GET | `/tutors/dashboard` | Tutor | Dashboard summary (upcoming classes, stats) |

### Admin Tutor Management Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/admin/tutors` | Admin(tutor_management) | Create tutor (via M2 user creation) |
| PATCH | `/admin/tutors/:id` | Admin(tutor_management) | Update tutor details |
| PATCH | `/admin/tutors/:id/status` | Admin(tutor_management) | Activate/deactivate (toggle `isActive`) |
| DELETE | `/admin/tutors/:id` | Admin(tutor_management) | Soft delete tutor (sets `deletedAt` + `isActive: false`) |
| GET | `/admin/tutors/:id/performance` | Admin(tutor_management) | Performance metrics |
| POST | `/admin/tutors/:id/subjects` | Admin(tutor_management) | Assign subjects + set tutor_rate |
| DELETE | `/admin/tutors/:id/subjects/:subjectId` | Admin(tutor_management) | Remove subject assignment |
| POST | `/admin/tutors/:id/courses` | Admin(tutor_management) | Assign tutor to course |

**POST `/admin/tutors/:id/subjects`** — Assign subject with rate
```json
// Request
{
  "subjectId": "uuid-of-mathematics",
  "tutorRate": 7500  // 75 AED in fils
}

// Response (201)
{
  "success": true,
  "data": {
    "tutorId": "uuid",
    "subjectId": "uuid",
    "subjectName": "Mathematics",
    "tutorRate": 7500
  }
}
```

### Tutor Certification Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tutors/certifications` | Tutor | List own certifications |
| POST | `/tutors/certifications` | Tutor | Upload certification |
| DELETE | `/tutors/certifications/:id` | Tutor | Remove certification |

**POST `/tutors/certifications`** — Upload certification
```
Content-Type: multipart/form-data
Fields: title, institution, year, file (PDF/image)
```
```json
// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "B.Ed Mathematics",
    "institution": "University of Dubai",
    "year": 2018,
    "documentUrl": "https://s3.../tutors/uuid/certifications/cert-1.pdf"
  }
}
```

---

## 5. M4: Course & Subject Management

### Public Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/subjects` | Public | List all active subjects |
| GET | `/grades` | Public | List all grade levels |
| GET | `/boards` | Public | List all active boards |
| GET | `/courses` | Public | List/search courses |
| GET | `/courses/:id` | Public | Course detail page |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/admin/subjects` | Admin(course_management) | Create subject |
| PATCH | `/admin/subjects/:id` | Admin(course_management) | Update subject |
| POST | `/admin/grades` | Admin(course_management) | Create grade level |
| PATCH | `/admin/grades/:id` | Admin(course_management) | Update grade level |
| GET | `/admin/grade-tiers` | Admin(credit_management) | List grade tiers |
| POST | `/admin/grade-tiers` | Admin(credit_management) | Create grade tier |
| PATCH | `/admin/grade-tiers/:id` | Admin(credit_management) | Update tier pricing |
| POST | `/admin/courses` | Admin(course_management) | Create course |
| PATCH | `/admin/courses/:id` | Admin(course_management) | Update course |
| DELETE | `/admin/courses/:id` | Admin(course_management) | Soft delete course |
| POST | `/admin/courses/:id/materials` | Admin(course_management) | Upload course material |
| DELETE | `/admin/courses/:id/materials/:materialId` | Admin(course_management) | Remove material |

**POST `/admin/courses`** — Create course
```json
// Request
{
  "subjectId": "uuid-of-math",
  "gradeId": "uuid-of-grade-10",
  "name": "Mathematics — Grade 10",
  "description": "Comprehensive Grade 10 math curriculum covering algebra, geometry..."
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Mathematics — Grade 10",
    "subject": { "id": "uuid", "name": "Mathematics" },
    "grade": { "id": "uuid", "name": "Grade 10" },
    "gradeTier": { "name": "Tier 2", "creditsPerClass": 3 }
  }
}
```

**PATCH `/admin/grade-tiers/:id`** — Update tier pricing
```json
// Request
{
  "creditsPerClass": 3
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tier 2 (Grade 7-12)",
    "creditsPerClass": 3,
    "minGrade": 7,
    "maxGrade": 12
  }
}
```

---

## 6. M5: Availability & Scheduling

### Tutor Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tutors/availability/templates` | Tutor | Get own weekly templates |
| POST | `/tutors/availability/templates` | Tutor | Create/update weekly template |
| DELETE | `/tutors/availability/templates/:id` | Tutor | Remove template |
| GET | `/tutors/availability/blocked-dates` | Tutor | List blocked dates |
| POST | `/tutors/availability/blocked-dates` | Tutor | Block a date |
| DELETE | `/tutors/availability/blocked-dates/:id` | Tutor | Unblock a date |

### Public/Parent Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tutors/:id/availability` | Auth | Get tutor's available slots for a date range |

**POST `/tutors/availability/templates`** — Set weekly availability
```json
// Request
{
  "dayOfWeek": 1,        // Monday
  "startTime": "09:00",  // UTC
  "endTime": "12:00"     // UTC
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "dayOfWeek": 1,
    "dayName": "Monday",
    "startTime": "09:00",
    "endTime": "12:00"
  }
}
```

**GET `/tutors/:id/availability`** — Get available slots
```
Query: ?startDate=2026-03-20&endDate=2026-03-27
```
```json
// Response (200)
{
  "success": true,
  "data": [
    {
      "date": "2026-03-20",
      "dayName": "Friday",
      "slots": [
        {
          "id": "uuid",
          "startTime": "2026-03-20T09:00:00Z",
          "endTime": "2026-03-20T10:00:00Z",
          "isBooked": false
        },
        {
          "id": "uuid",
          "startTime": "2026-03-20T10:00:00Z",
          "endTime": "2026-03-20T11:00:00Z",
          "isBooked": true
        }
      ]
    }
  ]
}
```

---

## 7. M6: Demo Class Booking

### 7.0 Demo Request (Pre-Booking Intake)

These endpoints handle the initial demo request submitted by a parent before a formal DemoBooking is created.

#### Reference Endpoint

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/boards` | Public | List all active boards |

**GET `/boards`** — List active boards
```json
// Response (200)
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "CBSE" },
    { "id": "uuid", "name": "IB" },
    { "id": "uuid", "name": "British" }
  ]
}
```

#### Parent Demo Request Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/demo-requests` | Parent | Submit a demo request |
| GET | `/demo-requests/my` | Parent | List own demo requests (paginated) |
| GET | `/demo-requests/:id` | Auth | View single demo request (access-controlled) |
| DELETE | `/demo-requests/:id/cancel` | Parent | Cancel own PENDING or ASSIGNED request |

**POST `/demo-requests`** — Parent submits demo request
```json
// Request
{
  "contactEmail": "parent@example.com",
  "contactPhone": "+971501234567",
  "childFirstName": "Omar",
  "childLastName": "Al Rashid",
  "childDateOfBirth": "2015-06-15",
  "boardId": "uuid-of-cbse",
  "gradeId": "uuid-of-grade-5",
  "subjectIds": ["uuid-of-math", "uuid-of-english"],
  "preferredTimeSlot": "MORNING",
  "preferredDate": "2026-03-25",
  "alternativeDate": "2026-03-27",
  "notes": "Child struggles with fractions"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "PENDING",
    "childFirstName": "Omar",
    "board": { "id": "uuid", "name": "CBSE" },
    "grade": { "id": "uuid", "name": "Grade 5" },
    "subjects": [
      { "id": "uuid", "name": "Mathematics" },
      { "id": "uuid", "name": "English" }
    ],
    "preferredTimeSlot": "MORNING",
    "preferredDate": "2026-03-25",
    "message": "Demo request submitted. A consultant will review and contact you shortly."
  }
}
```

**GET `/demo-requests/my`** — Parent lists own requests
```
Query: ?page=1&limit=20&status=PENDING
```
```json
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "childFirstName": "Omar",
      "childLastName": "Al Rashid",
      "status": "PENDING",
      "preferredDate": "2026-03-25",
      "subjects": [{ "name": "Mathematics" }],
      "createdAt": "2026-03-18T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 3, "totalPages": 1 }
}
```

**DELETE `/demo-requests/:id/cancel`** — Cancel own request
```json
// Response (200) — only allowed when status is PENDING or ASSIGNED
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CANCELLED",
    "message": "Demo request cancelled."
  }
}
```

#### Consultant Demo Request Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/demo-requests/consultant` | Consultant | List PENDING requests + own assigned requests |
| PATCH | `/demo-requests/:id/assign` | Consultant | Self-assign a PENDING request |
| PATCH | `/demo-requests/:id/status` | Consultant | Update request status (CONFIRMED, COMPLETED, CANCELLED) |

**PATCH `/demo-requests/:id/assign`** — Consultant self-assigns
```json
// Response (200) — only allowed when status is PENDING
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "ASSIGNED",
    "consultantId": "uuid",
    "message": "Request assigned to you."
  }
}
```

**PATCH `/demo-requests/:id/status`** — Consultant/Admin updates status
```json
// Request
{
  "status": "CONFIRMED"
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CONFIRMED"
  }
}
```

#### Admin Demo Request Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/demo-requests/admin` | Admin/SuperAdmin | List all demo requests (filterable, paginated) |

**GET `/demo-requests/admin`** — Admin lists all requests
```
Query: ?page=1&limit=20&status=PENDING&consultantId=uuid
```

---

### 7.1 Demo Booking (Existing Flow)

The following endpoints remain for the formal DemoBooking flow (after a DemoRequest has been processed).

### Parent Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/demo-bookings` | Parent | Request a demo class |
| GET | `/demo-bookings` | Parent | List own demo bookings |
| GET | `/demo-bookings/:id` | Parent | Get demo booking details |
| PATCH | `/demo-bookings/:id/cancel` | Parent | Cancel a pending demo request |

### Consultant Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/consultant/demo-bookings` | Consultant | List demo requests to handle |
| GET | `/consultant/demo-bookings/:id` | Consultant | Get demo request details |
| PATCH | `/consultant/demo-bookings/:id/confirm` | Consultant | Confirm demo + assign slot |
| PATCH | `/consultant/demo-bookings/:id/cancel` | Consultant | Cancel/reject demo request |
| PATCH | `/consultant/demo-bookings/:id/complete` | Consultant | Mark demo as completed |
| PATCH | `/consultant/demo-bookings/:id/no-show` | Consultant | Mark as no-show |

### Tutor Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tutors/demo-bookings` | Tutor | List own upcoming demo classes |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/demo-bookings` | Admin(booking_oversight) | List all demo bookings (filterable) |

**POST `/demo-bookings`** — Parent requests demo
```json
// Request
{
  "studentId": "uuid-of-child",
  "tutorId": "uuid-of-tutor",
  "subjectId": "uuid-of-math",
  "preferredSlotId": "uuid-of-slot",  // Optional — parent can suggest a slot
  "notes": "My child is struggling with algebra"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "PENDING",
    "student": { "id": "uuid", "firstName": "Omar" },
    "tutor": { "id": "uuid", "firstName": "Sara", "lastName": "Khan" },
    "subject": { "id": "uuid", "name": "Mathematics" },
    "message": "Demo request submitted. A consultant will confirm shortly."
  }
}
```

**PATCH `/consultant/demo-bookings/:id/confirm`** — Consultant confirms demo
```json
// Request
{
  "slotId": "uuid-of-confirmed-slot",
  "consultantNotes": "Tutor confirmed availability via phone"
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CONFIRMED",
    "slot": {
      "date": "2026-03-22",
      "startTime": "2026-03-22T10:00:00Z",
      "endTime": "2026-03-22T11:00:00Z"
    },
    "meeting": {
      "joinUrl": "https://zoom.us/j/123456",
      "password": "abc123"
    }
  }
}
// Triggers: email notification to parent + tutor with meeting link
```

---

## 8. M7: Class Booking (Credit-Based)

### Parent Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/class-bookings` | Parent | Book a class (credit-based) |
| GET | `/class-bookings` | Parent | List own class bookings |
| GET | `/class-bookings/:id` | Parent | Get booking details |
| PATCH | `/class-bookings/:id/cancel` | Parent | Cancel a booking (no refund — D3) |

### Consultant Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/consultant/class-bookings` | Consultant | List pending verifications |
| GET | `/consultant/class-bookings/:id` | Consultant | Get booking details |
| PATCH | `/consultant/class-bookings/:id/confirm` | Consultant | Verify and confirm booking |
| PATCH | `/consultant/class-bookings/:id/reject` | Consultant | Reject booking (credits NOT deducted yet) |
| PATCH | `/consultant/class-bookings/:id/reassign` | Consultant | Assign alternate tutor |
| PATCH | `/consultant/class-bookings/:id/complete` | Consultant | Mark class as completed |
| PATCH | `/consultant/class-bookings/:id/no-show` | Consultant | Mark as no-show |

### Tutor Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tutors/class-bookings` | Tutor | List own class bookings |
| GET | `/tutors/class-bookings/:id` | Tutor | Get booking details |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/class-bookings` | Admin(booking_oversight) | List all bookings (filterable) |

**POST `/class-bookings`** — Parent books a class
```json
// Request
{
  "studentId": "uuid-of-child",
  "tutorId": "uuid-of-tutor",
  "subjectId": "uuid-of-math",
  "slotId": "uuid-of-slot",
  "notes": "Continue from last session's topic"
}

// Response (201) — booking created, NOT yet confirmed
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "PENDING_VERIFICATION",
    "student": { "id": "uuid", "firstName": "Omar", "grade": "Grade 9" },
    "tutor": { "id": "uuid", "firstName": "Sara" },
    "subject": { "name": "Mathematics" },
    "creditsToBeCharged": 3,  // Grade 9 → Tier 2 → 3 credits
    "currentBalance": 12,
    "message": "Booking submitted. Consultant will verify and confirm."
  }
}
// Note: Credits NOT deducted yet — only on consultant confirmation
```

**PATCH `/consultant/class-bookings/:id/confirm`** — Consultant confirms
```json
// Request
{
  "consultantNotes": "Verified tutor availability"
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CONFIRMED",
    "creditsCharged": 3,
    "newBalance": 9,
    "meeting": {
      "joinUrl": "https://zoom.us/j/789012",
      "password": "xyz456"
    }
  }
}
// Triggers: credit deduction + Zoom meeting creation + email notifications
```

**PATCH `/consultant/class-bookings/:id/reassign`** — Assign alternate tutor
```json
// Request
{
  "newTutorId": "uuid-of-alternate-tutor",
  "newSlotId": "uuid-of-new-slot",
  "reason": "Original tutor unavailable due to emergency"
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CONFIRMED",
    "tutor": { "id": "uuid", "firstName": "Fatima" },
    "slot": { "startTime": "2026-03-22T14:00:00Z" }
  }
}
```

---

## 9. M8: Credit Wallet System

### Parent Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/wallet/balance` | Parent | Get current credit balance |
| GET | `/wallet/transactions` | Parent | List credit transaction history |
| GET | `/credit-packages` | Auth | List available credit packages |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/wallets` | Admin(credit_management) | List all parent wallets |
| POST | `/admin/wallets/:parentId/adjust` | Admin(credit_management) | Manual credit adjustment |
| GET | `/admin/credit-packages` | Admin(credit_management) | List all non-deleted packages (sorted by price asc) |
| POST | `/admin/credit-packages` | Admin(credit_management) | Create credit package |
| PATCH | `/admin/credit-packages/:id` | Admin(credit_management) | Update package (name, credits, price, isActive) |
| DELETE | `/admin/credit-packages/:id` | Admin(credit_management) | Soft delete package (sets `deletedAt` + `isActive: false`) |

**GET `/wallet/balance`**
```json
// Response (200)
{
  "success": true,
  "data": {
    "balance": 12,
    "totalPurchased": 25,
    "totalSpent": 13
  }
}
```

**GET `/wallet/transactions`**
```
Query: ?type=DEDUCTION&page=1&limit=20
```
```json
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "PURCHASE",
      "amount": 10,
      "description": "Purchased Starter Pack (10 credits)",
      "createdAt": "2026-03-15T10:30:00Z"
    },
    {
      "id": "uuid",
      "type": "DEDUCTION",
      "amount": 3,
      "description": "Class booking — Mathematics, Grade 9",
      "bookingId": "uuid",
      "createdAt": "2026-03-16T14:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```

**GET `/credit-packages`** — Available packages for purchase
```json
// Response (200)
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Starter Pack", "credits": 10, "priceInFils": 5000 },
    { "id": "uuid", "name": "Value Pack", "credits": 25, "priceInFils": 10000 },
    { "id": "uuid", "name": "Premium Pack", "credits": 50, "priceInFils": 17500 }
  ]
}
```

**POST `/admin/wallets/:parentId/adjust`** — Manual adjustment
```json
// Request
{
  "amount": 5,
  "type": "ADMIN_ADJUSTMENT",
  "description": "Compensation for system error on booking #xyz"
}

// Response (200)
{
  "success": true,
  "data": {
    "newBalance": 17,
    "transaction": {
      "id": "uuid",
      "type": "ADMIN_ADJUSTMENT",
      "amount": 5
    }
  }
}
```

---

## 10. M9: Payment Processing (Stripe)

### Parent Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/create-checkout` | Parent | Create Stripe checkout session |
| GET | `/payments/history` | Parent | List own payment history |
| GET | `/payments/:id` | Parent | Get payment details |

### Webhook

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/webhook` | Stripe Signature | Handle Stripe webhook events |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/payments` | Admin(payment_management) | List all payments |
| GET | `/admin/payments/:id` | Admin(payment_management) | Get payment details |

**POST `/payments/create-checkout`** — Initiate credit purchase
```json
// Request
{
  "packageId": "uuid-of-starter-pack"
}

// Response (200)
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
    "sessionId": "cs_test_..."
  }
}
// Frontend redirects to checkoutUrl
// After payment: Stripe redirects to frontend success/cancel page
// Backend receives webhook for actual confirmation
```

**POST `/payments/webhook`** — Stripe webhook handler
```
// Stripe sends this automatically after payment
// Backend verifies webhook signature
// On success: creates PaymentTransaction + CreditTransaction (PURCHASE)
// On failure: logs failed payment

// No JSON response needed — return 200 status to acknowledge
```

---

## 11. M10: Video Meeting Integration (Zoom)

### Endpoints (mostly internal — triggered by booking confirmation)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/meetings/:bookingId` | Auth | Get meeting details for a booking |
| GET | `/meetings/:bookingId/recording` | Auth | Get recording URL (post-class) |

**Note:** Meeting creation is automatic — triggered internally when a booking is confirmed. No manual "create meeting" endpoint.

**GET `/meetings/:bookingId`**
```json
// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingId": "uuid",
    "status": "SCHEDULED",
    "scheduledStart": "2026-03-22T10:00:00Z",
    "scheduledEnd": "2026-03-22T11:00:00Z",
    "joinUrl": "https://zoom.us/j/123456",   // For parent/student
    "hostUrl": "https://zoom.us/s/123456",    // Only visible to tutor
    "password": "abc123"
  }
}
// hostUrl only returned if requester is the assigned tutor
```

**GET `/meetings/:bookingId/recording`**
```json
// Response (200)
{
  "success": true,
  "data": {
    "recordings": [
      {
        "id": "uuid",
        "recordingUrl": "https://zoom.us/rec/share/...",
        "duration": 55,
        "fileSize": 245000
      }
    ]
  }
}
```

---

## 12. M11: Assessment & Evaluation

### Tutor Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/assessments` | Tutor | Create assessment for a student |
| GET | `/assessments` | Tutor | List assessments created by tutor |
| PATCH | `/assessments/:id` | Tutor | Update assessment |
| POST | `/assessments/:id/documents` | Tutor | Upload assessment document |
| DELETE | `/assessments/:id/documents/:docId` | Tutor | Remove document |

### Parent Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/parents/children/:childId/assessments` | Parent | List child's assessments |
| GET | `/assessments/:id` | Parent | Get assessment details |
| GET | `/assessments/:id/documents/:docId/download` | Parent | Download document (pre-signed URL) |
| GET | `/parents/children/:childId/progress` | Parent | Get child's progress summary |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/assessments` | Admin(user_management) | List all assessments |

**POST `/assessments`** — Tutor creates assessment
```json
// Request (multipart/form-data for file upload, or JSON for data-only)
{
  "studentId": "uuid",
  "subjectId": "uuid",
  "bookingId": "uuid",      // Optional — link to specific class
  "title": "Mid-term Mathematics Assessment",
  "score": 85.5,
  "maxScore": 100,
  "remarks": "Good understanding of algebra. Needs practice in geometry.",
  "feedback": "Focus on triangle theorems for next session."
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "student": { "firstName": "Omar" },
    "subject": { "name": "Mathematics" },
    "title": "Mid-term Mathematics Assessment",
    "score": 85.5,
    "maxScore": 100,
    "remarks": "Good understanding of algebra. Needs practice in geometry."
  }
}
```

**GET `/parents/children/:childId/progress`** — Progress summary
```json
// Response (200)
{
  "success": true,
  "data": {
    "studentName": "Omar Al Rashid",
    "grade": "Grade 9",
    "subjects": [
      {
        "subject": "Mathematics",
        "totalAssessments": 8,
        "averageScore": 82.3,
        "latestScore": 85.5,
        "trend": "improving",
        "scores": [72, 75, 78, 80, 82, 84, 80, 85.5]
      }
    ]
  }
}
```

---

## 13. M12: Notification System

### Endpoints (mostly internal — triggered by events)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/notifications/templates` | Admin(system_config) | List notification templates |
| PATCH | `/admin/notifications/templates/:id` | SuperAdmin | Update email template |
| GET | `/admin/notifications/logs` | Admin(analytics_access) | View notification delivery logs |

**Note:** Notifications are triggered internally by other modules (booking confirmed, payment success, etc.). There are no "send notification" endpoints — it's event-driven.

**PATCH `/admin/notifications/templates/:id`** — Update template
```json
// Request
{
  "subject": "Your class is confirmed! 🎉",
  "bodyHtml": "<h1>Hi {{parentName}}</h1><p>Your class with {{tutorName}} is confirmed for {{dateTime}}.</p>"
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "eventName": "CLASS_CONFIRMED",
    "subject": "Your class is confirmed! 🎉",
    "channel": "EMAIL"
  }
}
```

---

## 14. M13: CMS Content Management

### Public Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cms/pages` | Public | List all published CMS pages |
| GET | `/cms/pages/:slug` | Public | Get page by slug (e.g., "about-us") |
| POST | `/cms/contact` | Public | Submit contact form |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/cms/pages` | Admin(cms_management) | List all pages (including drafts) |
| POST | `/admin/cms/pages` | Admin(cms_management) | Create page |
| PATCH | `/admin/cms/pages/:id` | Admin(cms_management) | Update page |
| DELETE | `/admin/cms/pages/:id` | Admin(cms_management) | Delete page |
| PATCH | `/admin/cms/pages/:id/publish` | Admin(cms_management) | Publish page |
| PATCH | `/admin/cms/pages/:id/unpublish` | Admin(cms_management) | Unpublish page |
| GET | `/admin/cms/contacts` | Admin(cms_management) | List contact submissions |
| PATCH | `/admin/cms/contacts/:id/read` | Admin(cms_management) | Mark as read |

**POST `/admin/cms/pages`** — Create CMS page
```json
// Request
{
  "title": "About Us",
  "slug": "about-us",
  "content": "<h1>About Indu AE</h1><p>We are a leading tutoring platform...</p>",
  "metaTitle": "About Us | Indu AE",
  "metaDescription": "Learn about Indu AE tutoring platform"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "About Us",
    "slug": "about-us",
    "status": "DRAFT"
  }
}
```

---

## 15. M14: Admin Analytics & Reporting

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/analytics/overview` | Admin(analytics_access) | Dashboard overview stats |
| GET | `/admin/analytics/users` | Admin(analytics_access) | User growth & distribution |
| GET | `/admin/analytics/bookings` | Admin(analytics_access) | Booking statistics |
| GET | `/admin/analytics/revenue` | Admin(analytics_access) | Revenue & credit stats |
| GET | `/admin/analytics/tutors` | Admin(analytics_access) | Tutor performance rankings |
| GET | `/admin/analytics/consultants` | Admin(analytics_access) | Consultant performance |

**GET `/admin/analytics/overview`** — Dashboard summary
```json
// Response (200)
{
  "success": true,
  "data": {
    "totalUsers": { "parents": 450, "tutors": 32, "consultants": 5, "admins": 3 },
    "activeThisMonth": { "parents": 210, "tutors": 28 },
    "bookings": {
      "totalDemo": 320,
      "totalClasses": 1200,
      "thisMonth": { "demo": 45, "classes": 180 }
    },
    "revenue": {
      "totalInFils": 5000000,  // 50,000 AED
      "thisMonthInFils": 750000
    },
    "credits": {
      "totalPurchased": 8500,
      "totalUsed": 6200,
      "inCirculation": 2300
    },
    "tutorEarnings": {
      "totalUnpaidInFils": 320000,
      "totalPaidInFils": 1800000
    }
  }
}
```

**GET `/admin/analytics/bookings`**
```
Query: ?period=monthly&startDate=2026-01-01&endDate=2026-03-31
```
```json
// Response (200)
{
  "success": true,
  "data": {
    "period": "monthly",
    "data": [
      { "month": "2026-01", "demoBookings": 40, "classBookings": 150, "cancellations": 8 },
      { "month": "2026-02", "demoBookings": 52, "classBookings": 175, "cancellations": 5 },
      { "month": "2026-03", "demoBookings": 45, "classBookings": 180, "cancellations": 6 }
    ],
    "gradeTierDistribution": {
      "tier1_grade1to6": 520,
      "tier2_grade7plus": 680
    }
  }
}
```

---

## 16. M15: Rating & Review

### Parent Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/reviews` | Parent | Submit review for completed class |
| GET | `/reviews/my-reviews` | Parent | List reviews submitted by parent |

### Public Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tutors/:id/reviews` | Public | List tutor's reviews |

### Tutor Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tutors/reviews` | Tutor | List own reviews |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/reviews` | Admin(user_management) | List all reviews |
| PATCH | `/admin/reviews/:id/visibility` | Admin(user_management) | Hide/show review |

**POST `/reviews`** — Submit review
```json
// Request
{
  "bookingId": "uuid-of-completed-booking",
  "rating": 5,
  "comment": "Excellent session! Sara explained algebra concepts very clearly."
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Excellent session! Sara explained algebra concepts very clearly.",
    "tutor": { "firstName": "Sara", "lastName": "Khan" },
    "newAggregateRating": 4.7
  }
}
// Triggers: email notification to tutor
```

**GET `/tutors/:id/reviews`** — Public tutor reviews
```json
// Response (200)
{
  "success": true,
  "data": {
    "tutorId": "uuid",
    "aggregateRating": 4.7,
    "totalReviews": 23,
    "distribution": { "5": 15, "4": 5, "3": 2, "2": 1, "1": 0 },
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Excellent session!",
        "parentName": "Ahmed A.",  // Partial name for privacy
        "subject": "Mathematics",
        "createdAt": "2026-03-15T12:00:00Z"
      }
    ]
  },
  "meta": { "page": 1, "limit": 10, "total": 23, "totalPages": 3 }
}
```

---

## 17. M16: Tutor Earnings

### Tutor Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tutors/earnings` | Tutor | List own earnings |
| GET | `/tutors/earnings/summary` | Tutor | Get earnings summary |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/earnings` | Admin(tutor_payouts) | List all tutor earnings |
| GET | `/admin/earnings/summary` | Admin(tutor_payouts) | Aggregate earnings summary |
| GET | `/admin/earnings/export` | Admin(tutor_payouts) | Export earnings as CSV |
| POST | `/admin/payouts` | Admin(tutor_payouts) | Record a payout |
| GET | `/admin/payouts` | Admin(tutor_payouts) | List payout history |

**GET `/tutors/earnings/summary`**
```json
// Response (200)
{
  "success": true,
  "data": {
    "totalEarnedInFils": 225000,   // 2,250 AED
    "unpaidInFils": 75000,          // 750 AED
    "paidInFils": 150000,           // 1,500 AED
    "totalClasses": 30,
    "thisMonth": {
      "earnedInFils": 37500,
      "classes": 5
    }
  }
}
```

**GET `/tutors/earnings`**
```
Query: ?status=UNPAID&page=1&limit=20
```
```json
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "subject": "Mathematics",
      "studentName": "Omar A.",
      "classDate": "2026-03-20T10:00:00Z",
      "amountInFils": 7500,
      "status": "UNPAID"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 10, "totalPages": 1 }
}
```

**POST `/admin/payouts`** — Record manual payout
```json
// Request
{
  "tutorId": "uuid",
  "earningIds": ["uuid-1", "uuid-2", "uuid-3"],
  "paidVia": "Bank Transfer",
  "referenceNo": "TXN-2026-0315-001",
  "notes": "March first half payout"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "tutorId": "uuid",
    "totalAmountInFils": 22500,
    "earningsMarkedPaid": 3,
    "paidVia": "Bank Transfer",
    "referenceNo": "TXN-2026-0315-001"
  }
}
// All referenced earnings are marked as PAID
```

**GET `/admin/earnings/export`** — CSV export
```
Query: ?status=UNPAID&tutorId=uuid (optional filters)
Response: CSV file download
```

---

## 18. Endpoint Count Summary

| Module | Public | Parent | Tutor | Consultant | Admin | Total |
|--------|--------|--------|-------|------------|-------|-------|
| M1: Auth | 5 | - | - | - | - | **8** |
| M2: User Management | - | 3 | - | - | 11 | **14** |
| M3: Tutor Management | 2 | - | 7 | - | 7 | **16** |
| M4: Course & Subject | 5 | - | - | - | 12 | **17** |
| M5: Availability | - | - | 6 | - | - | **7** |
| M6: Demo Booking + Demo Request | - | 8 | 1 | 9 | 2 | **20** |
| M7: Class Booking | - | 4 | 2 | 7 | 1 | **14** |
| M8: Credit Wallet | 1 | 2 | - | - | 6 | **9** |
| M9: Payment | - | 3 | - | - | 2 | **6** |
| M10: Meeting | - | - | - | - | - | **2** |
| M11: Assessment | - | 4 | 5 | - | 1 | **10** |
| M12: Notification | - | - | - | - | 3 | **3** |
| M13: CMS | 3 | - | - | - | 8 | **11** |
| M14: Analytics | - | - | - | - | 6 | **6** |
| M15: Review | 1 | 2 | 1 | - | 2 | **6** |
| M16: Tutor Earnings | - | - | 2 | - | 5 | **7** |
| **Total** | **17** | **26** | **24** | **16** | **65** | **156** |

---

## 19. Error Codes

Standard error codes used across all endpoints:

| Code | HTTP | Description |
|------|------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid access token |
| `FORBIDDEN` | 403 | Insufficient role or permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request body/params validation failed |
| `DUPLICATE_ENTRY` | 409 | Resource already exists (e.g., email taken) |
| `INSUFFICIENT_CREDITS` | 400 | Not enough credits to book class |
| `SLOT_UNAVAILABLE` | 409 | Slot already booked by another user |
| `BOOKING_NOT_CANCELLABLE` | 400 | Booking in non-cancellable state |
| `REVIEW_ALREADY_EXISTS` | 409 | Review already submitted for this booking |
| `ACCOUNT_DISABLED` | 403 | User account is deactivated |
| `EMAIL_NOT_VERIFIED` | 403 | Email verification pending |
| `PASSWORD_CHANGE_REQUIRED` | 403 | First login — must change temp password |
| `PAYMENT_FAILED` | 400 | Stripe payment failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

> **Architecture documentation complete.** All four foundational docs are ready:
> 1. [module-breakdown.md](module-breakdown.md) — 16 modules, 13 locked decisions
> 2. [system-architecture.md](system-architecture.md) — Tech stack, folder structure, middleware pipeline
> 3. [database-schema.md](database-schema.md) — 27 tables, full Prisma schema
> 4. [api-spec.md](api-spec.md) — 146 endpoints across 16 modules
>
> **Next step:** Begin implementation — Phase 1 (Foundation): M1 Auth + M2 User Management
