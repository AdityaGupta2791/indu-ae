
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ParentDashboardLayout from "@/components/ParentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, Calendar, CreditCard, BookOpen, ClipboardList, Star,
  ArrowRight, Search, CreditCard as CreditIcon,
} from "lucide-react";
import { ChildProfileCard } from "@/components/shared";

const ParentDashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Parent Dashboard | Indu AE";
  }, []);

  if (!user) return null;

  const children = user.children || [];
  const creditBalance = user.creditBalance || 0;


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const metrics = [
    { title: "My Children", value: String(children.length), description: "Profiles added", icon: <Users className="h-4 w-4 text-white" />, iconBg: "bg-indigo-600", href: "/parent-dashboard/children" },
    { title: "Upcoming Demos", value: "0", description: "Scheduled this week", icon: <Calendar className="h-4 w-4 text-white" />, iconBg: "bg-blue-600", href: "/parent-dashboard/demo-requests" },
    { title: "Credit Balance", value: `AED ${(creditBalance / 100).toFixed(2)}`, description: "Available credits", icon: <CreditCard className="h-4 w-4 text-white" />, iconBg: "bg-green-600", href: "/parent-dashboard/credits" },
    { title: "Active Classes", value: "0", description: "Across all children", icon: <BookOpen className="h-4 w-4 text-white" />, iconBg: "bg-purple-600", href: "/parent-dashboard/enrolled-classes" },
    { title: "Assessments", value: "0", description: "New results available", icon: <ClipboardList className="h-4 w-4 text-white" />, iconBg: "bg-amber-500", href: "/parent-dashboard/assessments" },
    { title: "Avg. Tutor Rating", value: "--", description: "From your reviews", icon: <Star className="h-4 w-4 text-white" />, iconBg: "bg-pink-500", href: "/parent-dashboard/enrolled-classes" },
  ];

  return (
    <ParentDashboardLayout>
      <div className="flex flex-col gap-6 pb-8 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
          <h1 className="text-2xl font-semibold text-indigo-800">
            {getGreeting()}, {user.fullName?.split(" ")[0] || "Parent"}!
          </h1>
          <p className="text-indigo-700 mt-2">
            Manage your children's education, find the best tutors, and track their progress.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <Link key={index} to={metric.href}>
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                    </div>
                    <div className={`${metric.iconBg} p-2 rounded-lg`}>{metric.icon}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Two-column layout: Children + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Children Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">My Children</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/parent-dashboard/children" className="text-xs text-indigo-600">
                    View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {children.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {children.slice(0, 4).map((child) => (
                      <ChildProfileCard
                        key={child.id}
                        child={child}
                        showActions={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No children added yet</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link to="/parent-dashboard/children">Add Child</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link to="/parent-dashboard/find-tutors">
                    <Search className="h-4 w-4 text-indigo-500" />
                    Find a Tutor
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link to="/parent-dashboard/demo-requests">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Request Demo Class
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link to="/parent-dashboard/credits">
                    <CreditIcon className="h-4 w-4 text-green-500" />
                    Purchase Credits
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentDashboard;
