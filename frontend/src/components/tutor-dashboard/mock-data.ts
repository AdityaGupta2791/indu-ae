
import { 
  Users, 
  Calendar, 
  Clock, 
  Star,
  DollarSign,
  BookOpen,
  MessageSquare,
  Award,
  Briefcase,
  User,
  GraduationCap,
  Mail,
  FileText,
  Bell,
  Video
} from "lucide-react";

// Mock data for upcoming sessions
export const upcomingSessions = [
  {
    id: 1,
    title: "Introduction to Tuples",
    subject: "Introduction to Python",
    date: "Sunday, June 15, 2025",
    time: "16:00 - 17:30",
    students: 12
  },
  {
    id: 2,
    title: "Creative Writing Techniques",
    subject: "Creative Writing Workshop",
    date: "Tuesday, June 17, 2025",
    time: "14:00 - 15:00",
    students: 8
  },
  {
    id: 3,
    title: "Advanced Problem Solving",
    subject: "Math Problem Solving",
    date: "Wednesday, June 18, 2025",
    time: "10:00 - 11:30",
    students: 15
  },
  {
    id: 4,
    title: "Data Structures: Arrays & Lists",
    subject: "Computer Science Fundamentals",
    date: "Thursday, June 19, 2025",
    time: "13:00 - 14:30",
    students: 10
  },
  {
    id: 5,
    title: "Chemistry Lab: Acid & Bases",
    subject: "High School Chemistry",
    date: "Friday, June 20, 2025",
    time: "15:00 - 16:30",
    students: 6
  },
  {
    id: 6,
    title: "Physics: Forces & Motion",
    subject: "High School Physics",
    date: "Monday, June 23, 2025",
    time: "09:00 - 10:30",
    students: 9
  },
  {
    id: 7,
    title: "Essay Structure & Composition",
    subject: "English Literature",
    date: "Tuesday, June 24, 2025",
    time: "11:00 - 12:30",
    students: 7
  },
  {
    id: 8,
    title: "Web Development: HTML Basics",
    subject: "Web Development for Teens",
    date: "Wednesday, June 25, 2025",
    time: "17:00 - 18:30",
    students: 14
  },
  {
    id: 9,
    title: "Algebra: Quadratic Equations",
    subject: "Middle School Mathematics",
    date: "Thursday, June 26, 2025",
    time: "15:30 - 17:00",
    students: 11
  },
  {
    id: 10,
    title: "Biology: Cell Structure",
    subject: "Middle School Science",
    date: "Friday, June 27, 2025",
    time: "14:00 - 15:30",
    students: 8
  }
];

// Mock data for recent activities with React elements converted to a format that works in TypeScript
export const recentActivities = [
  {
    icon: BookOpen,
    iconBg: "bg-indigo-50",
    title: "Class Completed",
    description: "You completed 'Introduction to Python' class with 12 students",
    time: "Today, 11:30 AM"
  },
  {
    icon: Users,
    iconBg: "bg-blue-50",
    title: "New Student Enrolled",
    description: "Alex Thompson enrolled in your 'Advanced Mathematics' class",
    time: "Yesterday, 3:15 PM"
  },
  {
    icon: Star,
    iconBg: "bg-yellow-50",
    title: "New Rating Received",
    description: "You received a 5-star rating from Emma Parker",
    time: "Yesterday, 10:00 AM"
  },
  {
    icon: DollarSign,
    iconBg: "bg-green-50",
    title: "Payment Received",
    description: "You received a payment of ₹5,500 for your recent classes",
    time: "June 10, 2:30 PM"
  },
  {
    icon: MessageSquare,
    iconBg: "bg-purple-50",
    title: "New Message",
    description: "Ryan Miller sent you a question about the homework assignment",
    time: "June 9, 5:45 PM"
  },
  {
    icon: Award,
    iconBg: "bg-amber-50",
    title: "Achievement Unlocked",
    description: "You've completed 50 classes! Keep up the great work",
    time: "June 8, 12:20 PM"
  },
  {
    icon: Calendar,
    iconBg: "bg-red-50",
    title: "Session Rescheduled",
    description: "Your 'Creative Writing' session has been rescheduled",
    time: "June 7, 9:10 AM"
  },
  {
    icon: User,
    iconBg: "bg-teal-50",
    title: "Profile Update",
    description: "You updated your teaching profile with new qualifications",
    time: "June 6, 2:00 PM"
  },
  {
    icon: Video,
    iconBg: "bg-cyan-50",
    title: "New Recording Available",
    description: "Your 'Data Structures' class recording is now available",
    time: "June 5, 10:30 AM"
  },
  {
    icon: FileText,
    iconBg: "bg-pink-50",
    title: "Materials Uploaded",
    description: "You uploaded new study materials for 'Physics: Forces & Motion'",
    time: "June 4, 4:45 PM"
  },
  {
    icon: GraduationCap,
    iconBg: "bg-lime-50",
    title: "Student Graduated",
    description: "Sophia Chen completed all sessions in 'Advanced Mathematics'",
    time: "June 3, 1:15 PM"
  },
  {
    icon: Briefcase,
    iconBg: "bg-rose-50",
    title: "New Course Created",
    description: "You created a new course: 'Introduction to Robotics'",
    time: "June 2, 11:00 AM"
  }
];

