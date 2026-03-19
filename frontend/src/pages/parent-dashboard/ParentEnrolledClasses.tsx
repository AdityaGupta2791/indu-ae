
import { useState } from "react";
import ParentDashboardLayout from "@/components/ParentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  Clock,
  Star,
  MapPin,
  User,
  CheckCircle2,
  PauseCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { mockAllocations } from "@/data/mockPlatformData";
import { useToast } from "@/hooks/use-toast";
import type { AllocationStatus } from "@/types/platform";

const statusConfig: Record<AllocationStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  "demo-scheduled": { label: "Demo Scheduled", color: "bg-blue-100 text-blue-700" },
  "demo-completed": { label: "Demo Done", color: "bg-purple-100 text-purple-700" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700" },
  "on-hold": { label: "On Hold", color: "bg-yellow-100 text-yellow-700" },
  "reassign-needed": { label: "Reassign", color: "bg-orange-100 text-orange-700" },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
};

const ParentEnrolledClasses = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  const filteredAllocations = activeTab === "all"
    ? mockAllocations
    : activeTab === "active"
    ? mockAllocations.filter((a) => ["active", "confirmed"].includes(a.status))
    : activeTab === "upcoming"
    ? mockAllocations.filter((a) => ["demo-scheduled", "demo-completed"].includes(a.status))
    : mockAllocations.filter((a) => ["reassign-needed", "on-hold", "completed"].includes(a.status));

  const activeCount = mockAllocations.filter((a) => ["active", "confirmed"].includes(a.status)).length;
  const upcomingCount = mockAllocations.filter((a) => ["demo-scheduled", "demo-completed"].includes(a.status)).length;

  return (
    <ParentDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-indigo-800">Enrolled Classes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View your children's active classes, schedules, and tutor information.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{mockAllocations.length}</p>
              <p className="text-xs text-muted-foreground">Total Classes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{upcomingCount}</p>
              <p className="text-xs text-muted-foreground">Upcoming Demos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">
                {(
                  mockAllocations
                    .filter((a) => a.parentRating)
                    .reduce((sum, a) => sum + (a.parentRating || 0), 0) /
                    (mockAllocations.filter((a) => a.parentRating).length || 1)
                ).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({mockAllocations.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingCount})</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredAllocations.length > 0 ? (
              <div className="space-y-4">
                {filteredAllocations.map((alloc) => {
                  const status = statusConfig[alloc.status];
                  return (
                    <Card key={alloc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Tutor avatar */}
                          <Avatar className="h-14 w-14 flex-shrink-0">
                            <AvatarImage src={alloc.tutorAvatar} alt={alloc.tutorName} />
                            <AvatarFallback className="bg-purple-100 text-purple-700">
                              {alloc.tutorName.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{alloc.subject}</h3>
                              <Badge className={`text-xs ${status.color}`}>{status.label}</Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <User className="h-3.5 w-3.5" />
                                <span>Child: <span className="font-medium text-foreground">{alloc.childName}</span> ({alloc.childGrade})</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Star className="h-3.5 w-3.5" />
                                <span>Tutor: <span className="font-medium text-foreground">{alloc.tutorName}</span></span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{alloc.schedule}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{alloc.format}</span>
                              </div>
                            </div>

                            {alloc.sessionsCompleted !== undefined && (
                              <p className="text-xs text-muted-foreground mt-2">
                                {alloc.sessionsCompleted} session{alloc.sessionsCompleted !== 1 ? "s" : ""} completed · Since {alloc.allocatedOn}
                              </p>
                            )}

                            {alloc.demoDate && alloc.status === "demo-scheduled" && (
                              <div className="flex items-center gap-1.5 text-sm text-blue-600 mt-2">
                                <Calendar className="h-3.5 w-3.5" />
                                Demo on {alloc.demoDate}
                              </div>
                            )}

                            {alloc.parentRating && (
                              <div className="flex items-center gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                      i < alloc.parentRating!
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-xs text-muted-foreground ml-1">Your rating</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex sm:flex-col gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => toast({ title: "Message", description: "Messaging feature coming soon." })}
                            >
                              <MessageSquare className="h-3.5 w-3.5 mr-1" />
                              Message
                            </Button>
                            {alloc.status === "reassign-needed" && (
                              <Button
                                size="sm"
                                className="text-xs bg-orange-600 hover:bg-orange-700"
                                onClick={() => toast({ title: "Reassignment", description: "Consultant will assign a new tutor." })}
                              >
                                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                Reassign
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold">No classes in this category</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Classes will appear here once tutors are assigned and demos are scheduled.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentEnrolledClasses;
