import { ClassBookingStatus, CreditTransactionType, Role } from '@prisma/client';
import prisma from '../../config/database';
import { ApiError } from '../../shared/utils/apiError';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import {
  CreateClassBookingDTO,
  UpdateClassBookingDTO,
  CancelClassBookingDTO,
  ClassBookingQueryDTO,
} from './class-booking.types';

// Valid state transitions
const VALID_TRANSITIONS: Record<ClassBookingStatus, ClassBookingStatus[]> = {
  PENDING_VERIFICATION: [ClassBookingStatus.CONFIRMED, ClassBookingStatus.CANCELLED],
  CONFIRMED: [ClassBookingStatus.IN_PROGRESS, ClassBookingStatus.CANCELLED, ClassBookingStatus.NO_SHOW],
  IN_PROGRESS: [ClassBookingStatus.COMPLETED, ClassBookingStatus.CANCELLED],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

const classBookingInclude = {
  student: { select: { id: true, firstName: true, lastName: true, gradeId: true } },
  tutor: { select: { id: true, firstName: true, lastName: true } },
  consultant: { select: { id: true, firstName: true, lastName: true } },
  subject: { select: { id: true, name: true } },
  creditTransaction: { select: { id: true, amount: true, type: true, createdAt: true } },
};

function formatClassBooking(db: Record<string, unknown>) {
  const raw = db as {
    id: string;
    status: ClassBookingStatus;
    creditsCharged: number;
    scheduledDate: Date;
    scheduledStart: string;
    scheduledEnd: string;
    meetingLink: string | null;
    meetingPassword: string | null;
    parentNotes: string | null;
    consultantNotes: string | null;
    cancelledAt: Date | null;
    cancelReason: string | null;
    createdAt: Date;
    updatedAt: Date;
    student: { id: string; firstName: string; lastName: string; gradeId: string };
    tutor: { id: string; firstName: string; lastName: string };
    consultant: { id: string; firstName: string; lastName: string };
    subject: { id: string; name: string };
    creditTransaction: { id: string; amount: number; type: string; createdAt: Date } | null;
  };

  return {
    id: raw.id,
    status: raw.status,
    creditsCharged: raw.creditsCharged,
    scheduledDate: raw.scheduledDate,
    scheduledStart: raw.scheduledStart,
    scheduledEnd: raw.scheduledEnd,
    meetingLink: raw.meetingLink,
    meetingPassword: raw.meetingPassword,
    parentNotes: raw.parentNotes,
    consultantNotes: raw.consultantNotes,
    cancelledAt: raw.cancelledAt,
    cancelReason: raw.cancelReason,
    student: raw.student,
    tutor: raw.tutor,
    consultant: raw.consultant,
    subject: raw.subject,
    creditTransaction: raw.creditTransaction,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

/** Compute parent wallet balance (same logic as WalletService) */
async function computeBalance(parentId: string): Promise<number> {
  const transactions = await prisma.creditTransaction.findMany({
    where: { parentId },
    select: { type: true, amount: true },
  });

  let balance = 0;
  for (const tx of transactions) {
    if (tx.type === CreditTransactionType.DEDUCTION) {
      balance -= tx.amount;
    } else {
      balance += tx.amount;
    }
  }
  return balance;
}

export class ClassBookingService {
  // ==========================================
  // CONSULTANT: Create class booking
  // ==========================================
  async create(userId: string, data: CreateClassBookingDTO) {
    const consultantProfile = await prisma.consultantProfile.findUnique({ where: { userId } });
    if (!consultantProfile) throw ApiError.notFound('Consultant profile not found');

    // Validate tutor exists and is active
    const tutor = await prisma.tutorProfile.findUnique({ where: { id: data.tutorId } });
    if (!tutor || !tutor.isActive) throw ApiError.badRequest('INVALID_TUTOR', 'Tutor not found or inactive');

    // Validate subject exists
    const subject = await prisma.subject.findUnique({ where: { id: data.subjectId } });
    if (!subject || !subject.isActive) throw ApiError.badRequest('INVALID_SUBJECT', 'Subject not found or inactive');

    // Validate student exists and get grade tier for credit cost
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
      include: { grade: { include: { gradeTier: true } } },
    });
    if (!student) throw ApiError.badRequest('INVALID_STUDENT', 'Student not found');
    if (!student.grade?.gradeTier) {
      throw ApiError.badRequest('NO_GRADE_TIER', 'Student grade does not have a credit tier configured');
    }

    const creditsPerClass = student.grade.gradeTier.creditsPerClass;

    const booking = await prisma.classBooking.create({
      data: {
        studentId: data.studentId,
        tutorId: data.tutorId,
        consultantId: consultantProfile.id,
        subjectId: data.subjectId,
        creditsCharged: creditsPerClass,
        scheduledDate: new Date(data.scheduledDate),
        scheduledStart: data.scheduledStart,
        scheduledEnd: data.scheduledEnd,
        meetingLink: data.meetingLink,
        meetingPassword: data.meetingPassword,
        parentNotes: data.parentNotes,
        consultantNotes: data.consultantNotes,
      },
      include: classBookingInclude,
    });

    return formatClassBooking(booking as unknown as Record<string, unknown>);
  }

  // ==========================================
  // CONSULTANT: Confirm booking (deduct credits)
  // ==========================================
  async confirm(userId: string, bookingId: string) {
    const cp = await prisma.consultantProfile.findUnique({ where: { userId } });
    if (!cp) throw ApiError.notFound('Consultant profile not found');

    const booking = await prisma.classBooking.findUnique({
      where: { id: bookingId },
      include: { student: { include: { parent: true } }, subject: true },
    });
    if (!booking) throw ApiError.notFound('Class booking not found');
    if (booking.consultantId !== cp.id) throw ApiError.forbidden('Not your booking');

    if (booking.status !== ClassBookingStatus.PENDING_VERIFICATION) {
      throw ApiError.badRequest('INVALID_TRANSITION', `Cannot confirm a booking in ${booking.status} status`);
    }

    // Get parent for credit deduction
    const parentProfile = booking.student.parent;
    if (!parentProfile) throw ApiError.badRequest('NO_PARENT', 'Student does not have a parent profile');

    // Check balance
    const balance = await computeBalance(parentProfile.id);
    if (balance < booking.creditsCharged) {
      throw ApiError.badRequest(
        'INSUFFICIENT_CREDITS',
        `Insufficient credits. Required: ${booking.creditsCharged}, Available: ${balance}`
      );
    }

    // Deduct credits and confirm in a transaction
    const confirmed = await prisma.$transaction(async (tx) => {
      await tx.creditTransaction.create({
        data: {
          parentId: parentProfile.id,
          type: CreditTransactionType.DEDUCTION,
          amount: booking.creditsCharged,
          description: `Class booking — ${booking.subject.name}`,
          classBookingId: booking.id,
        },
      });

      return tx.classBooking.update({
        where: { id: bookingId },
        data: { status: ClassBookingStatus.CONFIRMED },
        include: classBookingInclude,
      });
    });

    return formatClassBooking(confirmed as unknown as Record<string, unknown>);
  }

  // ==========================================
  // CONSULTANT: List own bookings
  // ==========================================
  async listForConsultant(userId: string, query: ClassBookingQueryDTO) {
    const cp = await prisma.consultantProfile.findUnique({ where: { userId } });
    if (!cp) throw ApiError.notFound('Consultant profile not found');

    const { page, limit, skip } = parsePagination(query.page, query.limit);
    const where: Record<string, unknown> = { consultantId: cp.id };
    if (query.status) where.status = query.status;

    const [bookings, total] = await Promise.all([
      prisma.classBooking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledDate: 'desc' },
        include: classBookingInclude,
      }),
      prisma.classBooking.count({ where }),
    ]);

    return {
      data: bookings.map((b) => formatClassBooking(b as unknown as Record<string, unknown>)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  // ==========================================
  // TUTOR: List assigned bookings
  // ==========================================
  async listForTutor(userId: string, query: ClassBookingQueryDTO) {
    const tp = await prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tp) throw ApiError.notFound('Tutor profile not found');

    const { page, limit, skip } = parsePagination(query.page, query.limit);
    const where: Record<string, unknown> = { tutorId: tp.id };
    if (query.status) where.status = query.status;

    const [bookings, total] = await Promise.all([
      prisma.classBooking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledDate: 'desc' },
        include: classBookingInclude,
      }),
      prisma.classBooking.count({ where }),
    ]);

    return {
      data: bookings.map((b) => formatClassBooking(b as unknown as Record<string, unknown>)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  // ==========================================
  // PARENT: List bookings for own children
  // ==========================================
  async listForParent(userId: string, query: ClassBookingQueryDTO) {
    const pp = await prisma.parentProfile.findUnique({
      where: { userId },
      include: { children: { select: { id: true } } },
    });
    if (!pp) throw ApiError.notFound('Parent profile not found');

    const childIds = pp.children.map((c) => c.id);
    const { page, limit, skip } = parsePagination(query.page, query.limit);

    const where: Record<string, unknown> = { studentId: { in: childIds } };
    if (query.status) where.status = query.status;

    const [bookings, total] = await Promise.all([
      prisma.classBooking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledDate: 'desc' },
        include: classBookingInclude,
      }),
      prisma.classBooking.count({ where }),
    ]);

    return {
      data: bookings.map((b) => formatClassBooking(b as unknown as Record<string, unknown>)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  // ==========================================
  // Get single booking (access-controlled)
  // ==========================================
  async getById(userId: string, userRole: Role, bookingId: string) {
    const booking = await prisma.classBooking.findUnique({
      where: { id: bookingId },
      include: classBookingInclude,
    });
    if (!booking) throw ApiError.notFound('Class booking not found');

    if (userRole === Role.CONSULTANT) {
      const cp = await prisma.consultantProfile.findUnique({ where: { userId } });
      if (!cp || booking.consultantId !== cp.id) throw ApiError.forbidden('Not your booking');
    } else if (userRole === Role.TUTOR) {
      const tp = await prisma.tutorProfile.findUnique({ where: { userId } });
      if (!tp || booking.tutorId !== tp.id) throw ApiError.forbidden('Not your booking');
    } else if (userRole === Role.PARENT) {
      const pp = await prisma.parentProfile.findUnique({
        where: { userId },
        include: { children: { select: { id: true } } },
      });
      if (!pp) throw ApiError.forbidden('Not authorized');
      const childIds = pp.children.map((c) => c.id);
      if (!childIds.includes(booking.studentId)) throw ApiError.forbidden('Not your booking');
    }

    return formatClassBooking(booking as unknown as Record<string, unknown>);
  }

  // ==========================================
  // CONSULTANT: Update booking details
  // ==========================================
  async update(userId: string, bookingId: string, data: UpdateClassBookingDTO) {
    const cp = await prisma.consultantProfile.findUnique({ where: { userId } });
    if (!cp) throw ApiError.notFound('Consultant profile not found');

    const booking = await prisma.classBooking.findUnique({ where: { id: bookingId } });
    if (!booking) throw ApiError.notFound('Class booking not found');
    if (booking.consultantId !== cp.id) throw ApiError.forbidden('Not your booking');

    const updateData: Record<string, unknown> = {};
    if (data.scheduledDate) updateData.scheduledDate = new Date(data.scheduledDate);
    if (data.scheduledStart) updateData.scheduledStart = data.scheduledStart;
    if (data.scheduledEnd) updateData.scheduledEnd = data.scheduledEnd;
    if (data.meetingLink !== undefined) updateData.meetingLink = data.meetingLink;
    if (data.meetingPassword !== undefined) updateData.meetingPassword = data.meetingPassword;
    if (data.consultantNotes !== undefined) updateData.consultantNotes = data.consultantNotes;

    const updated = await prisma.classBooking.update({
      where: { id: bookingId },
      data: updateData,
      include: classBookingInclude,
    });

    return formatClassBooking(updated as unknown as Record<string, unknown>);
  }

  // ==========================================
  // CONSULTANT/ADMIN: Update status
  // ==========================================
  async updateStatus(userId: string, userRole: Role, bookingId: string, newStatus: ClassBookingStatus) {
    const booking = await prisma.classBooking.findUnique({ where: { id: bookingId } });
    if (!booking) throw ApiError.notFound('Class booking not found');

    const allowed = VALID_TRANSITIONS[booking.status];
    if (!allowed.includes(newStatus)) {
      throw ApiError.badRequest('INVALID_TRANSITION', `Cannot transition from ${booking.status} to ${newStatus}`);
    }

    // Use confirm() for PENDING_VERIFICATION → CONFIRMED (credit deduction)
    if (booking.status === ClassBookingStatus.PENDING_VERIFICATION && newStatus === ClassBookingStatus.CONFIRMED) {
      return this.confirm(userId, bookingId);
    }

    if (userRole === Role.CONSULTANT) {
      const cp = await prisma.consultantProfile.findUnique({ where: { userId } });
      if (!cp || booking.consultantId !== cp.id) throw ApiError.forbidden('Not your booking');
    }

    const updated = await prisma.classBooking.update({
      where: { id: bookingId },
      data: { status: newStatus },
      include: classBookingInclude,
    });

    return formatClassBooking(updated as unknown as Record<string, unknown>);
  }

  // ==========================================
  // CONSULTANT/ADMIN/PARENT: Cancel booking
  // ==========================================
  async cancel(userId: string, userRole: Role, bookingId: string, data: CancelClassBookingDTO) {
    const booking = await prisma.classBooking.findUnique({ where: { id: bookingId } });
    if (!booking) throw ApiError.notFound('Class booking not found');

    // Can only cancel non-terminal statuses
    if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(booking.status)) {
      throw ApiError.badRequest('INVALID_TRANSITION', `Cannot cancel a ${booking.status} booking`);
    }

    // Access control
    if (userRole === Role.CONSULTANT) {
      const cp = await prisma.consultantProfile.findUnique({ where: { userId } });
      if (!cp || booking.consultantId !== cp.id) throw ApiError.forbidden('Not your booking');
    } else if (userRole === Role.PARENT) {
      const pp = await prisma.parentProfile.findUnique({
        where: { userId },
        include: { children: { select: { id: true } } },
      });
      if (!pp) throw ApiError.forbidden('Not authorized');
      if (!pp.children.map((c) => c.id).includes(booking.studentId)) {
        throw ApiError.forbidden('Not your booking');
      }
    }

    // No refunds on cancellation (D3)
    const updated = await prisma.classBooking.update({
      where: { id: bookingId },
      data: {
        status: ClassBookingStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: data.reason,
      },
      include: classBookingInclude,
    });

    return formatClassBooking(updated as unknown as Record<string, unknown>);
  }

  // ==========================================
  // ADMIN: List all bookings
  // ==========================================
  async listAll(query: ClassBookingQueryDTO) {
    const { page, limit, skip } = parsePagination(query.page, query.limit);

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const [bookings, total] = await Promise.all([
      prisma.classBooking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledDate: 'desc' },
        include: classBookingInclude,
      }),
      prisma.classBooking.count({ where }),
    ]);

    return {
      data: bookings.map((b) => formatClassBooking(b as unknown as Record<string, unknown>)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }
}
