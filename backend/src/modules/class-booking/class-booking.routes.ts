import { Router } from 'express';
import { ClassBookingController } from './class-booking.controller';
import { authenticate } from '../../shared/middlewares/authenticate';
import { requireRole } from '../../shared/middlewares/authorize';
import { validate } from '../../shared/middlewares/validate';
import { Role } from '@prisma/client';
import {
  createClassBookingSchema,
  updateClassBookingSchema,
  updateClassBookingStatusSchema,
  cancelClassBookingSchema,
  classBookingIdParam,
  classBookingQuerySchema,
} from './class-booking.validators';

const router = Router();
const controller = new ClassBookingController();

// ==========================================
// CONSULTANT ROUTES
// ==========================================

// POST /class-bookings — Create booking (PENDING_VERIFICATION)
router.post(
  '/class-bookings',
  authenticate,
  requireRole(Role.CONSULTANT),
  validate({ body: createClassBookingSchema }),
  controller.create
);

// PATCH /class-bookings/:id/confirm — Confirm & deduct credits
router.patch(
  '/class-bookings/:id/confirm',
  authenticate,
  requireRole(Role.CONSULTANT),
  validate({ params: classBookingIdParam }),
  controller.confirm
);

// GET /class-bookings/consultant — List own bookings
router.get(
  '/class-bookings/consultant',
  authenticate,
  requireRole(Role.CONSULTANT),
  validate({ query: classBookingQuerySchema }),
  controller.listForConsultant
);

// PATCH /class-bookings/:id — Update booking details
router.patch(
  '/class-bookings/:id',
  authenticate,
  requireRole(Role.CONSULTANT),
  validate({ params: classBookingIdParam, body: updateClassBookingSchema }),
  controller.update
);

// PATCH /class-bookings/:id/status — Update status
router.patch(
  '/class-bookings/:id/status',
  authenticate,
  requireRole(Role.CONSULTANT, Role.ADMIN, Role.SUPER_ADMIN),
  validate({ params: classBookingIdParam, body: updateClassBookingStatusSchema }),
  controller.updateStatus
);

// ==========================================
// TUTOR ROUTE
// ==========================================

router.get(
  '/class-bookings/tutor',
  authenticate,
  requireRole(Role.TUTOR),
  validate({ query: classBookingQuerySchema }),
  controller.listForTutor
);

// ==========================================
// PARENT ROUTES
// ==========================================

router.get(
  '/class-bookings/my',
  authenticate,
  requireRole(Role.PARENT),
  validate({ query: classBookingQuerySchema }),
  controller.listForParent
);

// PATCH /class-bookings/:id/cancel — Cancel booking
router.patch(
  '/class-bookings/:id/cancel',
  authenticate,
  requireRole(Role.CONSULTANT, Role.ADMIN, Role.SUPER_ADMIN, Role.PARENT),
  validate({ params: classBookingIdParam, body: cancelClassBookingSchema }),
  controller.cancel
);

// ==========================================
// ADMIN ROUTE
// ==========================================

router.get(
  '/class-bookings/admin',
  authenticate,
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),
  validate({ query: classBookingQuerySchema }),
  controller.listAll
);

// ==========================================
// SHARED (must be last — :id param)
// ==========================================

router.get(
  '/class-bookings/:id',
  authenticate,
  validate({ params: classBookingIdParam }),
  controller.getById
);

export default router;
