import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  X,
  BookOpen,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  adminTutorService,
  type AdminTutor,
  type PaginationMeta,
} from "@/services/tutor.service";
import { referenceService } from "@/services/user.service";
import type { Subject } from "@/services/user.service";

const SUBJECT_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-teal-100 text-teal-800",
  "bg-orange-100 text-orange-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
];

function getSubjectColor(index: number): string {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}

const TutorManagement = () => {
  const { toast } = useToast();

  // List state
  const [tutors, setTutors] = useState<AdminTutor[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Reference data
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [subjectsLoaded, setSubjectsLoaded] = useState(false);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editTutor, setEditTutor] = useState<AdminTutor | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    experience: 0,
  });
  const [editSaving, setEditSaving] = useState(false);

  // Subjects dialog
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjectsTutor, setSubjectsTutor] = useState<AdminTutor | null>(null);
  const [addSubjectId, setAddSubjectId] = useState("");
  const [addSubjectRate, setAddSubjectRate] = useState("");
  const [subjectSaving, setSubjectSaving] = useState(false);

  // Status toggle loading
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ------- Data fetching -------

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminTutorService.listTutors({
        page: currentPage,
        limit: 20,
        search: searchTerm.trim() || undefined,
      });
      setTutors(result.data);
      setMeta(result.meta);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load tutors.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, toast]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadSubjects = async () => {
    if (subjectsLoaded) return;
    try {
      const subjects = await referenceService.getSubjects();
      setAllSubjects(subjects);
      setSubjectsLoaded(true);
    } catch {
      // non-critical
    }
  };

  // ------- Toggle status -------

  const handleToggleStatus = async (tutor: AdminTutor) => {
    setTogglingId(tutor.id);
    try {
      await adminTutorService.toggleStatus(tutor.id, !tutor.isActive);
      toast({
        title: tutor.isActive ? "Tutor deactivated" : "Tutor activated",
        description: `${tutor.firstName} ${tutor.lastName}`,
      });
      fetchTutors();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update tutor status.",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteTutor = async (tutor: AdminTutor) => {
    if (!confirm(`Delete "${tutor.firstName} ${tutor.lastName}"? This action is soft-delete.`)) return;
    try {
      await adminTutorService.deleteTutor(tutor.id);
      toast({ title: "Tutor deleted", description: `${tutor.firstName} ${tutor.lastName}` });
      fetchTutors();
    } catch {
      toast({ title: "Error", description: "Failed to delete tutor.", variant: "destructive" });
    }
  };

  // ------- Edit tutor -------

  const openEditDialog = (tutor: AdminTutor) => {
    setEditTutor(tutor);
    setEditForm({
      firstName: tutor.firstName,
      lastName: tutor.lastName,
      phone: tutor.phone || "",
      bio: tutor.bio || "",
      experience: tutor.experience,
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editTutor) return;
    setEditSaving(true);
    try {
      await adminTutorService.updateTutor(editTutor.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone || undefined,
        bio: editForm.bio || undefined,
        experience: editForm.experience,
      });
      toast({
        title: "Tutor updated",
        description: `${editForm.firstName} ${editForm.lastName}'s profile has been updated.`,
      });
      setEditOpen(false);
      fetchTutors();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message || "Failed to update tutor.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setEditSaving(false);
    }
  };

  // ------- Manage subjects -------

  const openSubjectsDialog = (tutor: AdminTutor) => {
    setSubjectsTutor(tutor);
    setAddSubjectId("");
    setAddSubjectRate("");
    setSubjectsOpen(true);
    loadSubjects();
  };

  const handleAssignSubject = async () => {
    if (!subjectsTutor || !addSubjectId || !addSubjectRate) return;
    const rate = parseFloat(addSubjectRate);
    if (isNaN(rate) || rate <= 0) {
      toast({
        title: "Invalid rate",
        description: "Please enter a valid positive number for the rate.",
        variant: "destructive",
      });
      return;
    }
    setSubjectSaving(true);
    try {
      await adminTutorService.assignSubject(subjectsTutor.id, addSubjectId, rate);
      const subjectName =
        allSubjects.find((s) => s.id === addSubjectId)?.name || "Subject";
      toast({
        title: "Subject assigned",
        description: `${subjectName} assigned to ${subjectsTutor.firstName}.`,
      });
      setAddSubjectId("");
      setAddSubjectRate("");
      // Refresh tutor list & update the dialog tutor
      const result = await adminTutorService.listTutors({
        page: currentPage,
        limit: 20,
        search: searchTerm.trim() || undefined,
      });
      setTutors(result.data);
      setMeta(result.meta);
      const updated = result.data.find((t) => t.id === subjectsTutor.id);
      if (updated) setSubjectsTutor(updated);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message || "Failed to assign subject.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSubjectSaving(false);
    }
  };

  const handleRemoveSubject = async (subjectId: string) => {
    if (!subjectsTutor) return;
    try {
      await adminTutorService.removeSubject(subjectsTutor.id, subjectId);
      toast({
        title: "Subject removed",
        description: `Subject removed from ${subjectsTutor.firstName}.`,
      });
      // Refresh
      const result = await adminTutorService.listTutors({
        page: currentPage,
        limit: 20,
        search: searchTerm.trim() || undefined,
      });
      setTutors(result.data);
      setMeta(result.meta);
      const updated = result.data.find((t) => t.id === subjectsTutor.id);
      if (updated) setSubjectsTutor(updated);
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove subject.",
        variant: "destructive",
      });
    }
  };

  // Subjects available for assignment (not already assigned)
  const availableSubjects = allSubjects.filter(
    (s) => !subjectsTutor?.subjects.some((ts) => ts.id === s.id)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tutor Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage tutors, their subjects, rates, and account status
        </p>
      </div>

      {/* Main Card */}
      <Card>
        <div className="p-6 pb-0">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              All Tutors {meta ? `(${meta.total})` : ""}
            </h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tutors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No tutors found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tutors.map((tutor) => (
                      <TableRow key={tutor.id}>
                        {/* Name */}
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                              {tutor.profilePhotoUrl ? (
                                <img
                                  src={tutor.profilePhotoUrl}
                                  alt=""
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-medium text-gray-700">
                                  {(tutor.firstName?.[0] || "")}
                                  {(tutor.lastName?.[0] || "")}
                                </span>
                              )}
                            </div>
                            <span className="font-medium text-gray-800">
                              {tutor.firstName} {tutor.lastName}
                            </span>
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell className="text-sm text-muted-foreground">
                          {tutor.email}
                        </TableCell>

                        {/* Subjects */}
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {tutor.subjects.length > 0 ? (
                              tutor.subjects.map((sub, i) => (
                                <Badge
                                  key={sub.id}
                                  className={`text-[10px] font-normal ${getSubjectColor(i)}`}
                                >
                                  {sub.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                None
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Experience */}
                        <TableCell className="text-sm text-muted-foreground">
                          {tutor.experience} {tutor.experience === 1 ? "year" : "years"}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={tutor.isActive}
                              disabled={togglingId === tutor.id}
                              onCheckedChange={() => handleToggleStatus(tutor)}
                            />
                            <Badge
                              className={
                                tutor.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {tutor.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(tutor)}
                              title="Edit tutor"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openSubjectsDialog(tutor)}
                              title="Manage subjects"
                            >
                              <BookOpen className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTutor(tutor)}
                              title="Delete tutor"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {meta.page} of {meta.totalPages} ({meta.total} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= meta.totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ==================== Edit Tutor Dialog ==================== */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit Tutor — {editTutor?.firstName} {editTutor?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstName: e.target.value })
                  }
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastName: e.target.value })
                  }
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label>Experience (years)</Label>
              <Input
                type="number"
                min={0}
                value={editForm.experience}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    experience: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                placeholder="Tutor bio..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={editSaving || !editForm.firstName || !editForm.lastName}
            >
              {editSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== Manage Subjects Dialog ==================== */}
      <Dialog
        open={subjectsOpen}
        onOpenChange={(v) => {
          setSubjectsOpen(v);
          if (!v) {
            setAddSubjectId("");
            setAddSubjectRate("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subjects — {subjectsTutor?.firstName} {subjectsTutor?.lastName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Current subjects */}
            <div>
              <Label className="text-sm font-medium">Current Subjects</Label>
              {subjectsTutor?.subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground mt-2">
                  No subjects assigned yet.
                </p>
              ) : (
                <div className="space-y-2 mt-2">
                  {subjectsTutor?.subjects.map((sub, i) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-xs ${getSubjectColor(i)}`}
                        >
                          {sub.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Rate: AED {sub.tutorRate}/hr
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveSubject(sub.id)}
                        title="Remove subject"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Subject form */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium">Add Subject</Label>
              <div className="flex items-end gap-2 mt-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Subject</Label>
                  <Select value={addSubjectId} onValueChange={setAddSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubjects.length === 0 ? (
                        <SelectItem value="__none" disabled>
                          No more subjects available
                        </SelectItem>
                      ) : (
                        availableSubjects.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs text-muted-foreground">Rate (AED/hr)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={addSubjectRate}
                    onChange={(e) => setAddSubjectRate(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleAssignSubject}
                  disabled={subjectSaving || !addSubjectId || !addSubjectRate}
                  className="shrink-0"
                >
                  {subjectSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorManagement;
