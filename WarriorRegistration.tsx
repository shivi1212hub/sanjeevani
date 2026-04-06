import { useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Users, Map, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WarriorRegistrationForm from "@/components/WarriorRegistrationForm";

const WarriorMap = lazy(() => import("@/components/WarriorMap"));

const WarriorRegistration = () => {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">Sanjeevani</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full mb-6">
              <Shield className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium">Join the Movement</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Become a <span className="text-secondary">Health Warrior</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Be the first responder in your community. Get trained, certified, and help save lives during medical emergencies.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-10 max-w-lg mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">10K+</p>
                <p className="text-sm text-primary-foreground/70">Active Warriors</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">5K+</p>
                <p className="text-sm text-primary-foreground/70">Lives Saved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">500+</p>
                <p className="text-sm text-primary-foreground/70">Cities Covered</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="register" className="gap-2">
                <Users className="h-4 w-4" />
                Register
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <Map className="h-4 w-4" />
                Find Warriors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="register">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <WarriorRegistrationForm />
              </motion.div>
            </TabsContent>

            <TabsContent value="map">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Suspense fallback={<div className="flex items-center justify-center h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                  <WarriorMap />
                </Suspense>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Why Become a Health Warrior?</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: "🎓", title: "Free Training", description: "Get certified in CPR, first aid, and emergency response" },
              { icon: "🏆", title: "Recognition", description: "Earn badges and be recognized in your community" },
              { icon: "💰", title: "Incentives", description: "Receive rewards for successful emergency responses" },
              { icon: "❤️", title: "Save Lives", description: "Make a real difference when every second counts" },
            ].map((benefit) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 text-center shadow-soft"
              >
                <span className="text-4xl mb-4 block">{benefit.icon}</span>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/70">
            © 2026 Sanjeevani. Saving lives, one response at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WarriorRegistration;
