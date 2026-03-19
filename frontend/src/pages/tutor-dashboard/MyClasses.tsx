import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Calendar,
  Users,
  Star,
  MoreHorizontal,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  BookOpen,
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
import CreateClassDialog from "@/components/tutor-dashboard/class-creation/CreateClassDialog";

// Mock class data
const myClasses = [
  {
    id: 1,
    title: "Introduction to Python Programming",
    subject: "Technology & Coding",
    status: "active",
    deliveryMode: "online",
    format: "live",
    size: "group",
    paymentType: "fixed",
    students: 8,
    maxStudents: 12,
    nextSession: "Today, 4:00 PM",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&h=160&q=80",
    description: "This interactive course introduces children ages 10-14 to the world of programming through Python.",
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
    description: "Discover the joy of storytelling and develop creative writing skills in this engaging workshop.",
  },
  {
    id: 3,
    title: "Public Speaking for Kids",
    subject: "Life Skills",
    status: "active",
    deliveryMode: "online",
    format: "live",
    size: "group",
    paymentType: "recurring",
    students: 9,
    maxStudents: 12,
    nextSession: "Wednesday, 3:30 PM",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=300&h=160&q=80",
    description: "Help children build confidence and develop essential public speaking skills in a supportive environment.",
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
    description: "Learn the foundational skills of drawing and painting in this beginner-friendly art class.",
  },
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
    description: "Personalized advanced mathematics tutoring tailored to individual student needs.",
  },
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
    description: "Private online piano instruction for beginners with personalized guidance.",
  },
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
    description: "Master digital art techniques through comprehensive recorded lessons available on your schedule.",
  },
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
    description: "A comprehensive course covering core algebraic concepts for middle school students.",
  },
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
    description: "Learn guitar basics at your own pace with personalized video feedback sessions.",
  },
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
    description: "Build reading skills through personalized recorded lessons with feedback sessions.",
  },
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
    description: "In-home physics tutoring sessions customized to student's curriculum and learning pace.",
  },
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
    description: "Learn the basics of HTML, CSS, and JavaScript to build your own websites.",
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
    description: "Introduction to French language and culture for beginners of all ages.",
  },
];

type DeliveryMode = "all" | "online" | "offline";
type Format = "all" | "live" | "recorded" | "inbound" | "outbound";
type ClassSize = "all" | "group" | "one-on-one";
type PaymentType = "all" | "fixed" | "recurring";

