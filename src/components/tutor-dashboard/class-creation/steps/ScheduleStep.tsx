
import { useState, useEffect } from "react";
import { 
  useClassCreationStore, 
  TimeSlot, 
  Frequency, 
  DayOfWeek 
} from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ScheduleStepProps {
  onNext: () => void;
  onBack: () => void;
}

const daysOfWeek: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" }
];

const frequencies: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" }
];

const ScheduleStep = ({ onNext, onBack }: ScheduleStepProps) => {
  const { 
    formState, 
    setSchedule, 
    addTimeSlot, 
    removeTimeSlot, 
    updateTimeSlot 
  } = useClassCreationStore();
  
  const [frequency, setFrequency] = useState<Frequency | null>(formState.frequency);
  const [startDate, setStartDate] = useState(formState.startDate || "");
  const [endDate, setEndDate] = useState(formState.endDate || "");
  const [totalSessions, setTotalSessions] = useState(formState.totalSessions?.toString() || "");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    formState.timeSlots.length > 0 
      ? formState.timeSlots 
      : [{ day: "monday", startTime: "09:00", endTime: "10:00" }]
  );
  
  const [errors, setErrors] = useState({
    frequency: "",
    startDate: "",
    endDate: "",
    totalSessions: "",
    timeSlots: ""
  });
  
  const validateForm = () => {
    const newErrors = {
      frequency: !frequency ? "Frequency is required" : "",
      startDate: !startDate ? "Start date is required" : "",
      endDate: formState.durationType === "fixed" && !endDate ? "End date is required" : "",
      totalSessions: formState.durationType === "fixed" && !totalSessions ? "Total sessions is required" : "",
      timeSlots: timeSlots.length === 0 ? "At least one time slot is required" : ""
    };
    
    // Validate each time slot
    if (timeSlots.some(slot => !slot.day || !slot.startTime || !slot.endTime)) {
      newErrors.timeSlots = "All time slot fields are required";
    }
    
    // Validate end date is after start date
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleNext = () => {
    if (validateForm()) {
      setSchedule({
        frequency,
        startDate,
        endDate: formState.durationType === "fixed" ? endDate : null,
        totalSessions: formState.durationType === "fixed" ? parseInt(totalSessions) : null
      });
      
      // Update time slots in store
      formState.timeSlots.forEach((_, index) => {
        removeTimeSlot(0); // Always remove the first one until all are gone
      });
      
      timeSlots.forEach(slot => {
        addTimeSlot(slot);
      });
      
      onNext();
    }
  };
  
  const handleAddTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      { day: "monday", startTime: "09:00", endTime: "10:00" }
    ]);
  };
  
  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };
  
  const handleTimeSlotChange = (index: number, field: keyof TimeSlot, value: string) => {
    setTimeSlots(
      timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-base">
              Class Frequency <span className="text-red-500">*</span>
            </Label>
            <Select
              value={frequency || undefined}
              onValueChange={(value) => setFrequency(value as Frequency)}
            >
              <SelectTrigger id="frequency" className={errors.frequency ? "border-red-500" : ""}>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p className="text-red-500 text-sm">{errors.frequency}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-base">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setStartDate(e.target.value)}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate}</p>
            )}
          </div>
          
          {formState.durationType === "fixed" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-base">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={errors.endDate ? "border-red-500" : ""}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">{errors.endDate}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalSessions" className="text-base">
                  Total Sessions <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalSessions"
                  type="number"
                  min="1"
                  value={totalSessions}
                  onChange={(e) => setTotalSessions(e.target.value)}
                  className={errors.totalSessions ? "border-red-500" : ""}
                />
                {errors.totalSessions && (
                  <p className="text-red-500 text-sm">{errors.totalSessions}</p>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base">
                Time Slots <span className="text-red-500">*</span>
              </Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddTimeSlot}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Slot
              </Button>
            </div>
            
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2 mb-3">
                <Select
                  value={slot.day}
                  onValueChange={(value) => handleTimeSlotChange(index, "day", value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleTimeSlotChange(index, "startTime", e.target.value)}
                  className="flex-1"
                />
                
                <span className="text-muted-foreground">to</span>
                
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleTimeSlotChange(index, "endTime", e.target.value)}
                  className="flex-1"
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTimeSlot(index)}
                  disabled={timeSlots.length === 1}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove time slot</span>
                </Button>
              </div>
            ))}
            
            {errors.timeSlots && (
              <p className="text-red-500 text-sm">{errors.timeSlots}</p>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mt-4">
            <h4 className="font-medium text-[#1F4E79] mb-2">Schedule Tips</h4>
            <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
              <li>Choose consistent days and times for better student retention</li>
              <li>Consider time zones if teaching students internationally</li>
              <li>Allow buffers between sessions for preparation</li>
              <li>For fixed duration classes, ensure the number of sessions aligns with your curriculum</li>
            </ul>
          </div>
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
          Continue to Pricing
        </Button>
      </div>
    </div>
  );
};

export default ScheduleStep;
