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
import { User, Shield, AlertTriangle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const SIDEBAR_STATE_KEY = "sanjeevani-sidebar-collapsed";

const Index = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-background to-blue-100/50 dark:from-slate-900 dark:via-background dark:to-slate-800/40 transition-colors duration-500">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md shadow-soft border-b border-border">
            <div className="flex items-center justify-between h-14 px-4">
              <SidebarTrigger className="text-foreground transition-transform duration-200 hover:scale-110" />
              <div className="flex items-center gap-2 sm:gap-3">
                <LanguageToggle />
                <ThemeToggle />
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="outline" size="default" className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 group">
                        <LayoutDashboard className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-semibold hidden sm:inline">{t.dashboard || "Dashboard"}</span>
                      </Button>
                    </Link>
                    <Button variant="outline" size="default" className="gap-2" onClick={signOut}>
                      <span className="font-semibold hidden sm:inline">{t.signOut || "Sign Out"}</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="outline" size="default" className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 group">
                        <User className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-semibold hidden sm:inline">{t.patientLogin || "Patient Login"}</span>
                      </Button>
                    </Link>
                    {/* FIXED: Changed this link to point to /warrior-login instead of /auth */}
                    <Link to="/warrior-login">
                      <Button variant="outline" size="default" className="gap-2 border-secondary/30 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 group">
                        <Shield className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                        <span className="font-semibold hidden sm:inline">{t.warriorLogin || "Warrior Login"}</span>
                      </Button>
                    </Link>
                  </>
                )}
                
                <a href="#sos">
                  <Button variant="sos" size="default" className="gap-2 animate-pulse-emergency px-6">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-bold tracking-wide">{t.sos || "SOS"}</span>
                  </Button>
                </a>
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