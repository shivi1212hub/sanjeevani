import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AiAssistant from "./pages/AiAssistant";
import WarriorRegistration from "./pages/WarriorRegistration";
import WarriorLogin from "./pages/WarriorLogin"; // Import the integrated Warrior login
import MedicalHistory from "./pages/MedicalHistory"; // Import the integrated Medical History
import RppgMonitor from "./pages/RppgMonitor";
import Ministry from "./pages/Ministry";
import FirstAidGuide from "./pages/FirstAidGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="sanjeevani-theme">
    <LanguageProvider defaultLanguage="en" storageKey="sanjeevani-language">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ai-assistant" element={<AiAssistant />} />
                <Route path="/warrior-registration" element={<WarriorRegistration />} />
                <Route path="/warrior-login" element={<WarriorLogin />} /> {/* New Warrior Login Route */}
                <Route path="/medical-history" element={<MedicalHistory />} /> {/* New Medical History Route */}
                <Route path="/rppg" element={<RppgMonitor />} />
                <Route path="/first-aid/:slug" element={<FirstAidGuide />} />
                <Route path="/ministry" element={<Ministry />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;