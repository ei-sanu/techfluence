import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft, ChevronRight, MapPin, Code } from "lucide-react";

interface AddressStepProps {
  form: UseFormReturn<any>;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const AddressStep = ({ form, onNext, onPrev }: AddressStepProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="parchment-bg royal-border rounded-xl p-6 md:p-8">
          <h2 className="font-decorative text-2xl text-primary mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Address & Skills
          </h2>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel text-foreground">Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your complete address"
                      className="bg-input border-border font-cinzel min-h-[80px]"
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-cinzel text-foreground">City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter city"
                        className="bg-input border-border font-cinzel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-cinzel text-foreground">Pincode</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter pincode"
                        className="bg-input border-border font-cinzel"
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
                  <FormLabel className="font-cinzel text-foreground flex items-center gap-2">
                    <Code className="w-4 h-4" /> Technical Skills
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your skills (comma-separated, e.g., Python, React, Machine Learning)"
                      className="bg-input border-border font-cinzel min-h-[80px]"
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
          <Button type="button" variant="outline" onClick={onPrev} className="font-cinzel gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button type="submit" className="font-cinzel gap-2">
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddressStep;
