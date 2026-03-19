
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, BookOpen, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight,
  Download, Calendar,
} from "lucide-react";

const Analytics = () => {
  const kpiCards = [
    { title: "Total Revenue", value: "₹12,45,600", change: "+18.2%", up: true, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { title: "Active Users", value: "8,432", change: "+12.5%", up: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Classes Completed", value: "3,217", change: "+9.1%", up: true, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Conversion Rate", value: "24.8%", change: "-1.3%", up: false, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const monthlyData = [
    { month: "Oct", users: 5200, revenue: 820000, classes: 1890 },
    { month: "Nov", users: 6100, revenue: 945000, classes: 2340 },
    { month: "Dec", users: 6800, revenue: 1023000, classes: 2560 },
    { month: "Jan", users: 7400, revenue: 1102000, classes: 2780 },
    { month: "Feb", users: 8000, revenue: 1180000, classes: 3010 },
    { month: "Mar", users: 8432, revenue: 1245600, classes: 3217 },
  ];

  const topSubjects = [
    { name: "Mathematics", students: 2340, revenue: "₹3,45,000", growth: "+15%" },
    { name: "Science", students: 1890, revenue: "₹2,78,000", growth: "+12%" },
    { name: "English", students: 1560, revenue: "₹2,12,000", growth: "+8%" },
    { name: "Coding & Robotics", students: 1230, revenue: "₹1,98,000", growth: "+22%" },
    { name: "Art & Design", students: 980, revenue: "₹1,45,000", growth: "+18%" },
  ];

  const topTutors = [
    { name: "Priya Sharma", subject: "Mathematics", students: 145, rating: 4.9, earnings: "₹1,23,000" },
    { name: "Rajesh Kumar", subject: "Science", students: 132, rating: 4.8, earnings: "₹1,08,000" },
    { name: "Anita Desai", subject: "English", students: 118, rating: 4.9, earnings: "₹96,000" },
    { name: "Vikram Singh", subject: "Coding", students: 105, rating: 4.7, earnings: "₹89,000" },
    { name: "Meera Patel", subject: "Art", students: 98, rating: 4.8, earnings: "₹78,000" },
  ];

  const userBreakdown = [
    { role: "Students", count: 5200, pct: 42, color: "bg-blue-500" },
    { role: "Parents", count: 4100, pct: 33, color: "bg-indigo-500" },
    { role: "Tutors", count: 2400, pct: 19, color: "bg-purple-500" },
    { role: "Consultants", count: 732, pct: 6, color: "bg-teal-500" },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics & Reporting</h1>
          <p className="text-muted-foreground text-sm mt-1">Platform performance overview and insights.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 6 Months
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${kpi.bg}`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-1 ${kpi.up ? "text-green-600" : "text-red-500"}`}>
                    {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart (bar chart using divs) */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-800">
                  ₹{(d.revenue / 100000).toFixed(1)}L
                </span>
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>User Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userBreakdown.map((u) => (
              <div key={u.role}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{u.role}</span>
                  <span className="text-sm text-muted-foreground">{u.count.toLocaleString()} ({u.pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${u.color} h-2 rounded-full transition-all`} style={{ width: `${u.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Subjects */}
        <Card>
          <CardHeader>
            <CardTitle>Top Subjects by Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSubjects.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.students.toLocaleString()} students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{s.revenue}</p>
                    <p className="text-xs text-green-600">{s.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Tutors */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Tutors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Tutor</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Subject</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Students</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Rating</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topTutors.map((t) => (
                  <tr key={t.name} className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium">{t.name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{t.subject}</td>
                    <td className="py-3 text-sm">{t.students}</td>
                    <td className="py-3 text-sm">
                      <span className="inline-flex items-center gap-1 text-yellow-600">⭐ {t.rating}</span>
                    </td>
                    <td className="py-3 text-sm font-medium">{t.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
