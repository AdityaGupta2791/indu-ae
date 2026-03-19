
import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { Search, MoreHorizontal, Smile, Paperclip, Send, Circle, ArrowDown } from "lucide-react";
import ConsultantDashboardLayout from "@/components/ConsultantDashboardLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const conversations = [
  { id: 1, name: "Arun Enterprises", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200", lastMessage: "Thanks for the strategy document...", time: "10:00 AM", unread: true },
  { id: 2, name: "Meera Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200", lastMessage: "Can we schedule a follow-up session...", time: "09:00 AM", unread: true },
  { id: 3, name: "TechStart Solutions", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200", lastMessage: "The roadmap looks great!", time: "Sun", unread: false },
  { id: 4, name: "Ravi Kumar", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200", lastMessage: "I've implemented your suggestions...", time: "Sun", unread: false },
  { id: 5, name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200", lastMessage: "When is our next session?", time: "Fri", unread: false },
];

const messagesData: Record<number, Array<{ id: number; sender: string; avatar: string; content: string; time: string; isClient: boolean; date: string }>> = {
  1: [
    { id: 1, sender: "Arun Enterprises", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200", content: "Hi! We've reviewed the business strategy document you shared.", time: "10:00 AM", isClient: true, date: "2025-05-15" },
    { id: 2, sender: "You", avatar: "", content: "Great! Do you have any questions or areas you'd like to discuss further?", time: "10:05 AM", isClient: false, date: "2025-05-15" },
    { id: 3, sender: "Arun Enterprises", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200", content: "Thanks for the strategy document. We'd like to schedule a deep dive on the market analysis section.", time: "10:10 AM", isClient: true, date: "2025-05-15" },
  ],
  2: [
    { id: 1, sender: "Meera Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200", content: "Hello! I wanted to discuss my investment portfolio.", time: "09:00 AM", isClient: true, date: "2025-05-16" },
    { id: 2, sender: "You", avatar: "", content: "Hi Meera! Sure, what specific aspects would you like to review?", time: "09:05 AM", isClient: false, date: "2025-05-16" },
    { id: 3, sender: "Meera Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200", content: "Can we schedule a follow-up session to go over the retirement planning options?", time: "09:10 AM", isClient: true, date: "2025-05-16" },
  ],
  3: [{ id: 1, sender: "TechStart Solutions", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200", content: "The roadmap looks great!", time: "01:00 PM", isClient: true, date: "2025-05-12" }],
  4: [{ id: 1, sender: "Ravi Kumar", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200", content: "I've implemented your suggestions and seeing great results!", time: "03:40 PM", isClient: true, date: "2025-05-12" }],
  5: [{ id: 1, sender: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200", content: "When is our next session?", time: "11:30 AM", isClient: true, date: "2025-05-10" }],
};

const consultantAvatar = "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200";

const ConsultantMessages = () => {
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
    const newMessage = { id: currentMessages.length + 1, sender: "You", avatar: consultantAvatar, content: messageInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isClient: false, date: new Date().toISOString().slice(0, 10) };
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
    <ConsultantDashboardLayout>
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
                  <AvatarFallback className="bg-teal-100 text-teal-800">{conversation.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-sm font-medium ${conversation.unread ? "text-gray-900" : "text-gray-700"}`}>{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <p className={`text-xs truncate ${conversation.unread ? "font-medium text-gray-800" : "text-gray-500"}`}>{conversation.lastMessage}</p>
                </div>
                {conversation.unread && <Circle className="h-2.5 w-2.5 mt-1 fill-teal-600 stroke-none" />}
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activeConversation?.avatar || ""} />
                <AvatarFallback className="bg-teal-100 text-teal-800">{activeConversation ? activeConversation.name.split(" ").map(n => n[0]).join("") : ''}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-base font-medium">{activeConversation?.name || ''}</h2>
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
              <div key={message.id} className={`mb-6 flex ${message.isClient ? "justify-start" : "justify-end"}`}>
                <div className={`flex items-start gap-3 max-w-[85%] ${!message.isClient && "flex-row-reverse"}`}>
                  {message.isClient && (
                    <Avatar className="h-8 w-8 mt-1"><AvatarImage src={message.avatar} /><AvatarFallback className="bg-teal-100 text-teal-800">{message.sender.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                  )}
                  <div className={`flex flex-col ${!message.isClient && "items-end"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">{message.time}</span>
                      <span className="text-sm font-medium">{message.sender}</span>
                    </div>
                    <div className={`py-3 px-4 rounded-lg break-words ${message.isClient ? "bg-white border border-gray-200 text-gray-800" : "bg-teal-600 text-white"}`}>
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
                <Button className="rounded-md bg-teal-600 hover:bg-teal-700 gap-2" onClick={handleSendMessage} disabled={messageInput.trim() === ""}><Send className="h-5 w-5" /> Send</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConsultantDashboardLayout>
  );
};

export default ConsultantMessages;
