import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  Heart, 
  Share2, 
  MessageCircle,
  Check, 
  BadgeCheck,
  Award,
  MapPin,
  Video,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/hooks/use-toast";
import { LectureType, getLectureTypeInfo } from "@/types/lecture-types";
import LectureTypeBadge from "@/components/LectureTypeBadge";
import LectureTypeIcon from "@/components/LectureTypeIcon";

const classData = {
  id: "python-101",
  title: "Introduction to Python Programming",
  subtitle: "Learn the fundamentals of Python coding in a fun, engaging environment",
  description: "This interactive course introduces children ages 10-14 to the world of programming through Python. Students will learn basic programming concepts like variables, loops, and conditionals while building their own games and applications. No prior coding experience is necessary!",
  category: "technology-coding",
  subcategory: "Programming",
  level: "Beginner",
  ageRange: "10-14 years",
  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&w=800&h=500&fit=crop",
  rating: 4.9,
  reviewCount: 126,
  price: 149,
  priceInterval: "month",
  duration: "8 weeks",
  schedule: "Tuesdays and Thursdays, 4:00 PM - 5:00 PM ET",
  startDate: "June 15, 2023",
  spotsAvailable: 5,
  totalSpots: 12,
  lectureType: "live-group" as LectureType,
  location: null,
  tutor: {
    id: "michael-chen",
    name: "Michael Chen",
    title: "Computer Science Educator",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    bio: "Michael has 7+ years of experience teaching computer science to young learners. He holds a Master's in Computer Science and is passionate about making coding accessible to children.",
    rating: 4.8,
    classesCount: 48,
    studentsCount: 530,
    verified: true
  },
  learningObjectives: [
    "Understand fundamental programming concepts",
    "Write and execute Python code",
    "Build interactive games and applications",
    "Solve problems using computational thinking",
    "Develop debugging skills"
  ],
  syllabus: [
    {
      week: 1,
      title: "Getting Started with Python",
      description: "Introduction to Python, setting up the environment, writing your first program."
    },
    {
      week: 2,
      title: "Variables and Data Types",
      description: "Working with numbers, strings, and basic operations."
    },
    {
      week: 3,
      title: "Control Flow",
      description: "Conditionals, if-statements, and decision making in programs."
    },
    {
      week: 4,
      title: "Loops and Iteration",
      description: "For loops, while loops, and iterating through data."
    },
    {
      week: 5,
      title: "Functions and Modules",
      description: "Creating reusable code with functions and importing modules."
    },
    {
      week: 6,
      title: "Lists and Dictionaries",
      description: "Working with collections of data."
    },
    {
      week: 7,
      title: "Building a Simple Game",
      description: "Apply concepts to build a text-based adventure game."
    },
    {
      week: 8,
      title: "Final Project",
      description: "Create a personal project and showcase your skills."
    }
  ],
  reviews: [
    {
      id: 1,
      user: "Jennifer L.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer",
      rating: 5,
      date: "May 2, 2023",
      comment: "My son absolutely loves this class! Michael makes programming fun and engaging. He's now building his own games at home."
    },
    {
      id: 2,
      user: "David W.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      rating: 5,
      date: "April 15, 2023",
      comment: "Excellent introduction to Python. The pacing is perfect for beginners and my daughter looks forward to every class."
    },
    {
      id: 3,
      user: "Sarah M.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rating: 4,
      date: "March 28, 2023",
      comment: "Great curriculum and teaching style. My only suggestion would be to provide more practice exercises between classes."
    }
  ],
  requirements: [
    "Computer or laptop with internet connection",
    "No prior coding experience required",
    "Basic typing skills",
    "Enthusiasm for learning!"
  ],
  faqs: [
    {
      question: "Is this class suitable for complete beginners?",
      answer: "Yes, this class is designed specifically for beginners with no prior coding experience."
    },
    {
      question: "What if my child misses a class?",
      answer: "All classes are recorded and made available for 30 days, so students can catch up on any missed sessions."
    },
    {
      question: "What software will we need to install?",
      answer: "We'll provide detailed setup instructions before the class begins. We use free, beginner-friendly tools that work on both Windows and Mac."
    },
    {
      question: "Is there homework between classes?",
      answer: "Yes, students will have optional practice exercises to reinforce what they've learned. These typically take 30-45 minutes per week."
    }
  ]
};

