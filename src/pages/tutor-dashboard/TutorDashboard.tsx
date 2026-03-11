
import { useEffect } from "react";
import { 
  Users, 
  Calendar, 
  Star,
  DollarSign,
  Plus,
  MessageSquare,
  Download,
  FileText,
  Clock,
  BookOpen
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDesignTokens } from "@/hooks/use-design-tokens";

// Import our components
import MetricCard from "@/components/tutor-dashboard/MetricCard";
import TeachingProgress from "@/components/tutor-dashboard/TeachingProgress";
import QuickStats from "@/components/tutor-dashboard/QuickStats";
import UpcomingSessions from "@/components/tutor-dashboard/UpcomingSessions";
import RecentActivity from "@/components/tutor-dashboard/RecentActivity";
import NotificationsList from "@/components/tutor-dashboard/NotificationItem";
import { 
  upcomingSessions, 
  recentActivities, 
  notifications, 
  metricCards,
  quickStats,
  teachingProgress
} from "@/components/tutor-dashboard/mock-data";

const TutorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { colors, buttonStyles } = useDesignTokens();
  
  useEffect(() => {
    document.title = "Tutor Dashboard | Indu AE";
  }, []);

  if (!user) return null;
  
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: "Action initiated",
      description: `You clicked on ${action}`,
      duration: 4000,
    });
  };

  return (
    <TutorDashboardLayout>
      <div className="flex flex-col gap-8 pb-8 max-w-7xl mx-auto">
        {/* Welcome banner */}
        <div className="bg-purple-100 rounded-md shadow-sm p-6 animate-fade-in">
          <h1 className="text-2xl font-semibold leading-tight text-purple-900">
            {getGreeting()}, {user.fullName?.split(' ')[0] || 'Tutor'}!
          </h1>
          <p className="text-purple-800 mt-2 text-base">
            Here's what's happening with your teaching journey
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <Button 
              className="bg-white text-purple-700 hover:bg-gray-100 transition-all border border-purple-200 hover:scale-[0.98] active:scale-[0.97]"
              onClick={() => handleQuickAction("Create New Class")}
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Class
            </Button>
          </div>
        </div>
        
        {/* Key metrics - using 12 column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <MetricCard
            title="Classes"
            value="23"
            description="3 Offline, 20 Online"
            icon={<FileText className="h-4 w-4 text-white" />}
            iconBg="bg-blue-700"
            change="0"
            period="added from last month"
            trend="neutral"
          />
          <MetricCard
            title="Today's Sessions"
            value="2"
            description="Live Classes"
            icon={<Calendar className="h-4 w-4 text-white" />}
            iconBg="bg-teal-500"
            change="-1"
            period="from yesterday"
            trend="down"
          />
          <MetricCard
            title="Total Students"
            value="156"
            description="Currently Enrolled"
            icon={<Users className="h-4 w-4 text-white" />}
            iconBg="bg-purple-700"
            change="+14%"
            period="from last month"
            trend="up"
          />
        </div>
        
        {/* Additional metrics row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <MetricCard
            title="Monthly Revenue"
            value="₹15,000"
            description="This Month"
            icon={<DollarSign className="h-4 w-4 text-white" />}
            iconBg="bg-cyan-500"
            change="+₹5,000"
            period="from last month"
            trend="up"
          />
          <MetricCard
            title="Unread Messages"
            value="12"
            description="From Students"
            icon={<MessageSquare className="h-4 w-4 text-white" />}
            iconBg="bg-pink-500"
            change="+1"
            period="from yesterday"
            trend="up"
          />
          <MetricCard
            title="Average Ratings"
            value="4.5"
            description="From 135 Reviews"
            icon={<Star className="h-4 w-4 text-white" />}
            iconBg="bg-amber-500"
            change="Excellent"
            period=""
            trend="up"
          />
        </div>
        
        {/* Teaching progress - using 12 column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2">
            <TeachingProgress chartData={teachingProgress} />
          </div>
          <div className="md:col-span-1">
            <QuickStats stats={quickStats} />
          </div>
        </div>
        
        {/* Upcoming sessions and Notifications tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-[#F5F7FA] mb-6 h-auto">
            <TabsTrigger 
              value="upcoming" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2 text-sm"
            >
              Upcoming Sessions
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2 text-sm"
            >
              Recent Activity
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2 text-sm"
            >
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-purple-800">Upcoming Sessions</h2>
              <Button 
                className="bg-purple-700 hover:bg-purple-800 text-white transition-all hover:scale-[0.98] active:scale-[0.97]"
                onClick={() => handleQuickAction("Create New Session")}
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Session
              </Button>
            </div>
            <UpcomingSessions sessions={upcomingSessions} maxVisible={6} />
          </TabsContent>
          
          <TabsContent value="recent" className="mt-0">
            <RecentActivity activities={recentActivities} maxVisible={8} />
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0">
            <NotificationsList notifications={notifications} maxVisible={8} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="border-t pt-6 mt-4 text-center text-sm text-muted-foreground space-x-4">
          <a href="#" className="hover:text-purple-700 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-purple-700 transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-purple-700 transition-colors">Contact Support</a>
        </footer>
      </div>
    </TutorDashboardLayout>
  );
};

export default TutorDashboard;
