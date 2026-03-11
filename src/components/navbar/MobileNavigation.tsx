
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileNavLink from './MobileNavLink';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  exploreClassesItems, 
  howItWorksItems, 
  forTutorsItems, 
  resourcesItems 
} from './NavigationData';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavigationProps {
  isMenuOpen: boolean;
}

const MobileNavigation = ({ isMenuOpen }: MobileNavigationProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Determine the correct dashboard URL based on user role
  const dashboardUrl = user?.role === "tutor" ? "/tutor-dashboard" : "/dashboard";

  if (!isMenuOpen) return null;
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div 
      className="md:hidden fixed inset-x-0 top-16 z-50 bg-white shadow-lg animate-fade-in" 
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="flex flex-col space-y-4 p-4">
        {/* Explore Classes Section */}
        <div className="border-b border-gray-100 pb-2">
          <button 
            onClick={() => toggleSection('explore')}
            className="w-full flex items-center justify-between py-2 text-base font-medium text-talent-dark hover:text-talent-primary transition-colors"
          >
            <span>Explore Classes</span>
            {expandedSection === 'explore' ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSection === 'explore' && (
            <div className="pl-4 pt-2 space-y-2">
              {exploreClassesItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.href}
                  className="block py-1.5 text-sm font-medium text-talent-dark hover:text-talent-primary transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* How It Works Section */}
        <div className="border-b border-gray-100 pb-2">
          <button 
            onClick={() => toggleSection('howItWorks')}
            className="w-full flex items-center justify-between py-2 text-base font-medium text-talent-dark hover:text-talent-primary transition-colors"
          >
            <span>How It Works</span>
            {expandedSection === 'howItWorks' ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSection === 'howItWorks' && (
            <div className="pl-4 pt-2 space-y-2">
              {howItWorksItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.href}
                  className="block py-1.5 text-sm font-medium text-talent-dark hover:text-talent-primary transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* For Tutors Section */}
        <div className="border-b border-gray-100 pb-2">
          <button 
            onClick={() => toggleSection('forTutors')}
            className="w-full flex items-center justify-between py-2 text-base font-medium text-talent-dark hover:text-talent-primary transition-colors"
          >
            <span>For Tutors</span>
            {expandedSection === 'forTutors' ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSection === 'forTutors' && (
            <div className="pl-4 pt-2 space-y-2">
              {forTutorsItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.href}
                  className="block py-1.5 text-sm font-medium text-talent-dark hover:text-talent-primary transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Resources Section */}
        <div className="border-b border-gray-100 pb-2">
          <button 
            onClick={() => toggleSection('resources')}
            className="w-full flex items-center justify-between py-2 text-base font-medium text-talent-dark hover:text-talent-primary transition-colors"
          >
            <span>Resources</span>
            {expandedSection === 'resources' ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSection === 'resources' && (
            <div className="pl-4 pt-2 space-y-2">
              {resourcesItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.href}
                  className="block py-1.5 text-sm font-medium text-talent-dark hover:text-talent-primary transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="pt-4 flex flex-col gap-2">
          {isAuthenticated ? (
            <Button className="w-full justify-center bg-talent-primary hover:bg-talent-secondary" asChild>
              <Link to={dashboardUrl}>Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" className="w-full justify-center" asChild>
                <Link to="/auth/login">Log In</Link>
              </Button>
              <Button className="w-full justify-center bg-talent-primary hover:bg-talent-secondary" asChild>
                <Link to="/auth/signup">Sign Up Free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
