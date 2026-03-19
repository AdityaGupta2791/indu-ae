
import { useState } from "react";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, FileUp, Link2 } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CurriculumStepProps {
  onNext: () => void;
  onBack: () => void;
}

const CurriculumStep = ({ onNext, onBack }: CurriculumStepProps) => {
  const { formState, setSyllabus, addMaterial, removeMaterial } = useClassCreationStore();
  
  const [syllabus, setSyllabusState] = useState(
    formState.syllabus.length > 0 
      ? formState.syllabus 
      : [{ title: "Introduction", description: "" }]
  );
  
  const [errors, setErrors] = useState({
    syllabus: ""
  });
  
  const validateForm = () => {
    const newErrors = {
      syllabus: ""
    };
    
    // Check if any syllabus item has an empty title
    if (syllabus.some(item => !item.title.trim())) {
      newErrors.syllabus = "All lesson titles are required";
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleNext = () => {
    if (validateForm()) {
      setSyllabus(syllabus);
      onNext();
    }
  };
  
  const handleAddLesson = () => {
    setSyllabusState([
      ...syllabus,
      { title: `Lesson ${syllabus.length + 1}`, description: "" }
    ]);
  };
  
  const handleRemoveLesson = (index: number) => {
    setSyllabusState(syllabus.filter((_, i) => i !== index));
  };
  
  const handleLessonChange = (index: number, field: keyof typeof syllabus[0], value: string) => {
    setSyllabusState(
      syllabus.map((lesson, i) => 
        i === index ? { ...lesson, [field]: value } : lesson
      )
    );
  };
  
  // Mock file upload function
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to storage
      // Here we'll just simulate adding a reference
      addMaterial({
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "document",
        url: URL.createObjectURL(file) // This would typically be a server URL
      });
    }
  };
  
  // Mock URL add function
  const handleAddUrl = () => {
    const url = prompt("Enter URL:");
    if (url && isValidUrl(url)) {
      addMaterial({
        name: url.split("/").pop() || "External Resource",
        type: "link",
        url: url
      });
    } else if (url) {
      alert("Please enter a valid URL");
    }
  };
  
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Course Syllabus</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddLesson}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Lesson
              </Button>
            </div>
            
            {errors.syllabus && (
              <p className="text-red-500 text-sm mb-4">{errors.syllabus}</p>
            )}
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {syllabus.map((lesson, index) => (
                <Collapsible key={index} defaultOpen={index === 0}>
                  <div className="border rounded-md overflow-hidden">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 text-left hover:bg-gray-100">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Drag to reorder</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="font-medium">{lesson.title || `Lesson ${index + 1}`}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLesson(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete lesson</span>
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="p-3 border-t">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor={`lesson-title-${index}`} className="text-sm">
                            Lesson Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`lesson-title-${index}`}
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(index, "title", e.target.value)}
                            placeholder="Enter lesson title"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`lesson-description-${index}`} className="text-sm">
                            Description
                          </Label>
                          <Textarea
                            id={`lesson-description-${index}`}
                            value={lesson.description}
                            onChange={(e) => handleLessonChange(index, "description", e.target.value)}
                            placeholder="What will students learn in this lesson?"
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Materials</h3>
            <p className="text-sm text-muted-foreground">
              Upload or link to any materials students will need for your class.
            </p>
            
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Label 
                    htmlFor="file-upload" 
                    className="flex items-center justify-center gap-2 w-full p-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <FileUp className="h-4 w-4" />
                    <span>Upload Files</span>
                  </Label>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleAddUrl}
                >
                  <Link2 className="h-4 w-4" />
                  <span>Add URL</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Max file size: 50MB. Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG, JPG, MP4
              </p>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h4 className="font-medium">Uploaded Materials</h4>
              </div>
              <div className="p-3">
                {formState.materials.length > 0 ? (
                  <ul className="space-y-2">
                    {formState.materials.map((material, index) => (
                      <li key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          {material.type === "image" ? (
                            <div className="h-8 w-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded">
                              <span className="text-xs">IMG</span>
                            </div>
                          ) : material.type === "link" ? (
                            <div className="h-8 w-8 bg-green-100 text-green-600 flex items-center justify-center rounded">
                              <span className="text-xs">URL</span>
                            </div>
                          ) : (
                            <div className="h-8 w-8 bg-orange-100 text-orange-600 flex items-center justify-center rounded">
                              <span className="text-xs">DOC</span>
                            </div>
                          )}
                          <span className="text-sm font-medium truncate max-w-[200px]">
                            {material.name}
                          </span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => removeMaterial(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete material</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No materials uploaded yet
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-[#1F4E79] mb-2">Curriculum Tips</h4>
            <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
              <li>Break down your content into clear, manageable lessons</li>
              <li>Include learning objectives for each lesson</li>
              <li>Provide a mix of materials (videos, documents, links)</li>
              <li>Consider including pre-class preparation materials</li>
              <li>For recorded classes, outline when each lesson will be available</li>
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
          Continue to Preview
        </Button>
      </div>
    </div>
  );
};

export default CurriculumStep;
