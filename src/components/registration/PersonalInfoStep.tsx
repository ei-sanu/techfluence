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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, GraduationCap, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface PersonalInfoStepProps {
  form: UseFormReturn<any>;
  onNext: (data: any) => void;
}

const courses = [
  "BTech",
  "MTech",
  "BBA",
  "MBA",
  "BCA",
  "MCA",
  "BSc",
  "MSc",
  "BA",
  "MA",
  "Other",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

// Common country codes
const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
];

const PersonalInfoStep = ({ form, onNext }: PersonalInfoStepProps) => {
  const [countryCode, setCountryCode] = useState("+91");

  // Handle form submission with combined phone number
  const handleSubmit = (data: any) => {
    const combinedData = {
      ...data,
      contactNumber: `${countryCode} ${data.contactNumber}`,
    };
    onNext(combinedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="parchment-bg royal-border rounded-xl p-6 md:p-8">
          <h2 className="font-decorative text-2xl text-primary mb-6 flex items-center gap-2 font-bold">
            <User className="w-6 h-6" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="font-sans text-foreground font-semibold text-base">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="bg-input border-border font-sans text-base font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-foreground font-semibold text-base">Registration Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 2024BTCS001"
                      className="bg-input border-border font-sans text-base font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="universityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-foreground font-semibold text-base">University Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter university name"
                      className="bg-input border-border font-sans text-base font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-foreground font-semibold text-base flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="bg-input border-border font-sans text-base font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-foreground font-semibold text-base flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Contact Number
                  </FormLabel>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-[130px] bg-input border-border font-sans text-base font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {countryCodes.map((cc) => (
                          <SelectItem key={cc.code} value={cc.code} className="font-sans">
                            <span className="flex items-center gap-2">
                              <span>{cc.flag}</span>
                              <span className="font-medium">{cc.code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="1234567890"
                        className="bg-input border-border font-sans text-base font-medium flex-1"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-foreground font-semibold text-base flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Course
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border font-sans text-base font-medium">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course} className="font-sans font-medium">
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-foreground font-semibold text-base">Year of Study</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border font-sans text-base font-medium">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year} className="font-sans font-medium">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="font-sans font-semibold gap-2">
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInfoStep;
