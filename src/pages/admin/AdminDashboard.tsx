
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Activity, TrendingUp, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Classes",
      value: "1,234",
      change: "+8%",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: "$45,678",
      change: "+15%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Platform Activity",
      value: "89%",
      change: "+3%",
      icon: Activity,
      color: "text-orange-600"
    },
    {
      title: "Growth Rate",
      value: "23%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-red-600"
    },
    {
      title: "Scheduled Classes",
      value: "567",
      change: "+18%",
      icon: Calendar,
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-talent-dark">Admin Dashboard</h1>
        <p className="text-talent-muted mt-2">Welcome back! Here's what's happening with your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-talent-muted">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-talent-dark">{stat.value}</div>
                <p className="text-xs text-green-600 font-medium">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New tutor registered", time: "2 minutes ago", type: "user" },
                { action: "Class booking completed", time: "5 minutes ago", type: "booking" },
                { action: "Payment processed", time: "10 minutes ago", type: "payment" },
                { action: "New student enrolled", time: "15 minutes ago", type: "user" },
                { action: "Class completed", time: "20 minutes ago", type: "class" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-talent-light rounded-lg">
                  <span className="text-sm text-talent-dark">{activity.action}</span>
                  <span className="text-xs text-talent-muted">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Add User", color: "bg-blue-500" },
                { label: "Create Class", color: "bg-green-500" },
                { label: "View Reports", color: "bg-purple-500" },
                { label: "Manage Payments", color: "bg-orange-500" },
                { label: "Send Notification", color: "bg-red-500" },
                { label: "System Settings", color: "bg-indigo-500" }
              ].map((action, index) => (
                <button
                  key={index}
                  className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
