import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tutorEarningService, EarningSummary, TutorEarning } from "@/services/earning.service";
import { useToast } from "@/hooks/use-toast";

const formatInr = (paise: number) => {
  const inr = paise / 100;
  return `₹${inr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Earnings = () => {
  const { toast } = useToast();
  const [summary, setSummary] = useState<EarningSummary | null>(null);
  const [earnings, setEarnings] = useState<TutorEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryRes, earningsRes] = await Promise.all([
        tutorEarningService.getSummary(),
        tutorEarningService.list({
          page,
          limit: 20,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
        }),
      ]);
      setSummary(summaryRes);
      setEarnings(earningsRes.data);
      setTotalPages(earningsRes.meta.totalPages);
    } catch {
      toast({ title: "Error", description: "Failed to load earnings data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);

  return (
    <TutorDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-purple-800">Earnings</h1>
            <p className="text-muted-foreground text-sm mt-1">Track your teaching earnings and payouts</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Earned</h3>
                  <h2 className="text-2xl font-bold mt-1">{summary ? formatInr(summary.totalEarnedInPaise) : "..."}</h2>
                  <p className="text-xs text-gray-500 mt-1">{summary?.totalClasses ?? 0} classes</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Unpaid</h3>
                  <h2 className="text-2xl font-bold mt-1 text-amber-600">{summary ? formatInr(summary.unpaidInPaise) : "..."}</h2>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Wallet className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Paid</h3>
                  <h2 className="text-2xl font-bold mt-1 text-green-600">{summary ? formatInr(summary.paidInPaise) : "..."}</h2>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                  <h2 className="text-2xl font-bold mt-1">{summary ? formatInr(summary.thisMonth.earnedInPaise) : "..."}</h2>
                  <p className="text-xs text-gray-500 mt-1">{summary?.thisMonth.classes ?? 0} classes</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Table */}
        <Card className="bg-white shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Earnings History</h3>
              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                <SelectTrigger className="w-[140px] h-9 bg-white border border-gray-200 rounded-lg">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-medium text-gray-700">Subject</TableHead>
                    <TableHead className="font-medium text-gray-700">Student</TableHead>
                    <TableHead className="font-medium text-gray-700">Class Date</TableHead>
                    <TableHead className="font-medium text-gray-700">Amount</TableHead>
                    <TableHead className="font-medium text-gray-700">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading...</TableCell>
                    </TableRow>
                  ) : earnings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">No earnings found</TableCell>
                    </TableRow>
                  ) : (
                    earnings.map((earning) => (
                      <TableRow key={earning.id}>
                        <TableCell className="font-medium">{earning.subject}</TableCell>
                        <TableCell>{earning.studentName}</TableCell>
                        <TableCell>{new Date(earning.classDate).toLocaleDateString()}</TableCell>
                        <TableCell>{formatInr(earning.amountInPaise)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              earning.status === "PAID"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            }
                            variant="outline"
                          >
                            {earning.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TutorDashboardLayout>
  );
};

export default Earnings;
