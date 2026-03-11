
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Calendar, Video, DollarSign, Globe } from "lucide-react";

const BecomeTutor = () => {
  const navigate = useNavigate();
  const benefits = [
    {
      title: "Reach Students Worldwide",
      description: "Connect with eager learners across the globe and share your expertise without geographical limitations.",
      icon: <Globe className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Flexible Scheduling",
      description: "Create a teaching schedule that works for you—teach part-time, full-time, or anything in between.",
      icon: <Calendar className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Competitive Earnings",
      description: "Set your own rates and earn competitive income teaching subjects you're passionate about.",
      icon: <DollarSign className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Supportive Community",
      description: "Join our community of educators who share resources, strategies, and support each other.",
      icon: <Users className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Easy-to-Use Platform",
      description: "Our intuitive teaching tools make it simple to deliver engaging online classes.",
      icon: <Video className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Growth Opportunities",
      description: "Expand your teaching business and build your reputation with our growing student base.",
      icon: <CheckCircle className="h-10 w-10 text-talent-primary" />,
    },
  ];

  const steps = [
    {
      title: "Complete Your Application",
      description: "Fill out our comprehensive application form detailing your qualifications, experience, and the subjects you wish to teach.",
    },
    {
      title: "Verification Process",
      description: "Our team will review your application, verify your identity, credentials, and conduct background checks.",
    },
    {
      title: "Teaching Demonstration",
      description: "Show us your teaching style through a brief demo session with our education team.",
    },
    {
      title: "Profile Creation",
      description: "Build your tutor profile with a bio, photos, video introduction, and detailed class descriptions.",
    },
    {
      title: "Platform Training",
      description: "Complete our orientation program to learn how to use our teaching tools and maximize your impact.",
    },
    {
      title: "Start Teaching",
      description: "Launch your first classes and begin connecting with students across the globe!",
    },
  ];

  const faqs = [
    {
      question: "What qualifications do I need to become a tutor?",
      answer: "We look for tutors with expertise in their subject area, which could include formal qualifications (degrees, certifications) or demonstrated mastery through professional experience. Most importantly, you must have a passion for teaching and excellent communication skills."
    },
    {
      question: "How much can I earn on Indu AE?",
      answer: "Earnings vary based on your subject, experience, class format, and pricing strategy. Tutors set their own rates, and Indu AE takes a commission from completed classes. Many of our successful tutors earn a substantial part-time or full-time income."
    },
    {
      question: "What technology do I need to teach on Indu AE?",
      answer: "You'll need a reliable internet connection, a computer with webcam and microphone, and a quiet, well-lit teaching space. Our platform works in modern browsers without requiring additional software installation."
    },
    {
      question: "How long does the application process take?",
      answer: "The typical application process takes 1-2 weeks, including background checks and verification steps. Once approved, you can start creating classes and building your schedule right away."
    },
    {
      question: "Can I teach multiple subjects?",
      answer: "Absolutely! Many tutors teach across several related subjects where they have expertise. You can create different classes for various topics and age groups."
    },
  ];

  return (
    <PageLayout
      title="Become a Tutor"
      description="Join our growing community of passionate educators and share your expertise with students worldwide."
    >
      <div className="space-y-16">
        {/* Hero section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Transform Lives Through Teaching</h2>
            <p className="text-talent-muted mb-6">
              Share your passion and expertise with eager young minds on Indu AE—India's growing platform for online education. Create your own schedule, set your rates, and connect with students who are excited to learn from you.
            </p>
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white" onClick={() => navigate("/auth/signup")}>
              Apply to Teach
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Teacher with students" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* Benefits section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Teach on Indu AE</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-talent-muted">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Success story section */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <div className="md:flex gap-8 items-center">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="rounded-full overflow-hidden w-32 h-32 mx-auto">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Priya Sharma" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-semibold mb-4">"Teaching on Indu AE changed my life"</h3>
              <p className="text-talent-muted mb-4">
                "After 15 years of teaching music in traditional settings, I was looking for a way to reach more students and have a better work-life balance. Indu AE has allowed me to share my passion for violin with students across India and beyond. I now earn more than my previous full-time job while working fewer hours and connecting with amazing young musicians."
              </p>
              <div className="font-semibold">Priya Sharma, Music Teacher | 3 years on Indu AE</div>
            </div>
          </div>
        </div>
        
        {/* How to become a tutor section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">How to Become a Indu AE Tutor</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-talent-primary text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-talent-muted">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-12 right-0 h-0.5 bg-talent-gray-200 hidden lg:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* FAQs section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-talent-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA section */}
        <div className="bg-talent-primary/10 p-8 rounded-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Share Your Knowledge?</h2>
          <p className="text-talent-muted mb-6 max-w-2xl mx-auto">
            Join our community of passionate educators and start impacting young minds across the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white" onClick={() => navigate("/auth/signup")}>
              Apply to Teach
            </Button>
            <Button size="lg" variant="outline" className="border-talent-primary text-talent-primary hover:bg-talent-primary/5">
              Learn More About Our Platform
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BecomeTutor;
