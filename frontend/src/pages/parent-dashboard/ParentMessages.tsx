
import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { Search, MoreHorizontal, Smile, Paperclip, Send, Circle } from "lucide-react";
import ParentDashboardLayout from "@/components/ParentDashboardLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const conversations = [
  { id: 1, name: "Priya Sharma", role: "Consultant" as const, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200", lastMessage: "I've found a great tutor for Aarav's math...", time: "10:30 AM", unread: true },
  { id: 2, name: "Rajesh Verma", role: "Tutor" as const, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200", lastMessage: "Aarav did really well in today's class...", time: "09:15 AM", unread: true },
  { id: 3, name: "Neha Gupta", role: "Consultant" as const, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200", lastMessage: "The demo class is scheduled for Thursday...", time: "Sun", unread: false },
  { id: 4, name: "Dr. Amit Patel", role: "Tutor" as const, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200", lastMessage: "I've shared the study material for next...", time: "Sun", unread: false },
  { id: 5, name: "Sonia Mehta", role: "Consultant" as const, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200", lastMessage: "Here are some tutor options for science...", time: "Fri", unread: false },
];

const messagesData: Record<number, Array<{ id: number; sender: string; avatar: string; content: string; time: string; isParent: boolean; date: string }>> = {
  1: [
    { id: 1, sender: "You", avatar: "", content: "Hi Priya, I'm looking for a math tutor for my son Aarav. He's in Class 8 and needs help with algebra and geometry.", time: "10:00 AM", isParent: true, date: "2025-05-15" },
    { id: 2, sender: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200", content: "Hello! Thanks for reaching out. I'd love to help find the right tutor for Aarav. Could you tell me his current level and how many classes per week you're looking for?", time: "10:10 AM", isParent: false, date: "2025-05-15" },
    { id: 3, sender: "You", avatar: "", content: "He's scoring around 70% in math right now. We'd like 3 classes per week, preferably in the evenings after 5 PM.", time: "10:15 AM", isParent: true, date: "2025-05-15" },
    { id: 4, sender: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200", content: "I've found a great tutor for Aarav's math — Mr. Rajesh Verma. He specializes in CBSE Class 8-10 mathematics and has excellent reviews. Shall I schedule a demo class?", time: "10:30 AM", isParent: false, date: "2025-05-15" },
  ],
  2: [
    { id: 1, sender: "Rajesh Verma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200", content: "Good evening! Just wanted to share an update after today's class with Aarav.", time: "08:45 AM", isParent: false, date: "2025-05-16" },
    { id: 2, sender: "You", avatar: "", content: "Yes please! How did it go?", time: "08:50 AM", isParent: true, date: "2025-05-16" },
    { id: 3, sender: "Rajesh Verma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200", content: "Aarav did really well in today's class. He solved all the algebraic equations on his own. I'm moving him to quadratic equations next week.", time: "09:00 AM", isParent: false, date: "2025-05-16" },
    { id: 4, sender: "You", avatar: "", content: "That's wonderful to hear! He's been practicing a lot at home too. Should we increase the sessions to 4 per week as the exams are approaching?", time: "09:10 AM", isParent: true, date: "2025-05-16" },
    { id: 5, sender: "Rajesh Verma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200", content: "That's a great idea. I have a slot available on Saturdays at 11 AM. I'll also share some practice worksheets for the weekend.", time: "09:15 AM", isParent: false, date: "2025-05-16" },
  ],
  3: [{ id: 1, sender: "Neha Gupta", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200", content: "The demo class is scheduled for Thursday at 4 PM. The tutor will cover basic concepts to assess Aarav's current level.", time: "02:00 PM", isParent: false, date: "2025-05-12" }],
  4: [{ id: 1, sender: "Dr. Amit Patel", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200", content: "I've shared the study material for next week's classes. Please ensure Aarav reviews chapters 5 and 6 before our session.", time: "04:30 PM", isParent: false, date: "2025-05-12" }],
  5: [{ id: 1, sender: "Sonia Mehta", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200", content: "Here are some tutor options for science that match your requirements. I've shortlisted three experienced tutors — let me know if you'd like to schedule demo classes.", time: "11:00 AM", isParent: false, date: "2025-05-10" }],
};

const parentAvatar = "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200";

const ParentMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageInput, setMessageInput] = useState("");
  const [currentMessages, setCurrentMessages] = useState(messagesData[1]);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const filteredConversations = conversations.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (messagesData[selectedConversation]) {
      setCurrentMessages(messagesData[selectedConversation]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    const newMessage = { id: currentMessages.length + 1, sender: "You", avatar: parentAvatar, content: messageInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isParent: true, date: new Date().toISOString().slice(0, 10) };
    const updatedMessages = [...currentMessages, newMessage];
    setCurrentMessages(updatedMessages);
    messagesData[selectedConversation] = updatedMessages;
    setMessageInput("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    toast({ title: "Message sent", description: "Your message was sent successfully" });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const activeConversation = conversations.find(c => c.id === selectedConversation);

  return (
    <ParentDashboardLayout>
      <div className="flex h-[calc(100vh-64px)] bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="w-[320px] border-r flex flex-col bg-gray-50">
          <div className="p-4 border-b bg-white">
            <h2 className="text-lg font-semibold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search chats..." className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filteredConversations.map((conversation) => (
              <div key={conversation.id} className={`flex items-start gap-3 p-4 hover:bg-gray-100 cursor-pointer border-b transition-colors ${selectedConversation === conversation.id ? "bg-gray-100" : ""}`} onClick={() => { setSelectedConversation(conversation.id); conversation.unread = false; }}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-800">{conversation.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-sm font-medium ${conversation.unread ? "text-gray-900" : "text-gray-700"}`}>{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <p className={`text-xs truncate ${conversation.unread ? "font-medium text-gray-800" : "text-gray-500"}`}>{conversation.lastMessage}</p>
                </div>
                {conversation.unread && <Circle className="h-2.5 w-2.5 mt-1 fill-indigo-600 stroke-none" />}
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activeConversation?.avatar || ""} />
                <AvatarFallback className="bg-indigo-100 text-indigo-800">{activeConversation ? activeConversation.name.split(" ").map(n => n[0]).join("") : ''}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-medium">{activeConversation?.name || ''}</h2>
                  {activeConversation && (
                    <Badge variant="secondary" className={activeConversation.role === "Consultant" ? "bg-teal-100 text-teal-700 hover:bg-teal-100" : "bg-purple-100 text-purple-700 hover:bg-purple-100"}>
                      {activeConversation.role}
                    </Badge>
                  )}
                </div>
                <span className="flex items-center gap-1">
                  <Circle className="h-2 w-2 fill-green-500 stroke-none" />
                  <span className="text-xs text-gray-500">Online</span>
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-5 w-5" /></Button>
          </div>

          <ScrollArea className="flex-1 p-4 bg-gray-50">
            {currentMessages.map((message) => (
              <div key={message.id} className={`mb-6 flex ${message.isParent ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start gap-3 max-w-[85%] ${message.isParent && "flex-row-reverse"}`}>
                  {!message.isParent && (
                    <Avatar className="h-8 w-8 mt-1"><AvatarImage src={message.avatar} /><AvatarFallback className="bg-indigo-100 text-indigo-800">{message.sender.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                  )}
                  <div className={`flex flex-col ${message.isParent && "items-end"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">{message.time}</span>
                      <span className="text-sm font-medium">{message.sender}</span>
                    </div>
                    <div className={`py-3 px-4 rounded-lg break-words ${message.isParent ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-800"}`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="border-t p-4 bg-white">
            <div className="flex items-end gap-2">
              <div className="flex-1 border rounded-lg px-4 py-3 bg-gray-50">
                <Textarea placeholder="Type your message..." className="border-none px-0 py-0 min-h-[40px] focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-50 resize-none" value={messageInput} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessageInput(e.target.value)} onKeyDown={handleKeyPress} />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10"><Smile className="h-5 w-5 text-gray-500" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10"><Paperclip className="h-5 w-5 text-gray-500" /></Button>
                <Button className="rounded-md bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={handleSendMessage} disabled={messageInput.trim() === ""}><Send className="h-5 w-5" /> Send</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentMessages;
