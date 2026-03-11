
import PageLayout from "@/components/PageLayout";
import { Calendar, Video, Users, Clock, BookOpen, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClassFormats = () => {
  const classFormats = [
    {
      title: "One-time Classes",
      description: "Single-session classes on specific topics, perfect for trying new subjects or special interest areas.",
      icon: <Calendar className="h-10 w-10 text-talent-primary" />,
      features: ["No long-term commitment", "Try before you enroll in series", "Focus on specific topics"],
      example: "Art Workshop: Van Gogh's Starry Night"
    },
    {
      title: "Ongoing Courses",
      description: "Multi-session structured courses with progressive learning objectives and skill development.",
      icon: <BookOpen className="h-10 w-10 text-talent-primary" />,
      features: ["Sequential learning path", "Skill building over time", "Deeper subject exploration"],
      example: "Python Programming: Beginner to Intermediate (8 weeks)"
    },
    {
      title: "Clubs & Recurring Classes",
      description: "Regular, ongoing sessions where students build community while developing skills over time.",
      icon: <Users className="h-10 w-10 text-talent-primary" />,
      features: ["Consistent meeting times", "Build lasting friendships", "Long-term skill development"],
      example: "Young Writers Club (meets weekly)"
    },
    {
      title: "Private & Small Group",
      description: "Personalized instruction with focused attention on individual student needs and progress.",
      icon: <Medal className="h-10 w-10 text-talent-primary" />,
      features: ["Customized pacing", "Individual attention", "Personalized feedback"],
      example: "One-on-One Algebra Tutoring"
    },
  ];

  const classElements = [
    {
      title: "Live Interactive Video",
      description: "All classes take place on our secure, easy-to-use video platform designed specifically for engaging learning.",
      icon: <Video className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Small Class Sizes",
      description: "Most Indu AE classes have 5-12 students, ensuring personalized attention and peer interaction.",
      icon: <Users className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Flexible Durations",
      description: "Class lengths vary from 30-90 minutes based on age group and subject matter.",
      icon: <Clock className="h-10 w-10 text-talent-primary" />,
    },
    {
      title: "Personalized Learning",
      description: "Our tutors adapt their teaching approach to accommodate different learning styles and needs.",
      icon: <Medal className="h-10 w-10 text-talent-primary" />,
    },
  ];

  return (
    <PageLayout
      title="Class Formats"
      description="Discover our different class types and learning experiences designed for various subjects, ages, and learning styles."
    >
      <div className="space-y-16">
        {/* Intro section */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Flexible Learning Formats for Every Child</h2>
          <p className="text-talent-muted mb-6">
            At Indu AE, we offer a variety of class formats to match your child's learning style, interests, and schedule. From one-time workshops to ongoing courses, our flexible approach ensures the perfect fit for your family's needs.
          </p>
          <Button className="bg-talent-primary hover:bg-talent-secondary text-white">
            Browse All Classes
          </Button>
        </div>
        
        {/* Class formats section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Class Formats</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {classFormats.map((format, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="mb-4">{format.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{format.title}</h3>
                <p className="text-talent-muted mb-4">{format.description}</p>
                <div className="mb-4">
                  <div className="font-medium mb-2">Key Features:</div>
                  <ul className="list-disc pl-5 space-y-1 text-talent-muted">
                    {format.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-2">Example:</div>
                  <div className="bg-talent-gray-100 p-3 rounded-md text-sm">
                    {format.example}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Class elements section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Elements of Every Indu AE Class</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {classElements.map((element, index) => (
              <div key={index} className="flex gap-4 p-6 border border-gray-200 rounded-xl">
                <div>{element.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{element.title}</h3>
                  <p className="text-talent-muted">{element.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Class selection guide */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">How to Choose the Right Class Format</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">For Exploring New Interests</h3>
              <p className="text-talent-muted">
                If your child wants to try a new subject or activity, start with a one-time class or short series to gauge their interest before committing to a longer course.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">For Building Academic Skills</h3>
              <p className="text-talent-muted">
                Choose ongoing courses with sequential learning for subjects like math, coding, or languages where skills build progressively over time.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">For Socialization & Community</h3>
              <p className="text-talent-muted">
                Clubs and recurring classes are ideal for children who thrive in consistent social environments and enjoy building friendships around shared interests.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">For Personalized Attention</h3>
              <p className="text-talent-muted">
                Private or small group classes offer tailored instruction for children who need specialized support or want to advance rapidly in a particular area.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA section */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Find the Perfect Class Format for Your Child</h2>
          <p className="text-talent-muted mb-6 max-w-2xl mx-auto">
            Browse our extensive catalog of classes across different formats and discover the ideal learning experience for your child's unique needs.
          </p>
          <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
            Explore Classes Now
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClassFormats;
