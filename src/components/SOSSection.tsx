import { motion, AnimatePresence } from "framer-motion";
import { Heart, Car, Baby, AlertTriangle, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SlideToConfirm from "./SlideToConfirm";

const emergencyTypes = [
  {
    id: "cardiac",
    label: "Cardiac / Chest Pain",
    icon: Heart,
    color: "bg-destructive",
    description: "Heart attack, chest pain, breathing difficulty",
  },
  {
    id: "accident",
    label: "Road Accident",
    icon: Car,
    color: "bg-warning",
    description: "Vehicle accident, trauma, heavy bleeding",
  },
  {
    id: "labor",
    label: "Active Labor",
    icon: Baby,
    color: "bg-sanjeevani-orange",
    description: "Pregnancy emergency, delivery assistance",
  },
  {
    id: "other",
    label: "Other Critical",
    icon: AlertTriangle,
    color: "bg-primary",
    description: "Stroke, burns, poisoning, other emergencies",
  },
];

const SOSSection = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showSlideConfirm, setShowSlideConfirm] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const handleSOS = () => {
    if (selectedType) {
      setShowSlideConfirm(true);
    }
  };

  const handleConfirmEmergency = () => {
    setShowSlideConfirm(false);
    setIsActivated(true);
  };

  const handleCancelSlide = () => {
    setShowSlideConfirm(false);
  };

  return (
    <section id="sos" className="py-24 md:py-40 bg-background min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            One-Tap <span className="text-secondary">Emergency SOS</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your emergency type and activate. Help will be dispatched within seconds.
          </p>
        </motion.div>

        {!isActivated ? (
          <>
            {/* Emergency Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-16">
              {emergencyTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`p-8 cursor-pointer transition-all duration-300 hover:shadow-elevated border-2 ${
                      selectedType === type.id
                        ? "border-secondary shadow-elevated scale-105"
                        : "border-transparent hover:border-secondary/50"
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div
                      className={`w-20 h-20 rounded-2xl ${type.color} flex items-center justify-center mx-auto mb-6`}
                    >
                      <type.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground text-center mb-3">
                      {type.label}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {type.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* SOS Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <Button
                variant="sos"
                size="sos"
                onClick={handleSOS}
                disabled={!selectedType}
                className={`mb-8 text-2xl px-16 py-10 ${selectedType ? "animate-pulse-emergency" : ""}`}
              >
                <Phone className="h-10 w-10 mr-4" />
                ACTIVATE SOS
              </Button>
              <p className="text-lg text-muted-foreground">
                {selectedType
                  ? "Press to alert nearby Health Warriors"
                  : "Select emergency type to activate"}
              </p>
            </motion.div>
          </>
        ) : (
          /* Live Response Dashboard */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-10 shadow-elevated border-2 border-success">
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <MapPin className="h-12 w-12 text-success-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-3">
                  Help is on the way!
                </h3>
                <p className="text-lg text-muted-foreground">
                  Health Warrior dispatched. Track live below.
                </p>
              </div>

              <div className="bg-muted rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-medium text-muted-foreground">
                    Estimated Arrival
                  </span>
                  <span className="text-4xl font-bold text-success">4 min</span>
                </div>
                <div className="h-3 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-success"
                    initial={{ width: "0%" }}
                    animate={{ width: "60%" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-card rounded-xl border border-border">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">RS</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-foreground">Rajesh Sharma</h4>
                  <p className="text-muted-foreground">
                    Certified Health Warrior • 4.9 ★
                  </p>
                </div>
                <Button variant="outline" size="lg">
                  <Phone className="h-5 w-5" />
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full mt-8 py-6 text-lg"
                onClick={() => setIsActivated(false)}
              >
                Cancel Emergency
              </Button>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Slide to Confirm Modal */}
      <AnimatePresence>
        {showSlideConfirm && (
          <SlideToConfirm
            onConfirm={handleConfirmEmergency}
            onCancel={handleCancelSlide}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default SOSSection;
