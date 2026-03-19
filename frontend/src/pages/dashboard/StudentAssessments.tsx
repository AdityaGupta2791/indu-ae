
import { useState, useMemo } from "react";
import StudentDashboardLayout from "@/components/StudentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  ClipboardList,
  FileText,
  Clock,
  CheckCircle2,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { mockAssessments } from "@/data/mockPlatformData";
import { useToast } from "@/hooks/use-toast";

const typeConfig = {
  quiz: { label: "Quiz", color: "bg-blue-100 text-blue-700", icon: ClipboardList },
  assignment: { label: "Assignment", color: "bg-purple-100 text-purple-700", icon: FileText },
  exam: { label: "Exam", color: "bg-red-100 text-red-700", icon: GraduationCap },
  "progress-report": { label: "Progress Report", color: "bg-green-100 text-green-700", icon: TrendingUp },
};

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700" },
  graded: { label: "Graded", color: "bg-green-100 text-green-700" },
};

const StudentAssessments = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  const filteredAssessments = useMemo(() => {
    let result = [...mockAssessments];

    if (activeTab === "graded") {
      result = result.filter((a) => a.status === "graded");
    } else if (activeTab === "pending") {
      result = result.filter((a) => a.status === "pending" || a.status === "submitted");
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeTab]);

  const gradedCount = mockAssessments.filter((a) => a.status === "graded").length;
  const pendingCount = mockAssessments.filter((a) => a.status === "pending" || a.status === "submitted").length;
  const avgScore = (() => {
    const scored = mockAssessments.filter((a) => a.score !== undefined && a.maxScore !== undefined);
    if (scored.length === 0) return 0;
    return Math.round(
      scored.reduce((sum, a) => sum + ((a.score! / a.maxScore!) * 100), 0) / scored.length
    );
  })();

  return (
    <StudentDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Assessments</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your quiz results, assignments, and progress reports.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <ClipboardList className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{mockAssessments.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{gradedCount}</p>
              <p className="text-xs text-muted-foreground">Graded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{avgScore}%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({mockAssessments.length})</TabsTrigger>
            <TabsTrigger value="graded">Graded ({gradedCount})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {pendingCount > 0 && (
                <Badge className="ml-1.5 text-xs bg-yellow-500">{pendingCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredAssessments.length > 0 ? (
              <div className="space-y-3">
                {filteredAssessments.map((assessment) => {
                  const typeInfo = typeConfig[assessment.type];
                  const statusInfo = statusConfig[assessment.status];
                  const TypeIcon = typeInfo.icon;
                  const scorePercent =
                    assessment.score !== undefined && assessment.maxScore !== undefined
                      ? Math.round((assessment.score / assessment.maxScore) * 100)
                      : null;

                  return (
                    <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Type icon */}
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                            <TypeIcon className="h-6 w-6" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{assessment.title}</h3>
                              <Badge className={`text-xs ${typeInfo.color}`}>{typeInfo.label}</Badge>
                              <Badge className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                              <span>{assessment.subject}</span>
                              <span>·</span>
                              <span>{assessment.tutorName}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(assessment.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                            {assessment.remarks && (
                              <p className="text-sm text-muted-foreground mt-2 bg-gray-50 rounded p-2 italic">
                                "{assessment.remarks}"
                              </p>
                            )}
                          </div>

                          {/* Score */}
                          <div className="text-right flex-shrink-0">
                            {scorePercent !== null ? (
                              <div>
                                <div
                                  className={`text-2xl font-bold ${
                                    scorePercent >= 80
                                      ? "text-green-600"
                                      : scorePercent >= 60
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {assessment.score}/{assessment.maxScore}
                                </div>
                                <p className="text-xs text-muted-foreground">{scorePercent}%</p>
                                {assessment.grade && (
                                  <Badge
                                    variant="outline"
                                    className="mt-1 bg-green-50 text-green-700 border-green-200"
                                  >
                                    Grade {assessment.grade}
                                  </Badge>
                                )}
                              </div>
                            ) : assessment.status === "pending" ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                Upcoming
                              </Badge>
                            ) : (
                              <Badge variant="outline">Report</Badge>
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
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold">No assessments found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your assessment results will appear here once your tutors submit them.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentAssessments;
