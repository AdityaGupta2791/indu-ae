
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string;
  change: string;
  trend: string;
}

interface QuickStatsProps {
  stats: StatItem[];
}

const QuickStats = ({ stats }: QuickStatsProps) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className="border-[#1F4E79]/10 h-full">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-lg font-semibold text-[#1F4E79]">Quick Stats</CardTitle>
        <CardDescription>Current performance</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-3 bg-[#F5F7FA] rounded-lg flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
              <div className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStats;
