
import { useState, useMemo } from "react";
import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { mockAssessments } from "@/data/mockPlatformData";
import { useToast } from "@/hooks/use-toast";
import type { Assessment } from "@/types/platform";

const typeConfig = {
  quiz: { label: "Quiz", color: "bg-blue-100 text-blue-700" },
  assignment: { label: "Assignment", color: "bg-purple-100 text-purple-700" },
  exam: { label: "Exam", color: "bg-red-100 text-red-700" },
  "progress-report": { label: "Progress Report", color: "bg-green-100 text-green-700" },
};

const TutorAssessments = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    studentName: "",
    subject: "",
    type: "quiz" as Assessment["type"],
    title: "",
    maxScore: "100",
    remarks: "",
  });

  // Filter assessments by this tutor (tutor_001 and tutor_002 for demo)
  const myAssessments = mockAssessments.filter(
    (a) => a.tutorId === "tutor_001" || a.tutorId === "tutor_002"
  );

  const filteredAssessments = useMemo(() => {
    if (activeTab === "all") return myAssessments;
    if (activeTab === "graded") return myAssessments.filter((a) => a.status === "graded");
    if (activeTab === "pending") return myAssessments.filter((a) => a.status === "pending");
    return myAssessments;
  }, [activeTab, myAssessments]);

  const gradedCount = myAssessments.filter((a) => a.status === "graded").length;
  const pendingCount = myAssessments.filter((a) => a.status === "pending").length;

  const handleCreate = () => {
    if (!newAssessment.title || !newAssessment.studentName) {
      toast({ title: "Missing info", description: "Please fill in required fields.", variant: "destructive" });
      return;
    }
    toast({ title: "Assessment Created", description: `"${newAssessment.title}" has been created and assigned.` });
    setIsCreateOpen(false);
    setNewAssessment({ studentName: "", subject: "", type: "quiz", title: "", maxScore: "100", remarks: "" });
  };

  const handleGrade = (id: string) => {
    toast({ title: "Grade Assessment", description: "Grading interface coming in next update." });
  };

  return (
    <TutorDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-purple-800">Assessments</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Create and manage assessments, quizzes, and progress reports for your students.
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Assessment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <ClipboardList className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{myAssessments.length}</p>
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
              <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">
                {(() => {
                  const scored = myAssessments.filter((a) => a.score !== undefined && a.maxScore !== undefined);
                  if (scored.length === 0) return "—";
                  return Math.round(scored.reduce((s, a) => s + ((a.score! / a.maxScore!) * 100), 0) / scored.length) + "%";
                })()}
              </p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({myAssessments.length})</TabsTrigger>
            <TabsTrigger value="graded">Graded ({gradedCount})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {pendingCount > 0 && <Badge className="ml-1.5 text-xs bg-yellow-500">{pendingCount}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredAssessments.length > 0 ? (
              <div className="space-y-3">
                {filteredAssessments.map((assessment) => {
                  const typeInfo = typeConfig[assessment.type];
                  const scorePercent = assessment.score !== undefined && assessment.maxScore !== undefined
                    ? Math.round((assessment.score / assessment.maxScore) * 100) : null;

                  return (
                    <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{assessment.title}</h3>
                              <Badge className={`text-xs ${typeInfo.color}`}>{typeInfo.label}</Badge>
                              <Badge className={`text-xs ${
                                assessment.status === "graded" ? "bg-green-100 text-green-700" :
                                assessment.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                "bg-blue-100 text-blue-700"
                              }`}>
                                {assessment.status === "graded" ? "Graded" : assessment.status === "pending" ? "Pending" : "Submitted"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                              <span>Student: <span className="font-medium text-foreground">{assessment.studentName}</span></span>
                              <span>·</span>
                              <span>{assessment.subject}</span>
                              <span>·</span>
                              <span>{assessment.date}</span>
                            </div>
                            {assessment.remarks && (
                              <p className="text-sm text-muted-foreground mt-2 bg-gray-50 rounded p-2 italic">
                                "{assessment.remarks}"
                              </p>
                            )}
                          </div>

                          <div className="text-right flex-shrink-0">
                            {scorePercent !== null ? (
                              <div>
                                <p className={`text-2xl font-bold ${
                                  scorePercent >= 80 ? "text-green-600" :
                                  scorePercent >= 60 ? "text-yellow-600" : "text-red-600"
                                }`}>
                                  {assessment.score}/{assessment.maxScore}
                                </p>
                                {assessment.grade && (
                                  <Badge variant="outline" className="mt-1 bg-green-50 text-green-700">
                                    Grade {assessment.grade}
                                  </Badge>
                                )}
                              </div>
                            ) : assessment.status === "pending" ? (
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleGrade(assessment.id)}>
                                Grade
                              </Button>
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
                <h3 className="text-lg font-semibold">No assessments</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first assessment for your students.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Assessment Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Assessment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="e.g. Chapter 5 Quiz"
                  value={newAssessment.title}
                  onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Student Name</label>
                  <Input
                    placeholder="Enter student name"
                    value={newAssessment.studentName}
                    onChange={(e) => setNewAssessment({ ...newAssessment, studentName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="e.g. Mathematics"
                    value={newAssessment.subject}
                    onChange={(e) => setNewAssessment({ ...newAssessment, subject: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={newAssessment.type}
                    onValueChange={(val) => setNewAssessment({ ...newAssessment, type: val as Assessment["type"] })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="progress-report">Progress Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Max Score</label>
                  <Input
                    type="number"
                    value={newAssessment.maxScore}
                    onChange={(e) => setNewAssessment({ ...newAssessment, maxScore: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Remarks (optional)</label>
                <Textarea
                  placeholder="Any notes about this assessment..."
                  value={newAssessment.remarks}
                  onChange={(e) => setNewAssessment({ ...newAssessment, remarks: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <Button onClick={handleCreate} className="w-full bg-purple-600 hover:bg-purple-700">
                Create Assessment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TutorDashboardLayout>
  );
};

export default TutorAssessments;
