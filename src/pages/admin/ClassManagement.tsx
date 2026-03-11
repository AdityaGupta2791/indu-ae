
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Eye, Calendar, Users } from "lucide-react";

const ClassManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const classes = [
    { 
      id: 1, 
      title: "Advanced Mathematics", 
      tutor: "Dr. Smith", 
      type: "Online Live", 
      status: "active", 
      students: 25, 
      duration: "1 hour", 
      price: "$50",
      schedule: "Mon, Wed, Fri 3:00 PM"
    },
    { 
      id: 2, 
      title: "Creative Writing", 
      tutor: "Ms. Johnson", 
      type: "Online Recorded", 
      status: "active", 
      students: 45, 
      duration: "45 mins", 
      price: "$35",
      schedule: "Self-paced"
    },
    { 
      id: 3, 
      title: "Science Lab", 
      tutor: "Prof. Davis", 
      type: "Offline", 
      status: "pending", 
      students: 12, 
      duration: "2 hours", 
      price: "$75",
      schedule: "Saturdays 10:00 AM"
    },
    { 
      id: 4, 
      title: "Guitar Basics", 
      tutor: "Mr. Wilson", 
      type: "1-on-1", 
      status: "active", 
      students: 8, 
      duration: "30 mins", 
      price: "$40",
      schedule: "Flexible"
    },
    { 
      id: 5, 
      title: "Spanish Conversation", 
      tutor: "Ms. Garcia", 
      type: "Online Live", 
      status: "completed", 
      students: 18, 
      duration: "1 hour", 
      price: "$45",
      schedule: "Tues, Thurs 4:00 PM"
    }
  ];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         classItem.tutor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || classItem.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      "Online Live": "bg-purple-100 text-purple-800",
      "Online Recorded": "bg-blue-100 text-blue-800",
      "Offline": "bg-orange-100 text-orange-800",
      "1-on-1": "bg-pink-100 text-pink-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-talent-dark">Class Management</h1>
          <p className="text-talent-muted mt-2">Manage all classes across the platform</p>
        </div>
        <Button className="bg-talent-primary hover:bg-talent-secondary">
          <Plus className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Classes", value: "1,234", color: "text-blue-600" },
          { label: "Active Classes", value: "856", color: "text-green-600" },
          { label: "Pending Approval", value: "45", color: "text-yellow-600" },
          { label: "Completed", value: "333", color: "text-purple-600" }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-talent-dark">{stat.value}</div>
              <div className="text-sm text-talent-muted">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Classes ({filteredClasses.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-talent-muted" />
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-talent-dark">{classItem.title}</div>
                        <div className="text-sm text-talent-muted">by {classItem.tutor}</div>
                        <div className="text-xs text-talent-muted">{classItem.duration}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeBadge(classItem.type)}>
                        {classItem.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(classItem.status)}>
                        {classItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-talent-muted" />
                        {classItem.students}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{classItem.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-talent-muted" />
                        <span className="text-sm">{classItem.schedule}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassManagement;
