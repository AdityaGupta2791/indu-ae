# Module Breakdown — Indu AE Tutor-Student Learning Platform

> **Version:** 2.1 (Permission-Based Admin Added)
> **Date:** 2026-03-14
> **Status:** APPROVED — Ready for System Architecture
> **Author:** System Architect

---

## 1. PRD Summary

An online tutoring platform connecting **Parents**, **Students (children)**, **Tutors**, and **Consultants** through a centralized web system, managed by a **Super Admin**.

**Core business flow:**
1. Parent signs up → adds children (students) → searches for tutors
2. Parent requests a demo class → Consultant mediates → demo scheduled via Zoom
3. Parent purchases credits → books regular classes using credits
4. Tutor conducts class → uploads assessments → parent tracks progress
5. Admin oversees everything: users, courses, payments, analytics

**Target market:** UAE (Stripe payments)

---

## 2. Locked Business Decisions

All architectural decisions have been confirmed. These are **non-negotiable design constraints** for all subsequent phases.

| # | Decision | Detail |
|---|----------|--------|
| D1 | **Parent = Account Holder** | Parent is the only consumer account. Parent manages multiple child/student profiles. Students do NOT have independent accounts in V1. |
| D2 | **Consultant = Mandatory Human-in-the-Loop** | Every demo request AND regular class booking requires consultant verification before confirmation. This is intentional, not a bottleneck to optimize away. |
| D3 | **No Refunds on Cancellation** | Cancelled classes do NOT refund credits. Credits remain in wallet for future use. |
| D4 | **Variable Credit Pricing** | Credit cost per class varies by tutor AND subject. Not a flat rate. |
| D5 | **Grade-Tier Pricing** | Grade 1–6 = same rate (e.g., 2 credits/class). Grade 7+ = higher rate (e.g., 3 credits/class). Admin configures these tiers. All pricing is credit-based — no upfront money display to parents. |
| D6 | **One Tutor = Multiple Subjects** | A single tutor can teach multiple subjects across multiple grade levels. |
| D7 | **Tutor Earnings: Schema Now, Payout UI in V2** | Track tutor earnings from Day 1 (auto-created on class completion). Admin defines `tutor_rate` per tutor-subject combination. V1: admin exports earnings and pays manually. V2: automated payout system. |
| D8 | **Rating & Review in V1** | Post-class rating (1–5 stars) + optional text review. One review per completed class. Aggregate rating displayed on tutor profile. Admin can moderate. |
| D9 | **Messaging Deferred to V2** | V1: Consultant sees tutor contact info (phone/email) on dashboard. Communication happens off-platform. System sends automated email notifications. V2: In-app messaging. |
| D10 | **Student Self-Login Deferred to V2** | V1: Parent-only access. Schema designed with nullable `user_id` on Student table to support student accounts in V2. |
| D11 | **Email-Only Notifications (V1)** | V1: Email via AWS SES. Architecture is event-driven so adding SMS/push/in-app in V2 requires no core rewrite. |
| D12 | **Course = Subject + GradeLevel** | Subject and GradeLevel are independent reference tables. Course = Subject + GradeLevel + curriculum details. Tutors are assigned to Courses. |
| D13 | **Permission-Based Admin System** | Super Admin has all permissions + can create Admin users. Admin users get granular permissions (user_management, tutor_management, course_management, booking_oversight, payment_management, credit_management, tutor_payouts, cms_management, analytics_access, system_config). Tutors/Parents/Consultants remain role-based. |

---

## 3. User Roles & Responsibilities

| Role | Type | Access Control | Key Responsibility |
|------|------|---------------|---------------------|
| **Super Admin** | Internal | All permissions + admin user management | Full platform control — creates admin users, assigns permissions, owns system config |
| **Admin** | Internal | Permission-based (subset assigned by Super Admin) | Operates specific platform areas based on granted permissions |
| **Tutor** | Provider | Role-based (own data only) | Manage profile/availability, teach multiple subjects, conduct classes, upload assessments |
| **Parent** | Consumer (Account Holder) | Role-based (own data + children) | Manage multiple children, search tutors, buy credits, book classes, view progress |
| **Consultant** | Mediator (Human-in-the-Loop) | Role-based (assigned bookings) | Verify every booking, coordinate tutor availability, suggest/assign tutors, monitor satisfaction |
| **Student** | Passive Entity (Child Profile) | No login in V1 | Linked to parent. Schema supports V2 self-access via nullable `user_id`. |

