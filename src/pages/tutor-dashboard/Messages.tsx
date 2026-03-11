import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { Search, MoreHorizontal, Smile, Paperclip, Send, Circle, ArrowDown } from "lucide-react";
import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// Sample conversation data with unique profile images
const conversations = [
  {
    id: 1,
    name: "Alex Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    lastMessage: "Thanks! I'll start with the first lesso...",
    time: "10:00 AM",
    unread: true
  },
  {
    id: 2,
    name: "Meera Shah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    lastMessage: "I have a doubt, can you pls schedule...",
    time: "09:00 AM",
    unread: true
  },
  {
    id: 3,
    name: "Riya Singh",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    lastMessage: "Hi",
    time: "Sun",
    unread: false
  },
  {
    id: 4,
    name: "Aditya Mehta",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    lastMessage: "Can you pls cover the imaginary topics n...",
    time: "Sun",
    unread: false
  },
  {
    id: 5,
    name: "Vikram Patel",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
    lastMessage: "Hi Sir, just want to check if the next clas...",
    time: "Fri",
    unread: false
  },
  {
    id: 6,
    name: "Nisha Roy",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
    lastMessage: "Hi, can you help me with these ques...",
    time: "Thu",
    unread: false
  },
  {
    id: 7,
    name: "Arun Sharma",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200",
    lastMessage: "Hi Sir, I just want to know when will the...",
    time: "Thu",
    unread: false
  }
];

// Sample messages for conversations with unique profile images
const messagesData = {
  1: [
    {
      id: 1,
      sender: "Alex Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      content: "Hi! I just enrolled in your course — super excited to get started 😊",
      time: "10:00 AM",
      isStudent: true,
      date: "2025-05-15"
    },
    {
      id: 2,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
      content: "Hi Alex! Welcome to the course 👏 Glad to have you onboard.",
      time: "10:05 AM",
      isStudent: false,
      date: "2025-05-15"
    },
    {
      id: 3,
      sender: "Alex Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      content: "Thanks! I'll start with the first module today.",
      time: "10:10 AM",
      isStudent: true,
      date: "2025-05-15"
    },
    {
      id: 4,
      sender: "Alex Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      content: "Is there anything I should keep in mind?",
      time: "10:11 AM",
      isStudent: true,
      date: "2025-05-15"
    }
  ],
  2: [
    {
      id: 1,
      sender: "Meera Shah",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      content: "Hello teacher! I had a question about the homework assignment.",
      time: "09:00 AM",
      isStudent: true,
      date: "2025-05-16"
    },
    {
      id: 2,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
      content: "Hi Meera! What's your question?",
      time: "09:05 AM",
      isStudent: false,
      date: "2025-05-16"
    },
    {
      id: 3,
      sender: "Meera Shah", 
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      content: "I have a doubt, can you please schedule a quick call to explain the complex number system?",
      time: "09:10 AM",
      isStudent: true,
      date: "2025-05-16"
    }
  ],
  3: [
    {
      id: 1,
      sender: "Riya Singh",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
      content: "Hi",
      time: "01:00 PM",
      isStudent: true,
      date: "2025-05-12"
    }
  ],
  4: [
    {
      id: 1,
      sender: "Aditya Mehta",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      content: "Can you please cover the imaginary topics next class?",
      time: "03:40 PM",
      isStudent: true, 
      date: "2025-05-12"
    },
    {
      id: 2,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
      content: "Yes Aditya, I'm planning to cover imaginary numbers in our next session.",
      time: "04:20 PM",
      isStudent: false,
      date: "2025-05-12"
    }
  ],
  5: [
    {
      id: 1,
      sender: "Vikram Patel",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
      content: "Hi Sir, just want to check if the next class is still on Friday?",
      time: "11:30 AM",
      isStudent: true,
      date: "2025-05-10"
    },
    {
      id: 2,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
      content: "Yes Vikram, the class is scheduled for Friday at 4 PM as usual.",
      time: "12:15 PM",
      isStudent: false,
      date: "2025-05-10"
    }
  ],
  6: [
    {
      id: 1,
      sender: "Nisha Roy",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
      content: "Hi, can you help me with these questions from chapter 5?",
      time: "02:45 PM",
      isStudent: true,
      date: "2025-05-09"
    },
    {
      id: 2,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
      content: "Sure Nisha, please share the specific problems you're struggling with.",
      time: "03:20 PM", 
      isStudent: false,
      date: "2025-05-09"
    }
  ],
  7: [
    {
      id: 1,
      sender: "Arun Sharma",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200",
      content: "Hi Sir, I just want to know when will the exam syllabus be released?",
      time: "10:20 AM",
      isStudent: true,
      date: "2025-05-09"
    },
    {
      id: 2,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
      content: "Hi Arun, I'll be sharing the exam syllabus by the end of this week.",
      time: "11:00 AM",
      isStudent: false,
      date: "2025-05-09"
    }
  ]
};

// Your avatar image - used for your messages
const tutorAvatar = "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageInput, setMessageInput] = useState("");
  const [currentMessages, setCurrentMessages] = useState(messagesData[1]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const { toast } = useToast();

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(
    (conversation) => 
      conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
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
      avatar: tutorAvatar,
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStudent: false,
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
    
    // Mark conversation as read if it was unread
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation && conv.unread) {
        return { ...conv, unread: false };
      }
      return conv;
    });
    
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
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
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
  const formatDate = (dateStr) => {
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
    <TutorDashboardLayout>
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    // Mark as read when selected
                    conversation.unread = false;
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-purple-100 text-purple-800">
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
                    <Circle className="h-2.5 w-2.5 mt-1 fill-purple-600 stroke-none" />
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
                <AvatarFallback className="bg-purple-100 text-purple-800">
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
                  <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                    Imaginary Numbers
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
                {groupedMessages[date].map((message, index) => (
                  <div 
                    key={message.id}
                    className={`mb-6 flex ${message.isStudent ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${!message.isStudent && "flex-row-reverse"}`}>
                      {message.isStudent && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback className="bg-purple-100 text-purple-800">
                            {message.sender.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`flex flex-col ${!message.isStudent && "items-end"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">{message.time}</span>
                          <span className="text-sm font-medium">{message.sender}</span>
                        </div>
                        
                        <div className={`py-3 px-4 rounded-lg break-words ${
                          message.isStudent 
                            ? "bg-white border border-gray-200 text-gray-800"
                            : "bg-purple-600 text-white"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                      
                      {!message.isStudent && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={message.avatar || tutorAvatar} />
                          <AvatarFallback className="bg-purple-200 text-purple-800">
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
                className="fixed bottom-24 right-8 h-10 w-10 rounded-full bg-purple-600 shadow-md hover:bg-purple-700 p-0 flex items-center justify-center"
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
                  className="rounded-md bg-purple-600 hover:bg-purple-700 gap-2"
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
    </TutorDashboardLayout>
  );
};

export default Messages;
