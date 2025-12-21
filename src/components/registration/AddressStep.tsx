import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, ChevronLeft, ChevronRight, Code, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface AddressStepProps {
  form: UseFormReturn<any>;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const AddressStep = ({ form, onNext, onPrev }: AddressStepProps) => {
  const [isFetchingCity, setIsFetchingCity] = useState(false);
  const [cityFetched, setCityFetched] = useState(false);

  // Fetch city from pincode using India Post API
  const fetchCityFromPincode = async (pincode: string) => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      return;
    }

    setIsFetchingCity(true);
    setCityFetched(false);

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const cityName = postOffice.District || postOffice.Division || postOffice.Region;

        form.setValue("city", cityName, { shouldValidate: true });
        setCityFetched(true);

        toast({
          title: "City Found",
          description: `City set to ${cityName}`,
        });
      } else {
        toast({
          title: "Pincode Not Found",
          description: "Please enter the city manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      toast({
        title: "Error",
        description: "Could not fetch city. Please enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingCity(false);
    }
  };

  const handlePincodeChange = (value: string, onChange: (value: string) => void) => {
    // Only allow digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    onChange(numericValue);

    // Auto-fetch city when 6 digits entered
    if (numericValue.length === 6) {
      fetchCityFromPincode(numericValue);
    } else {
      setCityFetched(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="parchment-bg royal-border rounded-xl p-6 md:p-8">
          <h2 className="font-decorative text-2xl text-primary mb-6 flex items-center gap-2 font-bold">
            <MapPin className="w-6 h-6" />
            Address & Skills
          </h2>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-foreground font-semibold text-base">Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your complete address"
                      className="bg-input border-border font-sans text-base font-medium min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-foreground font-semibold text-base">
                      Pincode
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Enter 6-digit pincode"
                          className="bg-input border-border font-sans text-base font-medium pr-10"
                          value={field.value}
                          onChange={(e) => handlePincodeChange(e.target.value, field.onChange)}
                          maxLength={6}
                        />
                      </FormControl>
                      {isFetchingCity && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
                      )}
                      {cityFetched && !isFetchingCity && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      City will be auto-filled based on pincode
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-foreground font-semibold text-base">City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter city"
                        className="bg-input border-border font-sans text-base font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="technicalSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-foreground font-semibold text-base flex items-center gap-2">
                    <Code className="w-4 h-4" /> Technical Skills
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your skills (comma-separated, e.g., Python, React, Machine Learning)"
                      className="bg-input border-border font-sans text-base font-medium min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrev} className="font-sans font-semibold gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button type="submit" className="font-sans font-semibold gap-2">
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddressStep;
