import { useState } from "react";
import { motion } from "framer-motion";
import { User, Heart, Pill, Activity, Shield, FileText, CheckCircle2, CreditCard, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AbhaLinkingDialog from "@/components/AbhaLinkingDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import sanjeevaniLogo from "@/assets/sanjeevani-logo.jpg";

const HealthProfileSection = () => {
  const { t } = useLanguage();
  const [isLinked, setIsLinked] = useState(false);

  const profileFeatures = [
    { icon: User, titleKey: "profile.personalDetails", descKey: "profile.personalDetailsDesc" },
    { icon: Heart, titleKey: "profile.medicalHistory", descKey: "profile.medicalHistoryDesc" },
    { icon: Pill, titleKey: "profile.medications", descKey: "profile.medicationsDesc" },
    { icon: Activity, titleKey: "profile.vitals", descKey: "profile.vitalsDesc" },
    { icon: Shield, titleKey: "profile.abhaIntegration", descKey: "profile.abhaIntegrationDesc" },
    { icon: FileText, titleKey: "profile.digitalRecords", descKey: "profile.digitalRecordsDesc" },
  ];

  const features = ["profile.feature1", "profile.feature2", "profile.feature3", "profile.feature4"];

  return (
    <section id="profile" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <img src={sanjeevaniLogo} alt="" className="w-[600px] h-auto" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-6">{t("profile.badge")}</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              {t("profile.title1")}
              <span className="text-secondary">{t("profile.title2")}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">{t("profile.subtitle")}</p>

            <div className="space-y-4 mb-8">
              {features.map((key, index) => (
                <motion.div key={key} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{t(key)}</span>
                </motion.div>
              ))}
            </div>

            <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                    <CreditCard className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{t("profile.abhaTitle")}</h3>
                    <p className="text-sm text-muted-foreground">{t("profile.abhaDesc")}</p>
                    {isLinked && (
                      <div className="flex items-center gap-1.5 mt-1 text-success">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">{t("profile.linked")}</span>
                      </div>
                    )}
                  </div>
                </div>
                <AbhaLinkingDialog
                  isLinked={isLinked}
                  onLinkSuccess={() => setIsLinked(true)}
                  trigger={
                    <Button variant={isLinked ? "outline" : "default"} size="sm" className="gap-2">
                      <Link2 className="h-4 w-4" />
                      {isLinked ? t("profile.manage") : t("profile.linkAbha")}
                    </Button>
                  }
                />
              </div>
            </Card>

            <Button variant="default" size="lg">{t("profile.createProfile")}</Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {profileFeatures.map((feature, index) => (
              <motion.div key={feature.titleKey} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Card className="p-5 hover:shadow-card transition-shadow duration-300 border border-border h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HealthProfileSection;
