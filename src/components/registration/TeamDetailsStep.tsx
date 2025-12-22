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
import { ChevronLeft, ChevronRight, Crown, Shield, User, Users } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface TeamDetailsStepProps {
  form: UseFormReturn<any>;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const TeamDetailsStep = ({ form, onNext, onPrev }: TeamDetailsStepProps) => {
  const teamSize = Number(form.watch("teamSize") || 1);

  // Clear unused member fields when teamSize decreases
  const clearUnusedMembers = (size: number) => {
    const maxMembers = 3; // leader + up to 3 members supported
    for (let i = size; i < maxMembers; i++) {
      const idx = i + 1; // member1 corresponds to i=0
      form.setValue(`member${idx}Name`, "");
      form.setValue(`member${idx}RegNo`, "");
    }
  };

  React.useEffect(() => {
    // when teamSize decreases, clear trailing member fields
    clearUnusedMembers(teamSize - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSize]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="parchment-bg tech-border rounded-xl p-6 md:p-8">
          <h2 className="font-decorative text-2xl text-primary mb-6 flex items-center gap-2 font-bold">
            <Users className="w-6 h-6" />
            Team Details
          </h2>

          {/* Team Name */}
          <div className="mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-sans text-lg text-foreground font-semibold">Team Identity</h3>
            </div>
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-foreground font-semibold text-base">Team Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your team name (e.g., Code Warriors)"
                      className="bg-input border-border font-sans text-base font-medium"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose a unique and memorable name for your team
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team Size Selector */}
            <div className="mt-4">
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-foreground font-semibold text-base">Team Size</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="bg-input border-border font-sans text-base font-medium rounded-md px-3 py-2"
                      >
                        <option value={1}>1 (Individual)</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Select the total number of people in your team (including leader)</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Team Leader */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="font-sans text-lg text-foreground font-semibold">Team Leader</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="teamLeaderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-foreground font-semibold text-base">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Team leader's name"
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
                name="teamLeaderRegNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-foreground font-semibold text-base">Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Registration number"
                        className="bg-input border-border font-sans text-base font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Team Members (render based on selected team size) */}
          {Array.from({ length: Math.max(0, teamSize - 1) }).map((_, idx) => {
            const memberNum = idx + 1;
            return (
              <div key={memberNum} className="mb-6 pb-6 border-b border-border last:border-0 last:pb-0 last:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-sans text-foreground font-semibold">Team Member {memberNum}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`member${memberNum}Name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-foreground font-semibold text-base">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Member ${memberNum}'s name`}
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
                    name={`member${memberNum}RegNo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-foreground font-semibold text-base">Registration Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Registration number"
                            className="bg-input border-border font-sans text-base font-medium"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            );
          })}
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

export default TeamDetailsStep;
