
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Send, MessageSquare, Users, AlertCircle, CheckCircle2 } from "lucide-react";

const conversations = [
  { id: 1, name: "Priya Sharma", role: "tutor", lastMsg: "I need help with class scheduling approval.", time: "2m ago", unread: 2, status: "active" },
  { id: 2, name: "Rahul Verma", role: "parent", lastMsg: "Payment issue with credit purchase.", time: "15m ago", unread: 1, status: "active" },
  { id: 3, name: "Anita Desai", role: "tutor", lastMsg: "Thank you for resolving the issue!", time: "1h ago", unread: 0, status: "resolved" },
  { id: 4, name: "Vikram Singh", role: "consultant", lastMsg: "Need clarification on tutor allocation policy.", time: "2h ago", unread: 0, status: "active" },
  { id: 5, name: "Meera Patel", role: "parent", lastMsg: "Can you check my refund request?", time: "3h ago", unread: 3, status: "active" },
  { id: 6, name: "Arjun Reddy", role: "student", lastMsg: "Unable to access recorded lectures.", time: "5h ago", unread: 0, status: "resolved" },
  { id: 7, name: "Sneha Gupta", role: "tutor", lastMsg: "Demo class link not working.", time: "1d ago", unread: 0, status: "resolved" },
];

const AdminMessages = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [newMsg, setNewMsg] = useState("");

  const selected = conversations.find(c => c.id === selectedId)!;

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMsg.toLowerCase().includes(search.toLowerCase())
  );

  const mockMessages = [
    { from: "user", text: selected.lastMsg, time: selected.time },
    { from: "admin", text: "Hi, I'm looking into this for you. Could you provide more details?", time: "1m ago" },
    { from: "user", text: "Sure, here are the details — I've been facing this since yesterday.", time: "just now" },
  ];

  const roleColor: Record<string, string> = {
    tutor: "bg-purple-100 text-purple-700",
    parent: "bg-indigo-100 text-indigo-700",
    student: "bg-blue-100 text-blue-700",
    consultant: "bg-teal-100 text-teal-700",
  };

  const stats = [
    { label: "Open Conversations", value: conversations.filter(c => c.status === "active").length, icon: MessageSquare, color: "text-blue-600" },
    { label: "Unread Messages", value: conversations.reduce((s, c) => s + c.unread, 0), icon: AlertCircle, color: "text-orange-600" },
    { label: "Resolved Today", value: conversations.filter(c => c.status === "resolved").length, icon: CheckCircle2, color: "text-green-600" },
    { label: "Total Users", value: conversations.length, icon: Users, color: "text-purple-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <p className="text-muted-foreground text-sm mt-1">Communicate with platform users and handle support requests.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <Icon className={`h-5 w-5 ${s.color}`} />
                <div>
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chat Interface */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[500px]">
          {/* Conversation List */}
          <div className="border-r flex flex-col">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left p-3 border-b hover:bg-gray-50 transition-colors ${selectedId === c.id ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="bg-gray-200 text-sm">{c.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${roleColor[c.role] || ""}`}>
                          {c.role}
                        </Badge>
                        {c.status === "resolved" && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700">resolved</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">{c.lastMsg}</p>
                    </div>
                    {c.unread > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-200 text-sm">{selected.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{selected.name}</p>
                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${roleColor[selected.role] || ""}`}>
                  {selected.role}
                </Badge>
              </div>
              {selected.status === "active" && (
                <Button variant="outline" size="sm" className="ml-auto text-xs">
                  Mark Resolved
                </Button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${m.from === "admin" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                    <p className="text-sm">{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.from === "admin" ? "text-blue-200" : "text-muted-foreground"}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminMessages;
