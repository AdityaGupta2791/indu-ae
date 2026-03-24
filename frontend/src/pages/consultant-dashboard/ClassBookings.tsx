import { useState, useEffect, useMemo } from "react";
import ConsultantDashboardLayout from "@/components/ConsultantDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2,
  Video,
  User,
  BookOpen,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  consultantClassBookingService,
  type ClassBooking,
  type CreateClassBookingPayload,
} from "@/services/classBooking.service";
import { tutorSearchService } from "@/services/tutor.service";
import { referenceService } from "@/services/user.service";
import type { Subject } from "@/services/user.service";
import api from "@/services/api";

const statusColors: Record<string, string> = {
  PENDING_VERIFICATION: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  NO_SHOW: "bg-red-100 text-red-700",
};

interface StudentOption {
  id: string;
  firstName: string;
  lastName: string;
  parentName: string;
  gradeName: string;
}

const ClassBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Create dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [tutors, setTutors] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const emptyForm: CreateClassBookingPayload = {
    studentId: "",
    tutorId: "",
    subjectId: "",
    scheduledDate: "",
    scheduledStart: "",
    scheduledEnd: "",
    meetingLink: "",
    consultantNotes: "",
  };
  const [form, setForm] = useState<CreateClassBookingPayload>(emptyForm);

  const fetchBookings = () => {
    consultantClassBookingService
      .list({ limit: 50 })
      .then((res) => setBookings(res.data))
      .catch(() => toast({ title: "Error", description: "Failed to load class bookings.", variant: "destructive" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
    // Load reference data
    Promise.all([
      tutorSearchService.search({ limit: 100 }),
      referenceService.getSubjects(),
    ]).then(([t, s]) => {
      setTutors(t.data.map((tutor) => ({ id: tutor.id, firstName: tutor.firstName, lastName: tutor.lastName })));
      setSubjects(s);
    });
    // Load students (admin/consultant endpoint)
    api.get('/admin/users?role=PARENT&limit=100').then((res) => {
      // Flatten all children from parent profiles
      const allStudents: StudentOption[] = [];
      for (const parent of (res.data.data || [])) {
        for (const child of (parent.children || [])) {
          allStudents.push({
            id: child.id,
            firstName: child.firstName,
            lastName: child.lastName,
            parentName: `${parent.firstName} ${parent.lastName}`,
            gradeName: child.grade?.name || 'N/A',
          });
        }
      }
      setStudents(allStudents);
    }).catch(() => {
      // If admin endpoint not available, students list will be empty
    });
  }, []);

  const filtered = useMemo(() => {
    if (!activeFilter) return bookings;
    return bookings.filter((b) => b.status === activeFilter);
  }, [activeFilter, bookings]);

  const counts = useMemo(() => ({
    all: bookings.length,
    PENDING_VERIFICATION: bookings.filter((b) => b.status === "PENDING_VERIFICATION").length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
  }), [bookings]);

  const handleCreate = async () => {
    if (!form.studentId || !form.tutorId || !form.subjectId || !form.scheduledDate || !form.scheduledStart || !form.scheduledEnd) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const payload: CreateClassBookingPayload = {
        ...form,
        meetingLink: form.meetingLink || undefined,
        consultantNotes: form.consultantNotes || undefined,
      };
      await consultantClassBookingService.create(payload);
      toast({ title: "Booking Created", description: "Class booking created (pending verification)." });
      setDialogOpen(false);
      setForm(emptyForm);
      setLoading(true);
      fetchBookings();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || "Failed to create booking.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await consultantClassBookingService.confirm(id);
      toast({ title: "Confirmed", description: "Booking confirmed and credits deducted." });
      setLoading(true);
      fetchBookings();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || "Failed to confirm.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await consultantClassBookingService.updateStatus(id, status);
      toast({ title: "Status Updated", description: `Booking marked as ${status.replace("_", " ")}.` });
      setLoading(true);
      fetchBookings();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || "Failed to update.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await consultantClassBookingService.cancel(id);
      toast({ title: "Cancelled", description: "Booking cancelled. No refund issued." });
      setLoading(true);
      fetchBookings();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || "Failed to cancel.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <ConsultantDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-teal-800">Class Bookings</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Create and manage paid class bookings. Credits are deducted on confirmation.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-700 hover:bg-teal-800">
                <Plus className="h-4 w-4 mr-2" /> Create Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Class Booking</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-sm font-medium">Student *</label>
                  <Select value={form.studentId} onValueChange={(v) => setForm({ ...form, studentId: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.firstName} {s.lastName} — {s.gradeName} (Parent: {s.parentName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Tutor *</label>
                  <Select value={form.tutorId} onValueChange={(v) => setForm({ ...form, tutorId: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select tutor" /></SelectTrigger>
                    <SelectContent>
                      {tutors.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Subject *</label>
                  <Select value={form.subjectId} onValueChange={(v) => setForm({ ...form, subjectId: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Date *</label>
                  <Input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                    className="mt-1"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Start Time *</label>
                    <Input
                      type="time"
                      value={form.scheduledStart}
                      onChange={(e) => setForm({ ...form, scheduledStart: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Time *</label>
                    <Input
                      type="time"
                      value={form.scheduledEnd}
                      onChange={(e) => setForm({ ...form, scheduledEnd: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Meeting Link (Zoom)</label>
                  <Input
                    value={form.meetingLink || ""}
                    onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={form.consultantNotes || ""}
                    onChange={(e) => setForm({ ...form, consultantNotes: e.target.value })}
                    placeholder="Internal notes..."
                    className="mt-1"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                  <p className="font-medium">Credit Info</p>
                  <p>Credits will be computed from the student's grade tier and deducted when you confirm the booking.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} className="bg-teal-700 hover:bg-teal-800" disabled={submitting}>
                  {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : "Create Booking"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stat filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: null, label: "All", count: counts.all, bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" },
            { key: "PENDING_VERIFICATION", label: "Pending", count: counts.PENDING_VERIFICATION, bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
            { key: "CONFIRMED", label: "Confirmed", count: counts.CONFIRMED, bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
            { key: "COMPLETED", label: "Completed", count: counts.COMPLETED, bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
          ].map((item) => (
            <Card
              key={item.label}
              className={`${item.bg} ${item.border} cursor-pointer transition-all hover:shadow-md ${activeFilter === item.key ? "ring-2 ring-teal-500 shadow-md" : ""}`}
              onClick={() => setActiveFilter(item.key)}
            >
              <CardContent className="p-3 text-center">
                <p className={`text-2xl font-bold ${item.text}`}>{item.count}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((booking) => (
              <Card key={booking.id} className="bg-white hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-sm">
                          {booking.student.firstName} {booking.student.lastName}
                        </h3>
                        <Badge className={`text-[10px] ${statusColors[booking.status]}`} variant="secondary">
                          {booking.status.replace(/_/g, " ")}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          <CreditCard className="h-2.5 w-2.5 mr-1" />
                          {booking.creditsCharged} credits
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Tutor: {booking.tutor.firstName} {booking.tutor.lastName}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {booking.subject.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.scheduledDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {booking.scheduledStart} - {booking.scheduledEnd}
                        </span>
                        {booking.meetingLink && (
                          <a
                            href={booking.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <Video className="h-3 w-3" /> Join
                          </a>
                        )}
                      </div>
                      {booking.cancelReason && (
                        <p className="text-xs text-red-600 mt-1 bg-red-50 rounded p-1.5">
                          Cancel reason: {booking.cancelReason}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                      {booking.status === "PENDING_VERIFICATION" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-xs"
                            onClick={() => handleConfirm(booking.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Confirm & Charge
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-red-600 hover:bg-red-50"
                            onClick={() => handleCancel(booking.id)}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-xs"
                            onClick={() => handleStatusUpdate(booking.id, "IN_PROGRESS")}
                          >
                            Start Class
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-red-600 hover:bg-red-50"
                            onClick={() => handleCancel(booking.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                          onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold">No class bookings</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Create Booking" to schedule a paid class.
            </p>
          </div>
        )}
      </div>
    </ConsultantDashboardLayout>
  );
};

export default ClassBookings;
