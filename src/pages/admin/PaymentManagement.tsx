
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, DollarSign, CreditCard, TrendingUp, AlertCircle } from "lucide-react";

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const payments = [
    { 
      id: "PAY-001", 
      user: "John Doe", 
      class: "Advanced Mathematics", 
      amount: "$50", 
      status: "completed", 
      method: "credit_card", 
      date: "2024-01-25",
      tutor: "Dr. Smith"
    },
    { 
      id: "PAY-002", 
      user: "Jane Wilson", 
      class: "Creative Writing", 
      amount: "$35", 
      status: "pending", 
      method: "paypal", 
      date: "2024-01-24",
      tutor: "Ms. Johnson"
    },
    { 
      id: "PAY-003", 
      user: "Mike Brown", 
      class: "Science Lab", 
      amount: "$75", 
      status: "failed", 
      method: "credit_card", 
      date: "2024-01-23",
      tutor: "Prof. Davis"
    },
    { 
      id: "PAY-004", 
      user: "Sarah Davis", 
      class: "Guitar Basics", 
      amount: "$40", 
      status: "completed", 
      method: "bank_transfer", 
      date: "2024-01-22",
      tutor: "Mr. Wilson"
    },
    { 
      id: "PAY-005", 
      user: "Tom Anderson", 
      class: "Spanish Conversation", 
      amount: "$45", 
      status: "refunded", 
      method: "credit_card", 
      date: "2024-01-21",
      tutor: "Ms. Garcia"
    }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payment.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-blue-100 text-blue-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      credit_card: "bg-purple-100 text-purple-800",
      paypal: "bg-blue-100 text-blue-800",
      bank_transfer: "bg-green-100 text-green-800"
    };
    const labels = {
      credit_card: "Credit Card",
      paypal: "PayPal",
      bank_transfer: "Bank Transfer"
    };
    return { 
      color: colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800",
      label: labels[method as keyof typeof labels] || method
    };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-talent-dark">Payment Management</h1>
          <p className="text-talent-muted mt-2">Monitor and manage all platform payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-talent-primary hover:bg-talent-secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: "Total Revenue", 
            value: "$45,678", 
            change: "+12%", 
            icon: DollarSign, 
            color: "text-green-600" 
          },
          { 
            label: "Pending Payments", 
            value: "$2,340", 
            change: "+5%", 
            icon: CreditCard, 
            color: "text-yellow-600" 
          },
          { 
            label: "Successful Rate", 
            value: "94.5%", 
            change: "+2%", 
            icon: TrendingUp, 
            color: "text-blue-600" 
          },
          { 
            label: "Failed Payments", 
            value: "23", 
            change: "-8%", 
            icon: AlertCircle, 
            color: "text-red-600" 
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-talent-dark">{stat.value}</div>
                    <div className="text-sm text-talent-muted">{stat.label}</div>
                    <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-talent-muted" />
                <Input
                  placeholder="Search payments..."
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
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Tutor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const methodInfo = getMethodBadge(payment.method);
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-talent-dark">{payment.user}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{payment.class}</div>
                      </TableCell>
                      <TableCell className="font-bold text-talent-dark">{payment.amount}</TableCell>
                      <TableCell>
                        <Badge className={methodInfo.color}>
                          {methodInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell className="text-sm text-talent-muted">{payment.tutor}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagement;
