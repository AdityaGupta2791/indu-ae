
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Play } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import ClassCreationStepper from "./ClassCreationStepper";
import ClassTypeStep from "./steps/ClassTypeStep";
import DetailsStep from "./steps/DetailsStep";
import ScheduleStep from "./steps/ScheduleStep";
import PricingStep from "./steps/PricingStep";
import LocationStep from "./steps/LocationStep";
import CurriculumStep from "./steps/CurriculumStep";
import PreviewStep from "./steps/PreviewStep";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { autoFillClassCreation } from "@/testing/autoFill";
import ClassTypeSelector from "./ClassTypeSelector";
import { LectureType } from "@/types/lecture-types";

const steps = [
  "Delivery & Type",
  "Details",
  "Schedule",
  "Pricing & Capacity",
  "Location/Links",
  "Curriculum",
  "Preview & Publish"
];

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateClassDialog = ({ open, onOpenChange }: CreateClassDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { reset, formState, setDeliveryMode, setClassFormat, setClassSize, setDurationType, 
    setBasicDetails, setSchedule, setPricing, setLocation, setSyllabus } = useClassCreationStore();

  const updateFormState = (newState: any) => {
    // Helper function to update form state based on the current step
    if (newState.deliveryMode) setDeliveryMode(newState.deliveryMode);
    if (newState.classFormat) setClassFormat(newState.classFormat);
    if (newState.classSize) setClassSize(newState.classSize);
    if (newState.durationType) setDurationType(newState.durationType);
    
    if (newState.title || newState.subject || newState.description || newState.thumbnailUrl) {
      setBasicDetails({
        title: newState.title || formState.title,
        subject: newState.subject || formState.subject,
        description: newState.description || formState.description,
        thumbnailUrl: newState.thumbnailUrl || formState.thumbnailUrl
      });
    }
    
    if (newState.frequency || newState.startDate || newState.endDate || newState.totalSessions || newState.timeSlots) {
      setSchedule({
        frequency: newState.frequency || formState.frequency,
        startDate: newState.startDate || formState.startDate,
        endDate: newState.endDate || formState.endDate,
        totalSessions: newState.totalSessions || formState.totalSessions
      });
      // If timeSlots are provided, handle them separately
    }
    
    if (newState.price || newState.currency || newState.maxStudents !== undefined || newState.autoRenewal !== undefined) {
      setPricing({
        price: newState.price !== undefined ? newState.price : formState.price,
        currency: newState.currency || formState.currency,
        maxStudents: newState.maxStudents !== undefined ? newState.maxStudents : formState.maxStudents,
        autoRenewal: newState.autoRenewal !== undefined ? newState.autoRenewal : formState.autoRenewal
      });
    }
    
    if (newState.meetingLink || newState.address) {
      setLocation({
        meetingLink: newState.meetingLink || formState.meetingLink,
        address: newState.address || formState.address
      });
    }
    
    if (newState.syllabus) {
      setSyllabus(newState.syllabus);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after dialog closes
    setTimeout(() => {
      setCurrentStep(0);
      reset();
    }, 300);
  };

  const handleJumpToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSaveAsDraft = () => {
    toast({
      title: "Saved as draft",
      description: "Your class has been saved as a draft.",
    });
    handleClose();
    // Refresh the page to show the new draft
    navigate("/tutor-dashboard/classes");
  };

  const getClassCategoryLabel = () => {
    const { deliveryMode, classFormat, classSize } = formState;
    
    if (!deliveryMode || !classFormat || !classSize) return "Classes";
    
    let category = deliveryMode === "online" ? "Online" : "Offline";
    let format = "";
    
    if (deliveryMode === "online") {
      format = classFormat === "live" ? "Live" : "Recorded";
    } else {
      format = classFormat === "inbound" ? "Inbound" : "Outbound";
    }
    
    const size = classSize === "group" ? "Group" : "One-on-One";
    
    return `${category} ${format} ${size} Classes`;
  };

  const handlePublish = () => {
    const categoryLabel = getClassCategoryLabel();
    
    toast({
      title: "Class published!",
      description: `Added to ${categoryLabel}.`,
    });
    handleClose();
    // Refresh the page to show the new class
    navigate("/tutor-dashboard/classes");
  };

  const handleAutoFill = () => {
    setTypeSelectorOpen(true);
  };

  const handleSelectClassType = async (selectedType: LectureType) => {
    toast({
      title: "Test Mode Activated",
      description: `Auto-filling ${selectedType} class creation form...`,
    });
    await autoFillClassCreation(selectedType, setCurrentStep, updateFormState);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ClassTypeStep onNext={handleNext} />;
      case 1:
        return <DetailsStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <ScheduleStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <PricingStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <LocationStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <CurriculumStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <PreviewStep onBack={handleBack} onSaveAsDraft={handleSaveAsDraft} onPublish={handlePublish} />;
      default:
        return <ClassTypeStep onNext={handleNext} />;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden max-h-[90vh]">
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-[#1F4E79]">Create New Class</DialogTitle>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleAutoFill}
                        variant="outline" 
                        size="sm"
                        className="gap-1 border-[#1F4E79]/20 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Test
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Auto-fill form for testing</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogClose asChild onClick={handleClose}>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogClose>
              </div>
            </div>
            <ClassCreationStepper 
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleJumpToStep}
            />
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(90vh-150px)] px-6 py-4">
            {renderStep()}
          </div>
          
          {currentStep === 6 && (
            <DialogFooter className="px-6 py-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleSaveAsDraft}
                className="bg-white hover:bg-gray-50"
              >
                Save as Draft
              </Button>
              <Button 
                onClick={handlePublish}
                className="bg-[#1F4E79] hover:bg-[#1a4369]"
              >
                Publish Now
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      <ClassTypeSelector 
        open={typeSelectorOpen}
        onClose={() => setTypeSelectorOpen(false)}
        onSelectType={handleSelectClassType}
      />
    </>
  );
};

export default CreateClassDialog;