// Mock data for notifications
export const notifications = [
  {
    id: 1,
    icon: Users,
    title: "New Student Enrolled",
    message: "Alex Thompson has enrolled in your 'Advanced Mathematics' class.",
    time: "Today, 9:30 AM"
  },
  {
    id: 2,
    icon: Calendar,
    title: "Schedule Update",
    message: "Your 'Python Programming' class has been rescheduled to Friday.",
    time: "Yesterday, 4:15 PM"
  },
  {
    id: 3,
    icon: BookOpen,
    title: "Student Message",
    message: "You've received a message from Emma Parker about homework.",
    time: "Yesterday, 10:00 AM"
  },
  {
    id: 4,
    icon: DollarSign,
    title: "Payment Received",
    message: "You received a payment of ₹12,000 for your classes this week.",
    time: "June 10, 2:30 PM"
  },
  {
    id: 5,
    icon: Star,
    title: "New Rating",
    message: "You received a 5-star rating from Michael Johnson for your 'Chemistry' class.",
    time: "June 9, 11:45 AM"
  },
  {
    id: 6,
    icon: Bell,
    title: "Class Reminder",
    message: "Your 'Advanced Web Development' class starts in 1 hour.",
    time: "June 9, 9:00 AM"
  },
  {
    id: 7,
    icon: Mail,
    title: "New Admin Message",
    message: "The platform administrators sent you important updates about teaching policies.",
    time: "June 8, 3:20 PM"
  },
  {
    id: 8,
    icon: Video,
    title: "Recording Available",
    message: "Your 'Introduction to Physics' class recording is now available for students.",
    time: "June 7, 5:30 PM"
  },
  {
    id: 9,
    icon: Clock,
    title: "Session Extended",
    message: "Your session with the 'Advanced Mathematics' group has been extended by 30 minutes.",
    time: "June 6, 10:15 AM"
  },
  {
    id: 10,
    icon: Award,
    title: "Teaching Milestone",
    message: "Congratulations! You've completed 100 hours of teaching on our platform.",
    time: "June 5, 1:45 PM"
  },
  {
    id: 11,
    icon: FileText,
    title: "Material Recommendation",
    message: "Platform has recommended new teaching materials for your 'Biology' course.",
    time: "June 4, 9:00 AM"
  },
  {
    id: 12,
    icon: GraduationCap,
    title: "Student Completed Course",
    message: "Sophia Lee has completed all sessions in your 'Creative Writing' course.",
    time: "June 3, 4:30 PM"
  }
];

