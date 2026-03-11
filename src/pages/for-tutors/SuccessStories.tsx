
import PageLayout from "@/components/PageLayout";
import { Star, Users, Calendar, DollarSign, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const SuccessStories = () => {
  const featuredStories = [
    {
      name: "Priya Sharma",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      subject: "Music - Violin & Piano",
      joined: "3 years ago",
      students: 250,
      classes: 850,
      rating: 4.9,
      story: "After teaching music for 15 years in traditional settings, I was looking for a better work-life balance. Indu AE allowed me to build a thriving online teaching business reaching students across India and internationally. I now earn more than my previous full-time position while having complete schedule flexibility.",
      achievement: "Built a 6-figure teaching business within 18 months",
      quote: "Indu AE has transformed my teaching career by connecting me with passionate students who truly want to learn."
    },
    {
      name: "Vikram Singh",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      subject: "Coding & Game Design",
      joined: "2 years ago",
      students: 320,
      classes: 780,
      rating: 4.8,
      story: "I started teaching coding on Indu AE as a side project while working as a software engineer. The platform made it so easy to attract students and manage classes that I was able to transition to full-time teaching within 6 months. Now I get to share my passion for coding with young minds every day.",
      achievement: "Developed a popular 12-week coding boot camp for teens",
      quote: "The platform tools make it easy to create engaging technical classes that students love."
    },
    {
      name: "Neha Patel",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      subject: "Art & Creative Expression",
      joined: "1.5 years ago",
      students: 210,
      classes: 620,
      rating: 4.9,
      story: "As a professional artist, I was looking for ways to supplement my income during the pandemic. Indu AE not only provided financial stability but has become my primary passion. I've connected with young artists across the country and watching their skills develop has been incredibly rewarding.",
      achievement: "Featured in national media for innovative virtual art instruction",
      quote: "The community of learners and teachers on Indu AE is unlike anything I've experienced before."
    },
  ];

  const testimonials = [
    {
      quote: "The support from Indu AE has been incredible. From technical assistance to marketing guidance, they've helped me build a teaching business I never thought possible.",
      name: "Rajiv Kumar",
      subject: "Mathematics",
      image: "https://randomuser.me/api/portraits/men/52.jpg"
    },
    {
      quote: "What I love most about teaching on Indu AE is the freedom to create my own curriculum and teach in my unique style. The platform supports my creativity while handling all the administrative details.",
      name: "Ananya Desai",
      subject: "Creative Writing",
      image: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    {
      quote: "As someone who was new to online teaching, I was amazed at how quickly I was able to build a student base. The platform's search visibility and promotion tools helped me fill my classes within weeks.",
      name: "Arjun Mehta",
      subject: "Physics & Astronomy",
      image: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    {
      quote: "The scheduling flexibility has allowed me to continue teaching while pursuing my Ph.D. I can design my teaching schedule around my research commitments and still connect with amazing students.",
      name: "Lakshmi Krishnan",
      subject: "Classical Dance",
      image: "https://randomuser.me/api/portraits/women/62.jpg"
    },
  ];

  const statistics = [
    {
      value: "₹75,000+",
      label: "Average Monthly Earnings",
      description: "for established tutors with regular classes",
      icon: <DollarSign className="h-10 w-10 text-talent-primary" />,
    },
    {
      value: "4.8/5",
      label: "Average Class Rating",
      description: "from thousands of student reviews",
      icon: <Star className="h-10 w-10 text-talent-primary" />,
    },
    {
      value: "25+",
      label: "Average Class Size",
      description: "students per month for active tutors",
      icon: <Users className="h-10 w-10 text-talent-primary" />,
    },
    {
      value: "85%",
      label: "Student Retention",
      description: "for ongoing class series and packages",
      icon: <Award className="h-10 w-10 text-talent-primary" />,
    },
  ];

  return (
    <PageLayout
      title="Success Stories"
      description="Learn from tutors who have built thriving teaching businesses on Indu AE."
    >
      <div className="space-y-16">
        {/* Intro section */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Meet Our Thriving Tutors</h2>
          <p className="text-talent-muted text-center mb-0 max-w-3xl mx-auto">
            These educators have transformed their teaching passion into successful online businesses through Indu AE. Discover their journeys, strategies, and insights.
          </p>
        </div>
        
        {/* Featured success stories */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Featured Success Stories</h2>
          <div className="space-y-12">
            {featuredStories.map((story, index) => (
              <div 
                key={index} 
                className={`grid md:grid-cols-3 gap-8 items-start p-8 border border-gray-200 rounded-xl ${
                  index === 0 ? "bg-talent-primary/5 border-talent-primary/20" : ""
                }`}
              >
                <div className="md:col-span-1 text-center md:sticky md:top-24">
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src={story.image} 
                      alt={story.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{story.name}</h3>
                  <p className="text-talent-primary font-medium mb-4">{story.subject}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Users className="h-5 w-5 text-talent-primary mx-auto mb-1" />
                      <div className="font-semibold">{story.students}</div>
                      <div className="text-talent-muted">Students</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Calendar className="h-5 w-5 text-talent-primary mx-auto mb-1" />
                      <div className="font-semibold">{story.classes}</div>
                      <div className="text-talent-muted">Classes</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${
                            star <= Math.floor(story.rating) 
                              ? "fill-talent-warning text-talent-warning" 
                              : "text-gray-200"
                          }`} 
                        />
                      ))}
                      <span className="ml-1 font-semibold">{story.rating}</span>
                    </div>
                    <div className="text-talent-muted text-xs">Avg. Rating</div>
                  </div>
                  
                  <div className="mt-4 text-xs text-talent-muted">
                    Joined {story.joined}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <div className="text-xl text-talent-primary mb-2">"</div>
                    <p className="italic text-xl mb-4">{story.quote}</p>
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-3">My Indu AE Journey</h4>
                  <p className="text-talent-muted mb-6">{story.story}</p>
                  
                  <div className="bg-talent-accent/10 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-talent-accent" />
                      <span className="font-medium">Key Achievement:</span>
                    </div>
                    <p className="mt-1">{story.achievement}</p>
                  </div>
                  
                  <Button className="bg-talent-primary hover:bg-talent-secondary text-white">
                    View Full Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Statistics section */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Tutor Success by the Numbers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg text-center">
                <div className="mx-auto mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-talent-muted">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* More testimonials */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Our Tutors Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="border border-gray-200 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-talent-primary mb-2">"</div>
                    <p className="italic mb-4">{testimonial.quote}</p>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-talent-muted">{testimonial.subject} Instructor</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA section */}
        <div className="bg-talent-primary/10 p-8 rounded-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-talent-muted mb-6 max-w-2xl mx-auto">
            Join our community of educators who are making a difference in students' lives while creating thriving teaching businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
              Apply to Teach
            </Button>
            <Button size="lg" variant="outline" className="border-talent-primary text-talent-primary hover:bg-talent-primary/5">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SuccessStories;
