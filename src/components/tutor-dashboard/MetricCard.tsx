
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  change?: string;
  period?: string;
  trend?: "up" | "down" | "neutral";
}

const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  iconBg, 
  change, 
  period, 
  trend = "neutral" 
}: MetricCardProps) => {
  const getTrendColor = () => {
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
    <Card className="shadow-sm hover:shadow-md transition-all duration-300 border">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
            <h3 className="text-2xl font-semibold">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
            
            {change && (
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${getTrendColor()}`}>
                  {change}
                  {period && <span className="text-muted-foreground font-normal ml-1">{period}</span>}
                </span>
              </div>
            )}
          </div>
          <div className={`${iconBg} p-3 rounded-full transition-transform duration-300`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
