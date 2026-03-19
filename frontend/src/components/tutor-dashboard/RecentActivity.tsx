
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ActivityItem {
  icon: LucideIcon;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  maxVisible?: number;
}

const RecentActivity = ({ activities, maxVisible = 8 }: RecentActivityProps) => {
  const visibleActivities = activities.slice(0, maxVisible);
  
  return (
    <Card className="border-[#1F4E79]/10">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-lg font-semibold text-[#1F4E79]">Recent Activity</CardTitle>
        <CardDescription>Your latest teaching activities</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-4">
          {visibleActivities.map((activity, index) => (
            <div key={index} className="flex items-start p-2 hover:bg-[#F5F7FA] rounded-lg transition-colors">
              <div className={`${activity.iconBg} p-2 rounded-md mr-3 shrink-0`}>
                <activity.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-muted-foreground text-xs">{activity.description}</p>
              </div>
              <div className="text-xs text-muted-foreground shrink-0 ml-2">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
