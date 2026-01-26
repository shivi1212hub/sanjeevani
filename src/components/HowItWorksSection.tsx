import { motion } from "framer-motion";
import { 
  Smartphone, 
  Radio, 
  Navigation, 
  Hospital, 
  FileCheck,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "One-Tap SOS",
    description: "Select emergency type with large icons. GPS and medical profile captured instantly.",
  },
  {
    number: "02",
    icon: Radio,
    title: "Local Dispatch",
    description: "High-priority alert sent to 5 nearest registered Health Warriors (local volunteers/drivers).",
  },
  {
    number: "03",
    icon: Navigation,
    title: "Live Tracking",
    description: "Track responder in real-time. App provides step-by-step first-aid guides.",
  },
  {
    number: "04",
    icon: Hospital,
    title: "Smart Routing",
    description: "AI identifies and routes to nearest hospital equipped for your specific emergency.",
  },
  {
    number: "05",
    icon: FileCheck,
    title: "Digital Handover",
    description: "Hospital receives patient data via ABHA, ensuring immediate treatment upon arrival.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            How <span className="text-secondary">Sanjeevani</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From emergency to hospital in minutes, not hours. Every step designed for the Golden Hour.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-secondary to-primary" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated transition-shadow duration-300">
                  {/* Number Badge */}
                  <div className="absolute -top-4 left-6 bg-secondary text-secondary-foreground text-sm font-bold px-3 py-1 rounded-full">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 mt-2">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-24 -right-4 z-10 w-8 h-8 bg-background rounded-full items-center justify-center shadow-soft">
                    <ArrowRight className="h-4 w-4 text-secondary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
