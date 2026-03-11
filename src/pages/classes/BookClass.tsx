import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar, Clock, CreditCard, User, Mail, Users, Info, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { LectureType, getLectureTypeInfo } from "@/types/lecture-types";
import LectureTypeBadge from "@/components/LectureTypeBadge";

// Mock data - would be fetched from backend in real app
const classData = {
  id: "python-101",
  title: "Introduction to Python Programming",
  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&w=800&h=500&fit=crop",
  schedule: "Tuesdays and Thursdays, 4:00 PM - 5:00 PM ET",
  startDate: "June 15, 2023",
  tutor: "Michael Chen",
  price: 149,
  priceInterval: "month",
  duration: "8 weeks",
  totalPrice: 149,
  lectureType: "live-group" as LectureType
};

// Create different schemas based on lecture type
const baseBookingSchema = z.object({
  studentName: z.string().min(2, "Student name must be at least 2 characters"),
  studentAge: z
    .string()
    .refine((val) => !isNaN(parseInt(val)), {
      message: "Age must be a number",
    })
    .refine((val) => parseInt(val) >= 7 && parseInt(val) <= 18, {
      message: "Age must be between 7 and 18",
    }),
  parentEmail: z.string().email("Please enter a valid email address"),
  paymentMethod: z.enum(["credit", "paypal", "apple"], {
    required_error: "Please select a payment method",
  }),
});

const onlineSchema = baseBookingSchema;

const offlineSchema = baseBookingSchema.extend({
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "Please enter a valid city"),
  state: z.string().min(2, "Please enter a valid state"),
  zip: z.string().min(5, "Please enter a valid zip code"),
  specialInstructions: z.string().optional(),
});

type OnlineBookingFormValues = z.infer<typeof onlineSchema>;
type OfflineBookingFormValues = z.infer<typeof offlineSchema>;

const BookClass = () => {
  const { classId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // In a real app, we would fetch the class data based on the classId
  const lectureTypeInfo = getLectureTypeInfo(classData.lectureType);
  const isOffline = classData.lectureType.startsWith("offline");
  const isRecorded = classData.lectureType === "online-recorded-group" || 
                    classData.lectureType === "online-recorded-one-on-one" || 
                    classData.lectureType === "recorded-on-demand";
  const isTutorTravels = classData.lectureType === "offline-inbound-one-on-one" ||
                        classData.lectureType === "offline-tutor-travels";
  
  const onlineForm = useForm<OnlineBookingFormValues>({
    resolver: zodResolver(onlineSchema),
    defaultValues: {
      studentName: user?.role === "student" ? user.fullName : "",
      studentAge: "",
      parentEmail: user?.email || "",
      paymentMethod: "credit",
    },
  });

  const offlineForm = useForm<OfflineBookingFormValues>({
    resolver: zodResolver(offlineSchema),
    defaultValues: {
      studentName: user?.role === "student" ? user.fullName : "",
      studentAge: "",
      parentEmail: user?.email || "",
      paymentMethod: "credit",
      address: "",
      city: "",
      state: "",
      zip: "",
      specialInstructions: "",
    },
  });

  const form = isOffline ? offlineForm : onlineForm;

  const onSubmit = (data: OnlineBookingFormValues | OfflineBookingFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Booking successful!",
        description: "You have successfully enrolled in this class.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard/enrolled-classes");
    }, 1500);
  };

  return (
    <PageLayout
      title="Complete Your Booking"
      description="You're just a few steps away from joining this class"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Class Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={classData.image} 
                    alt={classData.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{classData.title}</h3>
                  <p className="text-sm text-muted-foreground">with {classData.tutor}</p>
                  <div className="mt-2">
                    <LectureTypeBadge type={classData.lectureType} size="sm" />
                  </div>
                  {!isRecorded && (
                    <div className="flex items-center mt-2 text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{classData.startDate}</span>
                    </div>
                  )}
                  {!isRecorded && (
                    <div className="flex items-center mt-1 text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{classData.schedule}</span>
                    </div>
                  )}
                  {isRecorded && (
                    <div className="flex items-center mt-1 text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>Watch anytime, unlimited access</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Class Price</span>
                  <span>${classData.price} / {classData.priceInterval}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration</span>
                  <span>{classData.duration}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${classData.totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Important Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <p>
                  By enrolling in this class, you agree to our Terms of Service and Class Policies.
                </p>
              </div>
              <div className="flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <p>
                  A confirmation email will be sent to you with class details and access instructions.
                </p>
              </div>
              <div className="flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <p>
                  {isRecorded 
                    ? "You'll have immediate access to all recorded content after purchase." 
                    : "Classes can be cancelled up to 24 hours before the start time for a full refund."}
                </p>
              </div>
              {isOffline && (
                <div className="flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <p>
                    {isTutorTravels 
                      ? "The tutor will travel to your specified address for this class." 
                      : "You'll need to travel to the tutor's location for this class."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>
              Please provide the student's details for enrollment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student's Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Enter student's name" 
                            {...field} 
                            className="pl-10"
                          />
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student's Age</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Enter age (7-18)" 
                            {...field} 
                            type="number"
                            min={7}
                            max={18}
                            className="pl-10"
                          />
                          <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        This helps the tutor prepare age-appropriate content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Enter parent's email" 
                            {...field} 
                            className="pl-10"
                          />
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Class confirmations and updates will be sent here
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {isOffline && (
                  <>
                    <Separator />
                    <h3 className="text-lg font-medium mb-3">{isTutorTravels ? "Your Location" : "Travel Details"}</h3>
                    
                    <FormField
                      control={form.control as any}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Enter street address" 
                                {...field} 
                                className="pl-10"
                              />
                              <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control as any}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter city" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control as any}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter state" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control as any}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter ZIP code" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control as any}
                      name="specialInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any special instructions or directions" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Provide any additional information that might be helpful
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <RadioGroupItem value="credit" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer flex items-center">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Credit/Debit Card
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                PayPal
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <RadioGroupItem value="apple" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Apple Pay
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Complete Booking • $" + classData.totalPrice}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BookClass;
