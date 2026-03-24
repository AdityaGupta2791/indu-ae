import { ClassBookingStatus } from '@prisma/client';

export interface CreateClassBookingDTO {
  studentId: string;
  tutorId: string;
  subjectId: string;
  scheduledDate: string; // ISO date
  scheduledStart: string; // "HH:mm"
  scheduledEnd: string; // "HH:mm"
  meetingLink?: string;
  meetingPassword?: string;
  parentNotes?: string;
  consultantNotes?: string;
}

export interface UpdateClassBookingDTO {
  scheduledDate?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  meetingLink?: string;
  meetingPassword?: string;
  consultantNotes?: string;
}

export interface UpdateClassBookingStatusDTO {
  status: ClassBookingStatus;
}

export interface CancelClassBookingDTO {
  reason?: string;
}

export interface ClassBookingQueryDTO {
  page?: string;
  limit?: string;
  status?: ClassBookingStatus;
}
