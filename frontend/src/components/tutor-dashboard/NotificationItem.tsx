
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface NotificationItem {
  id: number;
  icon: LucideIcon;
  title: string;
  message: string;
  time: string;
}

interface NotificationsProps {
  notifications: NotificationItem[];
  maxVisible?: number;
}

const NotificationsList = ({ notifications, maxVisible = 8 }: NotificationsProps) => {
  const visibleNotifications = notifications.slice(0, maxVisible);
  
  return (
    <Card className="border-[#1F4E79]/10">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-lg font-semibold text-[#1F4E79]">Notifications</CardTitle>
        <CardDescription>Your recent notifications</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-4">
          {visibleNotifications.map((notification) => (
            <div key={notification.id} className="flex items-start p-2 hover:bg-[#F5F7FA] rounded-lg transition-colors">
              <div className="p-2 bg-[#F5F7FA] rounded-full mr-3 shrink-0">
                <notification.icon className="h-4 w-4 text-[#1F4E79]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-muted-foreground text-xs">{notification.message}</p>
              </div>
              <div className="text-xs text-muted-foreground shrink-0 ml-2">{notification.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsList;
