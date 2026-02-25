import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Award, Users, MapPin, Star, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  {
    name: "Ravi Kumar",
    location: "Varanasi, UP",
    avatar: "RK",
    rating: 4.9,
    missions: 127,
    quote: "Being a Health Warrior gives me purpose. I've helped save 3 lives in the past month alone.",
  },
];

const WarriorsSection = () => {
  const { t } = useLanguage();

  const benefits = [
    { icon: Award, titleKey: "warriors.certifiedTraining", descKey: "warriors.certifiedTrainingDesc" },
    { icon: Users, titleKey: "warriors.communityImpact", descKey: "warriors.communityImpactDesc" },
  ];

  return (
    <section id="warriors" className="py-10 md:py-16 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-secondary rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-medium mb-4 border border-secondary/30">{t("warriors.badge")}</span>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("warriors.title1")} <span className="text-secondary">{t("warriors.title2")}</span>
            </h2>
            <p className="text-base text-primary-foreground/80 mb-6">{t("warriors.subtitle")}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {benefits.map((benefit, index) => (
                <motion.div key={benefit.titleKey} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-3 border border-primary-foreground/20">
                  <benefit.icon className="h-6 w-6 text-secondary mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{t(benefit.titleKey)}</h3>
                  <p className="text-xs text-primary-foreground/70 line-clamp-2">{t(benefit.descKey)}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/warrior-registration">
                <Button variant="secondary" size="default" className="gap-2">
                  {t("warriors.register")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/warrior-registration?tab=map">
                <Button variant="heroOutline" size="default">{t("warriors.findNearby")}</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Card className="p-5 bg-card text-card-foreground">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-base font-bold text-primary-foreground">{testimonials[0].avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{testimonials[0].name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonials[0].location}</p>
                    </div>
                    <div className="flex items-center gap-1 text-warning">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-sm font-medium">{testimonials[0].rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic mb-3">"{testimonials[0].quote}"</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-success" />
                <span>{testimonials[0].missions} {t("warriors.missionsCompleted")}</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WarriorsSection;
