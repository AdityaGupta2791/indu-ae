
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";

const BlogArticles = () => {
  const featuredArticle = {
    title: "10 Tips to Keep Kids Engaged in Online Learning",
    excerpt: "Discover effective strategies to maintain your child's interest and active participation in virtual classes, from creating an ideal learning environment to incorporating interactive elements.",
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    author: "Dr. Ananya Desai",
    authorRole: "Education Specialist",
    date: "May 28, 2023",
    category: "Online Learning",
    readTime: "7 min read",
  };

  const recentArticles = [
    {
      id: 1,
      title: "How Music Education Enhances Mathematics Learning",
      excerpt: "Research shows that learning music can significantly improve a child's mathematical abilities. Learn about the cognitive connections and how to leverage them.",
      image: "https://images.unsplash.com/photo-1514119412350-e174d90d280e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Priya Sharma",
      date: "May 25, 2023",
      category: "Educational Research",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Coding for Kids: When to Start and How to Progress",
      excerpt: "A comprehensive guide to introducing coding to children of different ages, with appropriate languages and platforms for each stage of development.",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Vikram Singh",
      date: "May 20, 2023",
      category: "Technology Education",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "Building Confidence Through Public Speaking Classes",
      excerpt: "How online public speaking classes can help shy children develop communication skills and self-assurance that benefit them across all areas of life.",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Rahul Kapoor",
      date: "May 18, 2023",
      category: "Skill Development",
      readTime: "6 min read",
    },
    {
      id: 4,
      title: "The Art of Effective Feedback in Online Learning",
      excerpt: "For both parents and tutors, learning how to provide constructive feedback is crucial for a child's development. This article provides practical approaches.",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Dr. Meera Patel",
      date: "May 15, 2023",
      category: "Teaching Strategies",
      readTime: "9 min read",
    },
    {
      id: 5,
      title: "Balancing Screen Time: Quality vs. Quantity",
      excerpt: "As online learning becomes more prevalent, how can parents ensure healthy screen habits while maximizing educational benefits? Expert insights and practical tips.",
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Sunita Sharma",
      date: "May 12, 2023",
      category: "Digital Wellness",
      readTime: "7 min read",
    },
    {
      id: 6,
      title: "The Rise of Microlearning: Short Sessions, Big Impact",
      excerpt: "Explore how brief, focused learning sessions can lead to better retention and engagement, especially for younger students with shorter attention spans.",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Arjun Mehta",
      date: "May 10, 2023",
      category: "Learning Trends",
      readTime: "5 min read",
    },
  ];

  const categories = [
    "Online Learning",
    "Educational Research",
    "Technology Education",
    "Skill Development",
    "Teaching Strategies",
    "Digital Wellness",
    "Learning Trends",
    "Success Stories",
    "Platform Updates",
  ];

  return (
    <PageLayout
      title="Blog & Articles"
      description="Educational insights, learning tips, and platform updates to enhance your Indu AE experience."
    >
      <div className="space-y-16">
        {/* Featured article */}
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3">
            <div className="text-talent-primary font-medium mb-2">Featured Article</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredArticle.title}</h2>
            <p className="text-talent-muted mb-4">
              {featuredArticle.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 text-talent-primary mr-1" />
                <span className="text-sm">{featuredArticle.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-talent-primary mr-1" />
                <span className="text-sm">{featuredArticle.date}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-talent-primary mr-1" />
                <span className="text-sm">{featuredArticle.category}</span>
              </div>
              <div className="text-sm text-talent-muted">
                {featuredArticle.readTime}
              </div>
            </div>
            <Button className="bg-talent-primary hover:bg-talent-secondary text-white">
              Read Full Article
            </Button>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-xl overflow-hidden">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title} 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
        
        {/* Recent articles */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Recent Articles</h2>
            <div className="flex gap-4 mt-2 md:mt-0">
              <Button variant="outline" className="border-talent-primary/30 text-talent-primary">
                Most Popular
              </Button>
              <Button variant="outline" className="border-talent-primary/30 text-talent-primary">
                Most Recent
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-talent-primary text-sm font-medium mb-2">{article.category}</div>
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-talent-muted mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-talent-muted">
                      <span>{article.date}</span>
                      <span className="mx-2">•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <Button variant="ghost" className="text-talent-primary p-0 hover:bg-transparent hover:text-talent-secondary">
                      Read more <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" className="border-talent-primary text-talent-primary hover:bg-talent-primary/5">
              View All Articles
            </Button>
          </div>
        </div>
        
        {/* Categories section */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="bg-white border-gray-200 hover:border-talent-primary hover:text-talent-primary"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Newsletter subscription */}
        <div className="bg-talent-primary/10 p-8 rounded-xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-talent-muted mb-6">
              Get the latest articles, teaching tips, and platform updates delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-talent-primary focus:border-transparent flex-grow"
              />
              <Button className="bg-talent-primary hover:bg-talent-secondary text-white">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-talent-muted mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogArticles;
