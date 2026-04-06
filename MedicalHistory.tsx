import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ChevronRight, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const MedicalHistory = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    bloodGroup: "",
    allergies: "",
    conditions: "",
    medications: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.age || !formData.bloodGroup) {
      toast.error("Please fill in all required fields");
      return;
    }
    localStorage.setItem("warrior_medical_history_done", "true");
    localStorage.setItem("warrior_profile", JSON.stringify(formData));
    toast.success("Medical profile saved successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg animate-slide-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Medical History</h1>
            <p className="text-xs text-muted-foreground">Required before accessing the dashboard</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg shadow-black/20">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Personal & Medical Info</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label className="text-foreground text-sm">Full Name *</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="John Doe"
                    className="bg-muted border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Age *</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="28"
                    className="bg-muted border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Blood Group *</Label>
                  <Select value={formData.bloodGroup} onValueChange={(v) => handleChange("bloodGroup", v)}>
                    <SelectTrigger className="bg-muted border-border text-foreground">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm">Known Allergies</Label>
                <Textarea
                  value={formData.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  placeholder="e.g., Penicillin, Peanuts, Latex..."
                  className="bg-muted border-border text-foreground min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm">Pre-existing Conditions</Label>
                <Textarea
                  value={formData.conditions}
                  onChange={(e) => handleChange("conditions", e.target.value)}
                  placeholder="e.g., Asthma, Diabetes, Hypertension..."
                  className="bg-muted border-border text-foreground min-h-[80px]"
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
              >
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Medications & Emergency Contact</span>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm">Current Medications</Label>
                <Textarea
                  value={formData.medications}
                  onChange={(e) => handleChange("medications", e.target.value)}
                  placeholder="e.g., Metformin 500mg, Lisinopril 10mg..."
                  className="bg-muted border-border text-foreground min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm">Emergency Contact Name</Label>
                <Input
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange("emergencyContact", e.target.value)}
                  placeholder="Jane Doe"
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm">Emergency Contact Phone</Label>
                <Input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-border text-foreground hover:bg-muted"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
