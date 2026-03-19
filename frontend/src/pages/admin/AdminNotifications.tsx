
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Bell, Send, Users, AlertTriangle, CheckCircle, Info,
  Search, Filter, Trash2,
} from "lucide-react";

const allNotifications = [
  { id: 1, type: "alert", title: "Payment Gateway Issue", desc: "Stripe payment processing is experiencing delays. 3 transactions pending.", time: "5m ago", read: false },
  { id: 2, type: "user", title: "New Tutor Registration", desc: "Priya Sharma registered as a tutor and is pending verification.", time: "15m ago", read: false },
  { id: 3, type: "success", title: "System Backup Complete", desc: "Daily database backup completed successfully.", time: "1h ago", read: false },
  { id: 4, type: "info", title: "Platform Update Available", desc: "Version 2.4.1 is ready for deployment with bug fixes.", time: "2h ago", read: true },
  { id: 5, type: "user", title: "Tutor Verification Request", desc: "Rajesh Kumar submitted documents for verification review.", time: "3h ago", read: true },
  { id: 6, type: "alert", title: "High Server Load", desc: "Server CPU usage exceeded 85% threshold for 10 minutes.", time: "4h ago", read: true },
  { id: 7, type: "success", title: "Email Campaign Sent", desc: "Monthly newsletter sent successfully to 8,432 users.", time: "5h ago", read: true },
  { id: 8, type: "info", title: "New Feedback Received", desc: "12 new feedback entries from parents this week.", time: "6h ago", read: true },
  { id: 9, type: "user", title: "Bulk Registration", desc: "15 new students enrolled via partner school integration.", time: "1d ago", read: true },
  { id: 10, type: "alert", title: "Failed Login Attempts", desc: "Multiple failed login attempts detected from IP 203.x.x.x.", time: "1d ago", read: true },
];

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string; badge: string }> = {
  alert: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
  user: { icon: Users, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
  success: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-700" },
  info: { icon: Info, color: "text-gray-600", bg: "bg-gray-50", badge: "bg-gray-100 text-gray-700" },
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(allNotifications);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.desc.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || n.type === filterType;
    return matchSearch && matchType;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">System alerts, user activity, and platform updates.</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Unread", value: unreadCount, color: "text-blue-600", icon: Bell },
          { label: "Alerts", value: notifications.filter(n => n.type === "alert").length, color: "text-red-600", icon: AlertTriangle },
          { label: "User Activity", value: notifications.filter(n => n.type === "user").length, color: "text-purple-600", icon: Users },
          { label: "Total", value: notifications.length, color: "text-gray-600", icon: Info },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <Icon className={`h-5 w-5 ${s.color}`} />
                <div>
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-9 h-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-1">
                  {["all", "alert", "user", "success", "info"].map(t => (
                    <Button
                      key={t}
                      variant={filterType === t ? "default" : "outline"}
                      size="sm"
                      className="text-xs capitalize"
                      onClick={() => setFilterType(t)}
                    >
                      {t === "all" ? "All" : t}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No notifications found.</p>
              ) : (
                filtered.map((n) => {
                  const config = typeConfig[n.type] || typeConfig.info;
                  const Icon = config.icon;
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${!n.read ? "bg-blue-50/50" : ""}`}
                      onClick={() => toggleRead(n.id)}
                    >
                      <div className={`p-2 rounded-lg ${config.bg} shrink-0 mt-0.5`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                          {!n.read && <span className="h-2 w-2 bg-blue-600 rounded-full shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${config.badge}`}>
                            {n.type}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{n.time}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Send Notification + Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium">To</label>
                <select className="w-full mt-1 border rounded-md p-2 text-sm">
                  <option>All Users</option>
                  <option>Students</option>
                  <option>Parents</option>
                  <option>Tutors</option>
                  <option>Consultants</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input className="mt-1" placeholder="Notification title..." />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea className="w-full mt-1 border rounded-md p-2 text-sm min-h-[80px] resize-none" placeholder="Write your message..." />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Alert Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Payment Alerts", desc: "Failed transactions & issues" },
                { label: "New Registrations", desc: "User signups & verifications" },
                { label: "Server Health", desc: "CPU, memory & uptime alerts" },
                { label: "Security Alerts", desc: "Suspicious activity & attempts" },
              ].map((pref, i) => (
                <div key={pref.label}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  {i < 3 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