### Admin Permission Groups

| Permission | Scope | Typical Assignment |
|------------|-------|--------------------|
| `user_management` | View/edit/disable parents, tutors, consultants | Operations team |
| `tutor_management` | Create tutors, assign subjects, set tutor_rates, activate/deactivate | Operations team |
| `course_management` | CRUD courses, subjects, grade levels, materials | Content team |
| `booking_oversight` | View/monitor all demo + class bookings | Operations team |
| `payment_management` | View transactions, invoices, credit purchases | Finance team |
| `credit_management` | Define credit packages, grade-tier pricing | Finance team |
| `tutor_payouts` | View tutor earnings, export CSV, mark as paid | Finance team |
| `cms_management` | Create/edit/publish CMS pages | Content team |
| `analytics_access` | View reports and dashboards | Management |
| `system_config` | Platform settings, notification templates — **Super Admin only, non-delegable** | Super Admin |

> **Note:** Super Admin is the only role that can create other admin users and assign permissions. The `system_config` permission is reserved for Super Admin and cannot be delegated.

---

## 4. Core System Modules (16 Total)

### Module Map Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          PLATFORM CORE                              │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐         │
│  │ M1: Auth &   │  │ M2: User     │  │ M3: Tutor         │         │
│  │ Authorization│  │ Management   │  │ Management        │         │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘         │
│         │                 │                    │                     │
│  ┌──────┴─────────────────┴────────────────────┴──────────────┐    │
│  │              M4: Course & Subject Management                │    │
│  │           (Subject + GradeLevel + Grade-Tier Pricing)       │    │
│  └─────────────────────────┬──────────────────────────────────┘    │
│                            │                                        │
│  ┌─────────────────────────┴──────────────────────────────────┐    │
│  │              M5: Availability & Scheduling                  │    │
│  └──────────┬─────────────────────────────┬───────────────────┘    │
│             │                             │                         │
│  ┌──────────┴──────────┐  ┌───────────────┴───────────────┐       │
│  │ M6: Demo Class      │  │ M7: Class Booking             │       │
│  │ Booking             │  │ (Credit-based + Consultant)   │       │
│  └──────────┬──────────┘  └───────────────┬───────────────┘       │
│             │                             │                         │
│  ┌──────────┴─────────────────────────────┴───────────────┐       │
│  │              M8: Credit Wallet System                   │       │
│  │           (Grade-Tier Pricing, No Refunds)              │       │
│  └─────────────────────────┬──────────────────────────────┘       │
│                            │                                        │
│  ┌─────────────────────────┴──────────────────────────────┐       │
│  │              M9: Payment Processing (Stripe)            │       │
│  └────────────────────────────────────────────────────────┘       │
│                                                                     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │ M10: Video     │  │ M11: Assessment│  │ M12: Notifi-   │       │
│  │ Meeting (Zoom) │  │ & Evaluation   │  │ cations (Email)│       │
│  └────────────────┘  └────────────────┘  └────────────────┘       │
│                                                                     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │ M13: CMS       │  │ M14: Admin     │  │ M15: Rating &  │       │
│  │ Pages          │  │ Analytics      │  │ Review         │       │
│  └────────────────┘  └────────────────┘  └────────────────┘       │
│                                                                     │
│  ┌────────────────┐                                                 │
│  │ M16: Tutor     │                                                 │
│  │ Earnings       │                                                 │
│  └────────────────┘                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

### M1: Authentication & Authorization

**Purpose:** Secure identity management with role-based access for external users and permission-based access for admin users.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Signup, login, logout, password reset, email verification, JWT session management, RBAC + permission-based admin access |
| **Actors** | All roles |
| **Key Entities** | User, Role, Permission, AdminPermission (junction), Session |
| **External Dependencies** | Email service (verification/reset) |

