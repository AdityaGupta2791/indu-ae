import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createClassBookingSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  tutorId: z.string().uuid('Invalid tutor ID'),
  subjectId: z.string().uuid('Invalid subject ID'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  scheduledStart: z.string().regex(timeRegex, 'Start time must be HH:mm format'),
  scheduledEnd: z.string().regex(timeRegex, 'End time must be HH:mm format'),
  meetingLink: z.string().url('Invalid meeting URL').optional(),
  meetingPassword: z.string().optional(),
  parentNotes: z.string().optional(),
  consultantNotes: z.string().optional(),
});

export const updateClassBookingSchema = z.object({
  scheduledDate: z.string().optional(),
  scheduledStart: z.string().regex(timeRegex, 'Start time must be HH:mm format').optional(),
  scheduledEnd: z.string().regex(timeRegex, 'End time must be HH:mm format').optional(),
  meetingLink: z.string().url('Invalid meeting URL').optional().nullable(),
  meetingPassword: z.string().optional().nullable(),
  consultantNotes: z.string().optional(),
});

export const updateClassBookingStatusSchema = z.object({
  status: z.enum(['PENDING_VERIFICATION', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
});

export const cancelClassBookingSchema = z.object({
  reason: z.string().optional(),
});

export const classBookingIdParam = z.object({
  id: z.string().uuid('Invalid class booking ID'),
});

export const classBookingQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(['PENDING_VERIFICATION', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
});