// Mock data for quick stats
export const quickStats = [
  { 
    label: "Teaching Hours", 
    value: "126", 
    change: "+12%", 
    trend: "up" 
  },
  { 
    label: "Student Retention", 
    value: "94%", 
    change: "+2.5%", 
    trend: "up" 
  },
  { 
    label: "New Enrollments", 
    value: "28", 
    change: "+8", 
    trend: "up" 
  },
  { 
    label: "Completion Rate", 
    value: "91%", 
    change: "-1.2%", 
    trend: "down" 
  },
  { 
    label: "Average Rating", 
    value: "4.92", 
    change: "+0.2", 
    trend: "up" 
  },
  { 
    label: "Total Courses", 
    value: "12", 
    change: "+2", 
    trend: "up" 
  },
  { 
    label: "Active Students", 
    value: "86", 
    change: "+14", 
    trend: "up" 
  },
  { 
    label: "Monthly Revenue", 
    value: "₹42,500", 
    change: "+₹3,200", 
    trend: "up" 
  }
];

// Mock data for teaching progress
export const teachingProgress = [
  {
    label: "Jan",
    hours: 42,
    students: 23
  },
  {
    label: "Feb",
    hours: 56,
    students: 28
  },
  {
    label: "Mar",
    hours: 62,
    students: 31
  },
  {
    label: "Apr",
    hours: 58,
    students: 34
  },
  {
    label: "May",
    hours: 72,
    students: 42
  },
  {
    label: "Jun",
    hours: 86,
    students: 46
  },
  {
    label: "Jul",
    hours: 92,
    students: 51
  },
  {
    label: "Aug",
    hours: 88,
    students: 48
  },
  {
    label: "Sep",
    hours: 94,
    students: 53
  },
  {
    label: "Oct",
    hours: 102,
    students: 58
  },
  {
    label: "Nov",
    hours: 110,
    students: 62
  },
  {
    label: "Dec",
    hours: 126,
    students: 68
  }
];

// Mock data for metrics cards
export const metricCards = [
  {
    title: "Active Students",
    value: "86",
    description: "Currently enrolled",
    icon: Users,
    iconBg: "bg-blue-500",
    change: "+14%",
    period: "from last month"
  },
  {
    title: "Today's Sessions",
    value: "6",
    description: "Scheduled today",
    icon: Calendar,
    iconBg: "bg-indigo-500",
    change: "+2",
    period: "from yesterday"
  },
  {
    title: "Average Rating",
    value: "4.92",
    description: "From 127 reviews",
    icon: Star,
    iconBg: "bg-amber-500",
    change: "+0.2",
    period: "from last month"
  },
  {
    title: "Monthly Revenue",
    value: "₹84,500",
    description: "This month",
    icon: DollarSign,
    iconBg: "bg-green-500",
    change: "+₹12,300",
    period: "from last month"
  },
  {
    title: "Class Completion",
    value: "94%",
    description: "Attendance rate",
    icon: BookOpen,
    iconBg: "bg-purple-500",
    change: "+2%",
    period: "from last month"
  },
  {
    title: "New Messages",
    value: "28",
    description: "Unread messages",
    icon: MessageSquare,
    iconBg: "bg-pink-500",
    change: "+8",
    period: "from yesterday"
  },
  {
    title: "Teaching Hours",
    value: "126",
    description: "This month",
    icon: Clock,
    iconBg: "bg-teal-500",
    change: "+22",
    period: "from last month"
  },
  {
    title: "Materials Uploaded",
    value: "42",
    description: "Teaching resources",
    icon: FileText,
    iconBg: "bg-cyan-500",
    change: "+12",
    period: "from last month"
  }
];

// Adding the missing mockClassesByCategory export to fix the error
export const mockClassesByCategory = {
  onlineLiveGroupFixed: [],
  onlineLiveGroupRecurring: [],
  onlineLiveOneOnOneFixed: [],
  onlineLiveOneOnOneRecurring: [],
  onlineRecordedGroupFixed: [],
  onlineRecordedGroupRecurring: [],
  onlineRecordedOneOnOneFixed: [],
  onlineRecordedOneOnOneRecurring: [],
  offlineInboundGroup: [],
  offlineInboundOneOnOne: [],
  offlineOutboundGroup: [],
  offlineOutboundOneOnOne: []
};