**Access Control Model (per D13):**
```
External Users (Tutor, Parent, Consultant)
  → Role-based access (role determines what endpoints they can hit)

Internal Users (Super Admin, Admin)
  → Permission-based access (granular permissions per admin user)
  → Super Admin = all permissions + admin user CRUD
  → Admin = only assigned permissions
```

**Business Rules:**
- Parents self-register
- Tutors and Consultants are created by Admin/Super Admin (admin-provisioned accounts)
- Admin users are created by Super Admin with specific permissions assigned
- Student table has nullable `user_id` (V2-ready for student self-login)
- API middleware checks: role first, then permissions (for admin routes)

**Sub-features:**
- Role-based signup flows (Parent = self-register; Tutor/Consultant/Admin = admin-provisioned)
- Email verification on signup
- Password reset via email token
- JWT-based authentication with refresh tokens (JWT payload includes role + permissions)
- Role middleware for external user routes
- Permission middleware for admin routes (checks specific permission per endpoint)
- Super Admin: create admin users and assign/revoke permissions

---

### M2: User Management

**Purpose:** CRUD operations and profile management for all user types, including child profiles under parents.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Profile CRUD, child management, account activation/deactivation |
| **Actors** | Admin (all users), Parent (own profile + children), Tutor (own profile), Consultant (own profile) |
| **Key Entities** | User, ParentProfile, TutorProfile, ConsultantProfile, Student (Child) |
| **Integration Points** | M1 (auth), M3 (tutor details) |

**Sub-features:**
- Parent profile with address, contact info
- Child/Student profiles (name, grade, subjects needed) — linked to parent
- **One parent can have multiple children** — each child has their own grade level and subject needs
- **Child CRUD is admin-only** — Parent has read-only access to their children (`GET /parents/children`). Create/update/delete operations are performed by Admin via `/admin/parents/:parentId/children` endpoints.
- Tutor profile (qualifications, experience, certifications, subjects, grade levels)
- Consultant profile (basic info, contact details visible on their dashboard)
- Admin: view/edit/disable any user
- Admin: soft delete user (sets `deletedAt` + `isActive: false`, invalidates refresh tokens; Super Admin accounts cannot be deleted)
- Admin: full child management (CRUD) under any parent

**Architecture:** User is a single base table. Role-specific data lives in separate profile tables (ParentProfile, TutorProfile, etc.) linked via foreign key.

---

### M3: Tutor Management

**Purpose:** Admin-controlled tutor lifecycle, multi-subject assignment, and public-facing tutor directory.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Admin CRUD for tutors, subject/course assignment, activation, performance tracking, public directory |
| **Actors** | Admin, Tutor (own profile), Parent (search/view) |
| **Key Entities** | TutorProfile, TutorSubject (many-to-many), TutorCertification, TutorCourse |
| **Integration Points** | M2 (user base), M4 (courses/subjects), M5 (availability), M15 (ratings), M16 (earnings) |

**Business Rules:**
- **One tutor can teach multiple subjects** across multiple grade levels
- Admin assigns subjects and courses to a tutor (many-to-many relationship)
- `tutor_rate` is defined per tutor-subject combination (supports variable pricing per D7)

**Sub-features:**
- Admin: create tutor account + generate credentials
- Admin: assign multiple subjects and courses to a single tutor
- Admin: define `tutor_rate` per tutor-subject pair
- Admin: activate/deactivate tutor (toggle `isActive` — reversible)
- Admin: soft delete tutor (sets `deletedAt` + `isActive: false` on TutorProfile, deactivates User, invalidates refresh tokens — irreversible)
- Admin: view tutor performance metrics (classes conducted, aggregate rating)
- Public tutor directory: search by subject, grade, experience, rating, availability. Entire tutor card is clickable to open profile detail.
- Tutor detail page: qualifications, subjects taught, intro video (YouTube embed), reviews, demo booking CTA
- Tutor: add/change/remove a YouTube intro video URL (standalone action, no edit mode required)

---

### M4: Course & Subject Management

