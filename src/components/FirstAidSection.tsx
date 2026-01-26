import { motion } from "framer-motion";
import { 
  Heart, 
  Flame, 
  Droplets, 
  AlertTriangle,
  Baby,
  Skull,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";

const firstAidGuides = [
  {
    icon: Heart,
    title: "Cardiac Arrest / CPR",
    steps: ["Check responsiveness", "Call for help", "Start chest compressions", "Continue until help arrives"],
    color: "bg-destructive",
  },
  {
    icon: Droplets,
    title: "Heavy Bleeding",
    steps: ["Apply direct pressure", "Elevate the wound", "Keep patient calm", "Do not remove cloth"],
    color: "bg-warning",
  },
  {
    icon: Flame,
    title: "Burn Injuries",
    steps: ["Cool with running water", "Cover loosely", "Do not apply ice", "Seek medical help"],
    color: "bg-sanjeevani-orange",
  },
  {
    icon: AlertTriangle,
    title: "Stroke Signs (FAST)",
    steps: ["Face drooping?", "Arm weakness?", "Speech difficulty?", "Time to call help"],
    color: "bg-primary",
  },
  {
    icon: Baby,
    title: "Choking (Adult/Child)",
    steps: ["Encourage coughing", "5 back blows", "5 abdominal thrusts", "Repeat until clear"],
    color: "bg-success",
  },
  {
    icon: Skull,
    title: "Poisoning",
    steps: ["Identify the poison", "Do not induce vomiting", "Call poison control", "Keep sample if possible"],
    color: "bg-muted-foreground",
  },
];

const FirstAidSection = () => {
  return (
    <section id="first-aid" className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-6">
            Life-Saving Knowledge
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            First Aid <span className="text-secondary">Quick Guides</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Step-by-step pictorial guides to stabilize patients before help arrives. 
            Designed for non-medical users with simple, clear instructions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firstAidGuides.map((guide, index) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer group border border-border h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 ${guide.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <guide.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-secondary transition-colors">
                      {guide.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {guide.steps.length} steps
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {guide.steps.map((step, stepIndex) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-foreground flex-shrink-0">
                        {stepIndex + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-secondary font-medium">
                    View full guide
                  </span>
                  <ChevronRight className="h-4 w-4 text-secondary group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FirstAidSection;
