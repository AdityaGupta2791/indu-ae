
import PageLayout from "@/components/PageLayout";
import { Shield, CheckCircle, User, Award, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const SafetyQuality = () => {
  const safetyMeasures = [
    {
      title: "Rigorous Tutor Verification",
      description: "All tutors undergo identity verification, credential checks, and thorough background screening.",
      icon: <User className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Secure Video Platform",
      description: "Our custom-built video classroom features end-to-end encryption and secure access controls.",
      icon: <Shield className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Content Moderation",
      description: "All class materials and descriptions are reviewed to ensure age-appropriate content.",
      icon: <FileText className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Parental Controls",
      description: "Parents can monitor class activities, review communications, and set privacy preferences.",
      icon: <Eye className="h-10 w-10 text-talent-primary" />,
    },
  ];

  const qualityStandards = [
    {
      title: "Expert Tutors",
      description: "Our tutors are subject matter experts with verified credentials and teaching experience.",
    },
    {
      title: "Engaging Curriculum",
      description: "Classes are designed to be interactive, engaging, and aligned with learning objectives.",
    },
    {
      title: "Small Class Sizes",
      description: "Limited enrollment ensures personalized attention and meaningful participation.",
    },
    {
      title: "Regular Quality Reviews",
      description: "Ongoing evaluation of classes through student feedback and professional assessment.",
    },
    {
      title: "Continuous Improvement",
      description: "We regularly update our platform and teaching methods based on educational research.",
    },
    {
      title: "Satisfaction Guarantee",
      description: "If you're not satisfied with your first class, we offer a full refund—no questions asked.",
    },
  ];

  return (
    <PageLayout
      title="Safety & Quality"
      description="Learn about our commitment to providing safe, high-quality online education for children of all ages."
    >
      <div className="space-y-16">
        {/* Intro section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Child's Safety Is Our Top Priority</h2>
            <p className="text-talent-muted mb-6">
              At Indu AE, we've built a secure online learning environment where children can explore, create, and connect without compromise. Our comprehensive approach to safety includes rigorous tutor verification, secure technology, and transparent policies.
            </p>
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
              Learn More About Our Process
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Secure online learning" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* Safety measures section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Safety Measures</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {safetyMeasures.map((measure, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="mb-4">{measure.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{measure.title}</h3>
                <p className="text-talent-muted">{measure.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tutor verification section */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Tutor Verification Process</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-talent-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Identity Verification</h3>
                <p className="text-talent-muted">Government-issued ID verification and address confirmation</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-talent-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Background Checks</h3>
                <p className="text-talent-muted">Comprehensive background screening conducted by accredited third-party providers</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-talent-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Credential Verification</h3>
                <p className="text-talent-muted">Confirmation of academic degrees, certifications, and teaching experience</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-talent-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Teaching Demonstration</h3>
                <p className="text-talent-muted">Live evaluation of teaching ability, engagement skills, and subject knowledge</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-talent-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">5</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Ongoing Monitoring</h3>
                <p className="text-talent-muted">Continuous evaluation through student feedback and regular performance reviews</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quality standards section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Quality Standards</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {qualityStandards.map((standard, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                <CheckCircle className="h-6 w-6 text-talent-success mb-4" />
                <h3 className="text-lg font-semibold mb-2">{standard.title}</h3>
                <p className="text-talent-muted text-sm">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Parent testimonial */}
        <div className="bg-talent-primary/10 p-8 rounded-xl">
          <div className="max-w-3xl mx-auto">
            <div className="text-2xl text-talent-primary mb-4">"</div>
            <p className="text-xl italic mb-6">
              As a parent, safety is my first concern with online classes. Indu AE has exceeded my expectations with their transparent safety policies and the quality of their tutors. My daughter's coding instructor is not only knowledgeable but also creates a supportive environment where she feels comfortable asking questions.
            </p>
            <div className="font-semibold">Meera Singh, parent of 12-year-old</div>
          </div>
        </div>
        
        {/* CTA section */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Experience the Indu AE Difference</h2>
          <p className="text-talent-muted mb-6 max-w-2xl mx-auto">
            Join thousands of families who trust Indu AE for safe, high-quality online education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
              Browse Classes
            </Button>
            <Button size="lg" variant="outline" className="border-talent-primary text-talent-primary hover:bg-talent-primary/5">
              Learn More About Our Tutors
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SafetyQuality;