**Purpose:** Catalog of courses and subjects with grade-tier pricing, managed by Admin.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Subject taxonomy, grade-level management, course CRUD, grade-tier credit pricing, material uploads |
| **Actors** | Admin (full CRUD), Parent/Public (browse), Tutor (view assigned) |
| **Key Entities** | Subject, GradeLevel, GradeTier, Course, CourseMaterial |
| **Integration Points** | M3 (tutor assignment), M7 (booking pricing), M8 (credit deduction) |

**Data Model:**
```
Subject (independent)          GradeLevel (independent)
  e.g., Mathematics              e.g., Grade 5, Grade 10
         \                              /
          \                            /
           → Course (Subject + GradeLevel + curriculum)
               e.g., "Mathematics — Grade 10"

GradeTier (pricing tiers — defined by admin)
  Tier 1: Grade 1–6  → 2 credits/class
  Tier 2: Grade 7+   → 3 credits/class
```

**Business Rules (per D5, D12):**
- Subject and GradeLevel are independent reference tables
- Course = Subject + GradeLevel composite
- **Grade-Tier Pricing:** Admin defines credit-per-class rates by grade tier (not per individual grade)
- All pricing displayed in credits only — no money amounts shown to parents
- Tutors are assigned to Courses (not raw subjects)

**Sub-features:**
- Admin: CRUD subjects and grade levels
- Admin: create/edit/archive courses (Subject + GradeLevel + description)
- Admin: configure grade-tier pricing (e.g., Tier 1 = Grades 1–6 = 2 credits, Tier 2 = Grades 7+ = 3 credits)
- Admin: assign tutors to courses
- Admin: upload course materials (PDFs, resources)
- Public: course listing page with overview, subjects, assigned tutors, demo CTA

---

### M5: Availability & Scheduling

**Purpose:** Tutor availability management and slot-based scheduling engine.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Weekly availability templates, date-specific overrides, slot generation, conflict detection |
| **Actors** | Tutor (manage own), Consultant (view/verify), Parent (view available slots), Admin (view all) |
| **Key Entities** | AvailabilityTemplate, AvailabilitySlot, BlockedDate, BookedSlot |
| **Integration Points** | M6 (demo booking), M7 (class booking), M10 (meeting creation) |

**Sub-features:**
- Tutor: set recurring weekly availability (e.g., Mon 9am–12pm, Wed 2pm–6pm)
- Tutor: block specific dates (holidays, leave)
- System: generate bookable slots from templates (e.g., 1-hour slots)
- Real-time availability check: prevent double-booking
- Calendar view for tutor, parent, consultant
- Timezone: store in UTC, display in user's local timezone
- Optimistic locking on slot reservation to handle concurrent bookings

---

### M6: Demo Class Booking

**Purpose:** Allow parents to book a free trial/demo class with a tutor, mediated by a consultant.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Demo request intake, consultant mediation workflow, slot assignment, meeting link generation |
| **Actors** | Parent (request), Consultant (mediate/confirm), Tutor (receive/conduct), Admin (monitor) |
| **Key Entities** | DemoRequest, DemoRequestSubject, DemoBooking, Board |
| **Integration Points** | M4 (boards, grades, subjects), M5 (availability), M10 (Zoom meeting), M12 (notifications) |

**Two-Stage Flow:**

M6 now has two stages: (1) **Demo Request** — parent intake form, and (2) **Demo Booking** — formal scheduling after consultant review.

**Stage 1: Demo Request (Pre-Booking Intake)**
```
Parent submits demo request form:
  - Contact info (email, phone)
  - Child details (name, DOB, board, grade)
  - Subjects requested (multiple)
  - Preferred time slot (MORNING/AFTERNOON/EVENING)
  - Preferred date + optional alternative date
  - Notes
    → Status: PENDING
    ↓
Consultant views PENDING queue → self-assigns
    → Status: ASSIGNED
    ↓
Consultant contacts parent, coordinates details
    → Status: CONFIRMED / CANCELLED
    ↓
Demo conducted
    → Status: COMPLETED
```

**DemoRequest Statuses:** `PENDING → ASSIGNED → CONFIRMED → COMPLETED | CANCELLED`

