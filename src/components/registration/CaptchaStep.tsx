import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Loader2, RefreshCw, Shield } from "lucide-react";
import { useState } from "react";

interface CaptchaStepProps {
  onSubmit: (verified: boolean) => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  return { num1, num2, answer: num1 + num2 };
};

const CaptchaStep = ({ onSubmit, onPrev, isSubmitting }: CaptchaStepProps) => {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState("");

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setUserAnswer("");
    setError("");
  };

  const handleSubmit = () => {
    if (parseInt(userAnswer) === captcha.answer) {
      setError("");
      onSubmit(true);
    } else {
      setError("Incorrect answer. Please try again.");
      refreshCaptcha();
    }
  };

  return (
    <div className="space-y-6">
      <div className="parchment-bg royal-border rounded-xl p-6 md:p-8">
        <h2 className="font-decorative text-2xl text-primary mb-6 flex items-center gap-2 font-bold">
          <Shield className="w-6 h-6" />
          Verification
        </h2>

        <div className="text-center">
          <p className="text-muted-foreground mb-6 font-sans font-medium">
            Complete this simple verification to submit your registration.
          </p>

          {/* Captcha Display */}
          <div className="bg-secondary/50 rounded-lg p-6 mb-6 inline-block">
            <div className="flex items-center gap-4 justify-center">
              <span className="font-decorative text-4xl text-primary">{captcha.num1}</span>
              <span className="font-decorative text-3xl text-foreground">+</span>
              <span className="font-decorative text-4xl text-primary">{captcha.num2}</span>
              <span className="font-decorative text-3xl text-foreground">=</span>
              <span className="font-decorative text-3xl text-muted-foreground">?</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex-1 max-w-[150px]">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setError("");
                }}
                placeholder="Answer"
                className="bg-input border-border font-sans text-center text-xl font-semibold"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={refreshCaptcha}
              className="border-border"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {error && (
            <p className="text-destructive text-sm mb-4 font-sans font-medium">{error}</p>
          )}
        </div>

        {/* Terms */}
        <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center font-sans">
            By submitting this form, you agree to participate in TechFluence and
            consent to the collection of your information for event purposes.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="font-sans font-semibold gap-2"
          disabled={isSubmitting}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="font-sans font-semibold gap-2 px-8"
          disabled={!userAnswer || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Registration"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CaptchaStep;
