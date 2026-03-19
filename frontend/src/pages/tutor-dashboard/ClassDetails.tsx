import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Users, 
  Edit, 
  Star, 
  MessageSquare, 
  Download,
  Trash2,
  Video,
  BookOpen,
  CheckSquare,
  X,
  Plus,
  ChevronRight,
  Upload,
  User,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { useToast } from "@/hooks/use-toast";
import VideoUploadDialog from "@/components/tutor-dashboard/VideoUploadDialog";
import { LectureType, getLectureTypeInfo } from "@/types/lecture-types";

// Mock class data - includes classType field to determine UI differences
const classData = {
  id: 1,
  title: "Introduction to Python Programming",
  subject: "Programming",
  description: "This interactive course introduces children ages 10-14 to the world of programming through Python. Students will learn basic programming concepts like variables, loops, and conditionals while building their own games and applications.",
  status: "active",
  classType: "online-live-one-on-one" as LectureType,
  paymentType: "fixed", // Options: "fixed", "recurring"
  dateCreated: "June 10, 2023",
  nextSession: "June 15, 2023, 4:00 PM",
  enrolledStudents: 1, // For 1-on-1 classes, this will always be 1
  maxStudents: 1, // For 1-on-1 classes, this will always be 1
  completionRate: 65,
  rating: 4.7,
  totalSessions: 12,
  completedSessions: 5,
  earnings: "$960",
  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&h=300&q=80",
  sessions: [
    {
      id: 1,
      title: "Introduction to Python Basics",
      date: "June 1, 2023",
      time: "4:00 PM - 5:30 PM",
      status: "completed",
      attendance: 1,
      materials: 2,
      videoUrl: "https://example.com/video1.mp4", // For recorded classes
      duration: "45 minutes", // For recorded classes
      notes: "Student showed good progress understanding variables and basic syntax", // For 1-on-1 sessions
      homework: "Complete exercises 1-5 in the workbook" // For 1-on-1 sessions
    },
    {
      id: 2,
      title: "Variables and Data Types",
      date: "June 4, 2023",
      time: "4:00 PM - 5:30 PM",
      status: "completed", 
      attendance: 1,
      materials: 3,
      videoUrl: "https://example.com/video2.mp4", // For recorded classes
      duration: "53 minutes", // For recorded classes
      notes: "Good understanding of data types, but needs more practice with lists", // For 1-on-1 sessions
      homework: "Create a simple program using lists and dictionaries" // For 1-on-1 sessions
    },
    {
      id: 3,
      title: "Control Flow and Conditionals",
      date: "June 8, 2023",
      time: "4:00 PM - 5:30 PM",
      status: "completed",
      attendance: 1,
      materials: 1,
      videoUrl: "https://example.com/video3.mp4", // For recorded classes
      duration: "48 minutes", // For recorded classes
      notes: "Excellent progress with if-statements and logical operators", // For 1-on-1 sessions
      homework: "Build a decision-making program" // For 1-on-1 sessions
    },
    {
      id: 4,
      title: "Loops and Iterations",
      date: "June 11, 2023",
      time: "4:00 PM - 5:30 PM",
      status: "completed",
      attendance: 1,
      materials: 2,
      videoUrl: "https://example.com/video4.mp4", // For recorded classes
      duration: "50 minutes", // For recorded classes
      notes: "Still struggling with nested loops, will focus on this next session", // For 1-on-1 sessions
      homework: "Complete the loop challenges in the worksheet" // For 1-on-1 sessions
    },
    {
      id: 5,
      title: "Functions and Modules",
      date: "June 15, 2023",
      time: "4:00 PM - 5:30 PM",
      status: "upcoming",
      attendance: 0,
      materials: 4,
      videoUrl: "", // For recorded classes - empty as not uploaded yet
      duration: "", // For recorded classes - empty as not uploaded yet
      notes: "", // For 1-on-1 sessions - empty for upcoming
      homework: "" // For 1-on-1 sessions - empty for upcoming
    }
  ],
  students: [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      progress: 75,
      lastAttended: "June 11, 2023",
      joinDate: "May 28, 2023",
      age: 12,
      parentName: "Sarah Johnson",
      parentEmail: "sarah.johnson@example.com",
      parentPhone: "+1 (555) 123-4567",
      notes: "Alex is very engaged and asks excellent questions. Shows particular interest in game development.",
      learningStyle: "Visual learner, benefits from diagrams and illustrations",
      strengths: "Quick to grasp new concepts, creative problem-solver",
      areasForImprovement: "Sometimes rushes through exercises without careful planning"
    }
  ],
  materials: [
    {
      id: 1,
      title: "Python Basics Slideshow",
      type: "presentation",
      size: "2.4 MB",
      uploadDate: "May 30, 2023",
      downloads: 3,
      forSession: 1
    },
    {
      id: 2,
      title: "Practice Exercises - Week 1",
      type: "document",
      size: "560 KB",
      uploadDate: "May 31, 2023",
      downloads: 4,
      forSession: 1
    },
    {
      id: 3,
      title: "Control Flow Cheat Sheet",
      type: "document",
      size: "320 KB",
      uploadDate: "June 6, 2023",
      downloads: 2,
      forSession: 3
    },
    {
      id: 4,
      title: "Functions and Modules Guide",
      type: "document",
      size: "480 KB",
      uploadDate: "June 13, 2023",
      downloads: 1,
      forSession: 5
    }
  ]
};

const ClassDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | undefined>(undefined);
  const [selectedSessionTitle, setSelectedSessionTitle] = useState<string | undefined>(undefined);
  const [selectedSessionDate, setSelectedSessionDate] = useState<string | undefined>(undefined);

  const handleEditClass = () => {
    toast({
      title: "Edit mode activated",
      description: "You can now edit the class details.",
    });
  };

  const handleDeleteClass = () => {
    toast({
      title: "Delete confirmation",
      description: "Are you sure you want to delete this class? This action cannot be undone.",
      variant: "destructive",
    });
  };

  const handleUploadVideo = (sessionId: number, title: string, date: string) => {
    setSelectedSessionId(sessionId);
    setSelectedSessionTitle(title);
    setSelectedSessionDate(date);
    setIsVideoUploadOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">Completed</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs">Upcoming</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-xs">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs">{status}</Badge>;
    }
  };
  
  // Determine class type to show appropriate UI
  const classType = classData.classType;
  const typeInfo = getLectureTypeInfo(classType);
  
  const isOneOnOne = typeInfo.size === 'one-on-one';
  const isRecorded = typeInfo.format === 'recorded';
  const isOnline = typeInfo.deliveryMode === 'online';
  const isOffline = typeInfo.deliveryMode === 'offline';
  const isInbound = typeInfo.format === 'inbound';
  const isOutbound = typeInfo.format === 'outbound';
  
  return (
    <TutorDashboardLayout>
      <div className="space-y-6">
        {/* Class Header */}
        <div className="relative rounded-xl overflow-hidden bg-white shadow-sm border border-[#1F4E79]/10">
          <div className="h-32 sm:h-40 md:h-48 w-full">
            <img 
              src={classData.image} 
              alt={classData.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-[#1F4E79]">{classData.title}</h1>
                  <Badge className={`${classData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {classData.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  {/* Class Type Badge */}
                  <Badge className={`bg-${typeInfo.color.substring(3)} text-${typeInfo.color.substring(3)}-800`}>
                    {typeInfo.name}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{classData.subject}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline"
                  size="sm" 
                  onClick={handleEditClass}
                  className="text-xs border-[#1F4E79] text-[#1F4E79] hover:bg-[#F5F7FA]"
                >
                  <Edit className="mr-1 h-3.5 w-3.5" />
                  Edit Class
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={handleDeleteClass}
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 border-[#1F4E79]/10">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-lg font-semibold text-[#1F4E79]">Class Overview</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isOneOnOne ? (
                  // For 1-on-1, show student info instead of enrollment
                  <div className="p-3 bg-[#F5F7FA] rounded-lg">
                    <div className="flex items-center mb-1">
                      <User className="h-4 w-4 text-[#1F4E79] mr-1" />
                      <span className="text-xs font-medium text-muted-foreground">Student</span>
                    </div>
                    <p className="text-lg font-semibold">{classData.students[0]?.name || "No student assigned"}</p>
                    <p className="text-xs text-muted-foreground">Individual learner</p>
                  </div>
                ) : (
                  // For group classes, show enrollment stats
                  <div className="p-3 bg-[#F5F7FA] rounded-lg">
                    <div className="flex items-center mb-1">
                      <Users className="h-4 w-4 text-[#1F4E79] mr-1" />
                      <span className="text-xs font-medium text-muted-foreground">Enrollment</span>
                    </div>
                    <p className="text-lg font-semibold">{classData.enrolledStudents}/{classData.maxStudents}</p>
                    <p className="text-xs text-muted-foreground">Students enrolled</p>
                  </div>
                )}
                
                <div className="p-3 bg-[#F5F7FA] rounded-lg">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 text-[#1F4E79] mr-1" />
                    <span className="text-xs font-medium text-muted-foreground">Sessions</span>
                  </div>
                  <p className="text-lg font-semibold">{classData.completedSessions}/{classData.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Classes completed</p>
                </div>
                
                <div className="p-3 bg-[#F5F7FA] rounded-lg">
                  <div className="flex items-center mb-1">
                    <Star className="h-4 w-4 text-[#F29F05] mr-1" />
                    <span className="text-xs font-medium text-muted-foreground">Rating</span>
                  </div>
                  <p className="text-lg font-semibold">{classData.rating}/5.0</p>
                  <p className="text-xs text-muted-foreground">Student rating</p>
                </div>
                
                <div className="p-3 bg-[#F5F7FA] rounded-lg">
                  <div className="flex items-center mb-1">
                    <BookOpen className="h-4 w-4 text-[#1F4E79] mr-1" />
                    <span className="text-xs font-medium text-muted-foreground">Earnings</span>
                  </div>
                  <p className="text-lg font-semibold">{classData.earnings}</p>
                  <p className="text-xs text-muted-foreground">Total class revenue</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Course Completion</p>
                <div className="flex items-center">
                  <Progress value={classData.completionRate} className="flex-1 bg-[#F5F7FA] h-2 [&>*]:bg-[#1F4E79]" />
                  <span className="ml-2 text-sm font-medium">{classData.completionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#1F4E79]/10">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-lg font-semibold text-[#1F4E79]">
                {isRecorded ? "Next Upload" : "Next Session"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {classData.sessions.find(session => session.status === "upcoming") ? (
                <>
                  <div className="bg-[#F5F7FA] p-3 rounded-lg">
                    <p className="font-medium text-sm">{classData.sessions.find(session => session.status === "upcoming")?.title}</p>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
                        <span>Due: {classData.sessions.find(session => session.status === "upcoming")?.date}</span>
                      </div>
                      {!isRecorded && (
                        <div className="flex items-center text-xs">
                          <Clock className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
                          <span>{classData.sessions.find(session => session.status === "upcoming")?.time}</span>
                        </div>
                      )}
                      
                      {isOffline && (
                        <div className="flex items-center text-xs">
                          <User className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
                          <span>{isInbound ? "Student's location" : "Your location"}</span>
                        </div>
                      )}
                      
                      {isOneOnOne && (
                        <div className="flex items-center text-xs">
                          <User className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
                          <span>{classData.students[0]?.name || "No student assigned"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    {isRecorded ? (
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Video
                      </Button>
                    ) : isOnline ? (
                      <Button className="w-full bg-[#1F4E79] hover:bg-[#1a4369] text-sm">
                        <Video className="mr-2 h-4 w-4" />
                        Start Session
                      </Button>
                    ) : (
                      <Button className="w-full bg-[#1F4E79] hover:bg-[#1a4369] text-sm">
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No upcoming {isRecorded ? "videos" : "sessions"}</p>
                  <Button variant="outline" className="mt-2 text-xs border-[#1F4E79] text-[#1F4E79]">
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    {isRecorded ? "Add New Video" : "Schedule New Session"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
            <TabsTrigger 
              value="sessions"
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
            >
              {isRecorded ? "Videos" : "Sessions"}
            </TabsTrigger>
            
            {isOneOnOne && (
              <TabsTrigger 
                value="student"
                className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] capitalize font-medium data-[state=active]:shadow-none"
              >
                Student
              </TabsTrigger>
            )}
            
            {!isOneOnOne && (
              <TabsTrigger 
                value="students"
                className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] capitalize font-medium data-[state=active]:shadow-none"
              >
                Students
              </TabsTrigger>
            )}
            
            <TabsTrigger 
              value="materials"
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] capitalize font-medium data-[state=active]:shadow-none"
            >
              Materials
            </TabsTrigger>
            
            <TabsTrigger 
              value="settings"
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] capitalize font-medium data-[state=active]:shadow-none"
            >
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sessions" className="pt-4">
            <Card className="border-[#1F4E79]/10">
              <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-[#1F4E79]">
                    {isRecorded ? "Videos" : "Sessions"}
                  </CardTitle>
                  <CardDescription>
                    {isRecorded 
                      ? `Manage your ${isOneOnOne ? '1-on-1' : 'group'} recorded videos` 
                      : `Manage your ${isOneOnOne ? '1-on-1' : 'group'} class sessions`}
                  </CardDescription>
                </div>
                <Button size="sm" className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  {isRecorded ? "New Video" : "New Session"}
                </Button>
              </CardHeader>
              <CardContent className="px-4 pb-4 overflow-x-auto">
                {isRecorded ? (
                  // Recorded classes UI (1-on-1 or group)
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Video Title</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Upload Date</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Duration</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Status</th>
                        {!isOneOnOne && (
                          <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Views</th>
                        )}
                        {isOneOnOne && (
                          <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Watched</th>
                        )}
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Materials</th>
                        {isOneOnOne && (
                          <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Student Notes</th>
                        )}
                        <th className="px-2 py-3 text-right font-medium text-muted-foreground text-xs">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classData.sessions.map((session) => (
                        <tr key={session.id} className="border-b last:border-0 hover:bg-[#F5F7FA] transition-colors">
                          <td className="px-2 py-3">{session.title}</td>
                          <td className="px-2 py-3">{session.date}</td>
                          <td className="px-2 py-3">{session.duration || "-"}</td>
                          <td className="px-2 py-3">
                            {session.videoUrl ? (
                              getStatusBadge("completed")
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-xs">
                                Not Uploaded
                              </Badge>
                            )}
                          </td>
                          {!isOneOnOne && (
                            <td className="px-2 py-3">{session.videoUrl ? Math.floor(Math.random() * 30) + 1 : "-"}</td>
                          )}
                          {isOneOnOne && (
                            <td className="px-2 py-3">{session.videoUrl ? (Math.random() > 0.5 ? "Yes" : "No") : "-"}</td>
                          )}
                          <td className="px-2 py-3">{session.materials}</td>
                          {isOneOnOne && (
                            <td className="px-2 py-3 max-w-[200px] truncate">
                              {session.notes || "-"}
                            </td>
                          )}
                          <td className="px-2 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              {!session.videoUrl ? (
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="text-xs bg-purple-600 hover:bg-purple-700"
                                  onClick={() => handleUploadVideo(session.id, session.title, session.date)}
                                >
                                  <Upload className="mr-1 h-3.5 w-3.5" />
                                  Upload
                                </Button>
                              ) : (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Video className="h-4 w-4" />
                                    <span className="sr-only">Preview</span>
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : isOnline ? (
                  // Live classes UI (online)
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Session</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Date</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Time</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Status</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">
                          {isOneOnOne ? "Attendance" : "Attendees"}
                        </th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Materials</th>
                        {isOneOnOne && (
                          <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Notes</th>
                        )}
                        <th className="px-2 py-3 text-right font-medium text-muted-foreground text-xs">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classData.sessions.map((session) => (
                        <tr key={session.id} className="border-b last:border-0 hover:bg-[#F5F7FA] transition-colors">
                          <td className="px-2 py-3">{session.title}</td>
                          <td className="px-2 py-3">{session.date}</td>
                          <td className="px-2 py-3">{session.time}</td>
                          <td className="px-2 py-3">{getStatusBadge(session.status)}</td>
                          <td className="px-2 py-3">
                            {isOneOnOne 
                              ? (session.attendance > 0 ? "Present" : "-") 
                              : (session.status === "completed" ? `${session.attendance}/${classData.enrolledStudents}` : "-")}
                          </td>
                          <td className="px-2 py-3">{session.materials}</td>
                          {isOneOnOne && (
                            <td className="px-2 py-3 max-w-[200px] truncate">{session.notes || "-"}</td>
                          )}
                          <td className="px-2 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              {session.status === "upcoming" && (
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]"
                                >
                                  <Video className="mr-1 h-3.5 w-3.5" />
                                  Start
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">Notes</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              {session.status === "upcoming" && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Cancel</span>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  // Offline classes UI
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Session</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Date</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Time</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Location</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Status</th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">
                          {isOneOnOne ? "Attendance" : "Attendees"}
                        </th>
                        <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Materials</th>
                        {isOneOnOne && (
                          <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Notes</th>
                        )}
                        <th className="px-2 py-3 text-right font-medium text-muted-foreground text-xs">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classData.sessions.map((session) => (
                        <tr key={session.id} className="border-b last:border-0 hover:bg-[#F5F7FA] transition-colors">
                          <td className="px-2 py-3">{session.title}</td>
                          <td className="px-2 py-3">{session.date}</td>
                          <td className="px-2 py-3">{session.time}</td>
                          <td className="px-2 py-3">{isInbound ? "Student's location" : "Your center"}</td>
                          <td className="px-2 py-3">{getStatusBadge(session.status)}</td>
                          <td className="px-2 py-3">
                            {isOneOnOne 
                              ? (session.attendance > 0 ? "Present" : "-") 
                              : (session.status === "completed" ? `${session.attendance}/${classData.enrolledStudents}` : "-")}
                          </td>
                          <td className="px-2 py-3">{session.materials}</td>
                          {isOneOnOne && (
                            <td className="px-2 py-3 max-w-[200px] truncate">{session.notes || "-"}</td>
                          )}
                          <td className="px-2 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              {session.status === "upcoming" && (
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]"
                                >
                                  <CheckSquare className="mr-1 h-3.5 w-3.5" />
                                  Mark Complete
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">Notes</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              {session.status === "upcoming" && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Cancel</span>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Rest of the tabs: student, students, materials, settings */}
          <TabsContent value="student" className="pt-4">
            <Card className="border-[#1F4E79]/10">
              <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-[#1F4E79]">Student Information</CardTitle>
                  <CardDescription>Manage your 1-on-1 student</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-xs border-[#1F4E79] text-[#1F4E79] hover:bg-[#F5F7FA]">
                  <MessageSquare className="mr-1 h-3.5 w-3.5" />
                  Message Student
                </Button>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {classData.students.length > 0 ? (
                  <div className="space-y-6">
                    {/* Student Profile */}
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-shrink-0">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={classData.students[0].avatar} alt={classData.students[0].name} />
                          <AvatarFallback>{classData.students[0].name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-grow space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">{classData.students[0].name}</h3>
                          <p className="text-muted-foreground">{classData.students[0].email}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline">Age: {classData.students[0].age}</Badge>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <Badge variant="outline">Joined: {classData.students[0].joinDate}</Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Progress</h4>
                            <div className="flex items-center gap-2">
                              <Progress value={classData.students[0].progress} className="w-full bg-[#F5F7FA] h-2 [&>*]:bg-[#1F4E79]" />
                              <span className="text-sm">{classData.students[0].progress}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Last Attended</h4>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{classData.students[0].lastAttended}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Parent Contact Information */}
                    <div>
                      <h3 className="text-md font-medium mb-3">Parent/Guardian Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#F5F7FA] p-3 rounded-lg">
                          <p className="text-sm font-medium">Name</p>
                          <p>{classData.students[0].parentName}</p>
                        </div>
                        <div className="bg-[#F5F7FA] p-3 rounded-lg">
                          <p className="text-sm font-medium">Email</p>
                          <p>{classData.students[0].parentEmail}</p>
                        </div>
                        <div className="bg-[#F5F7FA] p-3 rounded-lg">
                          <p className="text-sm font-medium">Phone</p>
                          <p>{classData.students[0].parentPhone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Learning Profile */}
                    <div>
                      <h3 className="text-md font-medium mb-3">Learning Profile</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="bg-[#F5F7FA] p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Learning Style</p>
                          <p className="text-sm">{classData.students[0].learningStyle}</p>
                        </div>
                        <div className="bg-[#F5F7FA] p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Strengths</p>
                          <p className="text-sm">{classData.students[0].strengths}</p>
                        </div>
                        <div className="bg-[#F5F7FA] p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Areas for Improvement</p>
                          <p className="text-sm">{classData.students[0].areasForImprovement}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Teacher Notes */}
                    <div>
                      <h3 className="text-md font-medium mb-3">Teacher Notes</h3>
                      <div className="bg-[#F5F7FA] p-3 rounded-lg">
                        <p className="text-sm">{classData.students[0].notes}</p>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button size="sm" className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]">
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Update Notes
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No student assigned to this class yet.</p>
                    <Button variant="outline" className="mt-3 text-xs border-[#1F4E79] text-[#1F4E79]">
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Assign Student
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="materials" className="pt-4">
            <Card className="border-[#1F4E79]/10">
              <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-[#1F4E79]">Class Materials</CardTitle>
                  <CardDescription>Manage teaching resources for your 1-on-1 class</CardDescription>
                </div>
                <Button size="sm" className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Upload Material
                </Button>
              </CardHeader>
              <CardContent className="px-4 pb-4 overflow-x-auto">
                <div className="mb-4">
                  <div className="text-sm font-medium">Filter by session:</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">All Sessions</Badge>
                    {classData.sessions.map((session, index) => (
                      <Badge 
                        key={session.id} 
                        variant="outline"
                        className="cursor-pointer hover:bg-muted"
                      >
                        Session {index + 1}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Title</th>
                      <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Type</th>
                      <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Size</th>
                      <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">For Session</th>
                      <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Upload Date</th>
                      <th className="px-2 py-3 text-left font-medium text-muted-foreground text-xs">Downloads</th>
                      <th className="px-2 py-3 text-right font-medium text-muted-foreground text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData.materials.map((material) => (
                      <tr key={material.id} className="border-b last:border-0 hover:bg-[#F5F7FA] transition-colors">
                        <td className="px-2 py-3">{material.title}</td>
                        <td className="px-2 py-3 capitalize">{material.type}</td>
                        <td className="px-2 py-3">{material.size}</td>
                        <td className="px-2 py-3">Session {material.forSession}</td>
                        <td className="px-2 py-3">{material.uploadDate}</td>
                        <td className="px-2 py-3">{material.downloads}</td>
                        <td className="px-2 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="pt-4">
            <Card className="border-[#1F4E79]/10">
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-lg font-semibold text-[#1F4E79]">Class Settings</CardTitle>
                <CardDescription>Manage settings for your 1-on-1 class</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Class Description</h3>
                    <p className="text-sm text-muted-foreground">{classData.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Status</h3>
                      <div className="flex items-center">
                        <Badge className={`${classData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {classData.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Class Type</h3>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-100 text-indigo-800">
                          1-on-1
                        </Badge>
                        
                        {isRecorded ? (
                          <Badge className="bg-purple-100 text-purple-800">
                            Online Recorded
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800">
                            Online Live
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Visibility</h3>
                      <div className="flex items-center">
                        <Badge className="bg-blue-100 text-blue-800">
                          Public
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Payment Type</h3>
                      <div className="flex items-center">
                        <Badge className={classData.paymentType === 'fixed' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                          {classData.paymentType === 'fixed' ? 'One-time Payment' : 'Subscription'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-[#1F4E79] text-[#1F4E79] hover:bg-[#F5F7FA] mr-2"
                      onClick={handleEditClass}
                    >
                      <Edit className="mr-1 h-3.5 w-3.5" />
                      Edit Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={handleDeleteClass}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Delete Class
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Upload Dialog - only for recorded classes */}
      {isRecorded && (
        <VideoUploadDialog
          isOpen={isVideoUploadOpen}
          onClose={() => setIsVideoUploadOpen(false)}
          sessionId={selectedSessionId}
          sessionTitle={selectedSessionTitle}
          sessionDate={selectedSessionDate}
        />
      )}
    </TutorDashboardLayout>
  );
};

export default ClassDetails;
