
import PageLayout from "@/components/PageLayout";
import { FileText, BookOpen, Video, Users, Monitor, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const TutorResources = () => {
  const resourceCategories = [
    {
      title: "Teaching Guides",
      description: "Comprehensive guides on effective online teaching strategies, classroom management, and student engagement.",
      icon: <BookOpen className="h-10 w-10 text-talent-primary" />,
      resources: [
        { title: "The Art of Online Teaching", type: "PDF Guide", link: "#" },
        { title: "Managing Virtual Classroom Dynamics", type: "Tutorial", link: "#" },
        { title: "Creating Engaging Assignments", type: "Worksheet", link: "#" },
      ]
    },
    {
      title: "Platform Tutorials",
      description: "Step-by-step tutorials on using Indu AE's teaching tools and features to their full potential.",
      icon: <Monitor className="h-10 w-10 text-talent-primary" />,
      resources: [
        { title: "Getting Started with the Classroom Interface", type: "Video", link: "#" },
        { title: "Using Interactive Whiteboards", type: "Tutorial", link: "#" },
        { title: "Managing Class Recordings", type: "Guide", link: "#" },
      ]
    },
    {
      title: "Business Development",
      description: "Resources to help you grow your teaching business, attract students, and optimize your offerings.",
      icon: <Users className="h-10 w-10 text-talent-primary" />,
      resources: [
        { title: "Crafting an Effective Tutor Profile", type: "Guide", link: "#" },
        { title: "Pricing Strategies for Online Classes", type: "Webinar", link: "#" },
        { title: "Marketing Your Classes Effectively", type: "Toolkit", link: "#" },
      ]
    },
    {
      title: "Professional Development",
      description: "Opportunities to enhance your teaching skills, stay current with educational trends, and grow professionally.",
      icon: <FileText className="h-10 w-10 text-talent-primary" />,
      resources: [
        { title: "Differentiated Instruction in Online Settings", type: "Course", link: "#" },
        { title: "Assessment Strategies for Virtual Learning", type: "Workshop", link: "#" },
        { title: "Building a Teaching Portfolio", type: "Template", link: "#" },
      ]
    },
  ];

  const upcomingWebinars = [
    {
      title: "Mastering Student Engagement in Virtual Classes",
      date: "June 15, 2023 | 7:00 PM IST",
      presenter: "Dr. Ananya Desai, Education Specialist",
      description: "Learn proven techniques to keep students actively participating and engaged during online classes."
    },
    {
      title: "Growing Your Student Base: Marketing Strategies for Tutors",
      date: "June 22, 2023 | 6:30 PM IST",
      presenter: "Rajiv Kapoor, Digital Marketing Expert",
      description: "Discover effective ways to promote your classes and attract more students to your Indu AE offerings."
    },
    {
      title: "Creating Compelling Visual Materials for Online Teaching",
      date: "June 30, 2023 | 7:30 PM IST",
      presenter: "Priya Mehta, Instructional Designer",
      description: "Learn to create visually appealing and educationally effective slides, handouts, and digital resources."
    },
  ];

  return (
    <PageLayout
      title="Tutor Resources"
      description="Access tools, guides, and support materials to help you succeed as an online educator on Indu AE."
    >
      <div className="space-y-16">
        {/* Hero section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Resources to Help You Succeed</h2>
            <p className="text-talent-muted mb-6">
              We're committed to your success as a Indu AE tutor. Explore our comprehensive library of teaching resources, business guides, and professional development opportunities designed to help you create engaging classes and grow your online teaching business.
            </p>
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
              Explore Resource Library
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Teacher resources" 
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
        
        {/* Tutor community section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Join Our Tutor Community</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 text-center">
              <Users className="h-10 w-10 text-talent-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tutor Forums</h3>
              <p className="text-talent-muted mb-4">
                Connect with fellow tutors, share ideas, ask questions, and get support from experienced educators.
              </p>
              <Button className="bg-talent-primary hover:bg-talent-secondary text-white w-full">
                Join Forums
              </Button>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 text-center">
              <Video className="h-10 w-10 text-talent-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Monthly Meetups</h3>
              <p className="text-talent-muted mb-4">
                Participate in virtual gatherings where tutors share best practices and build connections.
              </p>
              <Button className="bg-talent-primary hover:bg-talent-secondary text-white w-full">
                View Schedule
              </Button>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 text-center">
              <FileText className="h-10 w-10 text-talent-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tutor Newsletter</h3>
              <p className="text-talent-muted mb-4">
                Stay up-to-date with platform updates, teaching tips, and success stories from our community.
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
            Our dedicated tutor support team is here to help you with any questions or challenges you may face.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
              Contact Tutor Support
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

export default TutorResources;