**Stage 2: Demo Booking (Existing Flow)**
```
Parent requests demo (selects tutor + subject + preferred slot)
    → Status: PENDING
    ↓
Consultant reviews → checks tutor availability (M5)
    ↓
Consultant confirms slot → Status: CONFIRMED
    ↓
System generates Zoom link (M10) → sends email notifications (M12)
    ↓
Demo conducted → Status: COMPLETED
    ↓
Parent submits rating/feedback (M15)
```

**DemoBooking Statuses:** `PENDING → CONFIRMED → COMPLETED | CANCELLED | NO_SHOW`

**Business rule:** Demo classes are FREE — no credits required. Purpose is conversion to paid classes.

---

### M7: Class Booking (Credit-Based)

**Purpose:** Regular class booking using pre-purchased credits, with mandatory consultant verification.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Booking creation, credit validation/deduction (grade-tier based), consultant verification, meeting generation |
| **Actors** | Parent (book), Consultant (verify/confirm — MANDATORY), Tutor (receive/conduct), Admin (monitor) |
| **Key Entities** | ClassBooking, BookingSlot |
| **Integration Points** | M5 (availability), M8 (credit deduction), M10 (Zoom), M12 (notifications), M15 (post-class review), M16 (tutor earning) |

**Process Flow:**
```
Parent selects tutor + slot + subject for a specific child
    → System checks credit balance (M8) against grade-tier rate
    → Booking created → Status: PENDING_VERIFICATION
    ↓
Consultant verifies tutor availability (MANDATORY per D2)
    ↓
Confirmed → Credits deducted based on grade tier (M8)
    → Zoom link generated (M10)
    → Email notifications sent (M12)
    → Status: CONFIRMED
    ↓
Class conducted → Status: COMPLETED
    → Tutor earning auto-created (M16)
    → Parent can submit review (M15)
```

**Statuses:** `PENDING_VERIFICATION → CONFIRMED → IN_PROGRESS → COMPLETED | CANCELLED | NO_SHOW`

**Business Rules (per D3, D4, D5):**
- Credits deducted ONLY after consultant confirmation
- Credit cost determined by grade tier (Grade 1–6 = Tier 1 rate, Grade 7+ = Tier 2 rate)
- **No refunds on cancellation** — credits remain in wallet for future use
- Consultant can assign alternate tutor if original is unavailable
- On class completion: system auto-creates tutor earning record (M16)

---

### M8: Credit Wallet System

**Purpose:** Virtual wallet for parents to purchase, hold, and spend learning credits with grade-tier-based deductions.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Credit packages, wallet balance, credit transactions (purchase, deduction), grade-tier deduction logic |
| **Actors** | Parent (purchase/view), Admin (define packages + tiers, view all wallets), System (auto-deduct) |
| **Key Entities** | CreditPackage, Wallet, CreditTransaction, GradeTier |
| **Integration Points** | M4 (grade-tier rates), M7 (class booking deduction), M9 (payment on purchase) |

**Sub-features:**
- Admin: define credit packages (e.g., 5 credits = 50 AED, 10 credits = 100 AED). Packages sorted by price ascending (no sort order field). Admin can toggle `isActive` (reversible) or soft delete via `deletedAt` (irreversible).
- Admin: define grade-tier pricing (Grade 1–6 = 2 credits/class, Grade 7+ = 3 credits/class)
- Parent: purchase credits (triggers M9 payment flow)
- System: deduct credits on booking confirmation based on grade tier of the child
- **No refunds on cancellation** — credits stay in wallet (per D3)
- Parent: view wallet balance and full transaction history
- All transactions are immutable ledger entries

**Architecture:** Wallet balance = **computed value** from transaction ledger, never a stored mutable field. This ensures consistency and enables full audit trail.

---

### M9: Payment Processing

**Purpose:** Secure payment gateway integration for credit purchases.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Payment intent creation, payment processing, webhook handling, invoice generation |
| **Actors** | Parent (pay), Admin (view transactions) |
| **Key Entities** | PaymentTransaction, Invoice |
| **Integration Points** | M8 (credit wallet top-up), Stripe API |

