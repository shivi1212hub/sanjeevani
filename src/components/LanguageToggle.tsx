import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1.5 h-9 rounded-full border border-border hover:bg-muted transition-all duration-300 font-semibold text-xs px-3"
    >
      <Languages className="h-4 w-4" />
      {language === "en" ? "हिं" : "EN"}
    </Button>
  );
}
