
import { Button } from "@/components/ui/button";
import UpcomingSessionCard from "./UpcomingSessionCard";
import { ChevronRight } from "lucide-react";

interface Session {
  id: number;
  title: string;
  subject: string;
  date: string;
  time: string;
  students: number;
}

interface UpcomingSessionsProps {
  sessions: Session[];
  maxVisible?: number;
}

const UpcomingSessions = ({ sessions, maxVisible = 6 }: UpcomingSessionsProps) => {
  const visibleSessions = sessions.slice(0, maxVisible);
  const hasMore = sessions.length > maxVisible;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSessions.map((session) => (
          <UpcomingSessionCard key={session.id} {...session} />
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center mt-4">
          <Button 
            variant="outline" 
            className="border-[#1F4E79] text-[#1F4E79] hover:bg-[#F5F7FA] hover:text-[#1F4E79] transition-all hover:scale-[0.98] active:scale-[0.97] text-sm group"
            aria-label="View all sessions"
          >
            <span>View All Sessions ({sessions.length})</span>
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
