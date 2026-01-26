import { motion } from "framer-motion";
import { Heart, Car, Baby, AlertTriangle, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const [isActivated, setIsActivated] = useState(false);

  const handleSOS = () => {
    if (selectedType) {
      setIsActivated(true);
      // In real app, this would trigger the emergency flow
    }
  };

  return (
    <section id="sos" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            One-Tap <span className="text-secondary">Emergency SOS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your emergency type and activate. Help will be dispatched within seconds.
          </p>
        </motion.div>

        {!isActivated ? (
          <>
            {/* Emergency Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
              {emergencyTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-elevated border-2 ${
                      selectedType === type.id
                        ? "border-secondary shadow-elevated scale-105"
                        : "border-transparent hover:border-secondary/50"
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl ${type.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground text-center mb-2">
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
                className={`mb-6 ${selectedType ? "animate-pulse-emergency" : ""}`}
              >
                <Phone className="h-8 w-8 mr-3" />
                ACTIVATE SOS
              </Button>
              <p className="text-sm text-muted-foreground">
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
            <Card className="p-8 shadow-elevated border-2 border-success">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <MapPin className="h-10 w-10 text-success-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Help is on the way!
                </h3>
                <p className="text-muted-foreground">
                  Health Warrior dispatched. Track live below.
                </p>
              </div>

              <div className="bg-muted rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Estimated Arrival
                  </span>
                  <span className="text-2xl font-bold text-success">4 min</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-success"
                    initial={{ width: "0%" }}
                    animate={{ width: "60%" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">RS</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Rajesh Sharma</h4>
                  <p className="text-sm text-muted-foreground">
                    Certified Health Warrior • 4.9 ★
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full mt-6"
                onClick={() => setIsActivated(false)}
              >
                Cancel Emergency
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SOSSection;
