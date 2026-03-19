
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClassCreationStepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const ClassCreationStepper = ({ 
  steps, 
  currentStep, 
  onStepClick 
}: ClassCreationStepperProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  return (
    <div className="w-full py-4">
      {isDesktop ? (
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div 
              key={step} 
              className="flex flex-col items-center relative"
              style={{ width: `${100 / steps.length}%` }}
            >
              <button
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors z-10",
                  index < currentStep 
                    ? "bg-[#1F4E79] text-white" 
                    : index === currentStep 
                      ? "bg-[#1F4E79] text-white" 
                      : "bg-gray-200 text-gray-500"
                )}
                onClick={() => {
                  // Only allow clicking on completed steps or current step
                  if (index <= currentStep && onStepClick) {
                    onStepClick(index);
                  }
                }}
                disabled={index > currentStep}
                aria-current={index === currentStep ? "step" : undefined}
              >
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>
              <span 
                className={cn(
                  "text-xs text-center font-medium truncate max-w-[100px]", 
                  index === currentStep ? "text-[#1F4E79]" : "text-gray-500"
                )}
              >
                {step}
              </span>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "absolute top-4 left-1/2 h-[2px] -translate-y-1/2",
                    index < currentStep ? "bg-[#1F4E79]" : "bg-gray-200"
                  )}
                  style={{ width: `calc(100% - 1rem)` }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <Select 
          value={currentStep.toString()}
          onValueChange={(value) => {
            if (onStepClick) {
              onStepClick(parseInt(value));
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              Step {currentStep + 1}: {steps[currentStep]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {steps.map((step, index) => (
              <SelectItem 
                key={index} 
                value={index.toString()}
                disabled={index > currentStep}
              >
                Step {index + 1}: {step}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default ClassCreationStepper;
