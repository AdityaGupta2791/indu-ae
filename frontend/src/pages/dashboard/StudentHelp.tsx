import { useState } from "react";
import StudentDashboardLayout from "@/components/StudentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  BookOpen,
  CreditCard,
  UserCog,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  {
    category: "Classes",
    icon: BookOpen,
    questions: [
      {
        q: "How do I enroll in a class?",
        a: "Browse available classes from the 'Book a Class' page. Click on the class you're interested in, review the details, and click 'Enroll Now'. The class will then appear in your 'My Classes' section.",
      },
      {
        q: "Can I cancel an enrollment?",
        a: "Yes, you can cancel an enrollment up to 24 hours before the class starts. Go to 'My Classes', find the class, and click 'Cancel Enrollment'. Refunds are processed within 3–5 business days.",
      },
      {
        q: "How do I join a live class?",
        a: "When it's time for your class, go to 'My Classes' and click 'Join Class' on the relevant session. You'll be redirected to the virtual classroom. Make sure your camera and microphone are ready.",
      },
    ],
  },
  {
    category: "Account",
    icon: UserCog,
    questions: [
      {
        q: "How do I update my profile?",
        a: "Click on your avatar in the top-right corner and select 'My Profile'. From there you can update your name, photo, and other details.",
      },
      {
        q: "How do I change my password?",
        a: "Go to Settings from your avatar dropdown. Under the 'Security' section, you can update your password.",
      },
    ],
  },
  {
    category: "Payments",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit/debit cards, UPI, and net banking. Payment details are securely processed and we do not store your card information.",
      },
      {
        q: "How do I get a refund?",
        a: "If you're eligible for a refund (e.g., class cancellation within the allowed window), it will be processed automatically. You can track refund status from your enrolled classes page.",
      },
    ],
  },
  {
    category: "Technical",
    icon: ShieldCheck,
    questions: [
      {
        q: "What browser should I use?",
        a: "We recommend using the latest version of Chrome, Firefox, Safari, or Edge for the best experience.",
      },
      {
        q: "I'm having audio/video issues in class",
        a: "Check that your browser has permission to access your microphone and camera. Try refreshing the page or switching browsers. If the issue persists, contact support.",
      },
    ],
  },
];

const StudentHelp = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const filteredFaqs = faqs.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  const handleSubmitTicket = () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both the subject and message.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Support ticket submitted",
      description: "We'll get back to you within 24 hours.",
    });
    setSubject("");
    setMessage("");
  };

  const toggleFaq = (key: string) => {
    setOpenFaq(openFaq === key ? null : key);
  };

  return (
    <StudentDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Help & Support</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Find answers or reach out to our support team
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-blue-100">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Email Us</p>
                <p className="text-xs text-muted-foreground">support@induae.com</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-100">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Call Us</p>
                <p className="text-xs text-muted-foreground">+91 1800-123-4567</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-100">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Live Chat</p>
                <p className="text-xs text-muted-foreground">Available 9 AM – 9 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* FAQs by Category */}
        {filteredFaqs.map((category) => (
          <Card key={category.category}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <category.icon className="h-4 w-4 text-blue-600" />
                {category.category}
                <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700">
                  {category.questions.length} {category.questions.length === 1 ? "question" : "questions"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.questions.map((faq) => {
                const key = `${category.category}-${faq.q}`;
                const isOpen = openFaq === key;
                return (
                  <div key={key} className="border rounded-lg">
                    <button
                      onClick={() => toggleFaq(key)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-blue-50/50 transition-colors rounded-lg"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-500 shrink-0" />
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3 text-sm text-muted-foreground border-t pt-3 ml-6">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

        {filteredFaqs.length === 0 && searchQuery && (
          <div className="text-center py-8 text-muted-foreground">
            <HelpCircle className="h-10 w-10 mx-auto mb-2 text-blue-300" />
            <p className="text-sm">No FAQs match your search. Try a different query or submit a ticket below.</p>
          </div>
        )}

        {/* Submit a Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Send className="h-4 w-4 text-blue-600" />
              Submit a Support Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Subject</label>
              <Input
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Message</label>
              <Textarea
                placeholder="Describe your issue in detail..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmitTicket} className="bg-blue-600 hover:bg-blue-700">
              Submit Ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentHelp;
