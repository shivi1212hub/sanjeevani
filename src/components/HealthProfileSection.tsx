import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Heart, 
  Pill, 
  Activity, 
  Shield, 
  FileText,
  CheckCircle2,
  CreditCard,
  Link2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { toast } from "sonner";
import sanjeevaniLogo from "@/assets/sanjeevani-logo.jpg";

const profileFeatures = [
  {
    icon: User,
    title: "Personal Details",
    description: "Age, blood group, emergency contacts",
  },
  {
    icon: Heart,
    title: "Medical History",
    description: "Past conditions, surgeries, allergies",
  },
  {
    icon: Pill,
    title: "Current Medications",
    description: "Active prescriptions and dosages",
  },
  {
    icon: Activity,
    title: "Vital Records",
    description: "Blood pressure, heart rate trends",
  },
  {
    icon: Shield,
    title: "ABHA Integration",
    description: "Linked to Ayushman Bharat Health Account",
  },
  {
    icon: FileText,
    title: "Digital Records",
    description: "Secure blockchain-backed health records",
  },
];

const HealthProfileSection = () => {
  const [abhaId, setAbhaId] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const validateAbhaId = (id: string) => {
    // ABHA ID format: 14-digit number or XX-XXXX-XXXX-XXXX format
    const numericPattern = /^\d{14}$/;
    const formattedPattern = /^\d{2}-\d{4}-\d{4}-\d{4}$/;
    return numericPattern.test(id) || formattedPattern.test(id);
  };

  const handleLinkAbha = async () => {
    if (!abhaId.trim()) {
      toast.error("Please enter your ABHA ID");
      return;
    }

    if (!validateAbhaId(abhaId.trim())) {
      toast.error("Invalid ABHA ID format. Use 14 digits or XX-XXXX-XXXX-XXXX format");
      return;
    }

    setIsLinking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLinking(false);
    setIsLinked(true);
    setDialogOpen(false);
    toast.success("ABHA ID linked successfully!", {
      description: "Your Ayushman Bharat Health Account is now connected."
    });
  };

  return (
    <section id="profile" className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background Logo Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <img src={sanjeevaniLogo} alt="" className="w-[600px] h-auto" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-6">
              Health Profile
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Your Complete Medical Identity, 
              <span className="text-secondary"> Always Ready</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              In emergencies, every second matters. Your health profile ensures responders 
              and hospitals have critical information instantly, avoiding dangerous diagnosis errors.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Integrated with ABHA (Ayushman Bharat Health Account)",
                "End-to-end encrypted for privacy",
                "Automatic sync with hospitals",
                "Weekly health check-in reminders",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* ABHA ID Card */}
            <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                    <CreditCard className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">ABHA ID</h3>
                    <p className="text-sm text-muted-foreground">
                      Ayushman Bharat Health Account
                    </p>
                    {isLinked && (
                      <div className="flex items-center gap-1.5 mt-1 text-success">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Linked</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant={isLinked ? "outline" : "default"} 
                      size="sm" 
                      className="gap-2"
                    >
                      <Link2 className="h-4 w-4" />
                      {isLinked ? "Manage" : "Link ABHA"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Link Your ABHA ID
                      </DialogTitle>
                      <DialogDescription>
                        Connect your Ayushman Bharat Health Account for seamless health record access during emergencies.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
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
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            Instant access to medical history during emergencies
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            Seamless hospital and clinic integrations
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            Secure, government-backed health identity
                          </li>
                        </ul>
                      </div>

                      <Button 
                        onClick={handleLinkAbha} 
                        className="w-full gap-2"
                        disabled={isLinking}
                      >
                        {isLinking ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Link2 className="h-4 w-4" />
                            Link ABHA ID
                          </>
                        )}
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
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            <Button variant="default" size="lg">
              Create Your Health Profile
            </Button>
          </motion.div>

          {/* Right Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {profileFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5 hover:shadow-card transition-shadow duration-300 border border-border h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HealthProfileSection;
