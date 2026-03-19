
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  Heart,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import StudentDashboardLayout from "@/components/StudentDashboardLayout";

const UserDashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Dashboard | Indu AE";
  }, []);

  if (!user) return null;

  return (
    <StudentDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Welcome back, {user.fullName.split(' ')[0]}!</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's what's happening with your learning journey
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next class in 2 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes Taken</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">7 different subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.5</div>
              <p className="text-xs text-muted-foreground">Hours of learning completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Classes</CardTitle>
              <Heart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Classes saved for later</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingClasses.map((cls) => (
                <Card key={cls.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{cls.title}</CardTitle>
                    <CardDescription>with {cls.tutor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{cls.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{cls.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{cls.students} students</span>
                      </div>
                      <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                        Join Class
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/student-dashboard/enrolled-classes">View All Classes</Link>
            </Button>
          </TabsContent>
          <TabsContent value="recommended" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendedClasses.map((cls) => (
                <Card key={cls.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{cls.title}</CardTitle>
                    <CardDescription>with {cls.tutor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        {cls.description}
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{cls.students} students enrolled</span>
                      </div>
                      <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                        Explore Class
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full">View More Recommendations</Button>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4 pb-4 border-b last:border-0 last:pb-0">
                    <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
};

const upcomingClasses = [
  { id: 1, title: "Introduction to Python", tutor: "Dr. Sarah Johnson", date: "June 15, 2023", time: "4:00 PM - 5:30 PM", students: 12 },
  { id: 2, title: "Creative Writing Workshop", tutor: "James Peterson", date: "June 17, 2023", time: "2:00 PM - 3:00 PM", students: 8 },
  { id: 3, title: "Math Problem Solving", tutor: "Michael Chen", date: "June 18, 2023", time: "10:00 AM - 11:30 AM", students: 15 },
];

const recommendedClasses = [
  { id: 1, title: "Web Development for Teens", tutor: "Alex Rodriguez", description: "Learn HTML, CSS, and JavaScript in this hands-on course for beginners.", students: 24 },
  { id: 2, title: "Public Speaking Fundamentals", tutor: "Emily Washington", description: "Build confidence and communication skills in a supportive environment.", students: 18 },
  { id: 3, title: "Science Experiments at Home", tutor: "Dr. Robert Miller", description: "Exciting experiments using everyday materials that teach fundamental science concepts.", students: 32 },
];

const notifications = [
  { id: 1, title: "Class Reminder", message: "Your 'Introduction to Python' class starts in 24 hours.", time: "Today, 9:30 AM" },
  { id: 2, title: "New Message", message: "You've received a new message from Dr. Sarah Johnson.", time: "Yesterday, 4:15 PM" },
  { id: 3, title: "Assignment Due", message: "Your 'Creative Writing' assignment is due tomorrow.", time: "Yesterday, 10:00 AM" },
  { id: 4, title: "New Class Available", message: "A new 'Advanced Python' class is now available for enrollment.", time: "June 10, 2:30 PM" },
];

export default UserDashboard;