**Sub-features:**
- Stripe Checkout / Payment Intent for credit purchases
- Webhook handling for payment success/failure
- Invoice generation (PDF)
- Transaction history for parent and admin

**Business rule:** Payment is ONLY for purchasing credits. Classes are never paid directly — always through credit deduction. No upfront money amounts shown in booking flow.

---

### M10: Video Meeting Integration

**Purpose:** Automated video meeting lifecycle for demo and regular classes.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Meeting creation, link generation, recording management, attendance tracking |
| **Actors** | System (auto-create), Tutor (host), Parent/Student (join) |
| **Key Entities** | Meeting, MeetingRecording, AttendanceLog |
| **Integration Points** | M6 (demo), M7 (class), Zoom API |

**Sub-features:**
- Auto-create Zoom meeting when booking is confirmed
- Generate secure join links (separate host/participant links)
- Store meeting metadata (duration, participants)
- Fetch and store recording URLs from Zoom cloud
- Attendance logging via Zoom webhooks
- "Join Class" button on dashboards

**Architecture:** Abstract video provider behind an interface. Zoom in V1, but designed for provider-swappable integration.

---

### M11: Assessment & Evaluation

**Purpose:** Tutor-driven student evaluation with reports and progress tracking.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Assessment upload, scoring, remarks, progress tracking over time |
| **Actors** | Tutor (create/upload), Parent (view/download), Admin (monitor) |
| **Key Entities** | Assessment, AssessmentDocument, ProgressRecord |
| **Integration Points** | M2 (student profiles), M7 (linked to class sessions) |

**Sub-features:**
- Tutor: upload assessment report (PDF/image) linked to a specific student and class
- Tutor: add score, remarks, feedback text
- Tutor: track student progress across sessions
- Parent: view all assessments per child
- Parent: download assessment documents
- Progress dashboard: score trends over time per subject

---

### M12: Notification System

**Purpose:** Event-driven email notifications across platform workflows.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Trigger notifications on platform events, deliver via email |
| **Actors** | System (trigger), All users (receive) |
| **Key Entities** | NotificationTemplate, NotificationLog |
| **Integration Points** | M6, M7, M8, M9, M11, M15 (event sources), AWS SES |

**Notification Events:**

| Event | Recipients |
|-------|-----------|
| Demo class requested | Consultant |
| Demo class confirmed | Parent, Tutor |
| Class booked (pending verification) | Consultant |
| Class confirmed | Parent, Tutor |
| Payment successful | Parent |
| Credits running low | Parent |
| Assessment uploaded | Parent |
| Class reminder (24hrs before) | Parent, Tutor |
| Class reminder (1hr before) | Parent, Tutor |
| Tutor availability updated | Consultant |
| New review received | Tutor |

**Architecture:** Event-driven — modules emit events, notification service subscribes and dispatches via email. Designed for future channel expansion (SMS, push, in-app) without core rewrite.

---

### M13: CMS (Content Management)

**Purpose:** Admin-managed static/informational pages for the public website.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | CRUD for static pages, rich text editing, publish/draft control |
| **Actors** | Admin (manage), Public (view) |
| **Key Entities** | CMSPage |
| **Integration Points** | None (standalone) |

**Pages:** About Us, Courses, Tutors, How It Works, FAQ, Contact Us, Privacy Policy, Terms & Conditions

**Sub-features:**
- Admin: create/edit pages with rich text editor
- Admin: publish/unpublish pages
- SEO fields (title, meta description, slug)
- Contact form submission storage

---

### M14: Admin Analytics & Reporting

**Purpose:** Platform-wide metrics and operational reporting dashboard.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Aggregate metrics, trend reports, exportable data |
| **Actors** | Admin only |
| **Key Entities** | No dedicated entities — reads from all other modules |
| **Integration Points** | M2, M3, M7, M8, M9, M15, M16 (data sources) |

**Reports:**
- Total users by role (with growth trend)
- Active tutors and their utilization rates
- Classes booked (demo vs regular, by period)
- Credit purchases and revenue
- Top tutors by classes conducted / rating
- Consultant performance (requests handled, conversion rate)
- Tutor earnings summary (paid vs unpaid)
- Payment transaction summaries
- Grade-tier distribution (how many classes per tier)

