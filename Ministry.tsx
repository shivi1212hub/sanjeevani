import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { motion } from "framer-motion";

const Ministry = () => {
  const { t } = useLanguage();

  return (
    <main className="pt-24 pb-16">
      <section className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
            {t("ministryBadge")}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("ministryTitle1")} <span className="text-secondary">{t("ministryTitle2")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("ministrySubtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-left space-y-4"
        >
          <p>{t("ministryDescription")}</p>
          <p>
            <a
              href="https://www.mohfw.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:underline"
            >
              {t("ministryVisitBtn")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </p>
        </motion.div>
      </section>
    </main>
  );
};

export default Ministry;
