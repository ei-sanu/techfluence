import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, Calendar, Code, Sparkles } from "lucide-react";

interface EventSelectionStepProps {
  form: UseFormReturn<any>;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const events = [
  {
    value: "event",
    label: "TechFluence Event",
    description: "Join keynote sessions, panels, and networking opportunities with industry leaders.",
    icon: Calendar,
  },
  {
    value: "hackathon",
    label: "TechFluence Hackathon",
    description: "Compete in a 24-hour hackathon with your team to build innovative solutions.",
    icon: Code,
  },
  {
    value: "both",
    label: "Both Events",
    description: "Get the complete TechFluence experience with access to both the event and hackathon.",
    icon: Sparkles,
  },
];

const EventSelectionStep = ({ form, onNext, onPrev }: EventSelectionStepProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="parchment-bg royal-border rounded-xl p-6 md:p-8">
          <h2 className="font-decorative text-2xl text-primary mb-6">Choose Your Path</h2>

          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-4"
                  >
                    {events.map((event) => (
                      <label
                        key={event.value}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          field.value === event.value
                            ? "border-primary bg-primary/10 royal-glow"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={event.value} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <event.icon className="w-5 h-5 text-primary" />
                            <span className="font-cinzel text-lg text-foreground">
                              {event.label}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mt-1">
                            {event.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(form.watch("eventType") === "hackathon" || form.watch("eventType") === "both") && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-sm text-foreground font-cinzel">
                <Sparkles className="w-4 h-4 inline mr-2 text-primary" />
                Team registration required! You'll need to provide details for your team in the next step.
              </p>
            </div>
          )}
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

export default EventSelectionStep;
