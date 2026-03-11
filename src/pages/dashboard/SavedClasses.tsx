
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowUpDown, Heart, Users, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

const mockSavedClasses = [
  {
    id: "science-experiments",
    title: "Science Experiments at Home",
    tutor: "Dr. Robert Miller",
    description: "Exciting experiments using everyday materials that teach fundamental science concepts.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&w=600&h=400&fit=crop",
    startDate: "June 20, 2023",
    students: 32,
    rating: 4.8,
    reviewCount: 56,
    category: "Science",
    price: 129
  },
  {
    id: "coding-games",
    title: "Coding Games for Kids",
    tutor: "Jennifer Zhang",
    description: "Learn to code by creating fun, interactive games that you can share with friends and family.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&w=600&h=400&fit=crop",
    startDate: "July 5, 2023",
    students: 24,
    rating: 4.9,
    reviewCount: 42,
    category: "Coding",
    price: 149
  },
  {
    id: "digital-photography",
    title: "Digital Photography for Teens",
    tutor: "Carlos Rodriguez",
    description: "Master the basics of digital photography, composition, and editing to take stunning photos.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&w=600&h=400&fit=crop",
    startDate: "June 25, 2023",
    students: 18,
    rating: 4.7,
    reviewCount: 35,
    category: "Arts & Creativity",
    price: 139
  },
  {
    id: "debate-club",
    title: "Debate Club: Public Speaking",
    tutor: "Emily Washington",
    description: "Develop critical thinking and persuasive speaking skills in this interactive debate course.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&w=600&h=400&fit=crop",
    startDate: "July 12, 2023",
    students: 16,
    rating: 4.8,
    reviewCount: 28,
    category: "Life Skills",
    price: 119
  },
  {
    id: "math-challenge",
    title: "Math Problem Solving Challenge",
    tutor: "Michael Chen",
    description: "Tackle complex math problems and develop strong analytical thinking skills.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&w=600&h=400&fit=crop",
    startDate: "July 3, 2023",
    students: 28,
    rating: 4.9,
    reviewCount: 47,
    category: "Mathematics",
    price: 139
  },
  {
    id: "young-entrepreneurs",
    title: "Young Entrepreneurs Workshop",
    tutor: "David Johnson",
    description: "Learn business basics and develop your own mini-business concept from idea to presentation.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&w=600&h=400&fit=crop",
    startDate: "August 2, 2023",
    students: 14,
    rating: 4.7,
    reviewCount: 22,
    category: "Life Skills",
    price: 149
  },
  {
    id: "creative-writing",
    title: "Creative Writing Workshop",
    tutor: "Sarah Peterson",
    description: "Develop your storytelling skills and learn to write compelling fiction for young adults.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&w=600&h=400&fit=crop",
    startDate: "July 8, 2023",
    students: 22,
    rating: 4.8,
    reviewCount: 38,
    category: "Language Arts",
    price: 129
  }
];

const SavedClasses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedClasses, setSavedClasses] = useState(mockSavedClasses);
  const { toast } = useToast();
  
  const filteredClasses = savedClasses.filter(
    (cls) => 
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cls.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const removeFromSaved = (classId: string) => {
    setSavedClasses(savedClasses.filter(cls => cls.id !== classId));
    toast({
      title: "Removed from saved classes",
      description: "The class has been removed from your saved list.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Saved Classes</h1>
            <p className="text-muted-foreground">
              Classes you've saved for later
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search saved classes..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline" size="icon">
              <ArrowUpDown className="h-4 w-4" />
              <span className="sr-only">Sort</span>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3">
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No saved classes found.</p>
                  <Button asChild className="mt-4">
                    <Link to="/explore/academic-subjects">Explore Classes</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredClasses.map((cls) => (
              <Card key={cls.id} className="overflow-hidden">
                <div className="relative">
                  <div className="aspect-video w-full">
                    <img 
                      src={cls.image} 
                      alt={cls.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute top-2 right-2 rounded-full"
                    onClick={() => removeFromSaved(cls.id)}
                  >
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                    <span className="sr-only">Remove from saved</span>
                  </Button>
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <Badge variant="outline">{cls.category}</Badge>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                      <span>{cls.rating}</span>
                      <span className="text-muted-foreground ml-1">({cls.reviewCount})</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{cls.title}</CardTitle>
                  <CardDescription>{cls.tutor}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cls.description}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Starts {cls.startDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{cls.students} students</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="font-bold">${cls.price}</div>
                    <Button size="sm" asChild>
                      <Link to={`/classes/${cls.id}`}>
                        View Class
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SavedClasses;
