import { motion } from "framer-motion";
import { AlertCircle, Heart, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import sanjeevaniLogo from "@/assets/sanjeevani-logo.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero">
      {/* Background Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
        <img 
          src={sanjeevaniLogo} 
          alt="" 
          className="w-[800px] max-w-[90vw] h-auto"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary/85" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-secondary/20 text-secondary-foreground rounded-full text-sm font-medium mb-6 border border-secondary/30">
              🇮🇳 Aatmnirbhar Bharat Initiative
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6"
          >
            Every Second Counts.
            <br />
            <span className="text-secondary">Sanjeevani Saves.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
          >
            India's first hyper-local emergency response network. 
            Like Uber, but for saving lives during the Golden Hour.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button variant="sos" size="xl" className="gap-3">
              <AlertCircle className="h-6 w-6" />
              ACTIVATE SOS
            </Button>
            <Button variant="heroOutline" size="xl">
              Become a Health Warrior
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { icon: Clock, value: "<7 min", label: "Avg. Response Time" },
              { icon: Heart, value: "50,000+", label: "Lives Touched" },
              { icon: Shield, value: "10,000+", label: "Health Warriors" },
              { icon: AlertCircle, value: "96%", label: "AI Accuracy" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20"
              >
                <stat.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
          <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,90 1440,60 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
