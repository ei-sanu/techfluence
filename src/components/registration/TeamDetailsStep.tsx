import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft, ChevronRight, Users, Crown, User } from "lucide-react";

interface TeamDetailsStepProps {
  form: UseFormReturn<any>;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const TeamDetailsStep = ({ form, onNext, onPrev }: TeamDetailsStepProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="parchment-bg royal-border rounded-xl p-6 md:p-8">
          <h2 className="font-decorative text-2xl text-primary mb-6 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Team Details
          </h2>

          {/* Team Leader */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="font-cinzel text-lg text-foreground">Team Leader</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="teamLeaderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-cinzel text-foreground">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Team leader's name"
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
                name="teamLeaderRegNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-cinzel text-foreground">Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Registration number"
                        className="bg-input border-border font-cinzel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Team Members */}
          {[1, 2, 3].map((memberNum) => (
            <div key={memberNum} className="mb-6 pb-6 border-b border-border last:border-0 last:pb-0 last:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-cinzel text-foreground">Team Member {memberNum}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`member${memberNum}Name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-cinzel text-foreground">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Member ${memberNum}'s name`}
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
                  name={`member${memberNum}RegNo`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-cinzel text-foreground">Registration Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Registration number"
                          className="bg-input border-border font-cinzel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
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

export default TeamDetailsStep;
