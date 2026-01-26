import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SOSSection from "@/components/SOSSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import HealthProfileSection from "@/components/HealthProfileSection";
import FirstAidSection from "@/components/FirstAidSection";
import WarriorsSection from "@/components/WarriorsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <SOSSection />
        <HowItWorksSection />
        <HealthProfileSection />
        <FirstAidSection />
        <WarriorsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
