
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import DesktopNavigationItem from './DesktopNavigationItem';
import { 
  exploreClassesItems, 
  howItWorksItems, 
  forTutorsItems, 
  resourcesItems 
} from './NavigationData';
import { useAuth } from '@/contexts/AuthContext';

const DesktopNavigation = () => {
  const { isAuthenticated, user, logout } = useAuth();

  // Determine the correct dashboard URL based on user role
  const dashboardUrl = user?.role === "tutor" ? "/tutor-dashboard" : "/dashboard";

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="hidden md:flex items-center space-x-1">
        <NavigationMenu>
          <NavigationMenuList>
            <DesktopNavigationItem label="Explore Classes" items={exploreClassesItems} />
            <DesktopNavigationItem label="How It Works" items={howItWorksItems} />
            <DesktopNavigationItem label="For Tutors" items={forTutorsItems} />
            <DesktopNavigationItem label="Resources" items={resourcesItems} />
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Button className="bg-talent-primary hover:bg-talent-secondary text-white font-medium transition-all" asChild>
              <Link to={dashboardUrl}>Go to Dashboard</Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="font-medium border-talent-primary text-talent-primary hover:bg-talent-primary/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" className="font-medium" asChild>
              <Link to="/auth/login">Log In</Link>
            </Button>
            <Button className="bg-talent-primary hover:bg-talent-secondary text-white font-medium transition-all" asChild>
              <Link to="/auth/signup">Sign Up Free</Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default DesktopNavigation;
