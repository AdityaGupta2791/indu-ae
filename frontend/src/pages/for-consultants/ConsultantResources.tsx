
import PageLayout from "@/components/PageLayout";
import { FileText, BookOpen, Video, Users, Monitor, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConsultantResources = () => {
  const resourceCategories = [
    {
      title: "Consulting Guides",
      description: "Comprehensive guides on effective online consulting strategies, client management, and engagement techniques.",
      icon: <BookOpen className="h-10 w-10 text-talent-primary" />,
      resources: [
        { title: "The Art of Online Consulting", type: "PDF Guide", link: "#" },
        { title: "Managing Client Relationships Remotely", type: "Tutorial", link: "#" },
        { title: "Creating Compelling Proposals", type: "Template", link: "#" },
      ]
    },
    {
      title: "Platform Tutorials",
      description: "Step-by-step tutorials on using Indu AE's consulting tools and features to their full potential.",
      icon: <Monitor className="h-10 w-10 text-talent-primary" />,
      resources: [
        { title: "Getting Started with the Consulting Interface", type: "Video", link: "#" },
        { title: "Using Screen Sharing & Collaboration Tools", type: "Tutorial", link: "#" },
        { title: "Managing Session Recordings", type: "Guide", link: "#" },
      ]
    },
    {
      title: "Business Development",
      description: "Resources to help you grow your consulting practice, attract clients, and optimize your services.",
      icon: <Users className="h-10 w-10 text-talent-primary" />,
      resources: [
        { title: "Crafting an Effective Consultant Profile", type: "Guide", link: "#" },
        { title: "Pricing Strategies for Consulting Sessions", type: "Webinar", link: "#" },
        { title: "Marketing Your Consulting Services", type: "Toolkit", link: "#" },
      ]
    },
    {
      title: "Professional Development",
      description: "Opportunities to enhance your consulting skills, stay current with industry trends, and grow professionally.",
      icon: <FileText className="h-10 w-10 text-talent-primary" />,
      resources: [
        { title: "Advanced Consulting Frameworks", type: "Course", link: "#" },
        { title: "Data-Driven Decision Making for Consultants", type: "Workshop", link: "#" },
        { title: "Building a Consulting Portfolio", type: "Template", link: "#" },
      ]
    },
  ];

  const upcomingWebinars = [
    {
      title: "Mastering Client Engagement in Virtual Consulting",
      date: "June 15, 2025 | 7:00 PM IST",
      presenter: "Dr. Ananya Desai, Business Consultant",
      description: "Learn proven techniques to keep clients engaged and deliver high-impact consulting sessions online."
    },
    {
      title: "Growing Your Client Base: Marketing Strategies for Consultants",
      date: "June 22, 2025 | 6:30 PM IST",
      presenter: "Rajiv Kapoor, Digital Marketing Expert",
      description: "Discover effective ways to promote your consulting services and attract more clients on Indu AE."
    },
    {
      title: "Creating Compelling Deliverables for Online Consulting",
      date: "June 30, 2025 | 7:30 PM IST",
      presenter: "Priya Mehta, Strategy Consultant",
      description: "Learn to create professional reports, presentations, and frameworks that add value to your consulting."
    },
  ];

  return (
    <PageLayout
      title="Consultant Resources"
      description="Access tools, guides, and support materials to help you succeed as an online consultant on Indu AE."
    >
      <div className="space-y-16">
        {/* Hero section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Resources to Help You Succeed</h2>
            <p className="text-talent-muted mb-6">
              We're committed to your success as an Indu AE consultant. Explore our comprehensive library of consulting resources, business guides, and professional development opportunities designed to help you deliver impactful sessions and grow your practice.
            </p>
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
              Explore Resource Library
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Consultant resources"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Resource categories section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Resource Categories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-talent-muted mb-4">{category.description}</p>
                <div className="space-y-3">
                  {category.resources.map((resource, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div>
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-xs text-talent-muted">{resource.type}</div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-talent-primary hover:text-talent-secondary">
                        <Download className="h-4 w-4 mr-1" />
                        Access
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming webinars section */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Upcoming Webinars</h2>
          <div className="space-y-6">
            {upcomingWebinars.map((webinar, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <Video className="h-10 w-10 text-talent-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{webinar.title}</h3>
                    <div className="text-talent-primary font-medium mb-2">{webinar.date}</div>
                    <div className="font-medium mb-2">{webinar.presenter}</div>
                    <p className="text-talent-muted mb-4">{webinar.description}</p>
                    <div className="flex gap-3">
                      <Button className="bg-talent-primary hover:bg-talent-secondary text-white">
                        Register Now
                      </Button>
                      <Button variant="outline" className="border-talent-primary text-talent-primary hover:bg-talent-primary/5">
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" className="border-talent-primary text-talent-primary hover:bg-talent-primary/5">
              View All Upcoming Webinars
            </Button>
          </div>
        </div>

        {/* Consultant community section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Join Our Consultant Community</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 text-center">
              <Users className="h-10 w-10 text-talent-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Consultant Forums</h3>
              <p className="text-talent-muted mb-4">
                Connect with fellow consultants, share ideas, ask questions, and get support from experienced professionals.
              </p>
              <Button className="bg-talent-primary hover:bg-talent-secondary text-white w-full">
                Join Forums
              </Button>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 text-center">
              <Video className="h-10 w-10 text-talent-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Monthly Meetups</h3>
              <p className="text-talent-muted mb-4">
                Participate in virtual gatherings where consultants share best practices and build connections.
              </p>
              <Button className="bg-talent-primary hover:bg-talent-secondary text-white w-full">
                View Schedule
              </Button>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 text-center">
              <FileText className="h-10 w-10 text-talent-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Consultant Newsletter</h3>
              <p className="text-talent-muted mb-4">
                Stay up-to-date with platform updates, consulting tips, and success stories from our community.
              </p>
              <Button className="bg-talent-primary hover:bg-talent-secondary text-white w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Support section */}
        <div className="bg-talent-primary/10 p-8 rounded-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Additional Support?</h2>
          <p className="text-talent-muted mb-6 max-w-2xl mx-auto">
            Our dedicated consultant support team is here to help you with any questions or challenges you may face.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
              Contact Consultant Support
            </Button>
            <Button size="lg" variant="outline" className="border-talent-primary text-talent-primary hover:bg-talent-primary/5">
              Browse FAQs
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ConsultantResources;
