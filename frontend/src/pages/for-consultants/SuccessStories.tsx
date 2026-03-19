
import PageLayout from "@/components/PageLayout";
import { Star, Users, Calendar, DollarSign, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConsultantSuccessStories = () => {
  const featuredStories = [
    {
      name: "Rajesh Kapoor",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      subject: "Business Strategy & Management",
      joined: "2 years ago",
      clients: 180,
      sessions: 650,
      rating: 4.9,
      story: "After 20 years in corporate leadership, I transitioned to independent consulting through Indu AE. The platform made it easy to build credibility and attract clients. Within a year, I had a steady stream of startups seeking strategic guidance, and I was earning more than my corporate salary.",
      achievement: "Helped 15+ startups secure Series A funding through strategic consulting",
      quote: "Indu AE gave me the platform to share decades of experience with entrepreneurs who truly need guidance."
    },
    {
      name: "Sunita Reddy",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      subject: "Financial Planning & Investment",
      joined: "1.5 years ago",
      clients: 220,
      sessions: 780,
      rating: 4.8,
      story: "As a certified financial planner, I was limited to local clients. Indu AE opened up a nationwide market for my services. I now consult with professionals across India on investment strategies, retirement planning, and wealth management. The flexibility allows me to manage my own investments too.",
      achievement: "Built a consulting practice serving 200+ clients with a 95% satisfaction rate",
      quote: "The platform tools make it seamless to deliver high-quality financial consulting online."
    },
    {
      name: "Amit Verma",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      subject: "Technology & Digital Transformation",
      joined: "1 year ago",
      clients: 150,
      sessions: 420,
      rating: 4.9,
      story: "Coming from a CTO background at a major tech company, I wanted to help smaller businesses navigate digital transformation. Indu AE provided the perfect platform. I now consult with companies on cloud migration, AI adoption, and technology strategy, all from the comfort of my home office.",
      achievement: "Guided 30+ companies through successful digital transformation journeys",
      quote: "The consulting tools on Indu AE are perfect for delivering impactful technology guidance remotely."
    },
  ];

  const testimonials = [
    {
      quote: "The support from Indu AE has been incredible. From scheduling to payments, everything is handled seamlessly so I can focus on delivering value to my clients.",
      name: "Deepa Nair",
      subject: "HR & Organizational Development",
      image: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      quote: "What I love most about consulting on Indu AE is the quality of clients. The platform attracts serious professionals who value expert guidance and are willing to invest in it.",
      name: "Vikrant Malhotra",
      subject: "Marketing Strategy",
      image: "https://randomuser.me/api/portraits/men/55.jpg"
    },
    {
      quote: "As someone transitioning from corporate to independent consulting, Indu AE provided the perfect launchpad. I had my first paying client within two weeks of joining.",
      name: "Prerna Gupta",
      subject: "Legal Advisory",
      image: "https://randomuser.me/api/portraits/women/48.jpg"
    },
    {
      quote: "The flexibility to consult from anywhere has been life-changing. I travel frequently and can still maintain my consulting practice without missing a beat.",
      name: "Karan Joshi",
      subject: "Supply Chain & Operations",
      image: "https://randomuser.me/api/portraits/men/36.jpg"
    },
  ];

  const statistics = [
    {
      value: "₹1,00,000+",
      label: "Average Monthly Earnings",
      description: "for established consultants with regular clients",
      icon: <DollarSign className="h-10 w-10 text-talent-primary" />,
    },
    {
      value: "4.8/5",
      label: "Average Session Rating",
      description: "from thousands of client reviews",
      icon: <Star className="h-10 w-10 text-talent-primary" />,
    },
    {
      value: "30+",
      label: "Average Client Base",
      description: "active clients per month for top consultants",
      icon: <Users className="h-10 w-10 text-talent-primary" />,
    },
    {
      value: "90%",
      label: "Client Retention",
      description: "for ongoing consulting engagements",
      icon: <Award className="h-10 w-10 text-talent-primary" />,
    },
  ];

  return (
    <PageLayout
      title="Consultant Success Stories"
      description="Learn from consultants who have built thriving practices on Indu AE."
    >
      <div className="space-y-16">
        {/* Intro section */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Meet Our Thriving Consultants</h2>
          <p className="text-talent-muted text-center mb-0 max-w-3xl mx-auto">
            These experts have transformed their consulting passion into successful online practices through Indu AE. Discover their journeys, strategies, and insights.
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
                      <div className="font-semibold">{story.clients}</div>
                      <div className="text-talent-muted">Clients</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Calendar className="h-5 w-5 text-talent-primary mx-auto mb-1" />
                      <div className="font-semibold">{story.sessions}</div>
                      <div className="text-talent-muted">Sessions</div>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Consultant Success by the Numbers</h2>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Our Consultants Say</h2>
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
                    <div className="text-sm text-talent-muted">{testimonial.subject} Consultant</div>
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
            Join our community of consultants who are making a difference while building thriving consulting practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
              Apply to Consult
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

export default ConsultantSuccessStories;
