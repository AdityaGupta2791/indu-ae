import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Activity, TrendingUp, Calendar } from "lucide-react";
import { adminService } from "@/services/admin.service";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    adminService
      .listUsers({ page: 1, limit: 1 })
      .then((res) => setTotalUsers(res.meta.total))
      .catch(() => setTotalUsers(null));
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers !== null ? totalUsers.toLocaleString() : "—",
      change: totalUsers !== null ? "Live" : "Unavailable",
      icon: Users,
      color: "text-blue-600",
      live: true,
    },
    {
      title: "Active Classes",
      value: "—",
      change: "Coming soon",
      icon: BookOpen,
      color: "text-green-600",
      live: false,
    },
    {
      title: "Monthly Revenue",
      value: "—",
      change: "Coming soon",
      icon: DollarSign,
      color: "text-purple-600",
      live: false,
    },
    {
      title: "Platform Activity",
      value: "—",
      change: "Coming soon",
      icon: Activity,
      color: "text-orange-600",
      live: false,
    },
    {
      title: "Growth Rate",
      value: "—",
      change: "Coming soon",
      icon: TrendingUp,
      color: "text-red-600",
      live: false,
    },
    {
      title: "Scheduled Classes",
      value: "—",
      change: "Coming soon",
      icon: Calendar,
      color: "text-indigo-600",
      live: false,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening with your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <p className={`text-xs font-medium ${stat.live ? "text-green-600" : "text-muted-foreground"}`}>
                  {stat.change}
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
            <div className="text-center py-8 text-muted-foreground text-sm">
              Activity feed will be available when booking and session modules are built.
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
                { label: "Manage Users", color: "bg-blue-500", href: "/admin/users" },
                { label: "Create Class", color: "bg-green-500", href: "#" },
                { label: "View Reports", color: "bg-purple-500", href: "#" },
                { label: "Manage Payments", color: "bg-orange-500", href: "#" },
                { label: "Send Notification", color: "bg-red-500", href: "#" },
                { label: "System Settings", color: "bg-indigo-500", href: "#" },
              ].map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium text-center block`}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
