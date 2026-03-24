import api from './api';

export interface ClassBooking {
  id: string;
  status: 'PENDING_VERIFICATION' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  creditsCharged: number;
  scheduledDate: string;
  scheduledStart: string;
  scheduledEnd: string;
  meetingLink: string | null;
  meetingPassword: string | null;
  parentNotes: string | null;
  consultantNotes: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  student: { id: string; firstName: string; lastName: string; gradeId: string };
  tutor: { id: string; firstName: string; lastName: string };
  consultant: { id: string; firstName: string; lastName: string };
  subject: { id: string; name: string };
  creditTransaction: { id: string; amount: number; type: string; createdAt: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassBookingPayload {
  studentId: string;
  tutorId: string;
  subjectId: string;
  scheduledDate: string;
  scheduledStart: string;
  scheduledEnd: string;
  meetingLink?: string;
  meetingPassword?: string;
  parentNotes?: string;
  consultantNotes?: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Admin methods
export const adminClassBookingService = {
  async list(params: { page?: number; limit?: number; status?: string } = {}): Promise<{ data: ClassBooking[]; meta: PaginationMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.status) query.set('status', params.status);
    const { data } = await api.get(`/class-bookings/admin?${query.toString()}`);
    return { data: data.data, meta: data.meta };
  },
};

// Consultant methods
export const consultantClassBookingService = {
  async create(payload: CreateClassBookingPayload): Promise<ClassBooking> {
    const { data } = await api.post('/class-bookings', payload);
    return data.data;
  },

  async confirm(id: string): Promise<ClassBooking> {
    const { data } = await api.patch(`/class-bookings/${id}/confirm`);
    return data.data;
  },

  async list(params: { page?: number; limit?: number; status?: string } = {}): Promise<{ data: ClassBooking[]; meta: PaginationMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.status) query.set('status', params.status);
    const { data } = await api.get(`/class-bookings/consultant?${query.toString()}`);
    return { data: data.data, meta: data.meta };
  },

  async update(id: string, payload: Partial<Pick<CreateClassBookingPayload, 'scheduledDate' | 'scheduledStart' | 'scheduledEnd' | 'meetingLink' | 'meetingPassword' | 'consultantNotes'>>): Promise<ClassBooking> {
    const { data } = await api.patch(`/class-bookings/${id}`, payload);
    return data.data;
  },

  async updateStatus(id: string, status: string): Promise<ClassBooking> {
    const { data } = await api.patch(`/class-bookings/${id}/status`, { status });
    return data.data;
  },

  async cancel(id: string, reason?: string): Promise<ClassBooking> {
    const { data } = await api.patch(`/class-bookings/${id}/cancel`, { reason });
    return data.data;
  },
};

// Tutor methods
export const tutorClassBookingService = {
  async list(params: { page?: number; limit?: number; status?: string } = {}): Promise<{ data: ClassBooking[]; meta: PaginationMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.status) query.set('status', params.status);
    const { data } = await api.get(`/class-bookings/tutor?${query.toString()}`);
    return { data: data.data, meta: data.meta };
  },

  async getById(id: string): Promise<ClassBooking> {
    const { data } = await api.get(`/class-bookings/${id}`);
    return data.data;
  },
};

// Parent methods
export const parentClassBookingService = {
  async list(params: { page?: number; limit?: number; status?: string } = {}): Promise<{ data: ClassBooking[]; meta: PaginationMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.status) query.set('status', params.status);
    const { data } = await api.get(`/class-bookings/my?${query.toString()}`);
    return { data: data.data, meta: data.meta };
  },
};
