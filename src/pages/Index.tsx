import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import HeroSection from "@/components/HeroSection";
import SOSSection from "@/components/SOSSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import HealthProfileSection from "@/components/HealthProfileSection";
import FirstAidSection from "@/components/FirstAidSection";
import WarriorsSection from "@/components/WarriorsSection";
import Footer from "@/components/Footer";
import { User, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const SIDEBAR_STATE_KEY = "sanjeevani-sidebar-collapsed";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [defaultOpen, setDefaultOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
    setDefaultOpen(stored !== "true");
  }, []);

  const handleOpenChange = (open: boolean) => {
    localStorage.setItem(SIDEBAR_STATE_KEY, (!open).toString());
  };

  if (defaultOpen === undefined) {
    return null;
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
              <div className="flex items-center gap-2 sm:gap-3">
                <LanguageToggle />
                <ThemeToggle />
                <Button variant="outline" size="default" className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 group" onClick={() => navigate("/auth")}>
                  <User className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold hidden sm:inline">{t("header.patientLogin")}</span>
                </Button>
                <Button variant="outline" size="default" className="gap-2 border-secondary/30 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 group" onClick={() => navigate("/auth")}>
                  <Shield className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold hidden sm:inline">{t("header.warriorLogin")}</span>
                </Button>
                <Button variant="sos" size="default" className="gap-2 animate-pulse-emergency px-6">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-bold tracking-wide">{t("header.sos")}</span>
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
