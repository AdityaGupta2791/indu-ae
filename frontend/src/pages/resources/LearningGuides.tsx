
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Filter, ArrowRight, Search } from "lucide-react";
import { useState } from "react";

const LearningGuides = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const featuredGuide = {
    title: "Building Mathematical Confidence: A Parent's Guide",
    description: "Help your child develop a positive relationship with mathematics through fun activities, supportive strategies, and practical tips for overcoming math anxiety.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Mathematics",
    level: "All Levels",
    pages: 28,
  };
  
  const guides = [
    {
      id: 1,
      title: "The Complete Guide to Online Music Education",
      description: "Everything parents need to know about supporting their child's musical development through online classes, including instrument selection, practice techniques, and milestones.",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Music",
      level: "Beginner",
      pages: 32,
    },
    {
      id: 2,
      title: "Coding Concepts Explained for Parents",
      description: "A non-technical explanation of programming concepts to help parents understand what their children are learning and how to support their coding journey.",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Technology",
      level: "All Levels",
      pages: 24,
    },
    {
      id: 3,
      title: "Creative Writing: Nurturing Young Authors",
      description: "Strategies for encouraging creative expression through writing, with age-appropriate activities, prompts, and techniques to develop storytelling skills.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Language Arts",
      level: "Intermediate",
      pages: 36,
    },
    {
      id: 4,
      title: "Visual Arts: A Developmental Approach",
      description: "Understanding artistic development stages in children and how to provide appropriate support, materials, and encouragement at each level.",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Art",
      level: "All Levels",
      pages: 30,
    },
    {
      id: 5,
      title: "Science Experiments for Home Learning",
      description: "Safe, engaging science activities using common household items, organized by age group and scientific concept, with clear explanations.",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Science",
      level: "Beginner",
      pages: 42,
    },
    {
      id: 6,
      title: "Foreign Language Learning Strategies",
      description: "Effective approaches for supporting language acquisition at different ages, with tips for practice, immersion, and maintaining motivation.",
      image: "https://images.unsplash.com/photo-1518057111178-44a106bad636?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Languages",
      level: "Intermediate",
      pages: 26,
    },
  ];
  
  const categories = [
    "Mathematics", "Science", "Language Arts", "Music", "Art", "Technology", 
    "Languages", "Physical Education", "Social Studies", "Life Skills"
  ];
  
  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  return (
    <PageLayout
      title="Learning Guides"
      description="Subject-specific resources and guides to support your child's online learning journey."
    >
      <div className="space-y-16">
        {/* Search and filter section */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search learning guides by subject or keyword..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-talent-primary focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" className="bg-white">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="bg-white">All Subjects</Button>
              <Button variant="outline" className="bg-white">All Levels</Button>
              <Button variant="outline" className="bg-white">Most Popular</Button>
              <Button variant="outline" className="bg-white">Recently Added</Button>
            </div>
          </div>
        </div>
        
        {/* Featured guide */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Featured Learning Guide</h2>
          <div className="grid md:grid-cols-5 gap-8 items-center bg-talent-primary/5 p-8 rounded-xl">
            <div className="md:col-span-2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={featuredGuide.image} 
                  alt={featuredGuide.title} 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-talent-primary/10 text-talent-primary text-sm font-medium rounded-full">
                  {featuredGuide.category}
                </span>
                <span className="px-3 py-1 bg-talent-gray-200 text-talent-dark text-sm font-medium rounded-full">
                  {featuredGuide.level}
                </span>
                <span className="px-3 py-1 bg-talent-gray-200 text-talent-dark text-sm font-medium rounded-full">
                  {featuredGuide.pages} pages
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{featuredGuide.title}</h3>
              <p className="text-talent-muted mb-6">
                {featuredGuide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-talent-primary hover:bg-talent-secondary text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download Guide (PDF)
                </Button>
                <Button variant="outline" className="border-talent-primary text-talent-primary hover:bg-talent-primary/5">
                  Preview Guide
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* All guides */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">All Learning Guides</h2>
            <div className="text-talent-muted">Showing 6 of 24 guides</div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <div key={guide.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={guide.image} 
                    alt={guide.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-talent-primary/10 text-talent-primary text-xs font-medium rounded-full">
                      {guide.category}
                    </span>
                    <span className="px-3 py-1 bg-talent-gray-200 text-talent-dark text-xs font-medium rounded-full">
                      {guide.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
                  <p className="text-talent-muted mb-4 text-sm line-clamp-3">{guide.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-talent-muted">
                      {guide.pages} pages
                    </div>
                    <Button variant="ghost" className="text-talent-primary p-0 hover:bg-transparent hover:text-talent-secondary">
                      Download <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button size="lg" variant="outline" className="border-talent-primary text-talent-primary hover:bg-talent-primary/5">
              Load More Guides
            </Button>
          </div>
        </div>
        
        {/* Browse by category */}
        <div className="bg-talent-gray-100 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Browse by Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <a 
                key={index} 
                href="#" 
                className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <BookOpen className="h-8 w-8 text-talent-primary mb-2" />
                <span className="font-medium">{category}</span>
              </a>
            ))}
          </div>
        </div>
        
        {/* Browse by level */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Browse by Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {levels.map((level, index) => (
              <a 
                key={index} 
                href="#" 
                className="border border-gray-200 p-4 rounded-lg text-center hover:border-talent-primary hover:text-talent-primary transition-colors"
              >
                <span className="font-medium">{level}</span>
              </a>
            ))}
          </div>
        </div>
        
        {/* Request guide */}
        <div className="bg-talent-primary/10 p-8 rounded-xl text-center">
          <BookOpen className="h-12 w-12 text-talent-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-talent-muted mb-6 max-w-2xl mx-auto">
            If you need resources on a specific subject or topic that isn't covered in our current guides, let us know! We regularly create new guides based on parent and tutor requests.
          </p>
          <Button size="lg" className="bg-talent-primary hover:bg-talent-secondary text-white">
            Request a Learning Guide
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default LearningGuides;
