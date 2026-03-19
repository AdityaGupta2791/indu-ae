import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { Search, MoreHorizontal, Smile, Paperclip, Send, Circle, ArrowDown } from "lucide-react";
import StudentDashboardLayout from "@/components/StudentDashboardLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// Sample conversation data — student's tutors
const conversations = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    subject: "Mathematics",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
    lastMessage: "Great job on the last assignment! Keep...",
    time: "10:30 AM",
    unread: true
  },
  {
    id: 2,
    name: "Rajesh Verma",
    subject: "Science",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
    lastMessage: "Don't forget to review chapter 5 before...",
    time: "09:15 AM",
    unread: true
  },
  {
    id: 3,
    name: "Neha Gupta",
    subject: "English",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    lastMessage: "Your essay was well structured...",
    time: "Sun",
    unread: false
  },
  {
    id: 4,
    name: "Amit Patel",
    subject: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    lastMessage: "The coding exercise is due next Monday...",
    time: "Sat",
    unread: false
  },
  {
    id: 5,
    name: "Sonia Mehta",
    subject: "Hindi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
    lastMessage: "Practice the grammar exercises I shared...",
    time: "Fri",
    unread: false
  }
];

// Sample messages for conversations with realistic student-tutor exchanges
const messagesData: Record<number, Array<{
  id: number;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  isStudent: boolean;
  date: string;
}>> = {
  1: [
    {
      id: 1,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      content: "Ma'am, I had a doubt in the quadratic equations homework — question 7 specifically.",
      time: "09:45 AM",
      isStudent: true,
      date: "2026-03-11"
    },
    {
      id: 2,
      sender: "Dr. Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
      content: "Sure! Question 7 requires you to use the discriminant method first. Remember, b² - 4ac tells you the nature of roots. Try applying it and share your working.",
      time: "10:00 AM",
      isStudent: false,
      date: "2026-03-11"
    },
    {
      id: 3,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      content: "Oh I see! I was trying to factorise directly. Let me try the discriminant approach. Thank you!",
      time: "10:10 AM",
      isStudent: true,
      date: "2026-03-11"
    },
    {
      id: 4,
      sender: "Dr. Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
      content: "Great job on the last assignment! Keep up the good work 👏 Your understanding of quadratics is improving nicely.",
      time: "10:30 AM",
      isStudent: false,
      date: "2026-03-12"
    }
  ],
  2: [
    {
      id: 1,
      sender: "Rajesh Verma",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
      content: "Hi everyone! Just a reminder — we'll be covering the periodic table in detail next class. Please read through the first 20 elements.",
      time: "08:00 AM",
      isStudent: false,
      date: "2026-03-11"
    },
    {
      id: 2,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      content: "Sir, should we also revise the atomic structure concepts from chapter 4?",
      time: "08:30 AM",
      isStudent: true,
      date: "2026-03-11"
    },
    {
      id: 3,
      sender: "Rajesh Verma",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
      content: "Yes, that would be very helpful. Atomic structure ties directly into understanding electron configurations in the periodic table.",
      time: "08:45 AM",
      isStudent: false,
      date: "2026-03-11"
    },
    {
      id: 4,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      content: "Got it, sir. I'll go through both chapters before the class.",
      time: "09:00 AM",
      isStudent: true,
      date: "2026-03-11"
    },
    {
      id: 5,
      sender: "Rajesh Verma",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
      content: "Don't forget to review chapter 5 before our test on Thursday. Focus especially on chemical bonding.",
      time: "09:15 AM",
      isStudent: false,
      date: "2026-03-12"
    }
  ],
  3: [
    {
      id: 1,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      content: "Ma'am, I've submitted my essay on Shakespeare's Macbeth. Could you review it when you get a chance?",
      time: "02:00 PM",
      isStudent: true,
      date: "2026-03-09"
    },
    {
      id: 2,
      sender: "Neha Gupta",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      content: "Your essay was well structured and had a clear thesis. I've left a few comments on paragraph 3 — just polish the conclusion a bit.",
      time: "04:30 PM",
      isStudent: false,
      date: "2026-03-09"
    }
  ],
  4: [
    {
      id: 1,
      sender: "Amit Patel",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      content: "The coding exercise is due next Monday. Make sure to test your program with edge cases before submitting.",
      time: "11:00 AM",
      isStudent: false,
      date: "2026-03-08"
    },
    {
      id: 2,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      content: "Sir, should we use recursion or iteration for the sorting problem?",
      time: "11:30 AM",
      isStudent: true,
      date: "2026-03-08"
    },
    {
      id: 3,
      sender: "Amit Patel",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      content: "Try both approaches and compare their time complexity. That'll be great practice for the upcoming exam!",
      time: "12:00 PM",
      isStudent: false,
      date: "2026-03-08"
    }
  ],
  5: [
    {
      id: 1,
      sender: "Sonia Mehta",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
      content: "Practice the grammar exercises I shared on sandhi and samas. We'll discuss them in our next session.",
      time: "03:00 PM",
      isStudent: false,
      date: "2026-03-07"
    },
    {
      id: 2,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      content: "Sure ma'am, I'll complete them by tomorrow.",
      time: "03:30 PM",
      isStudent: true,
      date: "2026-03-07"
    }
  ]
};

// Your avatar image — used for student's own messages
const studentAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200";

const StudentMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageInput, setMessageInput] = useState("");
  const [currentMessages, setCurrentMessages] = useState(messagesData[1]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load conversation messages when selected conversation changes
  useEffect(() => {
    if (messagesData[selectedConversation]) {
      setCurrentMessages(messagesData[selectedConversation]);
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedConversation]);

  // Detect scroll position for showing/hiding scroll button
  useEffect(() => {
    const handleScroll = () => {
      const container = messageContainerRef.current;
      if (!container) return;

      const isScrollable = container.scrollHeight > container.clientHeight;
      const isScrolledUp = container.scrollTop < (container.scrollHeight - container.clientHeight - 200);

      setShowScrollButton(isScrollable && isScrolledUp);
    };

    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentMessages]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessage = {
      id: currentMessages.length + 1,
      sender: "You",
      avatar: studentAvatar,
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStudent: true,
      date: new Date().toISOString().slice(0, 10)
    };

    // Update the current conversation messages
    const updatedMessages = [...currentMessages, newMessage];
    setCurrentMessages(updatedMessages);

    // Update the message data store
    messagesData[selectedConversation] = updatedMessages;

    // Clear input
    setMessageInput("");

    // Scroll to bottom
    setTimeout(scrollToBottom, 100);

    // Show toast notification
    toast({
      title: "Message sent",
      description: "Your message was sent successfully",
    });
  };

  // Handle key press for sending messages
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: typeof currentMessages) => {
    const groups: Record<string, typeof currentMessages> = {};

    messages.forEach(message => {
      if (!groups[message.date]) {
        groups[message.date] = [];
      }
      groups[message.date].push(message);
    });

    return groups;
  };

  const groupedMessages = groupMessagesByDate(currentMessages);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().slice(0, 10)) {
      return "Today";
    } else if (dateStr === yesterday.toISOString().slice(0, 10)) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  // Get active conversation info
  const activeConversation = conversations.find(c => c.id === selectedConversation);

  return (
    <StudentDashboardLayout>
      <div className="flex h-[calc(100vh-64px)] bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Left sidebar with conversations */}
        <div className="w-[320px] border-r flex flex-col bg-gray-50">
          <div className="p-4 border-b bg-white">
            <h2 className="text-lg font-semibold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search chats..."
                className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation list */}
          <ScrollArea className="flex-1">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-start gap-3 p-4 hover:bg-gray-100 cursor-pointer border-b transition-colors ${
                    selectedConversation === conversation.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    conversation.unread = false;
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {conversation.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`text-sm font-medium ${conversation.unread ? "text-gray-900" : "text-gray-700"}`}>{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    <p className={`text-xs truncate ${conversation.unread ? "font-medium text-gray-800" : "text-gray-500"}`}>{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread && (
                    <Circle className="h-2.5 w-2.5 mt-1 fill-blue-600 stroke-none" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No conversations found</div>
            )}
          </ScrollArea>
        </div>

        {/* Right conversation area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Conversation header */}
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activeConversation?.avatar || ""} />
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {activeConversation ? activeConversation.name.split(" ").map(n => n[0]).join("") : ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-base font-medium">{activeConversation ? activeConversation.name : ''}</h2>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Circle className="h-2 w-2 fill-green-500 stroke-none" />
                    <span className="text-xs text-gray-500">Online</span>
                  </span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    {activeConversation ? activeConversation.subject : ''}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Message area */}
          <ScrollArea className="flex-1 p-4 bg-gray-50" ref={messageContainerRef}>
            {Object.keys(groupedMessages).map(date => (
              <div key={date}>
                {/* Date divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-50 px-4 text-xs text-gray-500">{formatDate(date)}</span>
                  </div>
                </div>

                {/* Messages for this date */}
                {groupedMessages[date].map((message) => (
                  <div
                    key={message.id}
                    className={`mb-6 flex ${message.isStudent ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${message.isStudent && "flex-row-reverse"}`}>
                      {!message.isStudent && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            {message.sender.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`flex flex-col ${message.isStudent && "items-end"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">{message.time}</span>
                          <span className="text-sm font-medium">{message.sender}</span>
                        </div>

                        <div className={`py-3 px-4 rounded-lg break-words ${
                          message.isStudent
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 text-gray-800"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>

                      {message.isStudent && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={message.avatar || studentAvatar} />
                          <AvatarFallback className="bg-blue-200 text-blue-800">
                            You
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />

            {/* Scroll to bottom button */}
            {showScrollButton && (
              <Button
                onClick={scrollToBottom}
                className="fixed bottom-24 right-8 h-10 w-10 rounded-full bg-blue-600 shadow-md hover:bg-blue-700 p-0 flex items-center justify-center"
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
            )}
          </ScrollArea>

          {/* Message input */}
          <div className="border-t p-4 bg-white">
            <div className="flex items-end gap-2">
              <div className="flex-1 border rounded-lg px-4 py-3 bg-gray-50">
                <Textarea
                  placeholder="Type your message..."
                  className="border-none px-0 py-0 min-h-[40px] focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-50 resize-none"
                  value={messageInput}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                  <Smile className="h-5 w-5 text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                  <Paperclip className="h-5 w-5 text-gray-500" />
                </Button>
                <Button
                  className="rounded-md bg-blue-600 hover:bg-blue-700 gap-2"
                  onClick={handleSendMessage}
                  disabled={messageInput.trim() === ""}
                >
                  <Send className="h-5 w-5" /> Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentMessages;
