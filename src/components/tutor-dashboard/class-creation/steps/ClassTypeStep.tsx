
import { useState, useEffect } from "react";
import { useClassCreationStore, DeliveryMode, ClassFormat, ClassSize, DurationType } from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ClassTypeStepProps {
  onNext: () => void;
}

const ClassTypeStep = ({ onNext }: ClassTypeStepProps) => {
  const { 
    formState, 
    setDeliveryMode, 
    setClassFormat, 
    setClassSize, 
    setDurationType 
  } = useClassCreationStore();
  
  const [isValid, setIsValid] = useState(false);
  
  // Validate if all required fields are filled
  useEffect(() => {
    const { deliveryMode, classFormat, classSize, durationType } = formState;
    
    // Special case: For inbound classes, classSize is always "one-on-one"
    const isClassSizeValid = 
      classFormat === "inbound" || 
      (classSize !== null && classSize !== undefined);
    
    setIsValid(
      !!deliveryMode && 
      !!classFormat && 
      isClassSizeValid && 
      !!durationType
    );
  }, [formState]);
  
  // Get available class formats based on delivery mode
  const getClassFormats = () => {
    if (formState.deliveryMode === "online") {
      return [
        { value: "live", label: "Live" },
        { value: "recorded", label: "Recorded" }
      ];
    } else if (formState.deliveryMode === "offline") {
      return [
        { value: "inbound", label: "Inbound (you go to student)" },
        { value: "outbound", label: "Outbound (student comes to you)" }
      ];
    }
    return [];
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Delivery Mode</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select how you want to deliver your class
        </p>
        
        <RadioGroup 
          defaultValue={formState.deliveryMode || undefined}
          onValueChange={(value) => setDeliveryMode(value as DeliveryMode)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="online" id="online" className="mt-1" />
            <Label 
              htmlFor="online" 
              className="flex flex-col cursor-pointer"
            >
              <span className="font-medium">Online</span>
              <span className="text-sm text-muted-foreground">
                Teach virtually from anywhere
              </span>
            </Label>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="offline" id="offline" className="mt-1" />
            <Label 
              htmlFor="offline"
              className="flex flex-col cursor-pointer"
            >
              <span className="font-medium">Offline</span>
              <span className="text-sm text-muted-foreground">
                Teach in-person
              </span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {formState.deliveryMode && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Class Format</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose the format that best suits your teaching style
          </p>
          
          <Select 
            value={formState.classFormat || undefined}
            onValueChange={(value) => setClassFormat(value as ClassFormat)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select class format" />
            </SelectTrigger>
            <SelectContent>
              {getClassFormats().map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {formState.classFormat && formState.classFormat !== "inbound" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Class Size</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select whether you want to teach a group or one-on-one
          </p>
          
          <RadioGroup 
            defaultValue={formState.classSize || undefined}
            onValueChange={(value) => setClassSize(value as ClassSize)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="group" id="group" className="mt-1" />
              <Label 
                htmlFor="group"
                className="flex flex-col cursor-pointer" 
              >
                <span className="font-medium">Group</span>
                <span className="text-sm text-muted-foreground">
                  Teach multiple students at once
                </span>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="one-on-one" id="one-on-one" className="mt-1" />
              <Label 
                htmlFor="one-on-one"
                className="flex flex-col cursor-pointer"
              >
                <span className="font-medium">One-on-One</span>
                <span className="text-sm text-muted-foreground">
                  Personalized teaching for a single student
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      {(formState.classSize || formState.classFormat === "inbound") && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Duration Type</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose between recurring or fixed duration classes
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <Label className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Recurring</span>
                  <p className="text-sm text-muted-foreground">
                    Ongoing classes with a monthly subscription
                  </p>
                </div>
                <Switch
                  checked={formState.durationType === "recurring"}
                  onCheckedChange={() => setDurationType("recurring")}
                />
              </Label>
            </div>
            
            <div className="p-4 border rounded-md">
              <Label className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Fixed Duration</span>
                  <p className="text-sm text-muted-foreground">
                    Set number of sessions with a one-time payment
                  </p>
                </div>
                <Switch
                  checked={formState.durationType === "fixed"}
                  onCheckedChange={() => setDurationType("fixed")}
                />
              </Label>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={!isValid}
          className="bg-[#1F4E79] hover:bg-[#1a4369]"
        >
          Continue to Details
        </Button>
      </div>
    </div>
  );
};

export default ClassTypeStep;
