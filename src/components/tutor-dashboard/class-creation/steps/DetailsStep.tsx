
import { useState, useEffect } from "react";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDesignTokens } from "@/hooks/use-design-tokens";

// Mock data for subjects
const subjectOptions = [
  "Mathematics", "Science", "Physics", "Chemistry", "Biology", 
  "Computer Science", "Programming", "Web Development", "Graphic Design", 
  "Literature", "History", "Geography", "Social Studies", "Psychology",
  "Philosophy", "Economics", "Business", "Marketing", "Accounting",
  "Music", "Art", "Physical Education", "Language Arts", "Foreign Languages"
];

interface DetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const DetailsStep = ({ onNext, onBack }: DetailsStepProps) => {
  const { formState, setBasicDetails } = useClassCreationStore();
  const { colors } = useDesignTokens();
  const [errors, setErrors] = useState({
    title: "",
    subject: "",
    description: ""
  });
  
  const [filteredSubjects, setFilteredSubjects] = useState<string[]>([]);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  const [title, setTitle] = useState(formState.title);
  const [subject, setSubject] = useState(formState.subject);
  const [description, setDescription] = useState(formState.description);
  const [thumbnailUrl, setThumbnailUrl] = useState(formState.thumbnailUrl);
  
  useEffect(() => {
    if (subject) {
      const filtered = subjectOptions.filter(option => 
        option.toLowerCase().includes(subject.toLowerCase())
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]);
    }
  }, [subject]);
  
  const validateForm = () => {
    const newErrors = {
      title: !title ? "Title is required" : "",
      subject: !subject ? "Subject is required" : "",
      description: !description ? "Description is required" : ""
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleNext = () => {
    if (validateForm()) {
      setBasicDetails({
        title,
        subject,
        description,
        thumbnailUrl
      });
      onNext();
    }
  };
  
  const handleSubjectSelect = (selected: string) => {
    setSubject(selected);
    setShowSubjectDropdown(false);
  };
  
  // Placeholder thumbnail upload function
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file to a storage service
      // and then set the URL. For now, we'll create a temporary object URL
      const tempUrl = URL.createObjectURL(file);
      setThumbnailUrl(tempUrl);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              Class Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={
                errors.title 
                  ? "border-red-500 focus-visible:ring-red-500" 
                  : title 
                    ? "border-green-500 focus-visible:ring-green-500" 
                    : ""
              }
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-base">
              Subject <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="subject"
                placeholder="Start typing to search subjects"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setShowSubjectDropdown(true);
                }}
                onFocus={() => setShowSubjectDropdown(true)}
                onBlur={() => {
                  // Delay hiding to allow for selection
                  setTimeout(() => setShowSubjectDropdown(false), 200);
                }}
                className={
                  errors.subject 
                    ? "border-red-500 focus-visible:ring-red-500" 
                    : subject 
                      ? "border-green-500 focus-visible:ring-green-500" 
                      : ""
                }
              />
              {showSubjectDropdown && filteredSubjects.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredSubjects.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => handleSubjectSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what students will learn in this class"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`min-h-[150px] ${
                errors.description 
                  ? "border-red-500 focus-visible:ring-red-500" 
                  : description 
                    ? "border-green-500 focus-visible:ring-green-500" 
                    : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="thumbnail" className="text-base block mb-2">
              Class Thumbnail
            </Label>
            <div className="border-2 border-dashed rounded-md p-4 text-center">
              {thumbnailUrl ? (
                <div className="space-y-4">
                  <div className="aspect-video relative">
                    <img 
                      src={thumbnailUrl} 
                      alt="Thumbnail preview" 
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setThumbnailUrl("")}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-md">
                    <p className="text-muted-foreground">16:9 Aspect Ratio</p>
                  </div>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="thumbnail" 
                    className="bg-[#1F4E79] text-white px-4 py-2 rounded-md cursor-pointer inline-block"
                  >
                    Upload Thumbnail
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 1280 × 720px (16:9 ratio)
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mt-4">
            <h4 className="font-medium text-[#1F4E79] mb-2">Tips for a great class</h4>
            <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
              <li>Use a clear, descriptive title</li>
              <li>Include the target age or skill level</li>
              <li>Highlight the key learning outcomes</li>
              <li>Add an eye-catching thumbnail image</li>
              <li>Describe your teaching style and approach</li>
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
          Continue to Schedule
        </Button>
      </div>
    </div>
  );
};

export default DetailsStep;
