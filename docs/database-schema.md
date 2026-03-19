# Database Schema — Indu AE Tutor-Student Learning Platform

> **Version:** 1.0
> **Date:** 2026-03-16
> **Status:** DRAFT — Awaiting Approval
> **Author:** System Architect
> **Depends on:** [module-breakdown.md](module-breakdown.md), [system-architecture.md](system-architecture.md)

---

## 1. Schema Design Principles

| Principle | Implementation |
|-----------|----------------|
| **IDs** | UUID v4 for all primary keys |
| **Money** | Stored as integers in fils (1 AED = 100 fils) |
| **Soft Deletes** | `deletedAt` nullable timestamp on all primary entities |
| **Timestamps** | `createdAt` + `updatedAt` on every table (Prisma auto-managed) |
| **Enums** | Defined as Prisma enums — enforced at database level |
| **Relations** | Foreign keys with referential integrity constraints |
| **Indexes** | On frequently queried columns (email, role, status, foreign keys) |

---

## 2. Entity Relationship Overview

```
User (base table for all roles)
 ├── 1:1  ParentProfile
 │         └── 1:N  Student (children)
 ├── 1:1  TutorProfile
 │         ├── N:M  Subject (via TutorSubject — includes tutor_rate)
 │         ├── 1:N  TutorCertification
 │         ├── 1:N  AvailabilityTemplate
 │         ├── 1:N  BlockedDate
 │         └── 1:N  TutorEarning
 ├── 1:1  ConsultantProfile
 └── N:M  Permission (via AdminPermission — admin users only)

Subject ←──→ GradeLevel ←──→ Course (Subject + GradeLevel composite)
                │
            GradeTier (pricing tiers: Grade 1-6 = Tier 1, Grade 7+ = Tier 2)

Course
 ├── N:M  Tutor (via TutorCourse)
 └── 1:N  CourseMaterial

DemoBooking
 ├── → Student (which child)
 ├── → Tutor
 ├── → Consultant
 ├── → AvailabilitySlot
 └── → Meeting

ClassBooking
 ├── → Student (which child)
 ├── → Tutor
 ├── → Consultant
 ├── → AvailabilitySlot
 ├── → Subject
 ├── → Meeting
 ├── → CreditTransaction (deduction)
 ├── → TutorEarning (on completion)
 └── → Review (post-class)

Wallet (per parent)
 └── 1:N  CreditTransaction (immutable ledger)

PaymentTransaction (Stripe payments for credit purchases)

Meeting (Zoom meetings)
 └── 1:N  MeetingRecording

Assessment (tutor uploads per student per class)
 └── 1:N  AssessmentDocument

Review (parent reviews tutor after class)

CMSPage (admin-managed static pages)

NotificationLog (email delivery tracking)

Board (educational boards, e.g., CBSE, IB)

DemoRequest (parent demo request — pre-booking intake)
 ├── → ParentProfile (requesting parent)
 ├── → Board (selected board)
 ├── → GradeLevel (child's grade)
 ├── → ConsultantProfile? (assigned consultant)
 └── N:M  Subject (via DemoRequestSubject)
```

---

## 3. Enums

```prisma
enum Role {
  SUPER_ADMIN
  ADMIN
  TUTOR
  PARENT
  CONSULTANT
}

enum Permission {
  USER_MANAGEMENT
  TUTOR_MANAGEMENT
  COURSE_MANAGEMENT
  BOOKING_OVERSIGHT
  PAYMENT_MANAGEMENT
  CREDIT_MANAGEMENT
  TUTOR_PAYOUTS
  CMS_MANAGEMENT
  ANALYTICS_ACCESS
  SYSTEM_CONFIG
}

enum DemoBookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum ClassBookingStatus {
  PENDING_VERIFICATION
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum CreditTransactionType {
  PURCHASE
  DEDUCTION
  ADMIN_ADJUSTMENT
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum EarningStatus {
  UNPAID
  PAID
}

enum MeetingStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum CMSPageStatus {
  DRAFT
  PUBLISHED
}

enum NotificationChannel {
  EMAIL
}

enum NotificationStatus {
  SENT
  FAILED
}

enum DemoRequestStatus {
  PENDING
  ASSIGNED
  CONFIRMED
  COMPLETED
  CANCELLED
}

enum TimeSlotPreference {
  MORNING
  AFTERNOON
  EVENING
}
```

---

