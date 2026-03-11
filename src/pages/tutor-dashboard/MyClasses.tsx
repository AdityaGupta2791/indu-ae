import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Star, 
  MoreHorizontal,
  ChevronRight,
  Edit,
  Trash2,
  Copy
} from "lucide-react";

import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useDesignTokens } from "@/hooks/use-design-tokens";
import CreateClassDialog from "@/components/tutor-dashboard/class-creation/CreateClassDialog";

// Mock class data
const myClasses = [
  // ONLINE LIVE GROUP FIXED CLASSES
  {
    id: 1,
    title: "Introduction to Python Programming",
    subject: "Technology & Coding",
    status: "active",
    deliveryMode: "online",
    format: "live",
    size: "group",
    paymentType: "fixed", // One-time payment
    students: 8,
    maxStudents: 12,
    nextSession: "Today, 4:00 PM",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&h=160&q=80",
    description: "This interactive course introduces children ages 10-14 to the world of programming through Python."
  },
  {
    id: 2,
    title: "Creative Writing Workshop",
    subject: "Arts & Creativity",
    status: "active",
    deliveryMode: "online",
    format: "live",
    size: "group",
    paymentType: "fixed",
    students: 6,
    maxStudents: 10,
    nextSession: "Tomorrow, 5:00 PM",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1522617889820-47708e025180?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Discover the joy of storytelling and develop creative writing skills in this engaging workshop."
  },
  
  // ONLINE LIVE GROUP RECURRING CLASSES
  {
    id: 3,
    title: "Public Speaking for Kids",
    subject: "Life Skills",
    status: "active",
    deliveryMode: "online",
    format: "live",
    size: "group",
    paymentType: "recurring", // Subscription-based
    students: 9,
    maxStudents: 12,
    nextSession: "Wednesday, 3:30 PM",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Help children build confidence and develop essential public speaking skills in a supportive environment."
  },
  {
    id: 4,
    title: "Art Fundamentals for Beginners",
    subject: "Arts & Creativity",
    status: "active",
    deliveryMode: "online",
    format: "live",
    size: "group",
    paymentType: "recurring",
    students: 7,
    maxStudents: 10,
    nextSession: "Saturday, 10:00 AM",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Learn the foundational skills of drawing and painting in this beginner-friendly art class."
  },
  
  // ONLINE LIVE ONE-ON-ONE FIXED CLASSES
  {
    id: 11,
    title: "Advanced Mathematics Tutoring",
    subject: "Academic Subjects",
    status: "active",
    deliveryMode: "online",
    format: "live",
    size: "one-on-one",
    paymentType: "fixed",
    students: 1,
    maxStudents: 1,
    nextSession: "Today, 5:30 PM",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1596496181871-9681eacf9764?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Personalized advanced mathematics tutoring tailored to individual student needs."
  },
  
  // ONLINE LIVE ONE-ON-ONE RECURRING CLASSES
  {
    id: 12,
    title: "Piano Lessons for Beginners",
    subject: "Arts & Creativity",
    status: "active",
    deliveryMode: "online",
    format: "live",
    size: "one-on-one",
    paymentType: "recurring",
    students: 1,
    maxStudents: 1,
    nextSession: "Tomorrow, 3:00 PM",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Private online piano instruction for beginners with personalized guidance."
  },
  
  // ONLINE RECORDED GROUP FIXED CLASSES
  {
    id: 6,
    title: "Digital Illustration Techniques",
    subject: "Arts & Creativity",
    status: "active",
    deliveryMode: "online",
    format: "recorded",
    size: "group",
    paymentType: "fixed",
    students: 12,
    maxStudents: 20,
    nextSession: "Available anytime",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Master digital art techniques through comprehensive recorded lessons available on your schedule."
  },
  
  // ONLINE RECORDED GROUP RECURRING CLASSES
  {
    id: 7,
    title: "Algebra Fundamentals",
    subject: "Academic Subjects",
    status: "active",
    deliveryMode: "online",
    format: "recorded",
    size: "group",
    paymentType: "recurring",
    students: 14,
    maxStudents: 25,
    nextSession: "Available anytime",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&h=160&q=80",
    description: "A comprehensive course covering core algebraic concepts for middle school students."
  },
  
  // ONLINE RECORDED ONE-ON-ONE FIXED CLASSES
  {
    id: 16,
    title: "Guitar for Beginners",
    subject: "Arts & Creativity",
    status: "active",
    deliveryMode: "online",
    format: "recorded",
    size: "one-on-one",
    paymentType: "fixed",
    students: 1,
    maxStudents: 1,
    nextSession: "Available anytime",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Learn guitar basics at your own pace with personalized video feedback sessions."
  },
  
  // ONLINE RECORDED ONE-ON-ONE RECURRING CLASSES
  {
    id: 17,
    title: "Reading Comprehension",
    subject: "Academic Subjects",
    status: "active",
    deliveryMode: "online",
    format: "recorded",
    size: "one-on-one",
    paymentType: "recurring",
    students: 1,
    maxStudents: 1,
    nextSession: "Available anytime",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Build reading skills through personalized recorded lessons with feedback sessions."
  },
  
  // OFFLINE CLASSES
  {
    id: 21,
    title: "Physics Tutoring at Home",
    subject: "Academic Subjects",
    status: "active",
    deliveryMode: "offline",
    format: "inbound",
    size: "one-on-one",
    students: 1,
    maxStudents: 1,
    nextSession: "Thursday, 5:00 PM",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1632571401005-458e9d244591?auto=format&fit=crop&w=300&h=160&q=80",
    description: "In-home physics tutoring sessions customized to student's curriculum and learning pace."
  }
];

