import { motion } from "framer-motion";
import { Heart, Flame, Droplets, AlertTriangle, Baby, Skull, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const FirstAidSection = () => {
  const { t } = useLanguage();

  const firstAidGuides = [
    { icon: Heart, titleKey: "firstaid.cpr", stepsKey: "firstaid.cprSteps", color: "bg-destructive" },
    { icon: Droplets, titleKey: "firstaid.bleeding", stepsKey: "firstaid.bleedingSteps", color: "bg-warning" },
    { icon: Flame, titleKey: "firstaid.burns", stepsKey: "firstaid.burnsSteps", color: "bg-sanjeevani-orange" },
    { icon: AlertTriangle, titleKey: "firstaid.stroke", stepsKey: "firstaid.strokeSteps", color: "bg-primary" },
    { icon: Baby, titleKey: "firstaid.choking", stepsKey: "firstaid.chokingSteps", color: "bg-success" },
    { icon: Skull, titleKey: "firstaid.poisoning", stepsKey: "firstaid.poisoningSteps", color: "bg-muted-foreground" },
  ];

  return (
    <section id="first-aid" className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-6">{t("firstaid.badge")}</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("firstaid.title1")} <span className="text-secondary">{t("firstaid.title2")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("firstaid.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firstAidGuides.map((guide, index) => {
            const steps = t(guide.stepsKey).split("|");
            return (
              <motion.div key={guide.titleKey} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Card className="p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer group border border-border h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 ${guide.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <guide.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-secondary transition-colors">{t(guide.titleKey)}</h3>
                      <span className="text-sm text-muted-foreground">{steps.length} {t("firstaid.steps")}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-foreground flex-shrink-0">{stepIndex + 1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-secondary font-medium">{t("firstaid.viewGuide")}</span>
                    <ChevronRight className="h-4 w-4 text-secondary group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FirstAidSection;