## 4. Full Prisma Schema

### 4.1 User & Authentication (M1, M2)

```prisma
model User {
  id                String    @id @default(uuid())
  email             String    @unique
  passwordHash      String
  role              Role
  isActive          Boolean   @default(true)
  isEmailVerified   Boolean   @default(false)
  forcePasswordChange Boolean @default(false)  // For admin-provisioned accounts
  lastLoginAt       DateTime?

  // Role-specific profiles (only one will be populated)
  parentProfile     ParentProfile?
  tutorProfile      TutorProfile?
  consultantProfile ConsultantProfile?

  // Admin permissions (only for SUPER_ADMIN and ADMIN roles)
  adminPermissions  AdminPermission[]

  // V2: Student self-access — Student table has nullable userId
  studentAccount    Student?

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?

  @@index([email])
  @@index([role])
  @@index([isActive])
}

model AdminPermission {
  id         String     @id @default(uuid())
  userId     String
  permission Permission

  user       User       @relation(fields: [userId], references: [id])

  createdAt  DateTime   @default(now())

  @@unique([userId, permission])  // One user can't have same permission twice
  @@index([userId])
}
```

### 4.2 Parent & Student Profiles (M2)

```prisma
model ParentProfile {
  id        String   @id @default(uuid())
  userId    String   @unique
  firstName String
  lastName  String
  phone     String?
  address   String?
  city      String?
  country   String?  @default("UAE")

  user      User     @relation(fields: [userId], references: [id])
  children  Student[]
  wallet    Wallet?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Student {
  id        String   @id @default(uuid())
  parentId  String
  userId    String?  @unique  // Nullable — V2: link to User for student self-login
  firstName String
  lastName  String
  gradeId   String
  notes     String?  // Any special notes from parent

  parent    ParentProfile @relation(fields: [parentId], references: [id])
  user      User?         @relation(fields: [userId], references: [id])  // V2
  grade     GradeLevel    @relation(fields: [gradeId], references: [id])

  // Subjects the student needs tutoring in
  subjectNeeds  StudentSubject[]

  // Bookings for this student
  demoBookings  DemoBooking[]
  classBookings ClassBooking[]
  assessments   Assessment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([parentId])
  @@index([gradeId])
}

model StudentSubject {
  id        String  @id @default(uuid())
  studentId String
  subjectId String

  student   Student @relation(fields: [studentId], references: [id])
  subject   Subject @relation(fields: [subjectId], references: [id])

  @@unique([studentId, subjectId])
}
```

### 4.3 Tutor Profile (M2, M3)

```prisma
model TutorProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  firstName       String
  lastName        String
  phone           String?
  bio             String?
  experience      Int      @default(0)   // Years of experience
  profilePhotoUrl String?
  introVideoUrl   String?                // YouTube intro video URL
  isActive        Boolean  @default(true)

  user            User     @relation(fields: [userId], references: [id])

  // Multi-subject support (M3) — includes per-subject tutor_rate
  subjects        TutorSubject[]
  certifications  TutorCertification[]
  courses         TutorCourse[]

  // Availability (M5)
  availabilityTemplates AvailabilityTemplate[]
  blockedDates          BlockedDate[]

  // Classes
  demoBookings    DemoBooking[]
  classBookings   ClassBooking[]
  meetings        Meeting[]
  assessments     Assessment[]

  // Earnings (M16)
  earnings        TutorEarning[]

  // Reviews (M15)
  reviews         Review[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  @@index([isActive])
}

model TutorSubject {
  id        String  @id @default(uuid())
  tutorId   String
  subjectId String
  tutorRate Int     // Rate in fils per class (e.g., 7500 = 75 AED) — per D7

  tutor     TutorProfile @relation(fields: [tutorId], references: [id])
  subject   Subject      @relation(fields: [subjectId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([tutorId, subjectId])  // One rate per tutor-subject pair
  @@index([tutorId])
  @@index([subjectId])
}

model TutorCertification {
  id          String  @id @default(uuid())
  tutorId     String
  title       String
  institution String?
  year        Int?
  documentUrl String  // S3 pre-signed URL path

  tutor       TutorProfile @relation(fields: [tutorId], references: [id])

  createdAt   DateTime @default(now())

  @@index([tutorId])
}
```

### 4.4 Consultant Profile (M2)

