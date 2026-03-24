import { useState, useEffect, useMemo } from "react";
import ParentDashboardLayout from "@/components/ParentDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Video,
  User,
  BookOpen,
  CreditCard,
  GraduationCap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parentDemoBookingService, type DemoBooking } from "@/services/demoBooking.service";
import { parentClassBookingService, type ClassBooking } from "@/services/classBooking.service";

const demoStatusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-green-100 text-green-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  NO_SHOW: "bg-red-100 text-red-700",
};

const classStatusColors: Record<string, string> = {
  PENDING_VERIFICATION: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  NO_SHOW: "bg-red-100 text-red-700",
};

const ParentBookings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("demos");
  const [demoBookings, setDemoBookings] = useState<DemoBooking[]>([]);
  const [classBookings, setClassBookings] = useState<ClassBooking[]>([]);
  const [loadingDemos, setLoadingDemos] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    parentDemoBookingService
      .list({ limit: 50 })
      .then((res) => setDemoBookings(res.data))
      .catch(() => toast({ title: "Error", description: "Failed to load demo bookings.", variant: "destructive" }))
      .finally(() => setLoadingDemos(false));

    parentClassBookingService
      .list({ limit: 50 })
      .then((res) => setClassBookings(res.data))
      .catch(() => toast({ title: "Error", description: "Failed to load class bookings.", variant: "destructive" }))
      .finally(() => setLoadingClasses(false));
  }, []);

  const demoStats = useMemo(() => ({
    total: demoBookings.length,
    upcoming: demoBookings.filter((b) => ["PENDING", "CONFIRMED"].includes(b.status)).length,
    completed: demoBookings.filter((b) => b.status === "COMPLETED").length,
  }), [demoBookings]);

  const classStats = useMemo(() => ({
    total: classBookings.length,
    active: classBookings.filter((b) => ["PENDING_VERIFICATION", "CONFIRMED", "IN_PROGRESS"].includes(b.status)).length,
    completed: classBookings.filter((b) => b.status === "COMPLETED").length,
    creditsSpent: classBookings.filter((b) => b.creditTransaction).reduce((sum, b) => sum + b.creditsCharged, 0),
  }), [classBookings]);

  return (
    <ParentDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-indigo-800">My Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View your scheduled demo and paid class bookings.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="p-4 text-center">
            <GraduationCap className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{demoStats.upcoming}</p>
            <p className="text-xs text-muted-foreground">Upcoming Demos</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{demoStats.completed}</p>
            <p className="text-xs text-muted-foreground">Demos Completed</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{classStats.active}</p>
            <p className="text-xs text-muted-foreground">Active Classes</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <CreditCard className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{classStats.creditsSpent}</p>
            <p className="text-xs text-muted-foreground">Credits Used</p>
          </CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="demos">
              Demo Classes
              <Badge variant="secondary" className="ml-1.5 text-xs">{demoStats.total}</Badge>
            </TabsTrigger>
            <TabsTrigger value="classes">
              Paid Classes
              <Badge variant="secondary" className="ml-1.5 text-xs">{classStats.total}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Demo Bookings */}
          <TabsContent value="demos" className="mt-4">
            {loadingDemos ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : demoBookings.length > 0 ? (
              <div className="space-y-3">
                {demoBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="font-semibold text-sm">
                              {booking.demoRequest
                                ? `${booking.demoRequest.childFirstName} ${booking.demoRequest.childLastName}`
                                : booking.student
                                ? `${booking.student.firstName} ${booking.student.lastName}`
                                : "Demo Class"}
                            </h3>
                            <Badge className={`text-[10px] ${demoStatusColors[booking.status]}`} variant="secondary">
                              {booking.status}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700">FREE</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {booking.tutor.firstName} {booking.tutor.lastName}
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
                                <Video className="h-3 w-3" /> Join Meeting
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold">No demo bookings yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When a consultant schedules a demo for your child, it will appear here.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Class Bookings */}
          <TabsContent value="classes" className="mt-4">
            {loadingClasses ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : classBookings.length > 0 ? (
              <div className="space-y-3">
                {classBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="font-semibold text-sm">
                              {booking.student.firstName} {booking.student.lastName}
                            </h3>
                            <Badge className={`text-[10px] ${classStatusColors[booking.status]}`} variant="secondary">
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
                              {booking.tutor.firstName} {booking.tutor.lastName}
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
                              Cancelled: {booking.cancelReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold">No class bookings yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When a consultant books a paid class for your child, it will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentBookings;
