import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import HeroSection from "@/components/HeroSection";
import SOSSection from "@/components/SOSSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import HealthProfileSection from "@/components/HealthProfileSection";
import FirstAidSection from "@/components/FirstAidSection";
import WarriorsSection from "@/components/WarriorsSection";
import Footer from "@/components/Footer";
import { Phone, User, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SIDEBAR_STATE_KEY = "sanjeevani-sidebar-collapsed";

const Index = () => {
  const [defaultOpen, setDefaultOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
    setDefaultOpen(stored !== "true");
  }, []);

  const handleOpenChange = (open: boolean) => {
    localStorage.setItem(SIDEBAR_STATE_KEY, (!open).toString());
  };

  if (defaultOpen === undefined) {
    return null; // Wait for localStorage to load
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md shadow-soft border-b border-border">
            <div className="flex items-center justify-between h-14 px-4">
              <SidebarTrigger className="text-foreground transition-transform duration-200 hover:scale-110" />
              <div className="flex items-center gap-3">
                <Button variant="outline" size="default" className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 group">
                  <User className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Patient Login</span>
                </Button>
                <Button variant="outline" size="default" className="gap-2 border-secondary/30 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 group">
                  <Shield className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Warrior Login</span>
                </Button>
                <Button variant="sos" size="default" className="gap-2 animate-pulse-emergency px-6">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-bold tracking-wide">SOS</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <HeroSection />
            <SOSSection />
            <HowItWorksSection />
            <HealthProfileSection />
            <FirstAidSection />
            <WarriorsSection />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
