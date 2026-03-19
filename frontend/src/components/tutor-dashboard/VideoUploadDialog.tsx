
import { useState } from "react";
import { 
  Upload, 
  Video, 
  FileText, 
  Image, 
  Clock, 
  AlertTriangle, 
  Check 
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const uploadSteps = [
  { id: "select", title: "Select Video", icon: Video },
  { id: "thumbnail", title: "Choose Thumbnail", icon: Image },
  { id: "details", title: "Video Details", icon: FileText },
  { id: "materials", title: "Attach Materials", icon: FileText },
  { id: "schedule", title: "Schedule Upload", icon: Clock },
];

const videoSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  videoFile: z.any().optional(),
  thumbnail: z.any().optional(),
  autoPublish: z.boolean().default(false),
  scheduledTime: z.string().optional(),
  materials: z.array(z.any()).default([])
});

type VideoUploadFormValues = z.infer<typeof videoSchema>;

interface VideoUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: number;
  sessionTitle?: string;
  sessionDate?: string;
}

const VideoUploadDialog = ({ 
  isOpen, 
  onClose, 
  sessionId, 
  sessionTitle = "Upcoming Session",
  sessionDate = "Today"
}: VideoUploadDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [materials, setMaterials] = useState<{ name: string; size: string }[]>([]);
  const { toast } = useToast();

  // Calculate if the session date is within 3 hours
  const sessionTime = new Date(sessionDate);
  const now = new Date();
  const timeDifference = sessionTime.getTime() - now.getTime();
  const hoursUntilSession = timeDifference / (1000 * 60 * 60);
  const showWarning = hoursUntilSession > 0 && hoursUntilSession < 3;

  const form = useForm<VideoUploadFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: sessionTitle,
      description: "",
      autoPublish: false,
      materials: []
    }
  });

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
      form.setValue("videoFile", file);
      
      // Auto-advance to next step
      setTimeout(() => {
        handleNext();
      }, 500);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreview(imageUrl);
      form.setValue("thumbnail", file);
    }
  };

  const handleMaterialUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMaterials([...materials, { 
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB"
      }]);
      const currentMaterials = form.getValues("materials") || [];
      form.setValue("materials", [...currentMaterials, file]);
    }
  };

  const handleNext = () => {
    if (currentStep < uploadSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = (data: VideoUploadFormValues) => {
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        toast({
          title: "Video uploaded successfully",
          description: data.autoPublish 
            ? `Your video "${data.title}" has been scheduled for automatic publishing.` 
            : `Your video "${data.title}" has been uploaded and is ready for review.`,
        });
        onClose();
      }
    }, 200);
  };

  // Generate default thumbnails based on session ID
  const defaultThumbnails = [
    `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=170&q=80`,
    `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&h=170&q=80`,
    `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&h=170&q=80`,
    `https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=300&h=170&q=80`,
  ];

  const renderStepContent = () => {
    switch (uploadSteps[currentStep].id) {
      case "select":
        return (
          <div className="space-y-4">
            {videoPreview ? (
              <div className="rounded-md overflow-hidden bg-muted aspect-video flex items-center justify-center">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Input
                  id="videoUpload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoSelect}
                />
                <Label htmlFor="videoUpload" className="cursor-pointer w-full h-full block">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <h3 className="font-medium text-lg">Click to select video</h3>
                    <p className="text-sm text-muted-foreground">
                      Or drag and drop video file here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP4, MOV, or WebM up to 2GB
                    </p>
                  </div>
                </Label>
              </div>
            )}
          </div>
        );

      case "thumbnail":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {defaultThumbnails.map((thumb, index) => (
                <div
                  key={index}
                  className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${
                    thumbnailPreview === thumb ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => {
                    setThumbnailPreview(thumb);
                    form.setValue("thumbnail", thumb);
                  }}
                >
                  <img src={thumb} alt={`Thumbnail option ${index + 1}`} className="w-full aspect-video object-cover" />
                  {thumbnailPreview === thumb && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm mb-2">Or upload your own thumbnail</p>
              <Input
                id="thumbnailUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailSelect}
              />
              <Label htmlFor="thumbnailUpload">
                <Button type="button" variant="outline" className="cursor-pointer">
                  <Image className="h-4 w-4 mr-2" />
                  Custom thumbnail
                </Button>
              </Label>
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a descriptive title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what students will learn in this video" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include key topics covered to help students navigate content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "materials":
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-6 text-center">
              <Input
                id="materialsUpload"
                type="file"
                className="hidden"
                onChange={handleMaterialUpload}
              />
              <Label htmlFor="materialsUpload" className="cursor-pointer w-full h-full block">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <h3 className="font-medium">Attach supplementary materials</h3>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOCX, PPT, or other files
                  </p>
                </div>
              </Label>
            </div>
            
            {materials.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Attached materials</h3>
                <div className="space-y-2">
                  {materials.map((material, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-muted rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{material.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{material.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-4">
            {showWarning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Upload soon!</h3>
                    <p className="text-sm text-yellow-700">
                      This session is scheduled to begin in less than 3 hours. 
                      We recommend uploading your video as soon as possible.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-publish at scheduled time</h3>
                <p className="text-sm text-muted-foreground">
                  Video will be automatically published to students
                </p>
              </div>
              <FormField
                control={form.control}
                name="autoPublish"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {form.watch("autoPublish") && (
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                        min={new Date().toISOString().slice(0, 16)}  
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            <div className="pt-4">
              <h3 className="font-medium text-sm mb-2">Session Information</h3>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">{sessionTitle}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Scheduled for: {sessionDate}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        {isUploading ? (
          <div className="py-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-center">Uploading Video</DialogTitle>
              <DialogDescription className="text-center">
                Please wait while we upload your video...
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{uploadProgress}% complete</span>
                <span>{Math.round(uploadProgress * 0.02 * 100) / 100} MB / {(2).toFixed(2)} MB</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{uploadSteps[currentStep].title}</DialogTitle>
              <DialogDescription>
                Step {currentStep + 1} of {uploadSteps.length}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex space-x-1 mb-4">
              {uploadSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`h-1.5 flex-1 rounded-full ${
                    index <= currentStep 
                      ? "bg-primary" 
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStepContent()}
              </form>
            </Form>
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button type="button" onClick={handleNext}>
                {currentStep === uploadSteps.length - 1 ? "Upload" : "Continue"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadDialog;
