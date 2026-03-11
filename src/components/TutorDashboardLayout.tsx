
import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard,
  BookOpen,
  BarChart,
  MessageSquare,
  Star,
  LogOut,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";

interface TutorDashboardLayoutProps {
  children: ReactNode;
}

const TutorDashboardLayout = ({ children }: TutorDashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [location, isMobile]);

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been logged out successfully.",
    });
    logout();
    navigate("/");
  };

  const isActiveRoute = (path: string) => {
    if (path === "/tutor-dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  if (!user || user.role !== "tutor") {
    navigate("/auth/login");
    return null;
  }

  // Skip to content link for accessibility
  const skipToContent = () => {
    const content = document.getElementById("main-content");
    if (content) {
      content.focus();
      content.scrollIntoView();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Accessibility skip link */}
      <a 
        href="#main-content" 
        onClick={skipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-primary focus:text-white focus:p-4 focus:m-2 focus:rounded-md"
      >
        Skip to content
      </a>
      
      {/* Header with minimal content */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center">
            <Link to="/" className="flex items-center mr-4">
              <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                Logo
              </div>
            </Link>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex items-center gap-1 text-xs"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Help</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border border-purple-200">
                    <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    <AvatarFallback className="bg-purple-600 text-white">{user?.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 min-h-[calc(100vh-4rem)] pt-16">
        {/* Sidebar (desktop only) */}
        <aside className={`hidden md:block ${isSidebarOpen ? 'col-span-2 lg:col-span-2 xl:col-span-2' : 'col-span-1'} transition-all duration-300 border-r bg-background`}>
          <div className="flex flex-col h-full p-2 gap-1">
            <Link
              to="/tutor-dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                isActiveRoute("/tutor-dashboard") && location.pathname === "/tutor-dashboard"
                  ? "bg-purple-600 text-white font-medium"
                  : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
              }`}
              aria-current={isActiveRoute("/tutor-dashboard") ? "page" : undefined}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              {isSidebarOpen && <span className="truncate">Dashboard</span>}
            </Link>
            
            <Link
              to="/tutor-dashboard/classes"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                isActiveRoute("/tutor-dashboard/classes")
                  ? "bg-purple-100 text-purple-600 font-medium"
                  : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
              }`}
              aria-current={isActiveRoute("/tutor-dashboard/classes") ? "page" : undefined}
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              {isSidebarOpen && (
                <>
                  <span className="truncate">Classes</span>
                  <Badge className="ml-auto text-xs bg-purple-200 text-purple-700" variant="secondary">
                    3
                  </Badge>
                </>
              )}
            </Link>
            
            <Link
              to="/tutor-dashboard/earnings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                isActiveRoute("/tutor-dashboard/earnings")
                  ? "bg-purple-100 text-purple-600 font-medium"
                  : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
              }`}
              aria-current={isActiveRoute("/tutor-dashboard/earnings") ? "page" : undefined}
            >
              <BarChart className="h-4 w-4 shrink-0" />
              {isSidebarOpen && <span className="truncate">Earnings</span>}
            </Link>
            
            <Link
              to="/tutor-dashboard/messages"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                isActiveRoute("/tutor-dashboard/messages")
                  ? "bg-purple-100 text-purple-600 font-medium"
                  : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
              }`}
              aria-current={isActiveRoute("/tutor-dashboard/messages") ? "page" : undefined}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              {isSidebarOpen && (
                <>
                  <span className="truncate">Messages</span>
                  <Badge className="ml-auto text-xs bg-purple-200 text-purple-700" variant="secondary">
                    2
                  </Badge>
                </>
              )}
            </Link>
            
            <Link
              to="/tutor-dashboard/feedback"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                isActiveRoute("/tutor-dashboard/feedback")
                  ? "bg-purple-100 text-purple-600 font-medium"
                  : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
              }`}
              aria-current={isActiveRoute("/tutor-dashboard/feedback") ? "page" : undefined}
            >
              <Star className="h-4 w-4 shrink-0" />
              {isSidebarOpen && <span className="truncate">Feedback</span>}
            </Link>

            <div className="mt-auto pt-4">
              <Separator className="mb-2" />
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-3 text-muted-foreground hover:bg-purple-100 hover:text-purple-600 ${!isSidebarOpen ? 'px-3' : ''}`}
                onClick={handleLogout}
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {isSidebarOpen && <span className="text-sm">Logout</span>}
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar */}
        {isMobile && (
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden fixed bottom-4 right-4 z-50 rounded-full shadow-lg">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px]">
              <SheetHeader>
                <SheetTitle className="text-purple-600">Dashboard Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {[
                  { icon: LayoutDashboard, label: "Dashboard", href: "/tutor-dashboard", badge: null },
                  { icon: BookOpen, label: "Classes", href: "/tutor-dashboard/classes", badge: "3" },
                  { icon: BarChart, label: "Earnings", href: "/tutor-dashboard/earnings", badge: null },
                  { icon: MessageSquare, label: "Messages", href: "/tutor-dashboard/messages", badge: "2" },
                  { icon: Star, label: "Feedback", href: "/tutor-dashboard/feedback", badge: null },
                ].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                      isActiveRoute(item.href)
                        ? "bg-purple-100 text-purple-600 font-medium"
                        : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto text-xs bg-purple-200 text-purple-700" variant="secondary">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
                <Separator className="my-4" />
                <Button 
                  variant="ghost" 
                  className="justify-start gap-3 text-muted-foreground hover:bg-purple-100 hover:text-purple-600" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        )}

        {/* Main content */}
        <main id="main-content" tabIndex={-1} className={`${isSidebarOpen ? 'col-span-12 md:col-span-10 lg:col-span-10 xl:col-span-10' : 'col-span-12 md:col-span-11'} transition-all duration-300 overflow-auto p-4 md:p-6 bg-[#f8fafc]`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default TutorDashboardLayout;
