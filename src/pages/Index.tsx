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
import { Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Login
                </Button>
                <Button variant="emergency" size="sm" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Emergency: 112
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
