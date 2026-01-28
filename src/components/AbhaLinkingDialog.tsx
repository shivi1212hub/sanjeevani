import { useState } from "react";
import {
  Shield,
  Link2,
  Loader2,
  CheckCircle2,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

type Step = "abha" | "mobile" | "otp" | "success";

interface AbhaLinkingDialogProps {
  isLinked: boolean;
  onLinkSuccess: () => void;
  trigger: React.ReactNode;
}

const AbhaLinkingDialog = ({ isLinked, onLinkSuccess, trigger }: AbhaLinkingDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState<Step>("abha");
  const [abhaId, setAbhaId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const validateAbhaId = (id: string) => {
    const numericPattern = /^\d{14}$/;
    const formattedPattern = /^\d{2}-\d{4}-\d{4}-\d{4}$/;
    return numericPattern.test(id) || formattedPattern.test(id);
  };

  const validateMobile = (number: string) => {
    return /^[6-9]\d{9}$/.test(number);
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAbhaSubmit = () => {
    if (!abhaId.trim()) {
      toast.error("Please enter your ABHA ID");
      return;
    }

    if (!validateAbhaId(abhaId.trim())) {
      toast.error("Invalid ABHA ID format. Use 14 digits or XX-XXXX-XXXX-XXXX format");
      return;
    }

    setStep("mobile");
  };

  const handleSendOtp = async () => {
    if (!mobileNumber.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }

    if (!validateMobile(mobileNumber.trim())) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setStep("otp");
    startResendTimer();
    toast.success("OTP sent successfully!", {
      description: `A 6-digit code has been sent to ******${mobileNumber.slice(-4)}`
    });
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    startResendTimer();
    toast.success("OTP resent successfully!");
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setStep("success");
    
    setTimeout(() => {
      onLinkSuccess();
      setDialogOpen(false);
      resetForm();
      toast.success("ABHA ID linked successfully!", {
        description: "Your Ayushman Bharat Health Account is now connected."
      });
    }, 1500);
  };

  const resetForm = () => {
    setStep("abha");
    setAbhaId("");
    setMobileNumber("");
    setOtp("");
    setResendTimer(0);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const goBack = () => {
    if (step === "mobile") setStep("abha");
    if (step === "otp") setStep("mobile");
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {step === "success" ? "Verification Successful" : "Link Your ABHA ID"}
          </DialogTitle>
          <DialogDescription>
            {step === "abha" && "Enter your ABHA ID to begin the linking process."}
            {step === "mobile" && "Verify your identity with your registered mobile number."}
            {step === "otp" && "Enter the OTP sent to your registered mobile number."}
            {step === "success" && "Your ABHA ID has been verified and linked."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step indicator */}
          {step !== "success" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {["abha", "mobile", "otp"].map((s, index) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step === s
                        ? "bg-primary text-primary-foreground"
                        : ["abha", "mobile", "otp"].indexOf(step) > index
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {["abha", "mobile", "otp"].indexOf(step) > index ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-8 h-0.5 ${
                        ["abha", "mobile", "otp"].indexOf(step) > index
                          ? "bg-success"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step: ABHA ID */}
          {step === "abha" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="abha-id">ABHA ID / Health ID</Label>
                <Input
                  id="abha-id"
                  placeholder="XX-XXXX-XXXX-XXXX or 14-digit number"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  maxLength={17}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your 14-digit ABHA number or formatted ID
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Benefits of linking ABHA:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                    Instant access to medical history during emergencies
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                    Seamless hospital and clinic integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                    Secure, government-backed health identity
                  </li>
                </ul>
              </div>

              <Button onClick={handleAbhaSubmit} className="w-full gap-2">
                Continue
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Don't have an ABHA ID?{" "}
                <a
                  href="https://abha.abdm.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Create one here
                </a>
              </p>
            </div>
          )}

          {/* Step: Mobile Number */}
          {step === "mobile" && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="gap-1 -ml-2 mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="space-y-2">
                <Label htmlFor="mobile">Registered Mobile Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-muted rounded-md border border-input text-sm">
                    +91
                  </div>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the mobile number registered with your ABHA account
                </p>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    OTP Verification Required
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    A 6-digit OTP will be sent to verify your identity and link your ABHA ID securely.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSendOtp}
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    Send OTP
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step: OTP Verification */}
          {step === "otp" && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="gap-1 -ml-2 mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to
                </p>
                <p className="font-medium text-foreground">
                  +91 ******{mobileNumber.slice(-4)}
                </p>
              </div>

              <div className="flex justify-center py-4">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend OTP in <span className="font-medium text-foreground">{resendTimer}s</span>
                  </p>
                ) : (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-primary"
                  >
                    Resend OTP
                  </Button>
                )}
              </div>

              <Button
                onClick={handleVerifyOtp}
                className="w-full gap-2"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Verify & Link ABHA
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  Verification Complete
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your ABHA ID has been successfully linked to your health profile.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AbhaLinkingDialog;
