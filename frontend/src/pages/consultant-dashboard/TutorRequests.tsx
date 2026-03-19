import { useState, useEffect, useMemo } from "react";
import ConsultantDashboardLayout from "@/components/ConsultantDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  BookOpen,
  User,
  GraduationCap,
  Mail,
  Phone,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { consultantDemoService, type DemoRequest } from "@/services/demoRequest.service";

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-green-100 text-green-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

const timeSlotLabels: Record<string, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
};

const TutorRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchRequests = () => {
    consultantDemoService
      .list({ limit: 50 })
      .then((res) => setRequests(res.data))
      .catch(() => toast({ title: "Error", description: "Failed to load requests.", variant: "destructive" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = useMemo(() => {
    if (!activeFilter) return requests;
    return requests.filter((r) => r.status === activeFilter);
  }, [activeFilter, requests]);

  const counts = useMemo(() => ({
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    ASSIGNED: requests.filter((r) => r.status === "ASSIGNED").length,
    CONFIRMED: requests.filter((r) => r.status === "CONFIRMED").length,
    COMPLETED: requests.filter((r) => r.status === "COMPLETED").length,
    all: requests.length,
  }), [requests]);

  const handleAssign = async (id: string) => {
    try {
      await consultantDemoService.assignToMe(id);
      toast({ title: "Assigned", description: "Request assigned to you." });
      setLoading(true);
      fetchRequests();
    } catch {
      toast({ title: "Error", description: "Failed to assign request.", variant: "destructive" });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await consultantDemoService.updateStatus(id, status);
      toast({ title: "Status Updated", description: `Request marked as ${status}.` });
      setLoading(true);
      fetchRequests();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || "Failed to update status.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <ConsultantDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-teal-800">Demo Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review parent requests, assign yourself, and manage the demo scheduling flow.
          </p>
        </div>

        {/* Clickable stat filters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { key: null, label: "All", count: counts.all, bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", sub: "text-gray-600" },
            { key: "PENDING", label: "Pending", count: counts.PENDING, bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", sub: "text-orange-600" },
            { key: "ASSIGNED", label: "Assigned to Me", count: counts.ASSIGNED, bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", sub: "text-blue-600" },
            { key: "CONFIRMED", label: "Confirmed", count: counts.CONFIRMED, bg: "bg-green-50", border: "border-green-200", text: "text-green-700", sub: "text-green-600" },
            { key: "COMPLETED", label: "Completed", count: counts.COMPLETED, bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", sub: "text-emerald-600" },
          ].map((item) => (
            <Card
              key={item.label}
              className={`${item.bg} ${item.border} cursor-pointer transition-all hover:shadow-md ${activeFilter === item.key ? "ring-2 ring-teal-500 shadow-md" : ""}`}
              onClick={() => setActiveFilter(item.key)}
            >
              <CardContent className="p-3 text-center">
                <p className={`text-2xl font-bold ${item.text}`}>{item.count}</p>
                <p className={`text-xs ${item.sub}`}>{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Request list */}
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((req) => {
                const isExpanded = expandedId === req.id;
                return (
                  <Card
                    key={req.id}
                    className="bg-white hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                  >
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-semibold shrink-0">
                          {req.parent.firstName.charAt(0)}{req.parent.lastName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold">
                              {req.parent.firstName} {req.parent.lastName}
                            </h3>
                            <Badge className={`text-[10px] ${statusColors[req.status]}`} variant="secondary">
                              {req.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {req.childFirstName} {req.childLastName}
                            </span>
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {req.board.name} — {req.grade.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {req.subjects.map((s) => s.name).join(", ")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {timeSlotLabels[req.preferredTimeSlot]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Contact</p>
                              <p className="mt-0.5 flex items-center gap-1.5 text-xs">
                                <Mail className="h-3.5 w-3.5 text-teal-600" />
                                {req.contactEmail}
                              </p>
                              {req.contactPhone && (
                                <p className="mt-0.5 flex items-center gap-1.5 text-xs">
                                  <Phone className="h-3.5 w-3.5 text-teal-600" />
                                  {req.contactPhone}
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Preferred Date</p>
                              <p className="mt-0.5 flex items-center gap-1.5 text-xs">
                                <Calendar className="h-3.5 w-3.5 text-teal-600" />
                                {new Date(req.preferredDate).toLocaleDateString()}
                                {req.alternativeDate && ` (Alt: ${new Date(req.alternativeDate).toLocaleDateString()})`}
                              </p>
                            </div>
                            {req.childDateOfBirth && (
                              <div>
                                <p className="text-xs text-muted-foreground font-medium">Child DOB</p>
                                <p className="mt-0.5 text-xs">{new Date(req.childDateOfBirth).toLocaleDateString()}</p>
                              </div>
                            )}
                          </div>

                          {req.notes && (
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Notes</p>
                              <p className="mt-0.5 text-sm text-gray-700 bg-gray-50 rounded-md p-2.5">{req.notes}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {req.status === "PENDING" && (
                              <Button
                                size="sm"
                                className="bg-teal-700 hover:bg-teal-800 text-xs"
                                onClick={(e) => { e.stopPropagation(); handleAssign(req.id); }}
                              >
                                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                Assign to Me
                              </Button>
                            )}
                            {req.status === "ASSIGNED" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-xs"
                                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(req.id, "CONFIRMED"); }}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs text-red-600 hover:bg-red-50"
                                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(req.id, "CANCELLED"); }}
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            {req.status === "CONFIRMED" && (
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(req.id, "COMPLETED"); }}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                Mark Completed
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-muted-foreground">No {activeFilter ? activeFilter.toLowerCase() : ""} requests found</p>
            </div>
          )}
        </div>
      </div>
    </ConsultantDashboardLayout>
  );
};

export default TutorRequests;
