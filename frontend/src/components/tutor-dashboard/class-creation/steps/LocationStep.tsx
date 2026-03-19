
import { useState } from "react";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LocationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const LocationStep = ({ onNext, onBack }: LocationStepProps) => {
  const { formState, setLocation } = useClassCreationStore();
  
  // Initialize form based on class type
  const [meetingLink, setMeetingLink] = useState(formState.meetingLink || "");
  const [address, setAddress] = useState({
    street: formState.address.street || "",
    city: formState.address.city || "",
    state: formState.address.state || "",
    zipCode: formState.address.zipCode || "",
    country: formState.address.country || ""
  });
  
  const [errors, setErrors] = useState({
    meetingLink: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });
  
  const validateForm = () => {
    const newErrors = {
      meetingLink: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    };
    
    // Validate based on class type
    if (formState.deliveryMode === "online" && formState.classFormat === "live") {
      if (!meetingLink) {
        newErrors.meetingLink = "Meeting link is required for online live classes";
      } else if (!isValidUrl(meetingLink)) {
        newErrors.meetingLink = "Please enter a valid URL";
      }
    } else if (formState.deliveryMode === "offline") {
      if (!address.street) newErrors.street = "Street address is required";
      if (!address.city) newErrors.city = "City is required";
      if (!address.state) newErrors.state = "State/Province is required";
      if (!address.zipCode) newErrors.zipCode = "Zip/Postal code is required";
      if (!address.country) newErrors.country = "Country is required";
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  const handleNext = () => {
    if (validateForm()) {
      setLocation({
        meetingLink,
        address
      });
      onNext();
    }
  };
  
  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Determine which form to show based on class type
  const renderLocationForm = () => {
    if (formState.deliveryMode === "online") {
      if (formState.classFormat === "live") {
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="meetingLink" className="text-base">
                  Video Conference Link <span className="text-red-500">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Provide a link to your Zoom, Google Meet, or other video conferencing platform.
                        Make sure to test the link before sharing with students.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="meetingLink"
                placeholder="https://zoom.us/j/123456789"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className={errors.meetingLink ? "border-red-500" : ""}
              />
              {errors.meetingLink && (
                <p className="text-red-500 text-sm">{errors.meetingLink}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Students will use this link to join your live sessions. 
                Please double-check it before proceeding.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md mt-4">
              <h4 className="font-medium text-amber-800 mb-2">Important Reminders</h4>
              <ul className="text-sm space-y-2 list-disc list-inside text-amber-700">
                <li>Test your video conferencing link before each session</li>
                <li>Consider setting up a waiting room for better security</li>
                <li>Prepare backup plans in case of technical issues</li>
                <li>Students will receive automatic reminders 1 hour before class</li>
              </ul>
            </div>
          </div>
        );
      } else {
        // Online recorded classes
        return (
          <div className="bg-blue-50 p-6 rounded-md">
            <h4 className="font-semibold text-[#1F4E79] mb-4">Recorded Class Upload System</h4>
            <p className="mb-4">
              For recorded classes, you'll use our secure upload system to provide content to your students.
              No location or link information is needed at this time.
            </p>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md">
                <h5 className="font-medium mb-2">Upload Schedule</h5>
                <p className="text-sm text-muted-foreground">
                  Please upload your videos at least 3 hours before the scheduled release time to ensure proper processing.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-md">
                <h5 className="font-medium mb-2">Supported Formats</h5>
                <p className="text-sm text-muted-foreground">
                  Our system supports MP4, MOV, and AVI formats with a maximum file size of 2GB per video.
                  For optimal quality, we recommend 720p resolution or higher.
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleNext}
              className="bg-[#1F4E79] hover:bg-[#1a4369] mt-6 w-full"
            >
              Continue to Curriculum
            </Button>
          </div>
        );
      }
    } else {
      // Offline classes
      const locationType = formState.classFormat === "inbound" ? "Student's Location" : "Your Teaching Location";
      
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {locationType}
            {formState.classFormat === "inbound" && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (where you'll travel to)
              </span>
            )}
          </h3>
          
          {formState.classFormat === "inbound" && (
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <p className="text-sm">
                As this is an inbound class, students can update their location during enrollment.
                Any address you provide now will be used as a default location for planning purposes.
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street" className="text-base">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="street"
                placeholder="123 Main St"
                value={address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                className={errors.street ? "border-red-500" : ""}
              />
              {errors.street && (
                <p className="text-red-500 text-sm">{errors.street}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-base">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state" className="text-base">
                  State/Province <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="state"
                  placeholder="State/Province"
                  value={address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm">{errors.state}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-base">
                  Zip/Postal Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zipCode"
                  placeholder="Zip/Postal Code"
                  value={address.zipCode}
                  onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm">{errors.zipCode}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country" className="text-base">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                  className={errors.country ? "border-red-500" : ""}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm">{errors.country}</p>
                )}
              </div>
            </div>
          </div>
          
          {formState.classFormat === "outbound" && (
            <div className="bg-amber-50 p-4 rounded-md mt-4">
              <h4 className="font-medium text-amber-800 mb-2">Important Note</h4>
              <p className="text-sm text-amber-700">
                This address will be shared with enrolled students. Make sure it's accurate and that you're comfortable sharing this location.
              </p>
            </div>
          )}
        </div>
      );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {renderLocationForm()}
        </div>
        
        <div className="space-y-4">
          {(formState.deliveryMode === "offline" || 
            (formState.deliveryMode === "online" && formState.classFormat === "live")) && (
            <div className="bg-[#F5F7FA] p-6 rounded-lg">
              <h4 className="font-semibold text-lg mb-4">Location Tips</h4>
              
              {formState.deliveryMode === "offline" && (
                <div className="space-y-4">
                  {formState.classFormat === "outbound" ? (
                    <>
                      <div className="p-4 bg-white rounded-md shadow-sm">
                        <h5 className="font-medium mb-2">Teaching Location</h5>
                        <p className="text-sm text-muted-foreground">
                          Ensure your teaching space is:
                        </p>
                        <ul className="text-sm list-disc list-inside text-muted-foreground mt-2 space-y-1">
                          <li>Accessible and easy to find</li>
                          <li>Appropriate for the class size you specified</li>
                          <li>Equipped with necessary facilities</li>
                          <li>In a safe neighborhood</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-white rounded-md shadow-sm">
                        <h5 className="font-medium mb-2">Student Instructions</h5>
                        <p className="text-sm text-muted-foreground">
                          Consider adding special instructions for students:
                        </p>
                        <ul className="text-sm list-disc list-inside text-muted-foreground mt-2 space-y-1">
                          <li>Parking information</li>
                          <li>Entry instructions (doorbell, access codes)</li>
                          <li>Landmarks to help find the location</li>
                          <li>What to bring to class</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-white rounded-md shadow-sm">
                        <h5 className="font-medium mb-2">Inbound Teaching</h5>
                        <p className="text-sm text-muted-foreground">
                          For inbound classes, you'll travel to the student's location.
                          Keep in mind:
                        </p>
                        <ul className="text-sm list-disc list-inside text-muted-foreground mt-2 space-y-1">
                          <li>Set clear travel radius boundaries</li>
                          <li>Factor travel time into your scheduling</li>
                          <li>Clarify any minimum space requirements</li>
                          <li>Be prepared to adapt to different environments</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-white rounded-md shadow-sm">
                        <h5 className="font-medium mb-2">Pre-Class Communication</h5>
                        <p className="text-sm text-muted-foreground">
                          Before the first class, confirm:
                        </p>
                        <ul className="text-sm list-disc list-inside text-muted-foreground mt-2 space-y-1">
                          <li>Exact location and access details</li>
                          <li>Availability of necessary equipment/space</li>
                          <li>Presence of adults (for classes with minors)</li>
                          <li>Any pets or other factors to be aware of</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {formState.deliveryMode === "online" && formState.classFormat === "live" && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-md shadow-sm">
                    <h5 className="font-medium mb-2">Platform Recommendations</h5>
                    <p className="text-sm text-muted-foreground">
                      Recommended video conferencing platforms:
                    </p>
                    <ul className="text-sm list-disc list-inside text-muted-foreground mt-2 space-y-1">
                      <li>Zoom (best for screen sharing and breakout rooms)</li>
                      <li>Google Meet (simple and accessible)</li>
                      <li>Microsoft Teams (good for document collaboration)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded-md shadow-sm">
                    <h5 className="font-medium mb-2">Before Your First Class</h5>
                    <p className="text-sm text-muted-foreground">
                      Preparation checklist:
                    </p>
                    <ul className="text-sm list-disc list-inside text-muted-foreground mt-2 space-y-1">
                      <li>Test your video conferencing link</li>
                      <li>Check your camera and microphone</li>
                      <li>Ensure your internet connection is stable</li>
                      <li>Set up proper lighting and a professional background</li>
                      <li>Have a backup plan for technical issues</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-[#1F4E79] hover:bg-[#1a4369]"
        >
          Continue to Curriculum
        </Button>
      </div>
    </div>
  );
};

export default LocationStep;
