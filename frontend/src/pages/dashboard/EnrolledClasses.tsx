
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StudentDashboardLayout from "@/components/StudentDashboardLayout";
import ClassList from "@/components/dashboard/ClassList";
import { mockClasses, ClassData } from "@/data/mockClasses";
import { ClassCardProps } from "@/components/dashboard/ClassCard";

type DeliveryMode = "all" | "online" | "offline";
type Format = "all" | "live" | "recorded" | "inbound" | "outbound";
type ClassSize = "all" | "group" | "one-on-one";

const EnrolledClasses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("all");
  const [format, setFormat] = useState<Format>("all");
  const [classSize, setClassSize] = useState<ClassSize>("all");

  const formatOptions = useMemo(() => {
    if (deliveryMode === "online") return ["all", "live", "recorded"] as const;
    if (deliveryMode === "offline") return ["all", "inbound", "outbound"] as const;
    return ["all", "live", "recorded", "inbound", "outbound"] as const;
  }, [deliveryMode]);

  const handleDeliveryChange = (value: DeliveryMode) => {
    setDeliveryMode(value);
    setFormat("all");
  };

  const activeFiltersCount = [deliveryMode, format, classSize].filter((f) => f !== "all").length;

  const clearFilters = () => {
    setDeliveryMode("all");
    setFormat("all");
    setClassSize("all");
  };

  const convertToClassCardProps = (classData: ClassData): ClassCardProps => {
    return {
      id: classData.id,
      title: classData.title,
      tutor: classData.tutor,
      image: classData.image,
      nextSession: classData.nextSession,
      progress: classData.progress,
      category: classData.category,
      status: classData.status,
      completionDate: classData.completionDate,
      classType: classData.deliveryMode,
      format: classData.format as "live" | "recorded" | "inbound" | "outbound",
      classSize: classData.size === "group" ? "group" : "individual",
      duration: "fixed",
      studentsCount: classData.studentsCount,
    };
  };

  const filterClasses = (status: "active" | "completed") => {
    return mockClasses
      .filter((cls) => {
        if (cls.status !== status) return false;
        if (deliveryMode !== "all" && cls.deliveryMode !== deliveryMode) return false;
        if (format !== "all" && cls.format !== format) return false;
        if (classSize !== "all" && cls.size !== classSize) return false;
        if (
          searchQuery &&
          !cls.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !cls.tutor.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !cls.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;
        return true;
      })
      .map(convertToClassCardProps);
  };

  const activeClasses = useMemo(() => filterClasses("active"), [searchQuery, deliveryMode, format, classSize]);
  const completedClasses = useMemo(() => filterClasses("completed"), [searchQuery, deliveryMode, format, classSize]);

  const FilterButton = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );

  return (
    <StudentDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-800">My Classes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track your enrolled classes
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search classes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Compact Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-blue-800">Filters</p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* Delivery Mode */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground w-20 shrink-0">Delivery</span>
                <div className="flex gap-1.5 flex-wrap">
                  <FilterButton active={deliveryMode === "all"} onClick={() => handleDeliveryChange("all")}>
                    All
                  </FilterButton>
                  <FilterButton active={deliveryMode === "online"} onClick={() => handleDeliveryChange("online")}>
                    Online
                  </FilterButton>
                  <FilterButton active={deliveryMode === "offline"} onClick={() => handleDeliveryChange("offline")}>
                    Offline
                  </FilterButton>
                </div>
              </div>

              {/* Format */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground w-20 shrink-0">Format</span>
                <div className="flex gap-1.5 flex-wrap">
                  <FilterButton active={format === "all"} onClick={() => setFormat("all")}>
                    All
                  </FilterButton>
                  {formatOptions.filter((o) => o !== "all").map((opt) => (
                    <FilterButton
                      key={opt}
                      active={format === opt}
                      onClick={() => setFormat(opt as Format)}
                    >
                      {opt === "live" ? "Live" : opt === "recorded" ? "Recorded" : opt === "inbound" ? "Inbound" : "Outbound"}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Class Size */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground w-20 shrink-0">Size</span>
                <div className="flex gap-1.5 flex-wrap">
                  <FilterButton active={classSize === "all"} onClick={() => setClassSize("all")}>
                    All
                  </FilterButton>
                  <FilterButton active={classSize === "group"} onClick={() => setClassSize("group")}>
                    Group
                  </FilterButton>
                  <FilterButton active={classSize === "one-on-one"} onClick={() => setClassSize("one-on-one")}>
                    1-on-1
                  </FilterButton>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              Active Classes <Badge className="ml-2" variant="secondary">{activeClasses.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed <Badge className="ml-2" variant="secondary">{completedClasses.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <ClassList
              classes={activeClasses}
              emptyStateMessage="No active classes found."
              showFindClassesButton
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <ClassList
              classes={completedClasses}
              emptyStateMessage="No completed classes yet."
            />
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
};

export default EnrolledClasses;