```prisma
model ConsultantProfile {
  id        String   @id @default(uuid())
  userId    String   @unique
  firstName String
  lastName  String
  phone     String?
  email     String?  // Contact email visible to admin (may differ from login email)

  user      User     @relation(fields: [userId], references: [id])

  // Bookings managed by this consultant
  demoBookings  DemoBooking[]
  classBookings ClassBooking[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 4.4a Board (Reference Data)

```prisma
model Board {
  id        String   @id @default(uuid())
  name      String   @unique   // e.g., "CBSE", "IB", "British", "American"
  isActive  Boolean  @default(true)

  demoRequests DemoRequest[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([name])
  @@index([isActive])
}
```

### 4.4b Demo Request (M6 — Pre-Booking Intake)

```prisma
model DemoRequest {
  id               String              @id @default(uuid())
  parentId         String
  contactEmail     String
  contactPhone     String?
  childFirstName   String
  childLastName    String
  childDateOfBirth DateTime?           // Date only
  boardId          String
  gradeId          String
  preferredTimeSlot TimeSlotPreference  // MORNING, AFTERNOON, EVENING
  preferredDate    DateTime            // Date only
  alternativeDate  DateTime?           // Date only
  notes            String?
  status           DemoRequestStatus   @default(PENDING)
  consultantId     String?             // Consultant who self-assigned

  parent           ParentProfile      @relation(fields: [parentId], references: [id])
  board            Board              @relation(fields: [boardId], references: [id])
  grade            GradeLevel         @relation(fields: [gradeId], references: [id])
  consultant       ConsultantProfile? @relation(fields: [consultantId], references: [id])

  subjects         DemoRequestSubject[]

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([parentId])
  @@index([status])
  @@index([consultantId])
  @@index([createdAt])
}

model DemoRequestSubject {
  id             String  @id @default(uuid())
  demoRequestId  String
  subjectId      String

  demoRequest    DemoRequest @relation(fields: [demoRequestId], references: [id])
  subject        Subject     @relation(fields: [subjectId], references: [id])

  @@unique([demoRequestId, subjectId])
  @@index([demoRequestId])
}
```

### 4.5 Course & Subject Management (M4)

```prisma
model Subject {
  id          String   @id @default(uuid())
  name        String   @unique   // e.g., "Mathematics", "Physics", "English"
  description String?
  isActive    Boolean  @default(true)

  // Relations
  courses        Course[]
  tutorSubjects  TutorSubject[]
  studentNeeds   StudentSubject[]
  classBookings  ClassBooking[]
  demoRequestSubjects DemoRequestSubject[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([name])
}

model GradeLevel {
  id        String   @id @default(uuid())
  name      String   @unique   // e.g., "Grade 1", "Grade 2", ..., "Grade 12"
  sortOrder Int      @unique   // For ordering: 1, 2, 3, ..., 12
  tierId    String             // Links to GradeTier for pricing

  tier      GradeTier @relation(fields: [tierId], references: [id])
  courses   Course[]
  students  Student[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([sortOrder])
  @@index([tierId])
}

model GradeTier {
  id              String   @id @default(uuid())
  name            String   @unique  // e.g., "Tier 1 (Grade 1-6)", "Tier 2 (Grade 7+)"
  creditsPerClass Int               // e.g., 2 for Tier 1, 3 for Tier 2
  minGrade        Int               // e.g., 1
  maxGrade        Int               // e.g., 6

  gradeLevels     GradeLevel[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Course {
  id          String   @id @default(uuid())
  subjectId   String
  gradeId     String
  name        String            // e.g., "Mathematics — Grade 10"
  description String?
  isActive    Boolean  @default(true)

  subject     Subject    @relation(fields: [subjectId], references: [id])
  grade       GradeLevel @relation(fields: [gradeId], references: [id])
  tutors      TutorCourse[]
  materials   CourseMaterial[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@unique([subjectId, gradeId])  // One course per subject-grade combination
  @@index([subjectId])
  @@index([gradeId])
  @@index([isActive])
}

model TutorCourse {
  id       String @id @default(uuid())
  tutorId  String
  courseId  String

  tutor    TutorProfile @relation(fields: [tutorId], references: [id])
  course   Course       @relation(fields: [courseId], references: [id])

  createdAt DateTime @default(now())

  @@unique([tutorId, courseId])
}

model CourseMaterial {
  id          String  @id @default(uuid())
  courseId     String
  title       String
  fileUrl     String   // S3 path
  fileType    String   // pdf, docx, etc.
  fileSizeKb  Int?

  course      Course  @relation(fields: [courseId], references: [id])

  createdAt   DateTime @default(now())

  @@index([courseId])
}
```

### 4.6 Availability & Scheduling (M5)

```prisma
model AvailabilityTemplate {
  id        String @id @default(uuid())
  tutorId   String
  dayOfWeek Int    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime String // "09:00" (HH:mm in UTC)
  endTime   String // "12:00" (HH:mm in UTC)

  tutor     TutorProfile @relation(fields: [tutorId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tutorId])
  @@index([dayOfWeek])
}

model AvailabilitySlot {
  id        String   @id @default(uuid())
  tutorId   String
  date      DateTime // Specific date (date only, no time)
  startTime DateTime // Full datetime with timezone (stored in UTC)
  endTime   DateTime
  isBooked  Boolean  @default(false)

  // Linked booking (only one — either demo or class)
  demoBooking  DemoBooking?
  classBooking ClassBooking?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tutorId, date])
  @@index([tutorId, isBooked])
  @@index([startTime])
}

model BlockedDate {
  id      String   @id @default(uuid())
  tutorId String
  date    DateTime // The blocked date
  reason  String?  // Optional: "Holiday", "Leave", etc.

  tutor   TutorProfile @relation(fields: [tutorId], references: [id])

  createdAt DateTime @default(now())

  @@unique([tutorId, date])
  @@index([tutorId])
}
```

### 4.7 Demo Class Booking (M6)

```prisma
model DemoBooking {
  id            String            @id @default(uuid())
  studentId     String
  tutorId       String
  consultantId  String?           // Consultant who handled the request
  subjectId     String
  slotId        String?           @unique
  status        DemoBookingStatus @default(PENDING)
  parentNotes   String?           // Parent's notes/preferences
  consultantNotes String?         // Consultant's internal notes

  student       Student            @relation(fields: [studentId], references: [id])
  tutor         TutorProfile       @relation(fields: [tutorId], references: [id])
  consultant    ConsultantProfile? @relation(fields: [consultantId], references: [id])
  slot          AvailabilitySlot?  @relation(fields: [slotId], references: [id])

  meeting       Meeting?           // Generated on confirmation

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([studentId])
  @@index([tutorId])
  @@index([consultantId])
  @@index([status])
}
```

### 4.8 Class Booking — Credit-Based (M7)

```prisma
model ClassBooking {
  id              String             @id @default(uuid())
  studentId       String
  tutorId         String
  consultantId    String?            // Mandatory consultant verification (D2)
  subjectId       String
  slotId          String?            @unique
  status          ClassBookingStatus @default(PENDING_VERIFICATION)
  creditsCharged  Int                // Credits deducted (based on grade tier)
  parentNotes     String?
  consultantNotes String?
  cancelledAt     DateTime?
  cancelReason    String?

  student         Student            @relation(fields: [studentId], references: [id])
  tutor           TutorProfile       @relation(fields: [tutorId], references: [id])
  consultant      ConsultantProfile? @relation(fields: [consultantId], references: [id])
  subject         Subject            @relation(fields: [subjectId], references: [id])
  slot            AvailabilitySlot?  @relation(fields: [slotId], references: [id])

  meeting         Meeting?           // Generated on confirmation
  creditTransaction CreditTransaction? // Deduction record
  earning         TutorEarning?      // Created on completion
  review          Review?            // Post-class review

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([studentId])
  @@index([tutorId])
  @@index([consultantId])
  @@index([status])
  @@index([createdAt])
}
```

### 4.9 Credit Wallet System (M8)

```prisma
model Wallet {
  id       String @id @default(uuid())
  parentId String @unique

  parent   ParentProfile @relation(fields: [parentId], references: [id])
  transactions CreditTransaction[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // NOTE: Balance is COMPUTED from transactions, not stored here.
  // To get balance: SUM(amount) WHERE type=PURCHASE - SUM(amount) WHERE type=DEDUCTION
}

model CreditTransaction {
  id          String                @id @default(uuid())
  walletId    String
  type        CreditTransactionType
  amount      Int                   // Number of credits (positive always)
  description String?               // e.g., "Purchased 10 credits", "Class booking #xyz"

  // Links to related entities
  bookingId   String?               @unique  // If type = DEDUCTION → which booking used these credits
  paymentId   String?               // If type = PURCHASE → which payment funded these credits

  wallet      Wallet         @relation(fields: [walletId], references: [id])
  booking     ClassBooking?  @relation(fields: [bookingId], references: [id])
  payment     PaymentTransaction? @relation(fields: [paymentId], references: [id])

  createdAt   DateTime @default(now())

  // Transactions are IMMUTABLE — no updatedAt, no deletedAt

  @@index([walletId])
  @@index([type])
  @@index([createdAt])
}

model CreditPackage {
  id          String  @id @default(uuid())
  name        String          // e.g., "Starter Pack", "Value Pack"
  credits     Int             // e.g., 10, 25, 50
  priceInFils Int             // e.g., 5000 = 50 AED
  isActive    Boolean @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([isActive])
  @@index([priceInFils])      // Packages sorted by price ascending
}
```

### 4.10 Payment Processing (M9)

```prisma
model PaymentTransaction {
  id                String        @id @default(uuid())
  parentId          String        // Which parent paid
  amountInFils      Int           // Amount paid in fils (e.g., 5000 = 50 AED)
  currency          String        @default("AED")
  status            PaymentStatus @default(PENDING)
  stripePaymentIntentId String?   @unique  // Stripe reference for reconciliation
  stripeSessionId   String?       @unique
  creditsPurchased  Int           // How many credits this payment is for
  packageId         String?       // Which credit package was purchased

  // Credit transactions funded by this payment
  creditTransactions CreditTransaction[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([parentId])
  @@index([status])
  @@index([stripePaymentIntentId])
  @@index([createdAt])
}
```

### 4.11 Video Meeting Integration (M10)

```prisma
model Meeting {
  id              String        @id @default(uuid())
  tutorId         String
  zoomMeetingId   String?       @unique  // Zoom's meeting ID
  hostJoinUrl     String?       // Tutor's join link
  participantJoinUrl String?    // Parent/student's join link
  meetingPassword String?
  status          MeetingStatus @default(SCHEDULED)
  scheduledStart  DateTime
  scheduledEnd    DateTime
  actualDuration  Int?          // Duration in minutes (from Zoom after meeting ends)

  tutor           TutorProfile  @relation(fields: [tutorId], references: [id])

  // Linked to either a demo or a class booking (not both)
  demoBookingId   String?       @unique
  classBookingId  String?       @unique
  demoBooking     DemoBooking?  @relation(fields: [demoBookingId], references: [id])
  classBooking    ClassBooking? @relation(fields: [classBookingId], references: [id])

  recordings      MeetingRecording[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([tutorId])
  @@index([scheduledStart])
  @@index([status])
}

model MeetingRecording {
  id          String  @id @default(uuid())
  meetingId   String
  recordingUrl String  // Zoom cloud recording URL
  duration    Int?     // Duration in minutes
  fileSize    Int?     // Size in KB

  meeting     Meeting @relation(fields: [meetingId], references: [id])

  createdAt   DateTime @default(now())

  @@index([meetingId])
}
```

### 4.12 Assessment & Evaluation (M11)

```prisma
model Assessment {
  id          String  @id @default(uuid())
  studentId   String
  tutorId     String
  bookingId   String? // Linked to a specific class session (optional)
  subjectId   String
  title       String
  score       Float?  // e.g., 85.5 out of 100
  maxScore    Float?  @default(100)
  remarks     String? // Tutor's text feedback
  feedback    String? // Detailed evaluation notes

  student     Student      @relation(fields: [studentId], references: [id])
  tutor       TutorProfile @relation(fields: [tutorId], references: [id])

  documents   AssessmentDocument[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([studentId])
  @@index([tutorId])
  @@index([subjectId])
  @@index([createdAt])
}

model AssessmentDocument {
  id           String @id @default(uuid())
  assessmentId String
  title        String
  fileUrl      String  // S3 path
  fileType     String  // pdf, jpg, png, etc.
  fileSizeKb   Int?

  assessment   Assessment @relation(fields: [assessmentId], references: [id])

  createdAt    DateTime @default(now())

  @@index([assessmentId])
}
```

### 4.13 Notification System (M12)

```prisma
model NotificationTemplate {
  id        String @id @default(uuid())
  eventName String @unique   // e.g., "DEMO_CONFIRMED", "CLASS_REMINDER_24H"
  subject   String           // Email subject line
  bodyHtml  String           // HTML email template with {{variables}}
  channel   NotificationChannel @default(EMAIL)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model NotificationLog {
  id          String             @id @default(uuid())
  recipientId String             // User ID who received the notification
  eventName   String             // Which event triggered this
  channel     NotificationChannel
  recipient   String             // Email address or phone (for audit)
  subject     String
  status      NotificationStatus
  errorMsg    String?            // If failed, why

  createdAt   DateTime @default(now())

  @@index([recipientId])
  @@index([eventName])
  @@index([createdAt])
}
```

### 4.14 CMS (M13)

```prisma
model CMSPage {
  id              String        @id @default(uuid())
  title           String
  slug            String        @unique  // URL-friendly: "about-us", "privacy-policy"
  content         String        // Rich text HTML content
  metaTitle       String?       // SEO
  metaDescription String?       // SEO
  status          CMSPageStatus @default(DRAFT)
  sortOrder       Int           @default(0)
  publishedAt     DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([slug])
  @@index([status])
}

model ContactSubmission {
  id        String  @id @default(uuid())
  name      String
  email     String
  phone     String?
  subject   String?
  message   String
  isRead    Boolean @default(false)

  createdAt DateTime @default(now())

  @@index([isRead])
  @@index([createdAt])
}
```

### 4.15 Rating & Review (M15)

```prisma
model Review {
  id        String @id @default(uuid())
  bookingId String @unique  // One review per completed ClassBooking
  tutorId   String
  parentId  String          // Which parent submitted the review
  rating    Int             // 1-5 stars
  comment   String?         // Optional text review
  isVisible Boolean @default(true)  // Admin can hide inappropriate reviews

  booking   ClassBooking @relation(fields: [bookingId], references: [id])
  tutor     TutorProfile @relation(fields: [tutorId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tutorId])
  @@index([parentId])
  @@index([rating])
  @@index([createdAt])
}
```

### 4.16 Tutor Earnings (M16)

```prisma
model TutorEarning {
  id          String        @id @default(uuid())
  tutorId     String
  bookingId   String        @unique  // One earning per completed class
  amountInFils Int                   // Tutor's earning in fils (from tutor_rate)
  status      EarningStatus @default(UNPAID)
  paidAt      DateTime?             // When admin marked as paid

  tutor       TutorProfile @relation(fields: [tutorId], references: [id])
  booking     ClassBooking @relation(fields: [bookingId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([tutorId])
  @@index([status])
  @@index([createdAt])
}

model PayoutRecord {
  id            String   @id @default(uuid())
  tutorId       String
  totalAmountInFils Int  // Total payout amount
  earningIds    String[] // Array of TutorEarning IDs included in this payout
  notes         String?  // Admin notes
  paidVia       String?  // "Bank Transfer", "Cash", etc.
  referenceNo   String?  // Bank transfer reference

  createdAt     DateTime @default(now())

  @@index([tutorId])
  @@index([createdAt])
}
```

---

## 5. Key Relationship Summary

| Relationship | Type | Description |
|-------------|------|-------------|
| User → ParentProfile | 1:1 | One user with role PARENT has one parent profile |
| User → TutorProfile | 1:1 | One user with role TUTOR has one tutor profile |
| User → ConsultantProfile | 1:1 | One user with role CONSULTANT has one consultant profile |
| User → AdminPermission | 1:N | Admin/Super Admin users have multiple permissions |
| ParentProfile → Student | 1:N | One parent has many children |
| ParentProfile → Wallet | 1:1 | One parent has one credit wallet |
| Student → GradeLevel | N:1 | Each student is in one grade |
| TutorProfile → TutorSubject | 1:N | One tutor teaches many subjects (with per-subject rate) |
| TutorProfile → TutorCourse | N:M | Tutors assigned to courses |
| Subject + GradeLevel → Course | Composite | Course = Subject + GradeLevel |
| GradeLevel → GradeTier | N:1 | Multiple grades map to one pricing tier |
| Wallet → CreditTransaction | 1:N | Immutable ledger of all credit operations |
| ClassBooking → Meeting | 1:1 | Each confirmed booking has one Zoom meeting |
| ClassBooking → Review | 1:1 | Each completed booking has one optional review |
| ClassBooking → TutorEarning | 1:1 | Each completed booking generates one earning record |
| ClassBooking → CreditTransaction | 1:1 | Each booking has one deduction transaction |
| ParentProfile → DemoRequest | 1:N | One parent can submit many demo requests |
| DemoRequest → Board | N:1 | Each demo request references one board |
| DemoRequest → GradeLevel | N:1 | Each demo request references one grade |
| DemoRequest → ConsultantProfile | N:1 | Consultant self-assigns to a demo request |
| DemoRequest → DemoRequestSubject | 1:N | Each demo request can have multiple subjects |

---

## 6. Wallet Balance Calculation

The wallet does NOT store a mutable balance field. Balance is always computed:

```sql
-- Get parent's credit balance
SELECT
  COALESCE(SUM(CASE WHEN type = 'PURCHASE' THEN amount ELSE 0 END), 0) -
  COALESCE(SUM(CASE WHEN type = 'DEDUCTION' THEN amount ELSE 0 END), 0) AS balance
FROM credit_transactions
WHERE wallet_id = '<wallet-id>';
```

**Why:** Mutable balance fields can drift due to race conditions. A computed balance from an immutable ledger is always accurate and fully auditable.

**Performance:** This query is fast with the `walletId` index. No external caching needed — PostgreSQL handles this at our scale.

---

## 7. Grade-Tier Pricing Flow

```
Admin setup:
  GradeTier "Tier 1" → creditsPerClass: 2, minGrade: 1, maxGrade: 6
  GradeTier "Tier 2" → creditsPerClass: 3, minGrade: 7, maxGrade: 12

  GradeLevel "Grade 3" → tierId: Tier 1
  GradeLevel "Grade 9" → tierId: Tier 2

Booking flow:
  1. Parent books class for child in Grade 9
  2. System looks up: Grade 9 → Tier 2 → creditsPerClass = 3
  3. System checks wallet: parent has 5 credits → sufficient
  4. Consultant confirms → 3 credits deducted
  5. CreditTransaction created: type=DEDUCTION, amount=3
```

---

## 8. Seed Data

The following data must be seeded on first deployment:

```typescript
// prisma/seed.ts

// 1. Super Admin user
{
  email: "admin@induae.com",
  role: "SUPER_ADMIN",
  password: "<hashed-initial-password>"
}

// 2. Subjects
["Mathematics", "Physics", "Chemistry", "Biology", "English",
 "Arabic", "Computer Science", "Economics", "Business Studies"]

// 3. Grade Levels (1-12)
Grade 1 through Grade 12, each linked to appropriate tier

// 4. Grade Tiers
{ name: "Tier 1 (Grade 1-6)", creditsPerClass: 2, minGrade: 1, maxGrade: 6 }
{ name: "Tier 2 (Grade 7-12)", creditsPerClass: 3, minGrade: 7, maxGrade: 12 }

// 5. Boards
["CBSE", "ICSE", "IB", "British", "American", "UAE MOE"]

// 6. Default CMS Pages (draft)
["About Us", "How It Works", "FAQ", "Contact Us",
 "Privacy Policy", "Terms & Conditions"]

// 7. Notification Templates
["DEMO_REQUESTED", "DEMO_CONFIRMED", "CLASS_BOOKED",
 "CLASS_CONFIRMED", "PAYMENT_SUCCESS", "CLASS_REMINDER_24H",
 "CLASS_REMINDER_1H", "ASSESSMENT_UPLOADED", "REVIEW_RECEIVED"]
```

---

## 9. Index Strategy

All indexes are defined inline in the schema above. Summary of critical indexes:

| Table | Indexed Columns | Why |
|-------|----------------|-----|
| User | email, role, isActive | Login lookup, role-based queries |
| AvailabilitySlot | tutorId+date, tutorId+isBooked, startTime | Availability search during booking |
| ClassBooking | studentId, tutorId, consultantId, status, createdAt | Dashboard queries for all roles |
| CreditTransaction | walletId, type, createdAt | Balance computation, transaction history |
| PaymentTransaction | parentId, status, stripePaymentIntentId | Payment lookup, reconciliation |
| Review | tutorId, rating | Aggregate rating calculation |
| TutorEarning | tutorId, status | Unpaid earnings queries |
| DemoRequest | parentId, status, consultantId, createdAt | Parent listing, consultant queue, admin filtering |
| Board | name, isActive | Board lookup, active board listing |
| CMSPage | slug, status | Page lookup by URL |

---

> **Next step:** [api-spec.md](api-spec.md) — Full API endpoint specification for all 16 modules.
