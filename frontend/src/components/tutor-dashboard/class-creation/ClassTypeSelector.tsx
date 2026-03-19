
import { useState } from "react";
import { LectureType, lectureTypes, getLectureTypeInfo } from "@/types/lecture-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LectureTypeIcon from "@/components/LectureTypeIcon";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClassTypeSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: LectureType) => void;
}

const ClassTypeSelector = ({ open, onClose, onSelectType }: ClassTypeSelectorProps) => {
  const [selectedType, setSelectedType] = useState<LectureType | null>(null);
  
  // Filter out legacy types
  const activeTypes = Object.keys(lectureTypes).filter(key => 
    !['live-one-on-one', 'live-group', 'recorded-on-demand', 
      'offline-student-travels', 'offline-tutor-travels'].includes(key)
  ) as LectureType[];
  
  // Group by delivery mode
  const onlineTypes = activeTypes.filter(type => lectureTypes[type].deliveryMode === 'online');
  const offlineTypes = activeTypes.filter(type => lectureTypes[type].deliveryMode === 'offline');
  
  const handleConfirm = () => {
    if (selectedType) {
      onSelectType(selectedType);
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] sm:max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#1F4E79]">
            Select Class Type for Testing
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 overflow-auto max-h-[60vh]">
          <div className="py-4">
            <h3 className="mb-3 font-medium text-gray-700">Online Classes</h3>
            <RadioGroup 
              value={selectedType || ""} 
              onValueChange={(value) => setSelectedType(value as LectureType)}
              className="grid grid-cols-1 gap-2"
            >
              {onlineTypes.map(type => {
                const typeInfo = getLectureTypeInfo(type);
                return (
                  <label 
                    key={type} 
                    className={cn(
                      "flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-gray-50",
                      selectedType === type ? "border-[#1F4E79] bg-blue-50" : "border-gray-200"
                    )}
                  >
                    <RadioGroupItem value={type} id={type} />
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${typeInfo.color} text-white`}>
                        <LectureTypeIcon type={type} className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">{typeInfo.name}</span>
                        <p className="text-xs text-gray-500">{typeInfo.description}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
            
            <h3 className="mt-6 mb-3 font-medium text-gray-700">Offline Classes</h3>
            <RadioGroup 
              value={selectedType || ""} 
              onValueChange={(value) => setSelectedType(value as LectureType)}
              className="grid grid-cols-1 gap-2"
            >
              {offlineTypes.map(type => {
                const typeInfo = getLectureTypeInfo(type);
                return (
                  <label 
                    key={type} 
                    className={cn(
                      "flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-gray-50",
                      selectedType === type ? "border-[#1F4E79] bg-blue-50" : "border-gray-200"
                    )}
                  >
                    <RadioGroupItem value={type} id={type} />
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${typeInfo.color} text-white`}>
                        <LectureTypeIcon type={type} className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">{typeInfo.name}</span>
                        <p className="text-xs text-gray-500">{typeInfo.description}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[#1F4E79] hover:bg-[#1a4369]"
            disabled={!selectedType}
          >
            Start Auto-Fill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassTypeSelector;
