import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Phone, 
  MapPin, 
  FileCheck, 
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Contact & Location", icon: MapPin },
  { id: 3, title: "Verification", icon: FileCheck },
  { id: 4, title: "Training", icon: GraduationCap },
];

const WarriorRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    aadharNumber: "",
    aadharFile: null as File | null,
    photoFile: null as File | null,
    trainingCompleted: false,
  });
  const { toast } = useToast();

  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Registration Submitted!",
      description: "Your Health Warrior application is under review. We'll contact you soon.",
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name (as per Aadhar)</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="House/Street/Locality"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="XXXXXX"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="aadharNumber">Aadhar Number</Label>
              <Input
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Upload Aadhar Card (Front & Back)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  id="aadharFile"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, "aadharFile")}
                  className="hidden"
                />
                <label htmlFor="aadharFile" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {formData.aadharFile ? formData.aadharFile.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF (max 5MB)</p>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Upload Recent Passport Photo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  id="photoFile"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "photoFile")}
                  className="hidden"
                />
                <label htmlFor="photoFile" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {formData.photoFile ? formData.photoFile.name : "Click to upload photo"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG or JPG (max 2MB)</p>
                </label>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Verification Process</p>
                <p className="text-muted-foreground">
                  Your documents will be verified within 24-48 hours. You'll receive an SMS confirmation once approved.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <GraduationCap className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="text-xl font-semibold">Training Modules</h3>
              <p className="text-muted-foreground">
                Complete these modules to become a certified Health Warrior
              </p>
            </div>

            <div className="space-y-3">
              {[
                { title: "Basic First Aid", duration: "45 mins", completed: true },
                { title: "CPR & AED Training", duration: "60 mins", completed: true },
                { title: "Emergency Response Protocol", duration: "30 mins", completed: false },
                { title: "Using the Sanjeevani App", duration: "20 mins", completed: false },
              ].map((module, index) => (
                <div
                  key={module.title}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    module.completed ? "bg-success/10 border-success/30" : "bg-background border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      module.completed ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {module.completed ? <CheckCircle2 className="h-5 w-5" /> : <span>{index + 1}</span>}
                    </div>
                    <div>
                      <p className="font-medium">{module.title}</p>
                      <p className="text-sm text-muted-foreground">{module.duration}</p>
                    </div>
                  </div>
                  <Button
                    variant={module.completed ? "outline" : "default"}
                    size="sm"
                  >
                    {module.completed ? "Review" : "Start"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-secondary/20 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-secondary-foreground">
                Complete all modules to receive your Health Warrior certification
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Health Warrior Registration</CardTitle>
        <CardDescription>
          Join our network of certified first responders
        </CardDescription>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step.id < currentStep 
                    ? "bg-primary text-primary-foreground" 
                    : step.id === currentStep 
                    ? "bg-primary/20 border-2 border-primary" 
                    : "bg-muted"
                }`}>
                  {step.id < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={nextStep} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-2 bg-success hover:bg-success/90">
              Submit Application
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WarriorRegistrationForm;
