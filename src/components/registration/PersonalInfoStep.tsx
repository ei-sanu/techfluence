import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronRight, User, Mail, Phone, GraduationCap } from "lucide-react";

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

const PersonalInfoStep = ({ form, onNext }: PersonalInfoStepProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="parchment-bg royal-border rounded-xl p-6 md:p-8">
          <h2 className="font-decorative text-2xl text-primary mb-6 flex items-center gap-2">
            <User className="w-6 h-6" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="font-cinzel text-foreground">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
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
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel text-foreground">Registration Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 2024BTCS001"
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
              name="universityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel text-foreground">University Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter university name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
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
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel text-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Contact Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+91 1234567890"
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
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel text-foreground flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Course
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border font-cinzel">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course} className="font-cinzel">
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
                  <FormLabel className="font-cinzel text-foreground">Year of Study</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border font-cinzel">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year} className="font-cinzel">
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
          <Button type="submit" className="font-cinzel gap-2">
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInfoStep;
