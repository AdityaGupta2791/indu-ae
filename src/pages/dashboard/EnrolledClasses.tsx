
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import ClassesHeader from "@/components/dashboard/ClassesHeader";
import ClassFilters from "@/components/dashboard/ClassFilters";
import ClassList from "@/components/dashboard/ClassList";
import { mockClasses, ClassData } from "@/data/mockClasses";
import { ClassCardProps } from "@/components/dashboard/ClassCard";

const EnrolledClasses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"online" | "offline">("online");
  const [onlineFormat, setOnlineFormat] = useState<"recorded" | "live">("recorded");
  const [offlineFormat, setOfflineFormat] = useState<"inbound" | "outbound">("inbound");
  const [classSize, setClassSize] = useState<"group" | "one-on-one">("group");
  
  // Reset sub-tabs when changing main delivery mode or format
  useEffect(() => {
    if (deliveryMode === "online") {
      setOnlineFormat("recorded");
      setClassSize("group");
    } else {
      // For offline classes
      if (offlineFormat === "inbound") {
        // Inbound is always one-on-one
        setClassSize("one-on-one");
      } else {
        // Outbound can be either, default to group
        setClassSize("group");
      }
    }
  }, [deliveryMode]);

  // When changing offline format
  useEffect(() => {
    if (deliveryMode === "offline" && offlineFormat === "inbound") {
      // Inbound is always one-on-one
      setClassSize("one-on-one");
    }
  }, [offlineFormat, deliveryMode]);
  
  // Convert ClassData to ClassCardProps
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
      format: classData.format as "live" | "recorded" | "inbound" | "outbound", // This is already compatible
      classSize: classData.size === "group" ? "group" : "individual", 
      duration: "fixed", // Default to fixed for now
      studentsCount: classData.studentsCount
    };
  };
  
  // Filter active and completed classes based on current filters
  const activeClasses = mockClasses
    .filter(
      (cls) => cls.status === "active" && 
      cls.deliveryMode === deliveryMode &&
      ((deliveryMode === "online" && cls.format === onlineFormat) || 
       (deliveryMode === "offline" && cls.format === offlineFormat)) &&
      ((deliveryMode === "offline" && offlineFormat === "inbound") || cls.size === classSize) &&
      (cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       cls.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
       cls.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .map(convertToClassCardProps);
  
  const completedClasses = mockClasses
    .filter(
      (cls) => cls.status === "completed" &&
      cls.deliveryMode === deliveryMode &&
      ((deliveryMode === "online" && cls.format === onlineFormat) || 
       (deliveryMode === "offline" && cls.format === offlineFormat)) &&
      ((deliveryMode === "offline" && offlineFormat === "inbound") || cls.size === classSize) &&
      (cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       cls.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
       cls.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .map(convertToClassCardProps);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ClassesHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <ClassFilters
          deliveryMode={deliveryMode}
          onDeliveryModeChange={setDeliveryMode}
          onlineFormat={onlineFormat}
          onOnlineFormatChange={setOnlineFormat}
          offlineFormat={offlineFormat}
          onOfflineFormatChange={setOfflineFormat}
          classSize={classSize}
          onClassSizeChange={setClassSize}
        />
        
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
    </DashboardLayout>
  );
};

export default EnrolledClasses;