const ClassDetails = () => {
  const { classId } = useParams();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  
  const lectureTypeInfo = getLectureTypeInfo(classData.lectureType);
  const isOffline = classData.lectureType.startsWith("offline");
  const isRecorded = classData.lectureType === "online-recorded-group" || 
                    classData.lectureType === "online-recorded-one-on-one" || 
                    classData.lectureType === "recorded-on-demand";
  
  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved classes" : "Added to saved classes",
      description: isSaved 
        ? "The class has been removed from your saved list."
        : "The class has been added to your saved list.",
    });
  };
  
  const shareClass = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this class with others.",
    });
  };

  return (
    <PageLayout
      title={classData.title}
      description={classData.subtitle}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={classData.image} 
              alt={classData.title} 
              className="w-full aspect-video object-cover"
            />
            <div className="absolute top-4 left-4">
              <LectureTypeBadge type={classData.lectureType} size="md" />
            </div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button onClick={toggleSave} size="icon" variant="secondary" className="rounded-full">
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                <span className="sr-only">{isSaved ? "Unsave" : "Save"} this class</span>
              </Button>
              <Button onClick={shareClass} size="icon" variant="secondary" className="rounded-full">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share this class</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="syllabus" className="flex-1">Syllabus</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              <TabsTrigger value="faqs" className="flex-1">FAQs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">About This Class</h3>
                <p className="text-muted-foreground">{classData.description}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Class Format</h3>
                <div className="bg-muted p-4 rounded-lg flex items-start space-x-4 mb-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                    <LectureTypeIcon type={classData.lectureType} size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">{lectureTypeInfo.name}</h4>
                    <p className="text-sm text-muted-foreground">{lectureTypeInfo.description}</p>
                    
                    {isOffline && classData.location && (
                      <div className="mt-2 flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{lectureTypeInfo.travelType === "in-call" ? "Tutor travels to your location" : "At tutor's location: " + classData.location}</span>
                      </div>
                    )}
                    
                    {!isRecorded && (
                      <div className="mt-2 flex items-center text-sm">
                        <Video className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Live interactive sessions with the tutor</span>
                      </div>
                    )}
                    
                    {isRecorded && (
                      <div className="mt-2 flex items-center text-sm">
                        <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Watch anytime, unlimited access</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">What You'll Learn</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {classData.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {classData.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="syllabus" className="space-y-4">
              <h3 className="text-xl font-bold mb-3">Class Curriculum</h3>
              <div className="space-y-4">
                {classData.syllabus.map((week) => (
                  <Card key={week.week}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold">Week {week.week}: {week.title}</h4>
                        <Badge variant="outline">1 hour</Badge>
                      </div>
                      <p className="text-muted-foreground">{week.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="h-6 w-6 fill-primary text-primary" />
                <span className="text-2xl font-bold">{classData.rating}</span>
                <span className="text-muted-foreground">({classData.reviewCount} reviews)</span>
              </div>
              
              <div className="space-y-4">
                {classData.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.avatar} alt={review.user} />
                          <AvatarFallback>{review.user[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.user}</div>
                          <div className="text-xs text-muted-foreground">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="faqs" className="space-y-4">
              <h3 className="text-xl font-bold mb-3">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {classData.faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h4 className="font-bold mb-2">{faq.question}</h4>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">${classData.price}</span>
                  <span className="text-muted-foreground">per {classData.priceInterval}</span>
                </div>
                
                <div className="space-y-2">
                  {!isRecorded && (
                    <>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Starts {classData.startDate}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{classData.schedule}</span>
                      </div>
                    </>
                  )}
                  
                  {isRecorded && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Watch anytime, unlimited access</span>
                    </div>
                  )}
                  
                  {classData.lectureType === "online-live-group" || classData.lectureType === "live-group" ? (
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{classData.spotsAvailable} spots left (of {classData.totalSpots})</span>
                    </div>
                  ) : null}
                  
                  {isOffline && classData.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{classData.location}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{classData.category.replace('-', ' ')}</Badge>
                  <Badge variant="outline">{classData.level}</Badge>
                  <Badge variant="outline">{classData.ageRange}</Badge>
                </div>
                
                <div className="pt-2">
                  <Button asChild className="w-full mb-2">
                    <Link to={`/classes/${classId}/book`}>Book This Class</Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message the Tutor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={classData.tutor.image} alt={classData.tutor.name} />
                  <AvatarFallback>{classData.tutor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-bold">{classData.tutor.name}</h3>
                    {classData.tutor.verified && (
                      <BadgeCheck className="h-4 w-4 text-primary ml-1" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{classData.tutor.title}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                <div className="p-2 rounded-md bg-muted">
                  <div className="font-bold">{classData.tutor.rating}</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                <div className="p-2 rounded-md bg-muted">
                  <div className="font-bold">{classData.tutor.classesCount}</div>
                  <div className="text-xs text-muted-foreground">Classes</div>
                </div>
                <div className="p-2 rounded-md bg-muted">
                  <div className="font-bold">{classData.tutor.studentsCount}</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </div>
              
              <p className="text-sm mb-4">{classData.tutor.bio}</p>
              
              <Button variant="outline" className="w-full">
                View Full Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClassDetails;
