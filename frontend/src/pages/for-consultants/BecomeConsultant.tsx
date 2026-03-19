
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Calendar, Video, DollarSign, Globe } from "lucide-react";

const BecomeConsultant = () => {
  const navigate = useNavigate();
  const benefits = [
    {
      title: "Reach Clients Worldwide",
      description: "Connect with businesses and individuals across the globe seeking expert consulting services.",
      icon: <Globe className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Flexible Scheduling",
      description: "Create a consulting schedule that works for you—consult part-time, full-time, or anything in between.",
      icon: <Calendar className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Competitive Earnings",
      description: "Set your own rates and earn competitive income offering consulting in your area of expertise.",
      icon: <DollarSign className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Professional Network",
      description: "Join our community of consultants who share resources, strategies, and support each other.",
      icon: <Users className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Easy-to-Use Platform",
      description: "Our intuitive tools make it simple to deliver engaging consulting sessions online.",
      icon: <Video className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Growth Opportunities",
      description: "Expand your consulting practice and build your reputation with our growing client base.",
      icon: <CheckCircle className="h-10 w-10 text-talent-primary" />,
    },
  ];

  const steps = [
    {
      title: "Complete Your Application",
      description: "Fill out our comprehensive application form detailing your qualifications, experience, and consulting specializations.",
    },
    {
      title: "Verification Process",
      description: "Our team will review your application, verify your identity, credentials, and conduct background checks.",
    },
    {
      title: "Consulting Demonstration",
      description: "Show us your consulting style through a brief demo session with our review team.",
    },
    {
      title: "Profile Creation",
      description: "Build your consultant profile with a bio, photos, video introduction, and detailed service descriptions.",
    },
    {
      title: "Platform Training",
      description: "Complete our orientation program to learn how to use our consulting tools and maximize your impact.",
    },
    {
      title: "Start Consulting",
      description: "Launch your first sessions and begin connecting with clients across the globe!",
    },
  ];

  const faqs = [
    {
      question: "What qualifications do I need to become a consultant?",
      answer: "We look for consultants with deep expertise in their field, which could include formal qualifications (degrees, certifications) or demonstrated mastery through professional experience. Most importantly, you must have strong problem-solving skills and excellent communication abilities."
    },
    {
      question: "How much can I earn on Indu AE?",
      answer: "Earnings vary based on your specialization, experience, session format, and pricing strategy. Consultants set their own rates, and Indu AE takes a commission from completed sessions. Many of our successful consultants earn a substantial part-time or full-time income."
    },
    {
      question: "What technology do I need to consult on Indu AE?",
      answer: "You'll need a reliable internet connection, a computer with webcam and microphone, and a quiet, well-lit workspace. Our platform works in modern browsers without requiring additional software installation."
    },
    {
      question: "How long does the application process take?",
      answer: "The typical application process takes 1-2 weeks, including background checks and verification steps. Once approved, you can start offering sessions and building your schedule right away."
    },
    {
      question: "Can I consult in multiple areas?",
      answer: "Absolutely! Many consultants offer services across several related areas where they have expertise. You can create different service offerings for various topics and client needs."
    },
  ];

  return (
    <PageLayout
      title="Become a Consultant"
      description="Join our growing community of expert consultants and share your knowledge with clients worldwide."
    >
      <div className="space-y-16">
        {/* Hero section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Transform Businesses Through Consulting</h2>
            <p className="text-talent-muted mb-6">
              Share your expertise with businesses and individuals on Indu AE—India's growing platform for online consulting. Create your own schedule, set your rates, and connect with clients who need your guidance.
            </p>
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white" onClick={() => navigate("/auth/signup")}>
              Apply to Consult
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Consultant with clients"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Benefits section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Consult on Indu AE</h2>
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
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Rajesh Kapoor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-semibold mb-4">"Consulting on Indu AE changed my career"</h3>
              <p className="text-talent-muted mb-4">
                "After 20 years of corporate experience in business strategy, I was looking for a way to share my knowledge more broadly. Indu AE has allowed me to consult with startups and entrepreneurs across India and beyond. I now have a thriving consulting practice while enjoying complete schedule flexibility."
              </p>
              <div className="font-semibold">Rajesh Kapoor, Business Strategy Consultant | 2 years on Indu AE</div>
            </div>
          </div>
        </div>

        {/* How to become a consultant section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">How to Become an Indu AE Consultant</h2>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Share Your Expertise?</h2>
          <p className="text-talent-muted mb-6 max-w-2xl mx-auto">
            Join our community of expert consultants and start making an impact on businesses and individuals across the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white" onClick={() => navigate("/auth/signup")}>
              Apply to Consult
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

export default BecomeConsultant;
