
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UpcomingSessionProps {
  id: number;
  title: string;
  subject: string;
  date: string;
  time: string;
  students: number;
}

const UpcomingSessionCard = ({ title, subject, date, time, students }: UpcomingSessionProps) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border-[#1F4E79]/10">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-semibold text-[#1F4E79]">{title}</CardTitle>
        <CardDescription className="text-xs">{subject}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        <div className="space-y-2">
          <div className="flex items-center text-xs">
            <Calendar className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-xs">
            <Clock className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-xs">
            <Users className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
            <span>
              <span className="font-medium">{students}</span> students
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-[#1F4E79] hover:bg-[#1a4369] transition-all hover:scale-[0.98] active:scale-[0.97] text-xs py-1.5 focus:ring-2 focus:ring-[#F29F05] focus:ring-offset-2"
            aria-label="Start session"
          >
            Start Session
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="border-[#1F4E79] text-[#1F4E79] hover:bg-[#F5F7FA] hover:text-[#1F4E79] transition-all hover:scale-[0.98] active:scale-[0.97] p-1.5 focus:ring-2 focus:ring-[#F29F05] focus:ring-offset-2"
            aria-label="View session details"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionCard;
