
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Star,
  ClipboardList,
  MessageSquare,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ConsultantDashboardLayout from "@/components/ConsultantDashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const ConsultantDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Consultant Dashboard | Indu AE";
  }, []);

  if (!user) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const metrics = [
    {
      title: "Pending Demo Requests",
      value: "12",
      description: "From parents awaiting match",
      icon: <ClipboardList className="h-4 w-4 text-white" />,
      iconBg: "bg-orange-500",
      change: "+4",
      period: "since yesterday",
      trend: "up" as const,
    },
    {
      title: "Active Allocations",
      value: "34",
      description: "Tutor-parent pairs managed",
      icon: <UserCheck className="h-4 w-4 text-white" />,
      iconBg: "bg-teal-600",
      change: "+6",
      period: "from last week",
      trend: "up" as const,
    },
    {
      title: "Demos Scheduled",
      value: "8",
      description: "This week",
      icon: <Calendar className="h-4 w-4 text-white" />,
      iconBg: "bg-blue-600",
      change: "+2",
      period: "from last week",
      trend: "up" as const,
    },
    {
      title: "Parent Satisfaction",
      value: "4.7",
      description: "From 58 reviews",
      icon: <Star className="h-4 w-4 text-white" />,
      iconBg: "bg-amber-500",
      change: "+0.2",
      period: "from last month",
      trend: "up" as const,
    },
    {
      title: "Tutor Response Rate",
      value: "92%",
      description: "Avg. within 24 hours",
      icon: <Users className="h-4 w-4 text-white" />,
      iconBg: "bg-purple-600",
      change: "+5%",
      period: "from last month",
      trend: "up" as const,
    },
    {
      title: "Unread Messages",
      value: "6",
      description: "3 parents, 3 tutors",
      icon: <MessageSquare className="h-4 w-4 text-white" />,
      iconBg: "bg-pink-500",
      change: "+2",
      period: "since yesterday",
      trend: "up" as const,
    },
  ];

  const pendingRequests = [
    {
      id: 1,
      parentName: "Anita Sharma",
      parentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      childName: "Riya Sharma",
      subject: "Mathematics (Class 10)",
      format: "Online Live 1-on-1",
      requestedDate: "2 hours ago",
      urgency: "high" as const,
    },
    {
      id: 2,
      parentName: "Rajesh Kumar",
      parentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      childName: "Arjun Kumar",
      subject: "Physics (Class 12)",
      format: "Offline Inbound",
      requestedDate: "5 hours ago",
      urgency: "medium" as const,
    },
    {
      id: 3,
      parentName: "Priya Mehta",
      parentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
      childName: "Aarav Mehta",
      subject: "English Speaking",
      format: "Online Live Group",
      requestedDate: "1 day ago",
      urgency: "low" as const,
    },
    {
      id: 4,
      parentName: "Suresh Patel",
      parentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      childName: "Neha Patel",
      subject: "Chemistry (Class 11)",
      format: "Online Live 1-on-1",
      requestedDate: "1 day ago",
      urgency: "medium" as const,
    },
  ];

  const upcomingDemos = [
    {
      id: 1,
      parentName: "Kavita Joshi",
      childName: "Siddharth Joshi",
      tutorName: "Dr. Meena Iyer",
      subject: "Mathematics",
      dateTime: "Today, 4:00 PM",
      format: "Online Live",
      status: "confirmed" as const,
    },
    {
      id: 2,
      parentName: "Deepak Verma",
      childName: "Aisha Verma",
      tutorName: "Ravi Shankar",
      subject: "Hindi Literature",
      dateTime: "Tomorrow, 10:30 AM",
      format: "Online Live",
      status: "confirmed" as const,
    },
    {
      id: 3,
      parentName: "Anita Sharma",
      childName: "Riya Sharma",
      tutorName: "Pending Assignment",
      subject: "Mathematics",
      dateTime: "Wed, 3:00 PM",
      format: "Online Live",
      status: "pending" as const,
    },
  ];

  const recentActivities = [
    { id: 1, action: "Assigned tutor Dr. Meena Iyer to Siddharth Joshi for Mathematics", time: "1 hour ago", type: "allocation" },
    { id: 2, action: "Demo class confirmed: Aisha Verma with Ravi Shankar", time: "3 hours ago", type: "demo" },
    { id: 3, action: "New demo request from Anita Sharma for Mathematics", time: "5 hours ago", type: "request" },
    { id: 4, action: "Parent Kavita Joshi rated tutor match 5 stars", time: "1 day ago", type: "feedback" },
    { id: 5, action: "Tutor Priya Singh confirmed availability for demo", time: "1 day ago", type: "response" },
  ];

  const urgencyColor = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-green-100 text-green-700",
  };

  const urgencyLabel = {
    high: "Urgent",
    medium: "Normal",
    low: "Low",
  };

  return (
    <ConsultantDashboardLayout>
      <div className="flex flex-col gap-8 pb-8 max-w-7xl mx-auto">
        {/* Welcome banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 animate-fade-in">
          <h1 className="text-2xl font-semibold leading-tight text-teal-800">
            {getGreeting()}, {user.fullName?.split(" ")[0] || "Consultant"}!
          </h1>
          <p className="text-teal-700 mt-2 text-base">
            You have <span className="font-semibold">12 pending demo requests</span> and{" "}
            <span className="font-semibold">3 demos scheduled</span> this week.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link to="/consultant-dashboard/demo-requests">
              <Button className="bg-teal-700 hover:bg-teal-800 text-white">
                <ClipboardList className="mr-2 h-4 w-4" /> View Demo Requests
              </Button>
            </Link>
            <Link to="/consultant-dashboard/demo-scheduling">
              <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50">
                <Calendar className="mr-2 h-4 w-4" /> Schedule Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                  </div>
                  <div className={`${metric.iconBg} p-2 rounded-lg`}>{metric.icon}</div>
                </div>
                <div className="mt-3 flex items-center text-xs">
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-0.5" />
                  )}
                  <span className={`font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {metric.change}
                  </span>
                  <span className="text-muted-foreground ml-1">{metric.period}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two-column: Pending Requests + Upcoming Demos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Demo Requests */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-teal-800">
                  Pending Demo Requests
                </CardTitle>
                <Link to="/consultant-dashboard/demo-requests">
                  <Button variant="ghost" size="sm" className="text-teal-700 hover:text-teal-800 text-xs">
                    View All <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-9 w-9 mt-0.5">
                    <AvatarImage src={req.parentAvatar} />
                    <AvatarFallback className="bg-teal-100 text-teal-800 text-xs">
                      {req.parentName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{req.parentName}</p>
                      <Badge className={`text-[10px] ${urgencyColor[req.urgency]}`} variant="secondary">
                        {urgencyLabel[req.urgency]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {req.childName} &middot; {req.subject}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-muted-foreground">{req.format}</span>
                      <span className="text-[11px] text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {req.requestedDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Demos */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-teal-800">
                  Upcoming Demo Classes
                </CardTitle>
                <Link to="/consultant-dashboard/demo-scheduling">
                  <Button variant="ghost" size="sm" className="text-teal-700 hover:text-teal-800 text-xs">
                    View All <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {upcomingDemos.map((demo) => (
                <div
                  key={demo.id}
                  className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-teal-700" />
                      <span className="text-sm font-medium">{demo.dateTime}</span>
                    </div>
                    <Badge
                      className={`text-[10px] ${
                        demo.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                      variant="secondary"
                    >
                      {demo.status === "confirmed" ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" />Confirmed</>
                      ) : (
                        <><AlertCircle className="h-3 w-3 mr-1" />Tutor Pending</>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{demo.subject}</p>
                  <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground">
                    <span>Student: {demo.childName}</span>
                    <span>Tutor: {demo.tutorName}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Parent: {demo.parentName} &middot; {demo.format}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Allocation Performance */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-teal-800">
              Allocation Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Demo → Booking Conversion</span>
                  <span className="text-sm font-semibold">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Avg. Match Time</span>
                  <span className="text-sm font-semibold">18 hrs</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Parent Retention Rate</span>
                  <span className="text-sm font-semibold">89%</span>
                </div>
                <Progress value={89} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-teal-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        activity.type === "allocation"
                          ? "bg-teal-500"
                          : activity.type === "demo"
                          ? "bg-blue-500"
                          : activity.type === "request"
                          ? "bg-orange-500"
                          : activity.type === "feedback"
                          ? "bg-amber-500"
                          : "bg-purple-500"
                      }`}
                    />
                    <p className="text-sm">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="border-t pt-6 mt-4 text-center text-sm text-muted-foreground space-x-4">
          <a href="#" className="hover:text-teal-700 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-teal-700 transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-teal-700 transition-colors">Contact Support</a>
        </footer>
      </div>
    </ConsultantDashboardLayout>
  );
};

export default ConsultantDashboard;
