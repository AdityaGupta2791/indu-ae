
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Calendar, Video, Star, Shield } from "lucide-react";

const ForParents = () => {
  const benefits = [
    {
      title: "Personalized Learning",
      description: "Classes tailored to your child's interests, learning style, and schedule.",
      icon: <Users className="h-5 w-5 text-talent-primary" />,
    },
    {
      title: "Expert Tutors",
      description: "Learn from passionate, qualified teachers who are experts in their fields.",
      icon: <Star className="h-5 w-5 text-talent-primary" />,
    },
    {
      title: "Flexible Scheduling",
      description: "Find classes that fit your busy family schedule, with options for all time zones.",
      icon: <Calendar className="h-5 w-5 text-talent-primary" />,
    },
    {
      title: "Safe Learning Environment",
      description: "All tutors undergo background checks and our virtual classrooms are secure.",
      icon: <Shield className="h-5 w-5 text-talent-primary" />,
    },
    {
      title: "Interactive Learning",
      description: "Engage in real-time with interactive classes that make learning fun.",
      icon: <Video className="h-5 w-5 text-talent-primary" />,
    },
    {
      title: "Satisfaction Guarantee",
      description: "If you're not satisfied with your first class, we'll offer a full refund.",
      icon: <CheckCircle className="h-5 w-5 text-talent-primary" />,
    },
  ];

  const faqItems = [
    {
      question: "How do I sign up my child for classes?",
      answer: "Registration is simple! Create an account, browse classes, and enroll your child with secure online payment. Once enrolled, you'll receive confirmation and access details for the virtual classroom."
    },
    {
      question: "What ages do you cater to?",
      answer: "Indu AE offers classes for children ages 3-18. We have specially designed classes for different age groups to ensure appropriate content and teaching methods."
    },
    {
      question: "How are the classes conducted?",
      answer: "Classes are conducted live via our secure video platform. Students can interact with tutors and peers in real-time, ask questions, and participate in discussions and activities."
    },
    {
      question: "What if my child misses a class?",
      answer: "Many of our classes are recorded and available for replay. For ongoing courses, tutors often provide materials to help catch up. You can also contact the tutor directly for assistance."
    },
    {
      question: "How do you select your tutors?",
      answer: "All Indu AE tutors undergo a rigorous selection process including credential verification, background checks, and teaching demonstrations. We only select experienced educators passionate about their subjects."
    },
  ];

  return (
    <PageLayout
      title="For Parents"
      description="Learn how Indu AE helps your child discover new talents and develop skills through engaging online classes."
    >
      <div className="space-y-16">
        {/* Hero section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Discover the Perfect Learning Journey for Your Child</h2>
            <p className="text-talent-muted mb-6">
              At Indu AE, we're passionate about helping children explore their interests, develop new skills, and build confidence through quality online education.
            </p>
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
              Browse Classes
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Happy children learning" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* Benefits section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Parents Choose Indu AE</h2>
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
        
        {/* Testimonials */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Parents Are Saying</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-talent-primary mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-talent-warning text-talent-warning" />
                ))}
              </div>
              <p className="italic mb-4">"My daughter has flourished in her coding classes. Her tutor makes complex concepts accessible and fun. She's now building her own games and websites!"</p>
              <div className="font-semibold">Priya K., parent of 13-year-old</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-talent-primary mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-talent-warning text-talent-warning" />
                ))}
              </div>
              <p className="italic mb-4">"Finding quality music instruction was challenging until we discovered Indu AE. The violin teacher is patient and encouraging, and my son looks forward to every class."</p>
              <div className="font-semibold">Rajiv M., parent of 9-year-old</div>
            </div>
          </div>
        </div>
        
        {/* FAQ section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                <p className="text-talent-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA section */}
        <div className="bg-talent-primary/10 p-8 rounded-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Begin Your Child's Learning Journey?</h2>
          <p className="text-talent-muted mb-6 max-w-2xl mx-auto">
            Join thousands of families who have discovered the perfect classes for their children on Indu AE.
          </p>
          <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
            Browse Classes Now
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ForParents;
