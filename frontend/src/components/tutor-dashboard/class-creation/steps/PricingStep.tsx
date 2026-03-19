
import { useState } from "react";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface PricingStepProps {
  onNext: () => void;
  onBack: () => void;
}

const currencies = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" },
  { value: "INR", label: "INR (₹)" }
];

const PricingStep = ({ onNext, onBack }: PricingStepProps) => {
  const { formState, setPricing } = useClassCreationStore();
  
  const [price, setPrice] = useState(formState.price?.toString() || "");
  const [currency, setCurrency] = useState(formState.currency || "USD");
  const [maxStudents, setMaxStudents] = useState(
    formState.classSize === "one-on-one" 
      ? "1" 
      : formState.maxStudents?.toString() || ""
  );
  const [autoRenewal, setAutoRenewal] = useState(formState.autoRenewal);
  
  const [errors, setErrors] = useState({
    price: "",
    maxStudents: ""
  });
  
  const validateForm = () => {
    const newErrors = {
      price: !price || parseFloat(price) <= 0 ? "Price must be greater than 0" : "",
      maxStudents: 
        formState.classSize !== "one-on-one" && (!maxStudents || parseInt(maxStudents) < 2) 
          ? "Group classes must allow at least 2 students" 
          : ""
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleNext = () => {
    if (validateForm()) {
      setPricing({
        price: parseFloat(price),
        currency,
        maxStudents: parseInt(maxStudents || "1"),
        autoRenewal: formState.durationType === "recurring" ? autoRenewal : false
      });
      onNext();
    }
  };
  
  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.value === currencyCode);
    if (!currency) return "$";
    return currency.label.split(" ")[1].replace(/[()]/g, "");
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Pricing</h3>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-1/3">
                <Label htmlFor="currency" className="text-base block mb-2">
                  Currency
                </Label>
                <Select
                  value={currency}
                  onValueChange={setCurrency}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-2/3">
                <Label htmlFor="price" className="text-base block mb-2">
                  Price <span className="text-red-500">*</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formState.durationType === "recurring" ? "per month" : "one-time"})
                  </span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">
                    {getCurrencySymbol(currency)}
                  </span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`pl-8 ${errors.price ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxStudents" className="text-base block">
                Maximum Students <span className="text-red-500">*</span>
              </Label>
              <Input
                id="maxStudents"
                type="number"
                min={formState.classSize === "one-on-one" ? "1" : "2"}
                placeholder="10"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                disabled={formState.classSize === "one-on-one"}
                className={errors.maxStudents ? "border-red-500" : ""}
              />
              {formState.classSize === "one-on-one" && (
                <p className="text-sm text-muted-foreground">
                  One-on-one classes are limited to 1 student.
                </p>
              )}
              {errors.maxStudents && (
                <p className="text-red-500 text-sm">{errors.maxStudents}</p>
              )}
            </div>
            
            {formState.durationType === "recurring" && (
              <div className="space-y-2 mt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-Renewal</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow students to automatically renew their subscription
                    </p>
                  </div>
                  <Switch
                    checked={autoRenewal}
                    onCheckedChange={setAutoRenewal}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#F5F7FA] p-6 rounded-lg">
            <h4 className="font-semibold text-lg mb-4">Pricing Preview</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-md shadow-sm">
                <h5 className="font-medium mb-2">What Students Will Pay</h5>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold text-lg">
                    {getCurrencySymbol(currency)}{parseFloat(price || "0").toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Billing:</span>
                  <span>
                    {formState.durationType === "recurring" 
                      ? autoRenewal ? "Monthly, auto-renewal" : "Monthly, manual renewal"
                      : "One-time payment"
                    }
                  </span>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-md shadow-sm">
                <h5 className="font-medium mb-2">Class Capacity</h5>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Maximum students:</span>
                  <span className="font-semibold">
                    {formState.classSize === "one-on-one" ? "1 (One-on-one)" : maxStudents || "Not set"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h5 className="font-medium text-[#1F4E79] mb-2">Pricing Tips</h5>
              <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
                <li>Research similar classes to price competitively</li>
                <li>Consider your experience and expertise level</li>
                <li>Higher prices often suggest premium quality</li>
                <li>For group classes, a lower price per student can attract more enrollments</li>
              </ul>
            </div>
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
          Continue to Location
        </Button>
      </div>
    </div>
  );
};

export default PricingStep;
