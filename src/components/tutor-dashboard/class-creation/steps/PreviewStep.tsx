
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Calendar, Clock, Users, Globe, Video, MapPin, Link, Book } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

interface PreviewStepProps {
  onBack: () => void;
  onSaveAsDraft: () => void;
  onPublish: () => void;
}

const PreviewStep = ({ onBack, onSaveAsDraft, onPublish }: PreviewStepProps) => {
  const { formState } = useClassCreationStore();
  
  // Helper function to format class type for display
  const getClassTypeDisplayString = () => {
    const { deliveryMode, classFormat, classSize, durationType } = formState;
    
    if (!deliveryMode || !classFormat || !classSize || !durationType) {
      return "Not specified";
    }
    
    let displayString = `${durationType === "recurring" ? "Recurring" : "Fixed Duration"} `;
    
    if (deliveryMode === "online") {
      displayString += `${classFormat === "live" ? "Live" : "Recorded"} `;
    } else {
      displayString += `${classFormat === "inbound" ? "Inbound" : "Outbound"} `;
    }
    
    displayString += `${classSize === "group" ? "Group" : "One-on-One"} Class`;
    
    return displayString;
  };
  
  // Format address for display
  const formatAddress = () => {
    const { street, city, state, zipCode, country } = formState.address;
    if (!street && !city && !state && !zipCode && !country) {
      return "No address provided";
    }
    
    return `${street}, ${city}, ${state} ${zipCode}, ${country}`;
  };
  
  // Format class schedule
  const formatSchedule = () => {
    const { frequency, startDate, endDate, totalSessions, timeSlots } = formState;
    
    if (!frequency || !startDate || timeSlots.length === 0) {
      return "Schedule not complete";
    }
    
    let scheduleString = `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} classes`;
    
    if (startDate) {
      scheduleString += ` starting ${new Date(startDate).toLocaleDateString()}`;
    }
    
    if (formState.durationType === "fixed" && endDate) {
      scheduleString += ` until ${new Date(endDate).toLocaleDateString()}`;
    }
    
    if (formState.durationType === "fixed" && totalSessions) {
      scheduleString += ` (${totalSessions} sessions)`;
    }
    
    return scheduleString;
  };
  
  // Format time slots
  const formatTimeSlots = () => {
    if (formState.timeSlots.length === 0) {
      return "No time slots specified";
    }
    
    return formState.timeSlots.map(slot => {
      const day = slot.day.charAt(0).toUpperCase() + slot.day.slice(1);
      return `${day}s, ${slot.startTime} - ${slot.endTime}`;
    }).join("; ");
  };

  // Get class type icon
  const getClassTypeIcon = () => {
    if (formState.deliveryMode === "online") {
      return <Video className="h-5 w-5 text-blue-500" />;
    } else {
      return <MapPin className="h-5 w-5 text-orange-500" />;
    }
  };

  // Get badge color based on class type
  const getClassTypeBadgeColor = () => {
    const { deliveryMode, classFormat } = formState;
    
    if (deliveryMode === "online") {
      return classFormat === "live" 
        ? "bg-blue-100 text-blue-800 border-blue-200" 
        : "bg-green-100 text-green-800 border-green-200";
    } else {
      return classFormat === "inbound" 
        ? "bg-orange-100 text-orange-800 border-orange-200" 
        : "bg-purple-100 text-purple-800 border-purple-200";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2 border-[#1F4E79]/20 shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#F5F7FA] to-[#f0f4fb] px-4 py-3 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-[#1F4E79]">Class Preview</h3>
            {getClassTypeIcon()}
          </div>
          <div className="text-sm">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              Draft
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x">
            <div className="space-y-6 p-4">
              {formState.thumbnailUrl ? (
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden border hover:shadow-md transition-shadow duration-300">
                  <img 
                    src={formState.thumbnailUrl} 
                    alt="Class thumbnail" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center border">
                  <p className="text-gray-400">No thumbnail uploaded</p>
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-bold text-[#1F4E79]">{formState.title || "Class Title"}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getClassTypeBadgeColor()}>
                    {getClassTypeDisplayString()}
                  </Badge>
                  <p className="text-muted-foreground text-sm">{formState.subject || "Subject"}</p>
                </div>
              </div>
              
              <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-[#1F4E79] flex items-center">
                  <Book className="h-4 w-4 mr-2" />
                  Description
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {formState.description || "No description provided"}
                </p>
              </div>
              
              <Collapsible className="border rounded-md">
                <CollapsibleTrigger className="flex w-full items-center justify-between p-3 hover:bg-gray-50">
                  <h4 className="font-medium text-[#1F4E79] flex items-center">
                    <Book className="h-4 w-4 mr-2" />
                    Syllabus
                  </h4>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t px-3 py-2">
                  {formState.syllabus.length > 0 ? (
                    <ul className="text-sm space-y-2">
                      {formState.syllabus.map((lesson, i) => (
                        <li key={i} className="p-2 bg-white shadow-sm rounded-md hover:shadow-md transition-shadow">
                          <p className="font-medium">{i + 1}. {lesson.title}</p>
                          {lesson.description && (
                            <p className="text-xs text-muted-foreground mt-1">{lesson.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No syllabus provided</p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            <div className="space-y-5 p-4">
              <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="px-4 py-3 bg-gray-50">
                  <CardTitle className="text-base font-medium text-[#1F4E79]">Class Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-[#1F4E79]" />
                    <div>
                      <h5 className="text-sm font-medium">Schedule</h5>
                      <p className="text-sm text-muted-foreground">{formatSchedule()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-[#1F4E79]" />
                    <div>
                      <h5 className="text-sm font-medium">Time Slots</h5>
                      <p className="text-sm text-muted-foreground">{formatTimeSlots()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 text-[#1F4E79] mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium">Class Size</h5>
                        <Badge variant="outline" className="bg-blue-50">
                          Max: {formState.maxStudents || "Not set"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formState.classSize === "group" ? "Group Class" : "One-on-One"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 mr-3 text-[#1F4E79] mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium">Pricing</h5>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {formState.price 
                            ? `${formState.currency} ${formState.price.toFixed(2)}` 
                            : "Not set"
                          }
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          {formState.durationType === "recurring" ? "Monthly fee" : "One-time payment"}
                        </p>
                        {formState.durationType === "recurring" && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">Auto-renew</span>
                            <Switch checked={formState.autoRenewal} disabled />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="px-4 py-3 bg-gray-50">
                  <CardTitle className="text-base font-medium text-[#1F4E79]">
                    {formState.deliveryMode === "online" ? "Connection Details" : "Location"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {formState.deliveryMode === "online" ? (
                    formState.classFormat === "live" ? (
                      <div className="flex items-start">
                        <Link className="h-5 w-5 mr-3 text-[#1F4E79] mt-0.5" />
                        <div>
                          <h5 className="text-sm font-medium">Meeting Link</h5>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-sm text-blue-500 hover:text-blue-700 underline break-all cursor-pointer">
                                  {formState.meetingLink || "No link provided"}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to copy link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <Video className="h-5 w-5 mr-3 text-[#1F4E79] mt-0.5" />
                        <div>
                          <h5 className="text-sm font-medium">Recorded Class</h5>
                          <p className="text-sm text-muted-foreground">
                            Videos will be available to enrolled students
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-[#1F4E79] mt-0.5" />
                      <div>
                        <h5 className="text-sm font-medium">
                          {formState.classFormat === "inbound" ? "Student's Location" : "Your Teaching Location"}
                        </h5>
                        <p className="text-sm text-muted-foreground">{formatAddress()}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Collapsible className="border rounded-md">
                <CollapsibleTrigger className="flex w-full items-center justify-between p-3 hover:bg-gray-50">
                  <h4 className="font-medium text-[#1F4E79]">Class Materials</h4>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t p-3">
                  {formState.materials.length > 0 ? (
                    <ul className="text-sm space-y-2">
                      {formState.materials.map((material, i) => (
                        <li key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                            {material.type === 'pdf' ? 'PDF' : 
                             material.type === 'video' ? 'VID' : 
                             material.type === 'audio' ? 'AUD' : 'DOC'}
                          </span>
                          <span className="flex-1 truncate">{material.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No materials uploaded</p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100">
        <h4 className="font-medium text-[#1F4E79] mb-2">Next Steps</h4>
        <ul className="text-sm space-y-3">
          <li className="flex items-start gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium">Save as Draft</p>
              <p className="text-muted-foreground text-sm">
                Your class will be saved privately and you can edit it later before publishing.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium">Publish Now</p>
              <p className="text-muted-foreground text-sm">
                Your class will be immediately visible and students can start enrolling.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-[#1F4E79] text-[#1F4E79] hover:bg-[#F5F7FA]"
        >
          Back
        </Button>
        
        <div className="space-x-3">
          <Button 
            variant="outline"
            onClick={onSaveAsDraft}
            className="border-[#1F4E79] text-[#1F4E79] hover:bg-[#F5F7FA]"
          >
            Save as Draft
          </Button>
          <Button 
            onClick={onPublish}
            className="bg-[#1F4E79] hover:bg-[#1a4369] text-white"
          >
            Publish Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