const drafts = [
  {
    id: 36,
    title: "Web Development Fundamentals",
    subject: "Technology & Coding",
    deliveryMode: "online",
    format: "live",
    size: "group",
    paymentType: "fixed",
    lastEdited: "Yesterday",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Learn the basics of HTML, CSS, and JavaScript to build your own websites."
  },
  {
    id: 37,
    title: "French for Beginners",
    subject: "Academic Subjects",
    deliveryMode: "online",
    format: "recorded",
    size: "group",
    paymentType: "recurring",
    lastEdited: "3 days ago",
    image: "https://images.unsplash.com/photo-1549737221-bef65e2604a6?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Introduction to French language and culture for beginners of all ages."
  }
];

const MyClasses = () => {
  const { toast } = useToast();
  const { colors } = useDesignTokens();
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"online" | "offline">("online");
  const [onlineFormat, setOnlineFormat] = useState<"recorded" | "live">("live");
  const [offlineFormat, setOfflineFormat] = useState<"inbound" | "outbound">("outbound");
  const [classSize, setClassSize] = useState<"group" | "one-on-one">("group");
  const [paymentType, setPaymentType] = useState<"fixed" | "recurring">("fixed");
  const [createClassDialogOpen, setCreateClassDialogOpen] = useState(false);

  const handleCreateClass = () => {
    setCreateClassDialogOpen(true);
  };

  const handleDelete = (id: number, title: string) => {
    toast({
      title: "Confirm deletion",
      description: `Are you sure you want to delete "${title}"?`,
      variant: "destructive",
    });
  };

  const handleDuplicate = (id: number, title: string) => {
    toast({
      title: "Class duplicated",
      description: `"${title}" has been duplicated. You can find it in your drafts.`,
    });
  };

  // Filter classes based on the delivery mode, format, size, and payment type
  const filteredActiveClasses = myClasses.filter(
    (c) => c.status === "active" && 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    c.deliveryMode === deliveryMode &&
    ((deliveryMode === "online" && c.format === onlineFormat) || 
     (deliveryMode === "offline" && c.format === offlineFormat)) &&
    ((deliveryMode === "offline" && c.format === "inbound") ? true : c.size === classSize) &&
    (deliveryMode === "offline" || c.paymentType === paymentType)
  );

  return (
    <TutorDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F4E79]">My Classes</h1>
            <p className="text-muted-foreground">Manage your created classes</p>
          </div>
          <Button onClick={handleCreateClass} className="bg-[#1F4E79] hover:bg-[#1a4369]">
            <Plus className="mr-1 h-4 w-4" />
            Create New Class
          </Button>
        </div>

        {/* Create Class Dialog */}
        <CreateClassDialog
          open={createClassDialogOpen}
          onOpenChange={setCreateClassDialogOpen}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search classes..."
              className="pl-8 border-[#1F4E79]/20 focus-visible:ring-[#1F4E79]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-[#1F4E79]/20 text-muted-foreground gap-1 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Delivery Mode Tabs */}
        <Tabs value={deliveryMode} onValueChange={(v) => setDeliveryMode(v as "online" | "offline")} className="w-full">
          <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
            <TabsTrigger 
              value="online" 
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
            >
              Online Classes
            </TabsTrigger>
            <TabsTrigger 
              value="offline" 
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
            >
              Offline Classes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="online" className="pt-4">
            {/* Format Tabs for Online */}
            <Tabs value={onlineFormat} onValueChange={(v) => setOnlineFormat(v as "recorded" | "live")} className="w-full mb-4">
              <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
                <TabsTrigger 
                  value="live" 
                  className="rounded-none text-sm py-2 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
                >
                  Live Classes
                </TabsTrigger>
                <TabsTrigger 
                  value="recorded" 
                  className="rounded-none text-sm py-2 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
                >
                  Recorded Classes
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Class Size Tabs for Online */}
            <Tabs value={classSize} onValueChange={(v) => setClassSize(v as "group" | "one-on-one")} className="w-full mb-4">
              <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
                <TabsTrigger 
                  value="group" 
                  className="rounded-none text-sm py-2 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
                >
                  Group Classes
                </TabsTrigger>
                <TabsTrigger 
                  value="one-on-one" 
                  className="rounded-none text-sm py-2 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
                >
                  1-on-1 Classes
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Payment Type Tabs (Fixed vs Recurring) */}
            <Tabs value={paymentType} onValueChange={(v) => setPaymentType(v as "fixed" | "recurring")} className="w-full mb-4">
              <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
                <TabsTrigger 
                  value="fixed" 
                  className="rounded-none text-sm py-2 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
                >
                  Fixed Classes (One-time Payment)
                </TabsTrigger>
                <TabsTrigger 
                  value="recurring" 
                  className="rounded-none text-sm py-2 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
                >
                  Recurring Classes (Subscription)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="offline" className="pt-4">
            {/* Format Tabs for Offline */}
            <Tabs value={offlineFormat} onValueChange={(v) => setOfflineFormat(v as "inbound" | "outbound")} className="w-full mb-4">
              <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
                <TabsTrigger 
                  value="inbound" 
                  className="rounded-none text-sm py-2 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
                >
                  Inbound Classes
                </TabsTrigger>
                <TabsTrigger 
                  value="outbound" 
                  className="rounded-none text-sm py-2 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
                >
                  Outbound Classes
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Class Size Tabs for Offline Outbound only */}
            {offlineFormat === "outbound" && (
              <Tabs value={classSize} onValueChange={(v) => setClassSize(v as "group" | "one-on-one")} className="w-full mb-4">
                <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
                  <TabsTrigger 
                    value="group" 
                    className="rounded-none text-sm py-2 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
                  >
                    Group Classes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="one-on-one" 
                    className="rounded-none text-sm py-2 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
                  >
                    1-on-1 Classes
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </TabsContent>
        </Tabs>

        {/* Active/Inactive/Drafts Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
            <TabsTrigger 
              value="active" 
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
            >
              Active Classes
            </TabsTrigger>
            <TabsTrigger 
              value="inactive" 
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
            >
              Inactive Classes
            </TabsTrigger>
            <TabsTrigger 
              value="drafts" 
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
            >
              Drafts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="pt-4">
            {filteredActiveClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredActiveClasses.map((classItem) => (
                  <Card key={classItem.id} className="overflow-hidden hover:shadow-md transition-all border-[#1F4E79]/10">
                    <div className="relative h-40">
                      <img 
                        src={classItem.image} 
                        alt={classItem.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem asChild>
                              <Link to={`/tutor-dashboard/classes/${classItem.id}`} className="cursor-pointer flex items-center">
                                <ChevronRight className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleDuplicate(classItem.id, classItem.title)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
                              onClick={() => handleDelete(classItem.id, classItem.title)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                        <div className="flex items-center gap-2">
                          {classItem.paymentType && (
                            <Badge className={classItem.paymentType === "fixed" ? "bg-blue-100 text-blue-800 text-xs" : "bg-purple-100 text-purple-800 text-xs"}>
                              {classItem.paymentType === "fixed" ? "One-time" : "Subscription"}
                            </Badge>
                          )}
                          <div className="flex items-center">
                            <Star className="h-3.5 w-3.5 fill-[#F29F05] text-[#F29F05]" />
                            <span className="text-xs ml-1 font-medium">{classItem.rating || "-"}</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/tutor-dashboard/classes/${classItem.id}`}>
                        <h3 className="text-base font-semibold text-[#1F4E79] hover:underline mb-1">{classItem.title}</h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mb-3">{classItem.subject}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
                          <span>{classItem.nextSession || "No upcoming sessions"}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Users className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
                          <span>{classItem.students}/{classItem.maxStudents} students</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          asChild
                          className="flex-1 bg-[#1F4E79] hover:bg-[#1a4369] transition-all hover:scale-[0.98] active:scale-[0.97] text-xs"
                        >
                          <Link to={`/tutor-dashboard/classes/${classItem.id}`}>Manage Class</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#1F4E79]/10">
                <p className="text-muted-foreground mb-2">No active classes found</p>
                <Button onClick={handleCreateClass} className="bg-[#1F4E79] hover:bg-[#1a4369] text-sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Create New Class
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="inactive" className="pt-4">
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#1F4E79]/10">
              <p className="text-muted-foreground">No inactive classes found</p>
            </div>
          </TabsContent>
          
          <TabsContent value="drafts" className="pt-4">
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#1F4E79]/10">
              <p className="text-muted-foreground">No drafts found</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TutorDashboardLayout>
  );
};

export default MyClasses;