---

### M15: Rating & Review

**Purpose:** Post-class review system for tutors, powering search ratings and quality tracking.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Collect post-class ratings, aggregate tutor scores, admin moderation |
| **Actors** | Parent (submit review), Tutor (view own reviews), Admin (moderate), Public (view on tutor profile) |
| **Key Entities** | Review |
| **Integration Points** | M7 (linked to completed ClassBooking), M3 (tutor aggregate rating), M12 (notification) |

**Business Rules:**
- One review per completed ClassBooking
- Rating: 1–5 stars (required) + text comment (optional)
- Tutor's aggregate rating = average of all their reviews
- Reviews are publicly visible on tutor profile page
- Admin can hide/moderate inappropriate reviews
- Tutor receives email notification when new review is submitted

---

### M16: Tutor Earnings

**Purpose:** Track tutor earnings per completed class, with admin-managed payout tracking.

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Auto-generate earning records on class completion, admin payout tracking |
| **Actors** | System (auto-create), Admin (view/export/mark paid), Tutor (view own earnings) |
| **Key Entities** | TutorEarning, PayoutRecord |
| **Integration Points** | M3 (tutor_rate per subject), M7 (class completion trigger) |

**Business Rules (per D7):**
- Admin defines `tutor_rate` per tutor-subject combination (e.g., Tutor A earns 75 AED/class for Math)
- When a class status changes to COMPLETED, system auto-creates a `TutorEarning` record
- Tutor dashboard shows: total earned, unpaid balance, earning history
- Admin dashboard shows: all tutor earnings, filter by paid/unpaid
- **V1:** Admin exports earnings CSV and pays tutors manually, then marks as "paid"
- **V2:** Automated payout via Stripe Connect or bank transfer

---

## 5. Module Dependency Graph & Build Order

```
Phase 1 — Foundation (no dependencies)
  M1:  Authentication & Authorization
  M13: CMS Pages

Phase 2 — Core Entities (depends on M1)
  M2: User Management (Parent, Student, Tutor, Consultant profiles)
  M4: Course & Subject Management (Subject + GradeLevel + GradeTier)

Phase 3 — Tutor Ecosystem (depends on M2, M4)
  M3:  Tutor Management (multi-subject, tutor_rate)
  M5:  Availability & Scheduling

Phase 4 — Financial Infrastructure (depends on M2, M4)
  M8: Credit Wallet System (grade-tier deduction)
  M9: Payment Processing (Stripe)

Phase 5 — Booking Engine (depends on M3, M5, M8)
  M6: Demo Class Booking (consultant-mediated)
  M7: Class Booking (credit-based + consultant-mediated)

Phase 6 — Post-Booking Features (depends on M6, M7)
  M10: Video Meeting Integration (Zoom)
  M11: Assessment & Evaluation
  M15: Rating & Review
  M16: Tutor Earnings

Phase 7 — Cross-Cutting (depends on M6, M7, M8, M9)
  M12: Notification System (email)

Phase 8 — Intelligence (depends on all)
  M14: Admin Analytics & Reporting
```

---

## 6. V2 Roadmap (Deferred Features)

These are intentionally deferred but the V1 schema is designed to support them:

| Feature | V2 Module | Schema Preparation |
|---------|-----------|-------------------|
| Student self-login | M1 extension | Nullable `user_id` on Student table |
| In-app messaging | New module M17 | Conversation, Message tables |
| In-app notifications | M12 extension | NotificationChannel enum, in-app delivery |
| SMS notifications | M12 extension | ChannelDispatcher pattern |
| Automated tutor payouts | M16 extension | PayoutRecord table, Stripe Connect |
| Tutor self-registration | M1/M3 extension | Approval workflow + status field |

---

## 7. Next Step

**Module breakdown is LOCKED.**

Next deliverable: **`/docs/system-architecture.md`** covering:
- Tech stack selection and rationale
- System architecture diagram (monolith vs microservices decision)
- Backend service layer design
- Database selection
- External integration strategy (Zoom, Stripe, AWS SES)
- Deployment architecture

**Awaiting confirmation to proceed.**