const MyClasses = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("all");
  const [format, setFormat] = useState<Format>("all");
  const [classSize, setClassSize] = useState<ClassSize>("all");
  const [paymentType, setPaymentType] = useState<PaymentType>("all");
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

  // Get format options based on delivery mode
  const formatOptions = useMemo(() => {
    if (deliveryMode === "online") return ["all", "live", "recorded"] as const;
    if (deliveryMode === "offline") return ["all", "inbound", "outbound"] as const;
    return ["all", "live", "recorded", "inbound", "outbound"] as const;
  }, [deliveryMode]);

  // Reset format when delivery mode changes
  const handleDeliveryChange = (value: DeliveryMode) => {
    setDeliveryMode(value);
    setFormat("all");
  };

  // Filter classes
  const filteredActiveClasses = useMemo(() => {
    return myClasses.filter((c) => {
      if (c.status !== "active") return false;
      if (searchTerm && !c.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (deliveryMode !== "all" && c.deliveryMode !== deliveryMode) return false;
      if (format !== "all" && c.format !== format) return false;
      if (classSize !== "all" && c.size !== classSize) return false;
      if (paymentType !== "all" && c.paymentType !== paymentType) return false;
      return true;
    });
  }, [searchTerm, deliveryMode, format, classSize, paymentType]);

  const activeFiltersCount = [deliveryMode, format, classSize, paymentType].filter((f) => f !== "all").length;

  const clearFilters = () => {
    setDeliveryMode("all");
    setFormat("all");
    setClassSize("all");
    setPaymentType("all");
  };

  const FilterButton = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
        active
          ? "bg-purple-600 text-white border-purple-600"
          : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
      }`}
    >
      {children}
    </button>
  );

  return (
    <TutorDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-purple-800">My Classes</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your created classes and track student progress.
            </p>
          </div>
          <Button onClick={handleCreateClass} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-1 h-4 w-4" />
            Create New Class
          </Button>
        </div>

        <CreateClassDialog
          open={createClassDialogOpen}
          onOpenChange={setCreateClassDialogOpen}
        />

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search classes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Compact Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-purple-800">Filters</p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear all ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* Delivery Mode */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground w-20 shrink-0">Delivery</span>
                <div className="flex gap-1.5 flex-wrap">
                  <FilterButton active={deliveryMode === "all"} onClick={() => handleDeliveryChange("all")}>
                    All
                  </FilterButton>
                  <FilterButton active={deliveryMode === "online"} onClick={() => handleDeliveryChange("online")}>
                    Online
                  </FilterButton>
                  <FilterButton active={deliveryMode === "offline"} onClick={() => handleDeliveryChange("offline")}>
                    Offline
                  </FilterButton>
                </div>
              </div>

              {/* Format */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground w-20 shrink-0">Format</span>
                <div className="flex gap-1.5 flex-wrap">
                  <FilterButton active={format === "all"} onClick={() => setFormat("all")}>
                    All
                  </FilterButton>
                  {formatOptions.filter((o) => o !== "all").map((opt) => (
                    <FilterButton
                      key={opt}
                      active={format === opt}
                      onClick={() => setFormat(opt as Format)}
                    >
                      {opt === "live" ? "Live" : opt === "recorded" ? "Recorded" : opt === "inbound" ? "Inbound" : "Outbound"}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Class Size */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground w-20 shrink-0">Size</span>
                <div className="flex gap-1.5 flex-wrap">
                  <FilterButton active={classSize === "all"} onClick={() => setClassSize("all")}>
                    All
                  </FilterButton>
                  <FilterButton active={classSize === "group"} onClick={() => setClassSize("group")}>
                    Group
                  </FilterButton>
                  <FilterButton active={classSize === "one-on-one"} onClick={() => setClassSize("one-on-one")}>
                    1-on-1
                  </FilterButton>
                </div>
              </div>

              {/* Payment Type */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground w-20 shrink-0">Payment</span>
                <div className="flex gap-1.5 flex-wrap">
                  <FilterButton active={paymentType === "all"} onClick={() => setPaymentType("all")}>
                    All
                  </FilterButton>
                  <FilterButton active={paymentType === "fixed"} onClick={() => setPaymentType("fixed")}>
                    One-time
                  </FilterButton>
                  <FilterButton active={paymentType === "recurring"} onClick={() => setPaymentType("recurring")}>
                    Subscription
                  </FilterButton>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Tabs + Class Cards */}
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">
              Active ({myClasses.filter((c) => c.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="inactive">Inactive (0)</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {filteredActiveClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredActiveClasses.map((classItem) => (
                  <Card key={classItem.id} className="overflow-hidden hover:shadow-md transition-all">
                    <div className="relative h-40">
                      <img
                        src={classItem.image}
                        alt={classItem.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/tutor-dashboard/classes/${classItem.id}`}
                                className="cursor-pointer flex items-center"
                              >
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
                      {/* Delivery badge on image */}
                      <div className="absolute top-2 left-2">
                        <Badge className={`text-xs ${
                          classItem.deliveryMode === "online" ? "bg-purple-600" : "bg-indigo-600"
                        }`}>
                          {classItem.deliveryMode === "online" ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                        <div className="flex items-center gap-2">
                          {classItem.paymentType && (
                            <Badge
                              className={
                                classItem.paymentType === "fixed"
                                  ? "bg-blue-100 text-blue-800 text-xs"
                                  : "bg-purple-100 text-purple-800 text-xs"
                              }
                            >
                              {classItem.paymentType === "fixed" ? "One-time" : "Subscription"}
                            </Badge>
                          )}
                          <div className="flex items-center">
                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs ml-1 font-medium">{classItem.rating || "-"}</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/tutor-dashboard/classes/${classItem.id}`}>
                        <h3 className="text-base font-semibold text-purple-800 hover:underline mb-1">
                          {classItem.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mb-1">{classItem.subject}</p>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="text-xs capitalize">
                          {classItem.format}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {classItem.size === "one-on-one" ? "1-on-1" : "Group"}
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-purple-500" />
                          <span>{classItem.nextSession || "No upcoming sessions"}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Users className="h-3.5 w-3.5 mr-2 text-purple-500" />
                          <span>
                            {classItem.students}/{classItem.maxStudents} students
                          </span>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="w-full bg-purple-600 hover:bg-purple-700 text-xs"
                      >
                        <Link to={`/tutor-dashboard/classes/${classItem.id}`}>Manage Class</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold">No classes found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeFiltersCount > 0
                    ? "Try adjusting your filters to see more classes."
                    : "Create your first class to get started."}
                </p>
                {activeFiltersCount > 0 ? (
                  <Button variant="outline" className="mt-3" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button className="mt-3 bg-purple-600 hover:bg-purple-700" onClick={handleCreateClass}>
                    <Plus className="mr-1 h-4 w-4" />
                    Create New Class
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="mt-4">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold">No inactive classes</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Classes you deactivate will appear here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="mt-4">
            {drafts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drafts.map((draft) => (
                  <Card key={draft.id} className="overflow-hidden hover:shadow-md transition-all opacity-80">
                    <div className="relative h-40">
                      <img
                        src={draft.image}
                        alt={draft.title}
                        className="w-full h-full object-cover grayscale-[30%]"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gray-600 text-xs">Draft</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-base font-semibold text-purple-800 mb-1">{draft.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{draft.subject}</p>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="text-xs capitalize">
                          {draft.format}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {draft.size === "one-on-one" ? "1-on-1" : "Group"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Last edited: {draft.lastEdited}</p>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs">
                          Continue Editing
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-400 hover:text-red-600 h-9 w-9"
                          onClick={() => handleDelete(draft.id, draft.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold">No drafts</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Class drafts you haven't published yet will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TutorDashboardLayout>
  );
};

export default MyClasses;
